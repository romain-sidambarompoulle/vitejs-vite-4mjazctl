import { Container, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

function KineExplanation() {
  const navigate = useNavigate();

  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom>
        Explication du simulateur Kinésithérapeute
      </Typography>
      <Typography variant="body1" paragraph>
        Ce simulateur vous permet de calculer vos revenus nets après impôts et cotisations sociales. 
        Il prend en compte plusieurs paramètres tels que les charges, les abattements et les contributions obligatoires.
      </Typography>
      <Typography variant="body1" paragraph>
        Utilisez-le pour comparer les différents régimes fiscaux et optimiser votre situation financière.
      </Typography>
      <Box sx={{ mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate("/simulators/kine")}
        >
          Accéder au simulateur
        </Button>
      </Box>
    </Container>
  );
}

export default KineExplanation;
