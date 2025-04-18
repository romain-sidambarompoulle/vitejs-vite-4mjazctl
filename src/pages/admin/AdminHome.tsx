import { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, LinearProgress, Button, Chip, Badge } from '@mui/material';
import {
  People as UsersIcon,
  Assignment as FormulariosIcon,
  Description as DocumentsIcon,
  CalendarToday as AppointmentsIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  Chat as ChatIcon,
  Lock as LockIcon,
  Videocam as VideocamIcon,
  MarkChatUnread as InternalMessagesIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from '../../config/axios';
import { API_ROUTES } from '../../config/api';

interface AdminStats {
  totalUsers: number;
  totalForms: number;
  totalDocuments: number;
  totalAppointments: number;
}

const AdminHome = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalForms: 0,
    totalDocuments: 0,
    totalAppointments: 0
  });
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unreadInternalMessages, setUnreadInternalMessages] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [loadingInternalMessages, setLoadingInternalMessages] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get< { success: boolean, stats: AdminStats }>(API_ROUTES.admin.stats);
        if (response.data.success) {
          setStats(response.data.stats);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des statistiques:", error);
      } finally {
        setLoadingStats(false);
      }
    };

    const fetchUnreadMessages = async () => {
        try {
            const response = await axios.get<{ success: boolean, unreadCount: number }>(API_ROUTES.admin.unreadMessagesCount);
            if (response.data.success) {
                setUnreadMessages(response.data.unreadCount);
            }
        } catch (error) {
            console.error("Erreur lors de la récupération du nombre de messages non lus:", error);
        } finally {
            setLoadingMessages(false);
        }
    };

    const fetchUnreadInternalMessages = async () => {
      try {
        const response = await axios.get<{ success: boolean, unreadCount: number }>(API_ROUTES.admin.internalMessagesUnreadCount);
        console.log('API Response (Internal Messages Unread Count):', response.data);
        if (response.data.success) {
          setUnreadInternalMessages(response.data.unreadCount);
          console.log('Setting unreadInternalMessages to:', response.data.unreadCount);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du nombre de messages internes non lus:", error);
      } finally {
        setLoadingInternalMessages(false);
      }
    };

    fetchStats();
    fetchUnreadMessages();
    fetchUnreadInternalMessages();
  }, []);

  const loading = loadingStats || loadingMessages || loadingInternalMessages;

  console.log('Rendering AdminHome, current unreadInternalMessages state:', unreadInternalMessages);

  const adminItems = [
    {
      title: 'Utilisateurs',
      icon: <UsersIcon sx={{ fontSize: 40, color: '#3F51B5' }} />,
      description: 'Gérer les profils des utilisateurs',
      count: stats.totalUsers,
      path: '/admin/users',
      badgeContent: 0
    },
    {
      title: 'Messages Internes',
      icon: <InternalMessagesIcon sx={{ fontSize: 40, color: '#3F51B5' }} />,
      description: 'Répondez aux messages des utilisateurs connectés',
      count: null,
      path: '/admin/messages-users',
      badgeContent: unreadInternalMessages
    },
    {
      title: 'Messages ChatWidget',
      icon: <ChatIcon sx={{ fontSize: 40, color: '#3F51B5' }} />,
      description: 'Consulter les messages du widget public',
      count: null,
      path: '/admin/chat-messages',
      badgeContent: unreadMessages
    },
    {
      title: 'Formulaires',
      icon: <FormulariosIcon sx={{ fontSize: 40, color: '#3F51B5' }} />,
      description: 'Consulter les formulaires soumis',
      count: stats.totalForms,
      path: '/admin/forms',
      badgeContent: 0
    },
    {
      title: 'Documents',
      icon: <DocumentsIcon sx={{ fontSize: 40, color: '#3F51B5' }} />,
      description: 'Accéder aux documents des utilisateurs',
      count: stats.totalDocuments,
      path: '/admin/documents',
      badgeContent: 0
    },
    {
      title: 'Rendez-vous',
      icon: <AppointmentsIcon sx={{ fontSize: 40, color: '#3F51B5' }} />,
      description: 'Gérer les rendez-vous planifiés',
      count: stats.totalAppointments,
      path: '/admin/appointments',
      badgeContent: 0
    },
    {
      title: 'Changer mon mot de passe',
      icon: <LockIcon sx={{ fontSize: 40, color: '#3F51B5' }} />,
      description: 'Modifier votre mot de passe administrateur',
      count: null,
      path: '/admin/change-admin-password',
      badgeContent: 0
    },
    {
      title: 'Visio avec utilisateur',
      icon: <VideocamIcon sx={{ fontSize: 40, color: '#3F51B5' }} />,
      description: 'Lancer une visio avec un utilisateur',
      count: null,
      path: '/admin/visio',
      badgeContent: 0
    },
  ];

  return (
    <Box sx={{ py: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, color: '#3F51B5', fontWeight: 600 }}>
        Administration
      </Typography>

      <Grid container spacing={3}>
        {adminItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.title}>
            <Paper
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                border: '1px solid rgba(63, 81, 181, 0.2)',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  cursor: 'pointer'
                }
              }}
              onClick={() => navigate(item.path)}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Badge badgeContent={item.badgeContent} color="error" overlap="circular">
                  {item.icon}
                </Badge>
                <Typography variant="h6" sx={{ ml: 2, color: '#3F51B5' }}>
                  {item.title}
                </Typography>
              </Box>

              <Typography variant="body2" sx={{ mb: 2, flexGrow: 1, color: 'text.secondary' }}>
                {item.description}
              </Typography>

              {item.count !== null && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Chip
                    label={loading ? "..." : item.count}
                    color="primary"
                    sx={{ fontWeight: 'bold' }}
                  />
                </Box>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AdminHome;
