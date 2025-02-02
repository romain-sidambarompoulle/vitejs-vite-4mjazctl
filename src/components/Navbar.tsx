import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        {/* "Odia Stratégie" aligné à gauche */}
        <Button color="inherit" component={Link} to="/about">
          <Typography variant="body1">
            Odia Stratégie
          </Typography>
        </Button>

        {/* Espace flexible entre Odia Stratégie et Accueil */}
        <Box sx={{ flexGrow: 1 }} />

        {/* "Accueil" centré */}
        <Button color="inherit" component={Link} to="/">
          Accueil
        </Button>

        {/* Espace flexible entre Accueil et Simulateurs */}
        <Box sx={{ flexGrow: 1 }} />

        {/* "Simulateurs" aligné à droite */}
        <Button color="inherit" component={Link} to="/simulators">
          Simulateurs
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
