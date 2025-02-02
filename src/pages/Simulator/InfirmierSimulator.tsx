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
  useTheme,
  useMediaQuery,
  Divider,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom"; // Ajout de useNavigate

const API_URL = "https://script.google.com/macros/s/AKfycbzeUOU8h4MVZo-vZ0BKH8xDwwdPcIQkCRmaoiughpLjuikFshQF4GgUK5zIGvY_4ne0Lw/exec";

// Configuration des libellés et ordre des champs
const BNC_FIELDS = [
  { key: "cotisations", label: "Cotisations sociales" },
  { key: "contribution", label: "CSG/CRDS" },
  { key: "remuneration_avant_impot", label: "Rémunération avant impôt" },
  { key: "impot_sur_le_revenu", label: "Impôt sur le revenu" },
  { key: "revenu_net_apres_impot", label: "Revenu net après impôt" },
  { key: "epargne_disponible", label: "Épargne disponible" },
];

const ODIA_FIELDS = [
  { key: "revenu_bnc", label: "Revenu BNC Compte personelle" },
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

function InfirmierSimulator() {
  const [brut, setBrut] = useState<string>("");
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate(); // Utilisation de useNavigate pour la navigation

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const formatNumber = (num: number) => {
    if (typeof num !== "number" || isNaN(num)) return "0 €";
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brut || isNaN(Number(brut))) {
      setError("Veuillez entrer un chiffre d'affaires valide");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${API_URL}?brut=${brut}`);
      setData(response.data);
    } catch (err) {
      setError("Erreur lors de la récupération des données. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const RegimeItem = ({ label, value }: { label: string; value: number }) => (
    <ListItem>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
        </Grid>
        <Grid item xs={4} textAlign="right">
          <Typography fontWeight="500">{formatNumber(value)}</Typography>
        </Grid>
      </Grid>
    </ListItem>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: isMobile ? 2 : 4, borderRadius: 2 }}>
        <Typography
          variant={isMobile ? "h5" : "h4"}
          component="h1"
          gutterBottom
          align="center"
          sx={{ mb: 4 }}
        >
          Simulateur de Comparaison BNC vs ODIA Stratégie
        </Typography>

        {/* Formulaire de saisie du CA */}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Chiffre d'affaires annuel"
            variant="outlined"
            type="number"
            value={brut}
            onChange={(e) => setBrut(e.target.value)}
            placeholder="Entrez votre CA"
            InputProps={{
              startAdornment: <Box component="span" sx={{ mr: 1 }}>€</Box>,
            }}
            sx={{ mb: 3 }}
          />

          <Box textAlign="center" sx={{ mb: 3 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              type="submit"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Calculer"}
            </Button>
          </Box>

          <Box textAlign="center">
            <Button
              variant="outlined"
              color="info"
              size="large"
              onClick={() => navigate("/regles-de-calcul")}
            >
              Règles de Calcul
            </Button>
          </Box>
        </form>

        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

        {data && (
          <>
            <Box sx={{ mt: 4 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
                    <Chip label="Régime BNC" color="primary" sx={{ mb: 2, fontWeight: "bold" }} />
                    <List>
                      {BNC_FIELDS.map((field) => (
                        <RegimeItem key={field.key} label={field.label} value={data.simulation_bnc[field.key]} />
                      ))}
                    </List>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
                    <Chip label="ODIA Stratégie" color="secondary" sx={{ mb: 2, fontWeight: "bold" }} />
                    <List>
                      {ODIA_FIELDS.map((field) => (
                        <RegimeItem key={field.key} label={field.label} value={data.simulation_odia[field.key]} />
                      ))}
                    </List>
                  </Paper>
                </Grid>
              </Grid>
            </Box>

            <Box textAlign="center" sx={{ mt: 4 }}>
            
              <Button variant="contained" color="secondary" size="large" onClick={() => navigate("/contact")} sx={{ ml: 2 }}>Contact</Button>
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
}

export default InfirmierSimulator;
