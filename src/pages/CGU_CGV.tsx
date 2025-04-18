import React from 'react';
import { Container, Typography, Box, Paper, useTheme, useMediaQuery, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function CGU_CGV() {
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
            Conditions Générales d'Utilisation et de Vente
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
            1. Objet
          </Typography>
          <Typography 
            paragraph
            sx={{ 
              fontSize: { xs: '0.95rem', sm: '1rem' },
              lineHeight: 1.6
            }}
          >
            Les présentes Conditions Générales d'Utilisation et de Vente (ci-après « CGU/CGV ») ont pour objet de définir les modalités d'accès et d'utilisation du site, ainsi que les conditions applicables à nos services administratifs et/ou prestations décrites sur le site.
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
            2. Acceptation
          </Typography>
          <Typography 
            paragraph
            sx={{ 
              fontSize: { xs: '0.95rem', sm: '1rem' },
              lineHeight: 1.6
            }}
          >
            En accédant à notre site et en utilisant nos services, vous acceptez sans réserve les présentes CGU/CGV. Si vous n'êtes pas d'accord avec l'un de ses termes, vous êtes libre de ne pas utiliser le site ni nos services.
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
            3. Confidentialité et Non-Divulgation
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#2E5735',
              fontWeight: 500,
              mt: 2,
              mb: 1,
              fontSize: { xs: '1.1rem', sm: '1.2rem' }
            }}
          >
            3.1 Obligation de confidentialité
          </Typography>
          <Typography 
            paragraph
            sx={{ 
              fontSize: { xs: '0.95rem', sm: '1rem' },
              lineHeight: 1.6
            }}
          >
            Tout document, information, méthode ou stratégie communiqué par notre Société est strictement confidentiel. L'Utilisateur s'engage à ne pas divulguer ces informations à des tiers sans autorisation écrite préalable.
          </Typography>
          
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#2E5735',
              fontWeight: 500,
              mt: 2,
              mb: 1,
              fontSize: { xs: '1.1rem', sm: '1.2rem' }
            }}
          >
            3.2 Durée de l'obligation
          </Typography>
          <Typography 
            paragraph
            sx={{ 
              fontSize: { xs: '0.95rem', sm: '1rem' },
              lineHeight: 1.6
            }}
          >
            L'obligation de confidentialité perdure pendant la réalisation des prestations et pour une durée de cinq (5) ans après leur cessation, ou toute durée légale supérieure.
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
            4. Non-Dénigrement
          </Typography>
          <Typography 
            paragraph
            sx={{ 
              fontSize: { xs: '0.95rem', sm: '1rem' },
              lineHeight: 1.6
            }}
          >
            L'Utilisateur s'engage à ne pas tenir de propos dénigrants ou diffamatoires à l'égard de la Société, de ses dirigeants, salariés ou partenaires. En cas de litige, l'Utilisateur privilégiera une résolution amiable et confidentielle.
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
            5. Clause de Non-Responsabilité
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#2E5735',
              fontWeight: 500,
              mt: 2,
              mb: 1,
              fontSize: { xs: '1.1rem', sm: '1.2rem' }
            }}
          >
            5.1 Absence de conseil juridique ou fiscal
          </Typography>
          <Typography 
            paragraph
            sx={{ 
              fontSize: { xs: '0.95rem', sm: '1rem' },
              lineHeight: 1.6
            }}
          >
            Notre Société n'est ni un cabinet d'avocats, ni un cabinet d'expertise comptable. Les informations et outils proposés ont un but purement informatif et ne sauraient se substituer à l'avis d'un professionnel habilité (avocat, expert-comptable, etc.). L'Utilisateur demeure seul responsable de toute décision prise sur la base de ces informations.
          </Typography>
          
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#2E5735',
              fontWeight: 500,
              mt: 2,
              mb: 1,
              fontSize: { xs: '1.1rem', sm: '1.2rem' }
            }}
          >
            5.2 Limitation de responsabilité
          </Typography>
          <Typography 
            paragraph
            sx={{ 
              fontSize: { xs: '0.95rem', sm: '1rem' },
              lineHeight: 1.6
            }}
          >
            Nous ne pourrons être tenus pour responsables de toute conséquence découlant de l'utilisation de nos services ou informations (pertes financières, pénalités, redressements, etc.). Les estimations ou simulateurs fournis n'ont qu'une valeur indicative et ne constituent pas une garantie de résultat.
          </Typography>
          
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#2E5735',
              fontWeight: 500,
              mt: 2,
              mb: 1,
              fontSize: { xs: '1.1rem', sm: '1.2rem' }
            }}
          >
            5.3 Force majeure
          </Typography>
          <Typography 
            paragraph
            sx={{ 
              fontSize: { xs: '0.95rem', sm: '1rem' },
              lineHeight: 1.6
            }}
          >
            La Société ne saurait être tenue responsable de tout retard ou inexécution résultant d'un cas de force majeure ou d'événements indépendants de sa volonté (grève, panne, indisponibilité des services administratifs en ligne, etc.).
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
            6. Sanctions et Résiliation
          </Typography>
          <Typography 
            paragraph
            sx={{ 
              fontSize: { xs: '0.95rem', sm: '1rem' },
              lineHeight: 1.6
            }}
          >
            En cas de non-respect des présentes CGU/CGV (notamment confidentialité ou non-dénigrement), la Société se réserve le droit de résilier de plein droit toute prestation en cours, sans indemnité, et d'entreprendre toute action nécessaire à la réparation du préjudice subi.
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
            7. Propriété Intellectuelle
          </Typography>
          <Typography 
            paragraph
            sx={{ 
              fontSize: { xs: '0.95rem', sm: '1rem' },
              lineHeight: 1.6
            }}
          >
            Sauf mention contraire, tous les contenus, marques, logos et éléments présents sur le site sont la propriété exclusive de la Société ou de ses partenaires. Toute reproduction ou utilisation non autorisée est formellement interdite.
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
            8. Loi Applicable et Juridiction
          </Typography>
          <Typography 
            paragraph
            sx={{ 
              fontSize: { xs: '0.95rem', sm: '1rem' },
              lineHeight: 1.6
            }}
          >
            Les présentes CGU/CGV sont soumises au droit français. En cas de litige et à défaut de résolution amiable, les tribunaux compétents seront ceux du ressort du siège social de la Société.
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
            9. Contact
          </Typography>
          <Typography 
            paragraph
            sx={{ 
              fontSize: { xs: '0.95rem', sm: '1rem' },
              lineHeight: 1.6,
              mb: 0
            }}
          >
            Pour toute question concernant nos CGU/CGV, à la confidentialité ou à un éventuel litige, vous pouvez nous contacter à l'adresse suivante : contact@odia-strategie.com
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

export default CGU_CGV;