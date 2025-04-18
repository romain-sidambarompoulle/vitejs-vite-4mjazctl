import React from 'react';
import { Container, Typography, Box, Paper, useTheme, useMediaQuery, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function PrivacyPolicy() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  return (
    <Box sx={{ 
      backgroundColor: '#f1e1c6', 
      minHeight: 'calc(100vh - 130px)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      pt: { xs: 8, sm: 10, md: 12 }, // Augmente l'espace en haut pour l'éloigner de la navbar
      pb: { xs: 6, sm: 8 },          // Espace en bas adaptatif
      px: { xs: 2, sm: 3, md: 4 }    // Padding horizontal responsive
    }}>
      <Container 
        maxWidth="md" 
        sx={{ 
          my: 'auto',                // Centre verticalement
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: { xs: 3, sm: 4, md: 5 }, 
            borderRadius: 2,
            backgroundColor: 'white',
            mx: 'auto',               // Centre horizontalement
            width: '100%',
            maxWidth: '100%',
            mb: { xs: 3, sm: 3 }      // Marge réduite en bas
          }}
        >
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              color: '#2E5735',
              fontWeight: 600,
              mb: { xs: 2, sm: 3, md: 4 },
              textAlign: 'center',
              fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' }
            }}
          >
            Politique de confidentialité
          </Typography>
          
          <Typography 
            paragraph
            sx={{ 
              fontSize: { xs: '0.95rem', sm: '1rem' },
              lineHeight: 1.6
            }}
          >
            Nous collectons et traitons vos données personnelles (nom, email, téléphone, etc.)
            dans le but de réaliser des simulations financières, de planifier des rendez-vous et
            d'assurer le suivi de votre dossier. Ces données sont collectées avec votre consentement
            et sont nécessaires pour vous fournir nos services.
          </Typography>
          
          <Typography 
            paragraph
            sx={{ 
              fontSize: { xs: '0.95rem', sm: '1rem' },
              lineHeight: 1.6
            }}
          >
            Conformément à la législation française (RGPD), vous disposez d'un droit d'accès,
            de modification, de rectification et de suppression de vos données. Vous pouvez exercer
            ce droit à tout moment en nous contactant à l'adresse suivante :
            <strong> privacy@odia-strategie.com</strong>.
          </Typography>
          
          <Typography 
            paragraph
            sx={{ 
              fontSize: { xs: '0.95rem', sm: '1rem' },
              lineHeight: 1.6
            }}
          >
            Vos données sont conservées pendant la durée strictement nécessaire à la réalisation
            des finalités décrites. Nous mettons en place toutes les mesures de sécurité nécessaires
            pour préserver la confidentialité de vos informations.
          </Typography>
          
          <Typography 
            paragraph 
            sx={{ 
              mb: 0,
              fontSize: { xs: '0.95rem', sm: '1rem' },
              lineHeight: 1.6
            }}
          >
            En naviguant sur notre site et en cochant la case de consentement sur nos formulaires,
            vous acceptez cette politique de confidentialité. Pour toute question, contactez-nous
            à l'adresse susmentionnée.
          </Typography>
        </Paper>
        
        {/* Bouton de retour avec le même style que sur la page d'accueil */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          mt: { xs: 2, sm: 3 },
          mb: { xs: 4, sm: 6 }
        }}>
          <Button 
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
            sx={{
              color: '#2E5735',
              borderColor: '#2E5735',
              backgroundColor: 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(46, 87, 53, 0.1)',
                borderColor: '#2E5735',
              },
              py: 1,
              px: 3,
              textTransform: 'none',
              fontSize: '1rem',
              borderWidth: '2px',
              borderRadius: '4px',
              fontWeight: 500
            }}
          >
            Retour à l'accueil
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default PrivacyPolicy;