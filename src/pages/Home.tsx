import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Grid,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";


function Home() {
  const navigate = useNavigate();


  return (
    <>
      {/* Hero Section */}
      <Box
        sx={{
          backgroundImage:
            "url(https://plus.unsplash.com/premium_photo-1661292018719-db932eb64e39?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: { xs: "40vh", md: "60vh" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Container>
          <Typography
            variant="h2"
            color="white"
            align="center"
            sx={{ textShadow: "2px 2px 4px rgba(0,0,0,0.7)" }}
          >
            Optimisez votre fiscalité
          </Typography>
          <Typography
            variant="h5"
            color="white"
            align="center"
            sx={{ mt: 2, textShadow: "1px 1px 3px rgba(0,0,0,0.7)" }}
          >
            Votre plateforme de simulation pour des conseils personnalisés
          </Typography>
          <Box textAlign="center" sx={{ mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate("/simulators")}
            >
              Accéder à nos simulateurs
            </Button>
          </Box>
        </Container>
      </Box>


      {/* Section de Présentation des Simulateurs */}
      <Container sx={{ py: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={3}
              sx={{ p: 4, textAlign: "center", height: "100%", cursor: "pointer" }}
              onClick={() => navigate("/explanation/kine")}
            >
              <Typography variant="h6" gutterBottom>
                Simulateur Kinésithérapeute
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Simulez vos revenus et charges pour optimiser votre fiscalité.
              </Typography>
            </Paper>
          </Grid>


          <Grid item xs={12} md={4}>
            <Paper
              elevation={3}
              sx={{ p: 4, textAlign: "center", height: "100%", cursor: "pointer" }}
              onClick={() => navigate("/explanation/sage-femme")}
            >
              <Typography variant="h6" gutterBottom>
                Simulateur Sage-femme
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Découvrez vos options pour une gestion financière optimisée.
              </Typography>
            </Paper>
          </Grid>


          <Grid item xs={12} md={4}>
            <Paper
              elevation={3}
              sx={{ p: 4, textAlign: "center", height: "100%", cursor: "pointer" }}
              onClick={() => navigate("/explanation/infirmier")}
            >
              <Typography variant="h6" gutterBottom>
                Simulateur Infirmier
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Analysez votre situation pour mieux anticiper vos charges.
              </Typography>
            </Paper>
          </Grid>
        </Grid>


        {/* 🆕 Ajout du bouton "Contact" en dessous des simulateurs */}
        <Box textAlign="center" sx={{ mt: 6 }}>
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
       
        {/* Ajout du bouton "Prendre un rendez-vous" */}
      <Box textAlign="center" sx={{ mt: 6 }}>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={() => navigate("/formulaire-rdv")}
        >
          Prendre un rendez-vous stratégique
        </Button>
      </Box>


      {/* Footer */}
      <Box sx={{ backgroundColor: "grey.200", py: 3, mt: 4 }}>
        <Container>
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} ODIA Stratégie. Tous droits réservés.
          </Typography>
        </Container>
      </Box>
    </>
  );
}


export default Home;
