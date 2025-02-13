import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  CardContent
} from "@mui/material";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
// ------------ Import Recharts -----------
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from "recharts";

// URLs des APIs pour chaque simulateur
const API_URLS: Record<string, string> = {
  kine: "https://script.google.com/macros/s/AKfycbzNd0Blu_J5Ms-FGgfQQgal46qlfXlgHRiygR0RA2BGjHh_vm9ZHxt6raDrAubFynZVhQ/exec",
  sagefemme: "https://script.google.com/macros/s/AKfycbwhyFANDybERSdTg2l5J3LtCodmUC7VxPkZopFw-D6HoFx4RGZiAR8r7dJJoHBZYA4RQw/exec",
  infirmier: "https://script.google.com/macros/s/AKfycbwKH4QWfJNk7myoreqWpiW2bvGtHrjXz55qObeN0QBlOOJ6iRGMGkmlbPNawKpACy8V/exec"
};

function Simulateur() {
  const location = useLocation();
  const navigate = useNavigate();
  const { width, height } = useWindowSize();

  // Récupère la valeur du query param ?selected=
  const params = new URLSearchParams(location.search);
  const selectedSimParam = params.get("selected");

  // Simulateur sélectionné
  const [selectedSim, setSelectedSim] = useState<string>(
    selectedSimParam || "kine"
  );

  // Chiffre d'affaires
  const [chiffreAffaires, setChiffreAffaires] = useState<string>("");

  // Données renvoyées par l'API (dont BNC/ODIA)
  const [data, setData] = useState<any | null>(null);

  // Gestion chargement et erreur
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Animation confetti
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  // Gère la synchro du simulateur avec l'URL
  useEffect(() => {
    if (selectedSimParam && selectedSimParam !== selectedSim) {
      setSelectedSim(selectedSimParam);
      setData(null);
      setError("");
      setChiffreAffaires("");
    }
  }, [selectedSimParam, selectedSim]);

  // Sélection d'un simulateur (on modifie le query param)
  const handleSelectSim = (simulator: string) => {
    const newParams = new URLSearchParams(location.search);
    newParams.set("selected", simulator);
    navigate(`/simulateur?${newParams.toString()}`);

    setSelectedSim(simulator);
    setData(null);
    setError("");
    setChiffreAffaires("");
  };

  // Formatage d'un nombre en devise EUR
  const formatNumber = (num: number) => {
    if (!num || isNaN(num)) return "0 €";
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0
    }).format(num);
  };

  // Gestion de la soumission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const caValue = Number(chiffreAffaires);

    // Vérification CA correct
    if (!chiffreAffaires || isNaN(caValue)) {
      setError("Veuillez entrer un chiffre d'affaires valide.");
      return;
    }

    // CA minimum
    if (caValue < 52000) {
      setError(
        "Votre chiffre d'affaires est inférieur à 52 000 €. Veuillez demandez un RDV stratégique."
      );
      return;
    }

    if (!selectedSim || !API_URLS[selectedSim]) {
      setError("Veuillez sélectionner un simulateur valide.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await axios.get(
        `${API_URLS[selectedSim]}?brut=${chiffreAffaires}`
      );
      setData(response.data);

      // Active confetti si performance_montage > 0
      if (response.data?.simulation_odia?.performance_montage > 0) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
    } catch (err) {
      setError(
        "Erreur lors de la récupération des données. Veuillez réessayer."
      );
    } finally {
      setLoading(false);
    }
  };

  // Mapping des intitulés pour affichage
  const bncLabels: Record<string, string> = {
    cotisations: "CARPIMKO ou CARCDSF",
    contribution: "URSSAF",
    impot_sur_le_revenu: "IMPÔT (IR)",
    epargne_disponible: "ÉPARGNE (disponible)"
  };

  const odiaLabels: Record<string, string> = {
    cotisations: "CARPIMKO ou CARCDSF",
    contribution: "URSSAF",
    impot_sur_le_revenu: "IMPÔT (IR)",
    total_epargne_disponible: "ÉPARGNE (disponible)"
  };

  const extraLabels: Record<string, string> = {
    performance_montage: "ÉCONOMIE ANNUELLE",
    capital_revenu_place_10ans: "CAPITAL au bout de 10 ans",
    interet_mensuel_capital_10ans: "INTÉRÊT MENSUEL du capital au bout de 10 ans"
  };

  // ------------------------- Préparation des données Recharts -------------------------
  // On ne calcule les données que si data est défini
  const chartDataCharges = data
    ? [
        {
          name: "URSSAF",
          BNC: data.simulation_bnc?.cotisations || 0,
          ODIA: data.simulation_odia?.cotisations || 0
        },
        {
          name: "CARPIMKO ou CARCDSF",
          BNC: data.simulation_bnc?.contribution || 0,
          ODIA: data.simulation_odia?.contribution || 0
        },
        {
          name: "Impôt IR",
          BNC: data.simulation_bnc?.impot_sur_le_revenu || 0,
          ODIA: data.simulation_odia?.impot_sur_le_revenu || 0
        }
      ]
    : [];

  // Pour la différence d'épargne disponible
  const chartDataEpargne = data
    ? [
        {
          name: "Épargne Disponible",
          BNC: data.simulation_bnc?.epargne_disponible || 0,
          ODIA: data.simulation_odia?.total_epargne_disponible || 0
        }
      ]
    : [];

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {showConfetti && <Confetti width={width} height={height} />}

      <Paper
        elevation={3}
        sx={{
          minHeight: "160vh",
          width: "100%",
          p: { xs: 4, md: 8 },
          textAlign: "center"
        }}
      >
        {/* Sélection du simulateur */}
        <Grid container spacing={4} sx={{ width: "100%", mt: 0 }}>
          {["kine", "sagefemme", "infirmier"].map((sim) => (
            <Grid item xs={12} md={4} key={sim}>
              <Card
                sx={{
                  backgroundColor:
                    selectedSim === sim ? "#A4C3B2" : selectedSim
                    ? "#E0E0E0"
                    : "#EFE9AE",
                  p: 3,
                  textAlign: "center",
                  height: "100%",
                  cursor: "pointer"
                }}
                onClick={() => handleSelectSim(sim)}
              >
                <CardContent>
                  <Typography variant="h6">
                    {sim === "kine"
                      ? "Simulateur Kinésithérapeute"
                      : sim === "sagefemme"
                      ? "Simulateur Sage-Femme"
                      : "Simulateur Infirmier"}
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
              {error && <Alert severity="warning">{error}</Alert>}

              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Chiffre d’Affaires Annuel (€)"
                  variant="outlined"
                  type="number"
                  value={chiffreAffaires}
                  onChange={(e) => setChiffreAffaires(e.target.value)}
                  placeholder="Entrez votre CA annuel"
                  sx={{ mb: 3 }}
                />
                <Box sx={{ display: "inline-flex", gap: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : "Calculer"}
                  </Button>
                  {/* Bouton qui redirige vers la page des règles de calcul */}
                  <Button
                    variant="outlined"
                    color="primary"
                    type="button"
                    onClick={() => navigate("/regles-de-calcul")}
                  >
                    Règles de calcul
                  </Button>
                </Box>
              </form>
            </Paper>
          </Box>
        )}

        {/* Résultats BNC et ODIA */}
        {data && (
          <>
            <Grid container spacing={3} sx={{ mt: 4 }}>
              <Grid item xs={12} md={6}>
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Chip label="BNC / EI / IR" color="primary" sx={{ mb: 2 }} />
                  <List>
                    {Object.keys(data.simulation_bnc)
                      .filter((key) => bncLabels[key])
                      .map((key) => (
                        <ListItem key={key}>
                          {bncLabels[key]}: {formatNumber(data.simulation_bnc[key])}
                        </ListItem>
                      ))}
                  </List>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Chip label="Stratégie ODIA" color="secondary" sx={{ mb: 2 }} />
                  <List>
                    {Object.keys(data.simulation_odia)
                      .filter((key) => odiaLabels[key])
                      .map((key) => (
                        <ListItem key={key}>
                          {odiaLabels[key]}: {formatNumber(data.simulation_odia[key])}
                        </ListItem>
                      ))}
                  </List>
                </Paper>
              </Grid>
            </Grid>

            {/* Indicateurs financiers supplémentaires */}
            {Object.keys(data.simulation_odia).some((key) => extraLabels[key]) && (
              <Paper elevation={1} sx={{ p: 2, mt: 4 }}>
                <Chip label="Notre petit plus" color="secondary" sx={{ mb: 2 }} />
                <List>
                  {Object.keys(data.simulation_odia)
                    .filter((key) => extraLabels[key])
                    .map((key) => (
                      <ListItem key={key}>
                        {extraLabels[key]}: {formatNumber(data.simulation_odia[key])}
                      </ListItem>
                    ))}
                </List>
              </Paper>
            )}

            {/* Graphique 1 : Charges (URSSAF, CARPIMKO, impôt) */}
            <Typography variant="h5" sx={{ mt: 6, mb: 2 }}>
              Comparaison des charges
            </Typography>
            <Box sx={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <BarChart
                  data={chartDataCharges}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatNumber(value as number)} />
                  <Legend />
                  <Bar dataKey="BNC" name="BNC/EI/IR" fill="#2F4F2F" />
                  <Bar dataKey="ODIA" fill="#FCE5B6" />
                </BarChart>
              </ResponsiveContainer>
            </Box>

            {/* Graphique 2 : Épargne disponible */}
            <Typography variant="h5" sx={{ mt: 6, mb: 2 }}>
              Comparaison de l'épargne disponible
            </Typography>
            <Box sx={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <BarChart
                  data={chartDataEpargne}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatNumber(value as number)} />
                  <Legend />
                  <Bar dataKey="BNC" name="BNC/EI/IR" fill="#2F4F2F" />
                  <Bar dataKey="ODIA" fill="#FCE5B6" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
}

export default Simulateur;
