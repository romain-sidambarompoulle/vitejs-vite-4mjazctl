import { Container, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

function About() {
  const navigate = useNavigate();

  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom>
        À propos de Odia Stratégie
      </Typography>
      <Typography variant="body1" paragraph>
        Odia Stratégie est une plateforme qui accompagne les professionnels de santé dans l'optimisation de leur fiscalité.
        Nous proposons des outils de simulation et des conseils adaptés pour maximiser leurs revenus et réduire leurs charges.
      </Typography>
      <Typography variant="body1" paragraph>
        Explorez nos simulateurs pour mieux comprendre votre situation financière et prenez des décisions éclairées.
      </Typography>

      {/* 🆕 Ajout du bouton "Découvrir les simulateurs" */}
      <Box sx={{ mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate("/simulators")}
        >
          Découvrir les simulateurs
        </Button>
      </Box>

      {/* 🆕 Ajout du bouton "Contact" en dessous */}
      <Box sx={{ mt: 4 }}>
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

export default About;
