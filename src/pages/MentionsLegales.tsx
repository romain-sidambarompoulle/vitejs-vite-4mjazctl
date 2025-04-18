import React from 'react';
import { Container, Typography, Box, Paper, useTheme, useMediaQuery, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function MentionsLegales() {
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
      pt: { xs: 8, sm: 10, md: 12 },
      pb: { xs: 6, sm: 8 },
      px: { xs: 2, sm: 3, md: 4 }
    }}>
      <Container 
        maxWidth="md" 
        sx={{ 
          my: 'auto',
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
            mx: 'auto',
            width: '100%',
            maxWidth: '100%',
            mb: { xs: 3, sm: 3 }
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
            Mentions Légales
          </Typography>
          
          <Typography 
            variant="h5" 
            sx={{ 
              color: '#2E5735',
              fontWeight: 600,
              mt: 4,
              mb: 2,
              fontSize: { xs: '1.3rem', sm: '1.5rem' }
            }}
          >
            Éditeur du site
          </Typography>
          <Typography 
            paragraph
            sx={{ 
              fontSize: { xs: '0.95rem', sm: '1rem' },
              lineHeight: 1.6
            }}
          >
            Ce site est édité par :
          </Typography>
          <Typography 
            component="div"
            sx={{ 
              fontSize: { xs: '0.95rem', sm: '1rem' },
              lineHeight: 1.6,
              mb: 2,
              pl: 2
            }}
          >
            <Box component="p" sx={{ my: 0.5 }}>Raison sociale : ODIA</Box>
            <Box component="p" sx={{ my: 0.5 }}>Forme juridique : Société par Actions Simplifiée (SAS)</Box>
            <Box component="p" sx={{ my: 0.5 }}>Adresse du siège social : 10 ruelle Jacaranda, Sainte-Marie 97438</Box>
            <Box component="p" sx={{ my: 0.5 }}>Numéro d'immatriculation : RCS de Saint-Denis, 940 565 385</Box>
            <Box component="p" sx={{ my: 0.5 }}>Directeur de la publication : SIDAMBAROMPOULLE Esther</Box>
            <Box component="p" sx={{ my: 0.5 }}>Contact : contact@odia-strategie.com</Box>
          </Typography>
          
          <Typography 
            variant="h5" 
            sx={{ 
              color: '#2E5735',
              fontWeight: 600,
              mt: 4,
              mb: 2,
              fontSize: { xs: '1.3rem', sm: '1.5rem' }
            }}
          >
            Hébergeur du site
          </Typography>
          <Typography 
            paragraph
            sx={{ 
              fontSize: { xs: '0.95rem', sm: '1rem' },
              lineHeight: 1.6
            }}
          >
            Le site est hébergé par :
          </Typography>
          <Typography 
            component="div"
            sx={{ 
              fontSize: { xs: '0.95rem', sm: '1rem' },
              lineHeight: 1.6,
              mb: 2,
              pl: 2
            }}
          >
            <Box component="p" sx={{ my: 0.5 }}>Nom de l'hébergeur : GitHub Pages</Box>
            <Box component="p" sx={{ my: 0.5 }}>Site web : www.github.com</Box>
          </Typography>
          
          <Typography 
            variant="h5" 
            sx={{ 
              color: '#2E5735',
              fontWeight: 600,
              mt: 4,
              mb: 2,
              fontSize: { xs: '1.3rem', sm: '1.5rem' }
            }}
          >
            Objet du site
          </Typography>
          <Typography 
            paragraph
            sx={{ 
              fontSize: { xs: '0.95rem', sm: '1rem' },
              lineHeight: 1.6
            }}
          >
            Le site a pour objet de présenter les services administratifs et éducatifs proposés par ODIA, ainsi que d'offrir des outils (simulateurs) et informations visant à optimiser la situation des professionnels de santé.
          </Typography>
          
          <Typography 
            variant="h5" 
            sx={{ 
              color: '#2E5735',
              fontWeight: 600,
              mt: 4,
              mb: 2,
              fontSize: { xs: '1.3rem', sm: '1.5rem' }
            }}
          >
            Propriété intellectuelle
          </Typography>
          <Typography 
            paragraph
            sx={{ 
              fontSize: { xs: '0.95rem', sm: '1rem' },
              lineHeight: 1.6
            }}
          >
            Toutes les marques, logos, éléments graphiques, textes et plus généralement l'ensemble des contenus figurant sur ce site sont protégés au titre du droit de la propriété intellectuelle et sont la propriété exclusive d'ODIA Stratégie ou de ses partenaires. Toute reproduction, représentation ou diffusion, en tout ou partie, sans autorisation préalable écrite, est interdite.
          </Typography>
          
          <Typography 
            variant="h5" 
            sx={{ 
              color: '#2E5735',
              fontWeight: 600,
              mt: 4,
              mb: 2,
              fontSize: { xs: '1.3rem', sm: '1.5rem' }
            }}
          >
            Responsabilité
          </Typography>
          <Typography 
            paragraph
            sx={{ 
              fontSize: { xs: '0.95rem', sm: '1rem' },
              lineHeight: 1.6
            }}
          >
            Les informations fournies sur le site sont à titre indicatif. ODIA Stratégie s'efforce de les maintenir à jour et exactes, mais ne garantit pas leur exhaustivité ou l'absence d'erreur. L'utilisation des informations et outils se fait sous la seule responsabilité de l'utilisateur.
          </Typography>
          
          <Typography 
            variant="h5" 
            sx={{ 
              color: '#2E5735',
              fontWeight: 600,
              mt: 4,
              mb: 2,
              fontSize: { xs: '1.3rem', sm: '1.5rem' }
            }}
          >
            Données personnelles
          </Typography>
          <Typography 
            paragraph
            sx={{ 
              fontSize: { xs: '0.95rem', sm: '1rem' },
              lineHeight: 1.6
            }}
          >
            Pour connaître la manière dont nous traitons vos données, merci de consulter notre Politique de confidentialité. Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données.
          </Typography>
          
          <Typography 
            variant="h5" 
            sx={{ 
              color: '#2E5735',
              fontWeight: 600,
              mt: 4,
              mb: 2,
              fontSize: { xs: '1.3rem', sm: '1.5rem' }
            }}
          >
            Liens hypertextes
          </Typography>
          <Typography 
            paragraph
            sx={{ 
              fontSize: { xs: '0.95rem', sm: '1rem' },
              lineHeight: 1.6
            }}
          >
            Le site peut contenir des liens vers d'autres sites dont ODIA Stratégie n'a aucun contrôle. Nous déclinons toute responsabilité quant au contenu ou aux pratiques de ces sites tiers.
          </Typography>
          
          <Typography 
            variant="h5" 
            sx={{ 
              color: '#2E5735',
              fontWeight: 600,
              mt: 4,
              mb: 2,
              fontSize: { xs: '1.3rem', sm: '1.5rem' }
            }}
          >
            Modification des mentions légales
          </Typography>
          <Typography 
            paragraph
            sx={{ 
              fontSize: { xs: '0.95rem', sm: '1rem' },
              lineHeight: 1.6
            }}
          >
            ODIA Stratégie se réserve le droit de modifier à tout moment les présentes mentions légales. Il appartient à l'utilisateur de s'y référer régulièrement.
          </Typography>
          
          <Typography 
            variant="h5" 
            sx={{ 
              color: '#2E5735',
              fontWeight: 600,
              mt: 4,
              mb: 2,
              fontSize: { xs: '1.3rem', sm: '1.5rem' }
            }}
          >
            Droit applicable
          </Typography>
          <Typography 
            paragraph
            sx={{ 
              fontSize: { xs: '0.95rem', sm: '1rem' },
              lineHeight: 1.6,
              mb: 0
            }}
          >
            Les présentes mentions légales sont régies par la loi française. Tout litige résultant de leur interprétation ou de leur exécution relève de la compétence des tribunaux français.
          </Typography>
        </Paper>
        
        {/* Bouton de retour */}
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

export default MentionsLegales;