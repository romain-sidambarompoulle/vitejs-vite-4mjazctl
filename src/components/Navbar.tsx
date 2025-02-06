import React from "react";
import { AppBar, Toolbar, Typography, Button, Box, Slide, useScrollTrigger, IconButton } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import AccountCircle from "@mui/icons-material/AccountCircle";

function HideOnScroll({ children }: { children: React.ReactElement }) {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

function Navbar() {
  const navigate = useNavigate(); // Hook pour gérer la navigation

  return (
    <HideOnScroll>
      <AppBar position="sticky" sx={{ backgroundColor: "#A4C3B2" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>

          {/* Conteneur pour ODIA et Accueil */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginRight: "auto" }}>
            {/* Texte ODIA aligné à gauche */}
            <Typography 
              variant="h6" 
              sx={{ fontWeight: "bold", color: "black", cursor: "pointer" }} 
              onClick={() => navigate("/")}
            >
              ODIA-Stratégie
            </Typography>

            {/* Bouton Accueil (retour à la page d'accueil) */}
            <Button color="inherit" sx={{ color: "black" }} onClick={() => navigate("/")}>
              Accueil
            </Button>
          </Box>

          {/* Espace flexible pour centrer les boutons */}
          <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", gap: 2 }}>
            <Button color="inherit" sx={{ color: "black" }} component={Link} to="/simulateur">
              Simulateur
            </Button>
            <Button color="inherit" sx={{ color: "black" }} component={Link} to="/a-propos">
              À propos
            </Button>
            <Button color="inherit" sx={{ color: "black" }} component={Link} to="/contact">
              Contact
            </Button>
            <Button color="inherit" sx={{ color: "black" }} component={Link} to="/formulaire-rdv">
              RDV Stratégique
            </Button>
          </Box>

          {/* Icône AccountCircle alignée à droite */}
          <IconButton color="inherit">
            <AccountCircle fontSize="large" />
          </IconButton>

        </Toolbar>
      </AppBar>
    </HideOnScroll>
  );
}

export default Navbar;
