import React, { useState } from "react";
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Slide, 
  useScrollTrigger, 
  IconButton, 
  Menu, 
  MenuItem, 
  useMediaQuery, 
  useTheme 
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";

function HideOnScroll({ children }: { children: React.ReactElement }) {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

function Navbar() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // Détecte les écrans mobiles
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // Gère l'ouverture du menu

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <HideOnScroll>
      <AppBar position="sticky" sx={{ backgroundColor: "#A4C3B2" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* Logo et nom */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography 
              variant="h6" 
              sx={{ fontWeight: "bold", color: "black", cursor: "pointer" }} 
              onClick={() => navigate("/")}
            >
              ODIA-Stratégie
            </Typography>
          </Box>

          {/* Menu pour desktop */}
          {!isMobile && (
            <Box sx={{ display: "flex", gap: 2 }}>
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
          )}

          {/* Menu hamburger pour mobile */}
          {isMobile && (
            <>
              <IconButton color="inherit" onClick={handleMenuOpen}>
                <MenuIcon fontSize="large" />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                sx={{ mt: 1 }}
              >
                <MenuItem onClick={() => { navigate("/simulateur"); handleMenuClose(); }}>
                  Simulateur
                </MenuItem>
                <MenuItem onClick={() => { navigate("/a-propos"); handleMenuClose(); }}>
                  À propos
                </MenuItem>
                <MenuItem onClick={() => { navigate("/contact"); handleMenuClose(); }}>
                  Contact
                </MenuItem>
                <MenuItem onClick={() => { navigate("/formulaire-rdv"); handleMenuClose(); }}>
                  RDV Stratégique
                </MenuItem>
              </Menu>
            </>
          )}

          {/* Icône AccountCircle */}
          <IconButton color="inherit">
            <AccountCircle fontSize="large" />
          </IconButton>
        </Toolbar>
      </AppBar>
    </HideOnScroll>
  );
}

export default Navbar;