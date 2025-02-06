import {
  Typography,
  Button,
  Container,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Fab,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import AddIcon from "@mui/icons-material/Add";
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

  // Gère la redirection vers le simulateur en conservant la sélection
  const handleNavigateToSimulator = (simulator: string) => {
    navigate(`/simulateur?selected=${simulator}`);
  };

  return (
    <>
      {/* Sections organisées avec Paper et Grid */}
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
          {/* Slogan sous la navbar */}
          <Box sx={{ mb: 3, textAlign: "center" }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: "bold",
                color: "black",
                fontFamily: "'Rosborough CF', sans-serif",
                letterSpacing: "2px",
                mb: 4,
                fontSize: { xs: "2rem", sm: "3rem", md: "4rem" }, // Responsive font size
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
                fontSize: { xs: "1.2rem", sm: "1.5rem", md: "2rem" }, // Responsive font size
              }}
            >
              Votre partenaire administratif d'optimisation de revenus <br />
              qui vous accompagne sur la durée.
            </Typography>
          </Box>

          {/* Boutons Simulateurs */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" }, // Colonne sur mobile, ligne sur desktop
              justifyContent: "center",
              gap: 2,
              width: "100%",
            }}
          >
            {["Kinésithérapeute", "Sage-Femme", "Infirmier"].map((title, index) => (
              <Card
                key={index}
                sx={{
                  backgroundColor: "#FCE5B6",
                  color: "black",
                  minWidth: { xs: "100%", sm: "180px" }, // Pleine largeur sur mobile
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

          {/* 5 Cartes avec défilement horizontal */}
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
            <Box
              sx={{
                display: "inline-flex",
                gap: 4,
                px: 2,
                width: "max-content",
              }}
            >
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
                    ></Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        </Paper>

        {/* Paper 2 */}
        <Paper
          elevation={3}
          sx={{
            minHeight: { xs: "auto", sm: "500px", md: "600px" },
            maxWidth: { xs: "90%", sm: "80%", md: "70%" },
            width: "100%",
            margin: "auto",
            backgroundColor: "#A4C3B2",
            p: { xs: 2, md: 8 },
            mt: 4,
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            color="white"
            textAlign="center"
            sx={{ mb: 5, fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" } }}
          >
            Vous êtes kinésithérapeute, infirmier(ère) ou sage-femme et vous souhaitez mieux valoriser votre travail ?
          </Typography>

          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  backgroundColor: "#F7D488",
                  p: 3,
                  color: "black",
                  textAlign: "center",
                  width: "100%",
                  minHeight: "180px",
                  borderTopLeftRadius: "30px",
                  borderBottomRightRadius: "30px",
                }}
              >
                <CardContent>
                  <Typography variant="body1">
                    ODIA assume l’intégralité de votre gestion administrative, revoit et améliore votre structure financière...
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={8}>
              <Card sx={{ p: 4, width: "100%", minHeight: "200px" }}>
                <CardContent>
                  <Typography variant="h6" textAlign="center">
                    Accès à nos simulateurs
                  </Typography>
                  <Box textAlign="center" sx={{ mt: 3 }}>
                    <Button variant="contained" startIcon={<PlayCircleOutlineIcon />}>
                      Voir la vidéo explicative
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>

        {/* Paper 3 */}
        <Paper
          elevation={3}
          sx={{
            minHeight: { xs: "auto", sm: "500px", md: "600px" },
            maxWidth: { xs: "90%", sm: "80%", md: "70%" },
            width: "100%",
            margin: "auto",
            backgroundColor: "white",
            p: { xs: 2, md: 8 },
            mt: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 2, backgroundColor: "#A4C3B2", color: "white" }}>
                <CardContent>
                  <Typography variant="body1">
                    Un nouveau regard sur le libéral...
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box textAlign="center" sx={{ my: 3 }}>
            <Button variant="contained" size="large" onClick={() => navigate("/formulaire-rdv")}>
              RDV Stratégique
            </Button>
          </Box>

          <Grid container justifyContent="flex-end">
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 2, backgroundColor: "#EFE9AE" }}>
                <CardContent>
                  <Typography variant="body1">
                    Tout commence par un RDV stratégique offert...
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>

        {/* Paper 4 */}
        <Paper
          elevation={3}
          sx={{
            minHeight: { xs: "auto", sm: "500px", md: "600px" },
            maxWidth: { xs: "90%", sm: "80%", md: "70%" },
            width: "100%",
            margin: "auto",
            backgroundColor: "#A4C3B2",
            p: { xs: 2, md: 8 },
            mt: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Card sx={{ textAlign: "center", p: 4, minHeight: "180px" }}>
            <CardContent>
              <Typography variant="h5" fontWeight="bold" color="yellow.200" sx={{ mb: 2 }}>
                Nous couvrons l’ensemble du parcours
              </Typography>
              <Typography variant="body1" color="yellow.200">
                Constitution du dossier, suivi juridique, comptabilité, conseil en investissement.
                Vous n’êtes plus seul à devoir comprendre et appliquer de multiples informations éparses.
              </Typography>
            </CardContent>
          </Card>

          <Grid container spacing={3} sx={{ mt: 6 }}>
            {[
              "Plus de temps : vous réduisez votre gestion administrative au strict minimum.",
              "Plus de revenu : vous conservez davantage de ce que vous produisez.",
              "Plus de sérénité : vous savez exactement où vous allez et comment.",
            ].map((text, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ backgroundColor: "#EFE9AE", p: 3, textAlign: "center", height: "100%" }}>
                  <CardContent>
                    <Typography variant="body1">{text}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>

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