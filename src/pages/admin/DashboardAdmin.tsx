import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/Layout/AdminNav';
import axios from '../../config/axios';
import { API_ROUTES } from '../../config/api';

function DashboardAdmin() {
  const [adminData, setAdminData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
          navigate('/login');
          return;
        }
        
        const userData = JSON.parse(storedUser);
        
        // Utiliser d'abord les données en session si le rôle est admin
        if (userData.role === 'admin') {
          setAdminData(userData);
          return;
        }
        
        // Sinon, vérifier avec le serveur
        const response = await axios.get(API_ROUTES.auth.user_data);
        if (response.data.success && response.data.user.role === 'admin') {
          setAdminData(userData);
        } else {
          navigate('/dashboard');
        }
      } catch (error) {
        console.error("Erreur d'authentification admin:", error);
        // Au lieu de rediriger automatiquement, essayez d'utiliser les données en session
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        if (userData.role === 'admin') {
          setAdminData(userData);
        } else {
          navigate('/login');
        }
      }
    };

    checkAdminAuth();
  }, [navigate]);

  if (!adminData) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AdminSidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: 8,
          ml: { xs: 0, md: '240px' },
          display: 'flex',
          justifyContent: 'flex-start',
          minHeight: 'calc(100vh - 64px)',
          width: { xs: '100%', md: `calc(100% - 240px)` },
          position: 'relative',
          left: { xs: 0, md: '-120px' },
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: '1200px',
            p: { xs: 2, sm: 3 },
            margin: '0 auto',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default DashboardAdmin;
