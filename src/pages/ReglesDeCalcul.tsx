import { Container, Typography, Box, Paper, Button } from "@mui/material";
import axios from '../config/axios';
import { API_ROUTES } from '../config/api';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function ReglesDeCalcul() {
  const navigate = useNavigate();

  return (
    <Box sx={{ 
      backgroundColor: '#f1e1c6',
      minHeight: '100vh',
      pt: 12,
      pb: 6
    }}>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ 
          p: 4, 
          backgroundColor: 'rgba(255,255,255,0.8)',
          borderRadius: 2
        }}>
          <Typography 
            variant="h4" 
            gutterBottom 
            align="center"
            sx={{
              color: '#2E5735',
              fontWeight: 600,
              mb: 4
            }}
          >
            Règles de Calcul des Simulations
          </Typography>

          <Typography variant="body1" paragraph sx={{ mb: 3 }}>
            Afin d'offrir une comparaison pertinente et réaliste entre les différents statuts professionnels, 
            nos simulations utilisent une même base de calcul pour chaque scénario. Cela signifie que les charges 
            et dépenses prises en compte dans une simulation en BNC (Bénéfices Non Commerciaux) sont strictement 
            identiques à celles d'une simulation avec notre stratégie optimisée.
          </Typography>

          <Typography 
            variant="h5" 
            gutterBottom
            sx={{
              color: '#2E5735',
              fontWeight: 600,
              mt: 4,
              mb: 2
            }}
          >
            Principes de Calcul
          </Typography>
          
          <Typography variant="body1" paragraph>
            Dans nos deux simulations, nous utilisons les mêmes montants pour :
          </Typography>
          
          <Box sx={{ 
            backgroundColor: 'rgba(46, 87, 53, 0.05)',
            p: 3,
            borderRadius: 1,
            mb: 3
          }}>
            <ul style={{ marginBottom: 0 }}>
              <li>Budget personnel : alimentaire, logement, crédits, assurances (habitation, voiture, santé, etc.).</li>
              <li>Frais professionnels : matériel professionnel, consommables, cotisation foncière des entreprises (CFE), formations, responsabilité civile professionnelle.</li>
              <li>Coûts administratifs : frais de comptabilité, frais de mutuelle, charges sociales.</li>
            </ul>
          </Box>

          <Typography variant="body1" paragraph>
            L'objectif est de garantir que seule la structure juridique et fiscale varie afin que le client puisse voir, 
            à niveau de vie égal, l'impact réel de notre stratégie d'optimisation.
          </Typography>

          <Typography 
            variant="h5" 
            gutterBottom
            sx={{
              color: '#2E5735',
              fontWeight: 600,
              mt: 4,
              mb: 2
            }}
          >
            Calcul des Cotisations Sociales
          </Typography>
          
          <Box sx={{ 
            backgroundColor: 'rgba(46, 87, 53, 0.05)',
            p: 3,
            borderRadius: 1,
            mb: 3
          }}>
            <Typography variant="body1" paragraph>
              Pour assurer la précision de nos calculs, nous utilisons une API connectée directement aux serveurs de l'URSSAF. 
              Cette connexion nous permet de récupérer en temps réel les barèmes et taux en vigueur, garantissant ainsi 
              l'exactitude des cotisations sociales calculées dans nos simulations.
            </Typography>
            <Typography variant="body1">
              Ainsi, toute mise à jour effectuée par l'URSSAF est automatiquement prise en compte, évitant tout risque d'erreur 
              et assurant des simulations parfaitement conformes à la réglementation en vigueur.
            </Typography>
          </Box>

          <Typography 
            variant="h5" 
            gutterBottom
            sx={{
              color: '#2E5735',
              fontWeight: 600,
              mt: 4,
              mb: 2
            }}
          >
            Pourquoi cette approche ?
          </Typography>
          
          <Box sx={{ 
            backgroundColor: 'rgba(46, 87, 53, 0.05)',
            p: 3,
            borderRadius: 1
          }}>
            <Typography variant="body1" paragraph>
              Notre méthodologie permet à nos clients de mesurer la performance de notre stratégie d'optimisation en conservant 
              un niveau de vie constant. Cela leur offre une vision claire et objective des gains réalisables en changeant de statut professionnel.
            </Typography>
            <Typography variant="body1">
              Nous mettons tout en œuvre pour garantir une transparence totale et une prise de décision informée, en s'appuyant 
              sur des calculs fiables et mis à jour en temps réel.
            </Typography>
          </Box>
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
            Retour a la page d'accueil
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default ReglesDeCalcul;
