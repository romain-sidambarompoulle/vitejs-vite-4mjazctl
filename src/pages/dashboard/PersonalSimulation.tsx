import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from '../../config/axios';
import { API_ROUTES } from '../../config/api';

function PersonalSimulation() {
  const navigate = useNavigate();
  
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: '900px',
        margin: '0 auto',
        paddingX: { xs: 2, sm: 3, md: 4 }
      }}
    >
      <Typography
        variant="h4"
        sx={{
          mb: 4,
          color: '#2E5735',
          fontWeight: 600,
          textAlign: 'center',
          width: '100%'
        }}
      >
        Ma Simulation Personnalisée
      </Typography>
      <Box
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 2,
          backgroundColor: 'white',
          minHeight: '500px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2
        }}
      >
        <Typography variant="h5" sx={{ color: '#2E5735', fontWeight: 500 }}>
          Cette page est en cours de construction
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', textAlign: 'center', maxWidth: '600px' }}>
          Nous travaillons activement pour vous proposer ce service.
          Revenez bientôt pour découvrir votre simulation personnalisée !
        </Typography>
      </Box>
      
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
          onClick={() => navigate('/dashboard')}
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
          Retour au tableau de bord
        </Button>
      </Box>
    </Box>
  );
}
export default PersonalSimulation;