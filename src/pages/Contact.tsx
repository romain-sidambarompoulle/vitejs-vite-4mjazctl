import { Container, Typography, Box } from "@mui/material";

function Contact() {
  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Box textAlign="center">
        <Typography variant="h4" gutterBottom>
          Contactez-nous
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Téléphone : <a href="tel:+262692445436">06 92 44 54 36</a>
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Email : <a href="mailto:contact@odia-strategie.com">contact@odia-strategie.com</a>
        </Typography>
      </Box>
    </Container>
  );
}

export default Contact;