import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Slidebar from '../../components/Layout/Slidebar';
import axios from '../../config/axios';
import { API_ROUTES } from '../../config/api';

function DashboardVisitor() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      window.location.href = '/login';
      return;
    }
    setUserData(JSON.parse(storedUser));
  }, []);

  if (!userData) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', width: '100%', minHeight: '100%' }}>
      <Slidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 2,
          marginTop: '64px'
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default DashboardVisitor;
