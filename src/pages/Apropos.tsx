import { Typography, Container, Box, Paper, Grid, Card, CardContent, CardMedia } from "@mui/material";

function APropos() {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          backgroundColor: "white",
          p: { xs: 2, md: 4 }, // Padding responsive
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {/* Titre principal */}
        <Typography variant="h3" fontWeight="bold" color="primary" sx={{ mb: { xs: 2, md: 4 } }}>
          Notre Histoire – De la contrainte à la liberté
        </Typography>

        {/* Première rangée de cartes */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ backgroundColor: "#A4C3B2", p: { xs: 2, md: 3 }, textAlign: "center", color: "white" }}>
              <CardContent>
                <Typography variant="h6">
                  Je m’appelle Esther, je suis kinésithérapeute, après 5 ans d’études difficiles et un prêt étudiant, j’ai compris une chose : je ne pourrais jamais me payer la vie que je voulais; devenir propriétaire, avoir une voiture fiable et une école montessori pour mes 2 filles. Il fallait faire des concessions, alors que ce rêve me semblait abordable. Pourtant, aujourd’hui, j’ai même plus que ce que j’espérais. Mon mari Romain, passionné d’économie et de finance, a mis en lumière une réalité trop peu connue : En libéral optimisé, on ne se contente pas de "gagner plus", on libère un vrai potentiel financier. J’ai eu une prise de conscience financière et suivis sa méthode. Résultat ?
                  J’ai amélioré ma qualité de vie au travail.
                  • J’ai amélioré mes revenus au point de financer une vie plus confortable.
                  • J’ai retrouvé du temps pour ma famille et pour moi.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Deuxième rangée */}
        <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ backgroundColor: "#EFE9AE", p: { xs: 2, md: 3 }, textAlign: "center" }}>
              <CardContent>
                <Typography variant="body1">
                  Nous savons que les soignants ont besoin d’être rassurés, accompagnés, libérés de la charge mentale administrative.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ backgroundColor: "#A4C3B2", p: { xs: 2, md: 3 }, textAlign: "center", color: "white" }}>
              <CardContent>
                <Typography variant="body1">
                  Un service sur-mesure, pensé pour les besoins spécifiques des libéraux.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ backgroundColor: "#EFE9AE", p: { xs: 2, md: 3 }, textAlign: "center" }}>
              <CardContent>
                <Typography variant="body1">
                  Les soignants libéraux passent leur vie à travailler sans jamais vraiment profiter de ce qu’ils gagnent.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Troisième rangée avec une grande carte */}
        <Grid container spacing={3} sx={{ mt: { xs: 3, md: 5 } }}>
          <Grid item xs={12}>
            <Card sx={{ backgroundColor: "#A4C3B2", p: { xs: 2, md: 4 }, textAlign: "center", color: "white" }}>
              <CardContent>
                <Typography variant="h6">
                  La naissance d’ODIA
                  Nous avons choisi de créer une structure dédiée aux kinés, d’abord pour leur permettre de retrouver un équilibre dans leur pratique et dans leur vie personnelle. Voyant à quel point la gestion administrative et la lourdeur des démarches pouvaient épuiser les soignants, nous avons voulu proposer une solution clé en main qui libère leur emploi du temps, leur esprit et leur énergie. Parce qu’un professionnel de santé délivre de meilleures prestations quand il se forme, se repose suffisamment et peut accueillir chaque patient avec sérénité, nous mettons un point d’honneur à alléger ces contraintes. Qu’il s’agisse de passer plus de temps au chevet de ses patients, d’absorber davantage de connaissances ou simplement de prévenir le burn-out, notre objectif est de leur offrir la même opportunité de s’épanouir et de prospérer qu’à travers notre propre expérience.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Quatrième rangée avec des petites cartes */}
        <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid item xs={12} md={3}>
            <Card 
              sx={{ 
                backgroundColor: "#EFE9AE", 
                p: 0, // Supprime le padding interne
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden", // Assure que l'image ne déborde pas
              }}
            >
              <CardMedia
                component="img"
                image="https://ODIA.b-cdn.net/PHOTO-2025-02-05-09-31-27.jpg" // Remplace avec l'URL de ton image
                alt="Illustration"
                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ backgroundColor: "#A4C3B2", p: { xs: 2, md: 3 }, textAlign: "center", color: "white" }}>
              <CardContent>
                <Typography variant="body1">
                  ODIA:
                  Optimisation et Développement d'intelligence Accessible
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card 
              sx={{ 
                backgroundColor: "#EFE9AE", 
                p: 0, // Supprime le padding interne
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden", // Assure que l'image ne déborde pas
              }}
            >
              <CardMedia
                component="img"
                image="https://ODIA.b-cdn.net/PHOTO-2025-02-05-09-31-26.jpg" // Remplace avec l'URL de ton image
                alt="Illustration"
                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default APropos;