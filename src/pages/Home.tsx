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
  { height: "240px", width: "180px" },  // Petit → +40px hauteur & +20px largeur
  { height: "300px", width: "220px" },  // Grand → +40px hauteur & +20px largeur
  { height: "240px", width: "180px" },  // Petit → +40px hauteur & +20px largeur
  { height: "300px", width: "220px" },  // Grand → +40px hauteur & +20px largeur
  { height: "240px", width: "180px" },  // Petit → +40px hauteur & +20px largeur
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
        
        <Paper
          elevation={3}
          sx={{
            width: "100vw",
            minHeight: { xs: "800px", sm: "900px", md: "1000px" },
            height: "auto",
            backgroundColor: "#A4C3B2",
            p: { xs: 4, md: 8 },
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
    mb: 8, // Ajoute une marge en bas pour séparer du sous-titre
  }}
>
  Travaillez mieux. Gagnez plus.{" "}
  <span style={{ color: "#FCE5B6" }}>Sans stress.</span>
</Typography>
  <Typography
    variant="h4" // Augmente la taille de la police du sous-titre
    sx={{
      color: "black",
      fontFamily: "'Montserrat', sans-serif",
      fontWeight: 500,
      mt: 8, // Ajoute une marge en haut pour plus d'espace avec le titre
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
    flexDirection: "row",
    justifyContent: "center",
    gap: 2,
    width: "100%",
  }}
>
  {/* Carte Simulateur Kiné */}
  <Card
    sx={{
      backgroundColor: "#FCE5B6",
      color: "black",
      minWidth: "180px", // Plus large
      padding: "15px",
      cursor: "pointer",
      textAlign: "center",
      transition: "transform 0.2s ease-in-out",
      "&:hover": {
        transform: "scale(1.05)", // Effet zoom au survol
        backgroundColor: "#F9D88B",
      },
    }}
    onClick={() => handleNavigateToSimulator("kine")}
  >
    <CardContent>
      <Typography variant="h6" fontWeight="bold">
        Simulateur Kinésithérapeute
      </Typography>
    </CardContent>
  </Card>

  {/* Carte Simulateur Sage-Femme */}
  <Card
    sx={{
      backgroundColor: "#FCE5B6",
      color: "black",
      minWidth: "180px",
      padding: "15px",
      cursor: "pointer",
      textAlign: "center",
      transition: "transform 0.2s ease-in-out",
      "&:hover": {
        transform: "scale(1.05)",
        backgroundColor: "#F9D88B",
      },
    }}
    onClick={() => handleNavigateToSimulator("sagefemme")}
  >
    <CardContent>
      <Typography variant="h6" fontWeight="bold">
        Simulateur Sage-Femme
      </Typography>
    </CardContent>
  </Card>

  {/* Carte Simulateur Infirmier */}
  <Card
    sx={{
      backgroundColor: "#FCE5B6",
      color: "black",
      minWidth: "180px",
      padding: "15px",
      cursor: "pointer",
      textAlign: "center",
      transition: "transform 0.2s ease-in-out",
      "&:hover": {
        transform: "scale(1.05)",
        backgroundColor: "#F9D88B",
      },
    }}
    onClick={() => handleNavigateToSimulator("infirmier")}
  >
    <CardContent>
      <Typography variant="h6" fontWeight="bold">
        Simulateur Infirmier
      </Typography>
    </CardContent>
  </Card>
</Box>


          {/* Bouton RDV Stratégique centré entre les simulateurs et les cartes */}
<Box textAlign="center" sx={{ my: 3 }}>
  <Button
    variant="contained"
    color="primary"
    sx={{
      fontSize: "1.2rem",
      padding: "15px 30px",
      backgroundColor: "#4A4A4A", // Bleu comme sur l'image
      color: "white",
      textTransform: "uppercase",
      borderRadius: "8px", // Coins légèrement arrondis
      display: "flex",
      alignItems: "center",
      gap: 1, // Espace entre texte et icône
    }}
    onClick={() => navigate("/formulaire-rdv")}
    startIcon={<SendIcon sx={{ fontSize: "1.5rem" }} />} // Icône flèche
  >
    Planifier Un Rendez-Vous Stratégique
  </Button>
</Box>

          {/* 5 Cartes alignées côte à côte avec images et tailles différentes */}
          <Grid 
  container 
  spacing={2} 
  sx={{ mt: 3, justifyContent: "center", alignItems: "center" }} // Ajout de alignItems: "center"
>
  {images.map((image, index) => (
    <Grid item key={index} sx={{ display: "flex", justifyContent: "center" }}>
      <Card
        sx={{
          height: cardSizes[index].height,
          width: cardSizes[index].width,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundImage: `url(${image})`,
          borderRadius: "15px",
          boxShadow: 3,
        }}
      >
        <CardContent>
          <Typography variant="body1" sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>
            
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  ))}
</Grid>


</Paper>


        {/* Paper 2 */}
        <Paper
  elevation={3}
  sx={{
    minHeight: { xs: "400px", sm: "500px", md: "600px" },
    maxWidth: { xs: "90%", sm: "80%", md: "70%" },
    width: "100%",
    margin: "auto",
    backgroundColor: "#A4C3B2",
    p: { xs: 4, md: 8 },
  }}
>
  {/* Titre ajusté en taille et en gras */}
  <Typography 
    variant="h4" 
    fontWeight="bold" 
    color="white" 
    textAlign="center" 
    sx={{ mb: 5 }}
  >
    Vous êtes kinésithérapeute, infirmier(ère) ou sage-femme et vous souhaitez mieux valoriser votre travail ?
  </Typography>

  <Grid container spacing={6} alignItems="center">
    {/* Colonne 1 : Carte jaune avec ajustement des dimensions */}
    <Grid 
      item xs={12} md={4} 
      sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 6 }} // Légèrement plus bas
    >
      <Card sx={{ 
        backgroundColor: "#F7D488", 
        p: 3, 
        color: "black", 
        textAlign: "center", 
        width: "100%", 
        minHeight: "180px", 
        borderTopLeftRadius: "30px", 
        borderBottomRightRadius: "30px"
      }}>
        <CardContent>
          <Typography variant="body1">
            ODIA assume l’intégralité de votre gestion administrative, revoit et améliore votre structure financière...
          </Typography>
        </CardContent>
      </Card>
    </Grid>

    {/* Colonne 2-3 : Carte ajustée et bien espacée, plus épaisse */}
    <Grid 
      item xs={12} md={8} 
      sx={{
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center", 
        mt: 6 // Légèrement plus bas
      }}
    >
      <Card sx={{ p: 4, width: "90%", maxWidth: "600px", minHeight: "200px" }}> {/* Plus épaisse */}
        <CardContent>
          <Typography variant="h6" textAlign="center">Accès à nos simulateurs</Typography>
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
    minHeight: { xs: "400px", sm: "500px", md: "600px" },
    maxWidth: { xs: "90%", sm: "80%", md: "70%" },
    width: "100%",
    margin: "auto",
    backgroundColor: "white",
    p: { xs: 4, md: 8 },
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  }}
>
  <Grid container spacing={3}>
    {/* Colonne 1 : Carte en haut à gauche (fond vert) */}
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

  {/* Bouton RDV Stratégique centré */}
  <Box textAlign="center" sx={{ my: 3 }}>
    <Button variant="contained" size="large" onClick={() => navigate("/formulaire-rdv")}>
      RDV Stratégique
    </Button>
  </Box>

  {/* Carte en bas à droite (fond jaune) */}
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
    minHeight: { xs: "400px", sm: "500px", md: "600px" },
    maxWidth: { xs: "90%", sm: "80%", md: "70%" },
    width: "100%",
    margin: "auto",
    backgroundColor: "#A4C3B2",
    p: { xs: 4, md: 8 },
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  }}
>
  {/* Carte principale en haut avec titre et texte */}
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

  {/* Trois cartes alignées en bas */}
  <Grid container spacing={3} sx={{ mt: 6 }}>
    <Grid item xs={12} md={4}>
      <Card sx={{ backgroundColor: "#EFE9AE", p: 3, textAlign: "center", height: "100%" }}>
        <CardContent>
          <Typography variant="body1">
            Plus de temps : vous réduisez votre gestion administrative au strict minimum.
          </Typography>
        </CardContent>
      </Card>
    </Grid>
    <Grid item xs={12} md={4}>
      <Card sx={{ backgroundColor: "#EFE9AE", p: 3, textAlign: "center", height: "100%" }}>
        <CardContent>
          <Typography variant="body1">
            Plus de revenu : vous conservez davantage de ce que vous produisez.
          </Typography>
        </CardContent>
      </Card>
    </Grid>
    <Grid item xs={12} md={4}>
      <Card sx={{ backgroundColor: "#EFE9AE", p: 3, textAlign: "center", height: "100%" }}>
        <CardContent>
          <Typography variant="body1">
            Plus de sérénité : vous savez exactement où vous allez et comment.
          </Typography>
        </CardContent>
      </Card>
    </Grid>
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
