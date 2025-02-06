import { useState } from "react";
import axios from "axios";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
  Grid,
  List,
  ListItem,
  Chip,
  Card,
  CardContent,
} from "@mui/material";

// URLs des APIs pour chaque simulateur
const API_URLS: Record<string, string> = {
  kine: "https://script.google.com/macros/s/AKfycbzeUOU8h4MVZo-vZ0BKH8xDwwdPcIQkCRmaoiughpLjuikFshQF4GgUK5zIGvY_4ne0Lw/exec",
  sagefemme: "https://script.google.com/macros/s/AKfycbwGXGDzrdCyvQ4_Y3Ut55PQSDL1ViIY41aWIyg5B8afZAsV-BCBuOFT1YJK5ogGxxdZiw/exec",
  infirmier: "https://script.google.com/macros/s/AKfycbxUZ1HW3RL1aKkYQBNB-exsEhWjTixXpRoIW3QK2JV-6E-rPbubHp6FE8NCufl_9YlM/exec",
};

// Configuration des champs pour les résultats
const BNC_FIELDS = [
  { key: "cotisations", label: "Cotisations sociales" },
  { key: "contribution", label: "CSG/CRDS" },
  { key: "remuneration_avant_impot", label: "Rémunération avant impôt" },
  { key: "impot_sur_le_revenu", label: "Impôt sur le revenu" },
  { key: "revenu_net_apres_impot", label: "Revenu net après impôt" },
  { key: "epargne_disponible", label: "Épargne disponible" },
];

const ODIA_FIELDS = [
  { key: "revenu_bnc", label: "Revenu BNC Compte personnel" },
  { key: "cotisations", label: "Cotisations sociales" },
  { key: "contribution", label: "CSG/CRDS" },
  { key: "impot_sur_le_revenu", label: "Impôt sur le revenu" },
  { key: "revenu_apres_impot_perso", label: "Revenu après impôt personnel" },
  { key: "epargne_disponible_perso", label: "Épargne disponible personnel" },
  { key: "impot_sur_les_societes", label: "Impôt sur les sociétés" },
  { key: "revenu_apres_impot_a_investir_SELARL", label: "Revenu après impôt à investir (SELARL)" },
  { key: "total_revenu", label: "Épargne disponible SELARL" },
  { key: "performance_montage", label: "Performance du montage" },
  { key: "capital_revenu_place_15ans", label: "Capital investi après 15 ans" },
  { key: "interet_mensuel_capital_15ans", label: "Intérêts mensuels après 15 ans" },
];

function Simulateur() {
  const [selectedSim, setSelectedSim] = useState<string | null>(null);
  const [chiffreAffaires, setChiffreAffaires] = useState<string>("");
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Gère la sélection du simulateur
  const handleSelectSim = (simulator: string) => {
    setSelectedSim(simulator);
    setData(null); // Réinitialiser les données précédentes
  };

  // Soumission du chiffre d'affaires
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chiffreAffaires || isNaN(Number(chiffreAffaires))) {
      setError("Veuillez entrer un chiffre d'affaires valide.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.get(`${API_URLS[selectedSim!]}?brut=${chiffreAffaires}`);
      setData(response.data);
    } catch (err) {
      setError("Erreur lors de la récupération des données. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ minHeight: "160vh", width: "100%", p: { xs: 4, md: 8 }, textAlign: "center" }}>
        
        {/* Sélection du simulateur */}
        <Grid container spacing={4} sx={{ width: "100%", mt: 0 }}>
          {["kine", "sagefemme", "infirmier"].map((sim) => (
            <Grid item xs={12} md={4} key={sim}>
              <Card
                sx={{
                  backgroundColor: selectedSim === sim ? "#A4C3B2" : selectedSim ? "#E0E0E0" : "#EFE9AE",
                  p: 3,
                  textAlign: "center",
                  height: "100%",
                  cursor: "pointer",
                }}
                onClick={() => handleSelectSim(sim)}
              >
                <CardContent>
                  <Typography variant="h6">
                    {sim === "kine" ? "Simulateur Kiné" : sim === "sagefemme" ? "Simulateur Sage-Femme" : "Simulateur Infirmier"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Formulaire de saisie du CA */}
        {selectedSim && (
          <Box sx={{ mt: 6, width: "100%", textAlign: "center" }}>
            <Paper elevation={3} sx={{ p: 4, maxWidth: "600px", margin: "auto" }}>
              <Typography variant="h5" sx={{ mb: 3 }}>
                Entrez votre Chiffre d’Affaires
              </Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Chiffre d’Affaires (€)"
                  variant="outlined"
                  type="number"
                  value={chiffreAffaires}
                  onChange={(e) => setChiffreAffaires(e.target.value)}
                  placeholder="Entrez votre CA"
                  sx={{ mb: 3 }}
                />
                <Button variant="contained" color="primary" type="submit" disabled={loading}>
                  {loading ? <CircularProgress size={24} /> : "Calculer"}
                </Button>
              </form>
            </Paper>
          </Box>
        )}

        {/* Résultats affichés après soumission */}
        {data && (
          <Box sx={{ mt: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Chip label="Régime BNC" color="primary" sx={{ mb: 2 }} />
                  <List>{BNC_FIELDS.map((field) => data.simulation_bnc && <ListItem key={field.key}>{field.label}: {data.simulation_bnc[field.key]}</ListItem>)}</List>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Chip label="ODIA Stratégie" color="secondary" sx={{ mb: 2 }} />
                  <List>{ODIA_FIELDS.map((field) => data.simulation_odia && <ListItem key={field.key}>{field.label}: {data.simulation_odia[field.key]}</ListItem>)}</List>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default Simulateur;
