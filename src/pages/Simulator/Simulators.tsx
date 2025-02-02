import { Container, Paper, Typography, Button, Box, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Simulators() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, textAlign: "center" }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Choisissez un simulateur
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ py: 2 }}
              onClick={() => navigate("/simulators/kine")}
            >
              Simulateur Kinésithérapeute
            </Button>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              sx={{ py: 2 }}
              onClick={() => navigate("/simulators/sage-femme")}
            >
              Simulateur Sage-Femme
            </Button>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              color="success"
              fullWidth
              sx={{ py: 2 }}
              onClick={() => navigate("/simulators/infirmier")}
            >
              Simulateur Infirmier
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* 🆕 Ajout du bouton "Règles de calcul" juste avant le bouton "Contact" */}
      <Box textAlign="center" sx={{ mt: 4 }}>
        <Button
          variant="outlined"
          color="info"
          size="large"
          onClick={() => navigate("/regles-de-calcul")}
        >
          Règles de calcul
        </Button>
      </Box>

      {/* 🆕 Ajout du bouton "Contact" en dessous des simulateurs */}
      <Box textAlign="center" sx={{ mt: 3 }}>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={() => navigate("/contact")}
        >
          Contact
        </Button>
      </Box>
    </Container>
  );
}

export default Simulators;
