import { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, /*LinearProgress,*/ Badge, Button } from '@mui/material';
import {
  Person as ProfileIcon,
  Description as DocumentsIcon,
  Assignment as FormIcon,
  Phone as PhoneIcon,
  Business as StrategyIcon,
  Assessment as SimulationIcon,
  Videocam as VideocamIcon,
  Chat as ChatIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from '../../config/axios';
import { API_ROUTES } from '../../config/api';

const DashboardHome = () => {
  const navigate = useNavigate();
  const [unreadUserMessages, setUnreadUserMessages] = useState(0);

  const dashboardItems = [
    {
      title: 'Profil',
      icon: <ProfileIcon sx={{ fontSize: 40, color: '#2E5735' }} />,
      description: 'Complétez vos informations personnelles',
      progress: 60,
      path: '/dashboard/profile'
    },
    {
      title: 'Documents',
      icon: <DocumentsIcon sx={{ fontSize: 40, color: '#2E5735' }} />,
      description: 'Gérez vos documents importants',
      progress: 30,
      path: '/dashboard/documents'
    },
    {
      title: 'Formulaire',
      icon: <FormIcon sx={{ fontSize: 40, color: '#2E5735' }} />,
      description: 'Remplissez votre formulaire de situation',
      progress: 0,
      path: '/dashboard/form'
    },
    {
      title: 'RDV Téléphonique',
      icon: <PhoneIcon sx={{ fontSize: 40, color: '#2E5735' }} />,
      description: 'Planifiez votre appel de suivi',
      progress: 0,
      path: '/dashboard/appointment/tel'
    },
    {
      title: 'RDV Stratégique',
      icon: <StrategyIcon sx={{ fontSize: 40, color: '#2E5735' }} />,
      description: 'Réservez votre rendez-vous stratégique',
      progress: 0,
      path: '/dashboard/appointment/strat'
    },
    {
      title: 'Simulation',
      icon: <SimulationIcon sx={{ fontSize: 40, color: '#2E5735' }} />,
      description: 'Consultez votre simulation personnalisée',
      progress: 80,
      path: '/dashboard/simulation'
    },
    {
      title: 'Visioconférence',
      icon: <VideocamIcon sx={{ fontSize: 40, color: '#2E5735' }} />,
      description: 'Rejoindre la visioconférence activée par votre conseiller',
      progress: 0,
      path: '/dashboard/visio'
    },
    {
      title: 'Messages',
      icon: <ChatIcon sx={{ fontSize: 40, color: '#2E5735' }} />,
      description: 'Discutez avec un conseiller ODIA',
      progress: 0,
      path: '/dashboard/messages',
      badgeContent: 0
    }
  ];

  useEffect(() => {
    const fetchUnreadUserMessages = async () => {
      try {
        const response = await axios.get<{ success: boolean, unreadCount: number }>(API_ROUTES.user.internalMessagesUnreadCount);
        if (response.data.success) {
          setUnreadUserMessages(response.data.unreadCount);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du nombre de messages internes user non lus:", error);
      }
    };

    fetchUnreadUserMessages();
  }, []);

  return (
    <Box sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 2, mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<HomeIcon />}
          onClick={() => navigate('/dashboard/accueil')}
          sx={{
            color: '#2E5735',
            borderColor: '#2E5735',
            '&:hover': {
              backgroundColor: 'rgba(46, 87, 53, 0.1)',
              borderColor: '#2E5735',
            },
            textTransform: 'none'
          }}
        >
          Voir l'accueil
        </Button>
        <Typography variant="h4" sx={{ color: '#2E5735', fontWeight: 600 }}>
          Tableau de Bord
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {dashboardItems.map((item) => {
          if (item.title === 'Messages') {
            item.badgeContent = unreadUserMessages;
          }
          return (
            <Grid item xs={12} sm={6} md={4} key={item.title}>
              <Paper
                elevation={2}
                sx={{
                  p: { xs: 2, sm: 3 },
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 2,
                  border: '1px solid rgba(46, 87, 53, 0.1)',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 6px 12px rgba(46, 87, 53, 0.15)',
                    cursor: 'pointer',
                    borderColor: '#2E5735'
                  }
                }}
                onClick={() => navigate(item.path)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                  <Badge 
                    badgeContent={item.title === 'Messages' ? unreadUserMessages : undefined} 
                    color="error" 
                    overlap="circular"
                  >
                    {item.icon}
                  </Badge>
                  <Typography variant="h6" sx={{ ml: 1.5, color: '#2E5735', fontWeight: 500 }}>
                    {item.title}
                  </Typography>
                </Box>

                <Typography variant="body2" sx={{ flexGrow: 1, color: 'text.secondary' }}>
                  {item.description}
                </Typography>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      <Box sx={{ mt: 5, p: 3, border: '1px solid rgba(46, 87, 53, 0.2)', borderRadius: 2, bgcolor: 'grey.50' }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#2E5735', fontWeight: 600 }}>
          Vos prochaines étapes :
        </Typography>
        <Typography component="div" variant="body1" sx={{ mb: 1 }}>
          1 - Complétez votre profil et modifiez votre mot de passe si nécessaire.
        </Typography>
         <Typography component="div" variant="body1" sx={{ mb: 1 }}>
          2 - Réservez un créneau pour un rendez-vous téléphonique (si ce n'est pas déjà fait).
        </Typography>
         <Typography component="div" variant="body1" sx={{ mb: 1 }}>
          3 - Remplissez le formulaire (étape importante pour la personnalisation).
        </Typography>
         <Typography component="div" variant="body1" sx={{ mb: 1 }}>
          4 - Réservez un créneau pour le rendez-vous stratégique.
        </Typography>
         <Typography component="div" variant="body1">
          5 - Explorez les onglets Éducation et Investissement dans votre espace.
        </Typography>
         <Typography component="div" variant="body1" sx={{ mt: 1}}>
          6 - Utilisez l'onglet <strong>Messages</strong> pour toute question à l'attention de votre conseiller ODIA.
        </Typography>
      </Box>
    </Box>
  );
};

export default DashboardHome; 