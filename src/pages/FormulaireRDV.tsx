import { useState } from "react";
import { Container, Paper, Typography, TextField, Button, MenuItem, Box, Alert } from "@mui/material";
import axios from "axios";


const FORM_ENDPOINT = "https://script.google.com/macros/s/AKfycbwQSyUSs6oYCRXXHZ5NYsL_SbrU-QBlQqYg4JPiOcoeurMdr8X3QYC77bhC7exjnybuvA/exec"; // 🔥 Remplace par ton script Google Apps


function FormulaireRDV() {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    statut: "",
    revenu: "",
    situation_familiale: "",
  });


  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);


    try {
      const response = await axios.post(FORM_ENDPOINT, formData);
      if (response.status === 200) {
        setSuccess(true);
        setFormData({ nom: "", prenom: "", email: "", telephone: "", statut: "", revenu: "", situation_familiale: "" });
      }
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h5" align="center" sx={{ mb: 3 }}>
          📅 Planifier un RDV Stratégique
        </Typography>


        {success && <Alert severity="success">✅ Votre demande a bien été envoyée.</Alert>}
        {error && <Alert severity="error">{error}</Alert>}


        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="Nom" name="nom" value={formData.nom} onChange={handleChange} required sx={{ mb: 2 }} />
          <TextField fullWidth label="Prénom" name="prenom" value={formData.prenom} onChange={handleChange} required sx={{ mb: 2 }} />
          <TextField fullWidth label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required sx={{ mb: 2 }} />
          <TextField fullWidth label="Téléphone" name="telephone" value={formData.telephone} onChange={handleChange} required sx={{ mb: 2 }} />


          <TextField select fullWidth label="Statut" name="statut" value={formData.statut} onChange={handleChange} required sx={{ mb: 2 }}>
            <MenuItem value="Kinésithérapeute">Kinésithérapeute</MenuItem>
            <MenuItem value="Infirmier">Infirmier</MenuItem>
            <MenuItem value="Médecin">Médecin</MenuItem>
            <MenuItem value="Sage-femme">Sage-femme</MenuItem>
            <MenuItem value="Autre">Autre</MenuItem>
          </TextField>


          <TextField select fullWidth label="Fourchette de CA" name="revenu" value={formData.revenu} onChange={handleChange} required sx={{ mb: 2 }}>
            <MenuItem value="0-50k">0 - 50 000 €</MenuItem>
            <MenuItem value="50k-100k">50 000 € - 100 000 €</MenuItem>
            <MenuItem value="100k-150k">100 000 € - 150 000 €</MenuItem>
            <MenuItem value="150k+">150 000 € et plus</MenuItem>
          </TextField>


          <TextField select fullWidth label="Situation Familiale" name="situation_familiale" value={formData.situation_familiale} onChange={handleChange} required sx={{ mb: 3 }}>
            <MenuItem value="Célibataire">Célibataire</MenuItem>
            <MenuItem value="Marié(e)">Marié(e)</MenuItem>
            <MenuItem value="Divorcé(e)">Divorcé(e)</MenuItem>
            <MenuItem value="Pacsé(e)">Pacsé(e)</MenuItem>
          </TextField>


          <Button fullWidth variant="contained" color="primary" type="submit" disabled={loading}>
            {loading ? "Envoi en cours..." : "📩 Envoyer la demande"}
          </Button>
        </form>
      </Paper>
    </Container>
  );
}


export default FormulaireRDV;
