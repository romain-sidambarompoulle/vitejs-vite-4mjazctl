import { Link, Typography, Box, Container, Grid, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

// Fonction pour réinitialiser le consentement aux cookies
const resetCookieConsent = () => {
  localStorage.removeItem('cookieConsent');
  window.location.reload(); // Recharge la page pour réafficher le bandeau
};

function Footer() {
  return (
    <Box 
      component="footer" 
      sx={{ 
        position: 'relative',
        zIndex: 9999,
        backgroundColor: '#f5f5f5',
        borderTop: '1px solid #e0e0e0',
        mt: 'auto',
        width: '100%',
        py: { xs: 4, md: 5 }
      }}
    >
      <Container maxWidth="lg">
        {/* Grille principale à 3 colonnes */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          {/* Colonne 1: ODIA Stratégie et tagline */}
          <Grid item xs={12} sm={4} sx={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: { xs: 'center', sm: 'flex-start' }
          }}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#2E5735', 
                fontWeight: 600,
                fontSize: { xs: '1.1rem', sm: '1.2rem' },
                mb: 1 
              }}
            >
              ODIA Stratégie
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                textAlign: { xs: 'center', sm: 'left' }
              }}
            >
              Votre partenaire administratif<br />
              d'optimisation de revenus
            </Typography>
          </Grid>

          {/* Colonne 2: Liens légaux */}
          <Grid item xs={12} sm={4} sx={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: { xs: 'center', sm: 'center' },
            gap: 1.5
          }}>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                color: '#2E5735', 
                fontWeight: 600,
                fontSize: '0.95rem',
                mb: 1,
                textAlign: 'center'
              }}
            >
              Informations légales
            </Typography>
            <Link 
              component={RouterLink} 
              to="/mentions-legales"
              sx={{ 
                color: '#2E5735',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
                fontSize: '0.9rem',
                fontWeight: 500
              }}
            >
              Mentions légales
            </Link>
            <Link 
              component={RouterLink} 
              to="/cgu-cgv"
              sx={{ 
                color: '#2E5735',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
                fontSize: '0.9rem',
                fontWeight: 500
              }}
            >
              CGU / CGV
            </Link>
            <Link 
              component={RouterLink} 
              to="/privacy-policy"
              sx={{ 
                color: '#2E5735',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
                fontSize: '0.9rem',
                fontWeight: 500
              }}
            >
              Politique de confidentialité
            </Link>
            <Button
                variant="text"
                onClick={resetCookieConsent}
                sx={{
                    color: '#2E5735',
                    textDecoration: 'none',
                    textTransform: 'none',
                    padding: 0,
                    minWidth: 0,
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    '&:hover': {
                        textDecoration: 'underline',
                        backgroundColor: 'transparent'
                    }
                }}
            >
                Gérer mes cookies
            </Button>
          </Grid>

          {/* Colonne 3: Informations de contact */}
          <Grid item xs={12} sm={4} sx={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: { xs: 'center', sm: 'flex-end' },
            gap: 1.5
          }}>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                color: '#2E5735', 
                fontWeight: 600,
                fontSize: '0.95rem',
                mb: 1,
                textAlign: { xs: 'center', sm: 'right' }
              }}
            >
              Contactez-nous
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1
            }}>
              <EmailIcon sx={{ color: '#2E5735', fontSize: 18 }} />
              <Link 
                href="mailto:contact@odia-strategie.com"
                sx={{
                  color: '#2E5735',
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                  fontSize: '0.9rem',
                  fontWeight: 500
                }}
              >
                contact@odia-strategie.com
              </Link>
            </Box>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1
            }}>
              <PhoneIcon sx={{ color: '#2E5735', fontSize: 18 }} />
              <Link 
                href="tel:0692445436"
                sx={{
                  color: '#2E5735',
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                  fontSize: '0.9rem',
                  fontWeight: 500
                }}
              >
                06 92 44 54 36
              </Link>
            </Box>
          </Grid>
        </Grid>

        {/* Copyright centré en bas */}
        <Box sx={{ 
          borderTop: '1px solid #e0e0e0',
          pt: 3,
          textAlign: 'center'
        }}>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ fontSize: '0.85rem' }}
          >
            © {new Date().getFullYear()} ODIA Stratégie - Tous droits réservés
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;