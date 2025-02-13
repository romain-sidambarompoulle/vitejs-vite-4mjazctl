import {
  Typography,
  Button,
  Container,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import SendIcon from "@mui/icons-material/Send";

// 🔹 Tableau des images pour les cartes
const images = [
  "https://ODIA.b-cdn.net/Design%20sans%20titre-2.png",
  "https://ODIA.b-cdn.net/Design%20sans%20titre-13.png",
  "https://ODIA.b-cdn.net/Design%20sans%20titre-3%20copie.png",
  "https://ODIA.b-cdn.net/Design%20sans%20titre-15.png",
  "https://ODIA.b-cdn.net/Design%20sans%20titre-3%20copie%202.png",
];

// 🔹 Tailles différentes pour alterner
const cardSizes = [
  { height: "240px", width: "180px" }, // Petit
  { height: "300px", width: "220px" }, // Grand
  { height: "240px", width: "180px" }, // Petit
  { height: "300px", width: "220px" }, // Grand
  { height: "240px", width: "180px" }, // Petit
];

function Home() {
  const navigate = useNavigate();

  // Gère la redirection vers le simulateur
  const handleNavigateToSimulator = (simulator: string) => {
    navigate(`/simulateur?selected=${simulator}`);
  };

  return (
    <>
      {/* Contenant principal (Box) */}
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* Paper 1 */}
        <Paper
          elevation={3}
          sx={{
            width: "100%",
            minHeight: { xs: "auto", sm: "900px", md: "1000px" },
            backgroundColor: "#A4C3B2",
            p: { xs: 2, md: 8 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            textAlign: "center",
          }}
        >
          {/* Slogan */}
          <Box sx={{ mb: 3, textAlign: "center" }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: "bold",
                color: "black",
                fontFamily: "'Rosborough CF', sans-serif",
                letterSpacing: "2px",
                mb: 4,
                fontSize: { xs: "2rem", sm: "3rem", md: "4rem" },
              }}
            >
              Travaillez mieux. Gagnez plus.{" "}
              <span style={{ color: "#FCE5B6" }}>Sans stress.</span>
            </Typography>
            <Typography
              variant="h4"
              sx={{
                color: "black",
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 500,
                mt: 4,
                fontSize: { xs: "1.2rem", sm: "1.5rem", md: "2rem" },
              }}
            >
              Votre partenaire administratif d'optimisation de revenus<br />
              qui vous accompagne sur la durée.
            </Typography>
          </Box>

          {/* Boutons Simulateurs */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "center",
              gap: 2,
              width: "100%",
            }}
          >
            {["Kinésithérapeute", "Sage-Femme", "Infirmier"].map((title, i) => (
              <Card
                key={i}
                sx={{
                  backgroundColor: "#FCE5B6",
                  color: "black",
                  minWidth: { xs: "100%", sm: "180px" },
                  padding: "15px",
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "transform 0.2s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.05)",
                    backgroundColor: "#F9D88B",
                  },
                }}
                onClick={() => handleNavigateToSimulator(title.toLowerCase())}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">
                    Simulateur {title}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Bouton RDV Stratégique */}
          <Box textAlign="center" sx={{ my: 3 }}>
            <Button
              variant="contained"
              color="primary"
              sx={{
                fontSize: { xs: "1rem", sm: "1.2rem" },
                padding: { xs: "10px 20px", sm: "15px 30px" },
                backgroundColor: "#4A4A4A",
                color: "white",
                textTransform: "uppercase",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
              onClick={() => navigate("/formulaire-rdv")}
              startIcon={<SendIcon sx={{ fontSize: "1.5rem" }} />}
            >
              Planifier Un Rendez-Vous Stratégique
            </Button>
          </Box>

          {/* 5 Cartes défilantes */}
          <Box
            sx={{
              mt: 3,
              width: "100%",
              overflowX: "auto",
              whiteSpace: "nowrap",
              py: 2,
              "&::-webkit-scrollbar": {
                height: "6px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#A4C3B2",
                borderRadius: "3px",
              },
            }}
          >
            <Box sx={{ display: "inline-flex", gap: 4, px: 2, width: "max-content" }}>
              {images.map((image, index) => (
                <Card
                  key={index}
                  sx={{
                    height: cardSizes[index].height,
                    width: cardSizes[index].width,
                    flexShrink: 0,
                    backgroundImage: `url(${image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderRadius: "15px",
                    boxShadow: 3,
                    display: "inline-block",
                    "&:hover": {
                      transform: "scale(1.05)",
                      transition: "transform 0.3s ease",
                    },
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "white",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      {/* Texte si besoin */}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        </Paper>
      </Box>
      {/* /Fin du grand Box (section principale) */}

      {/* Footer */}
      <Box sx={{ backgroundColor: "grey.200", py: 3 }}>
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
