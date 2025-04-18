import { useState } from 'react';
import { 
  Box, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Typography,
  IconButton,
  Drawer,
  useTheme,
  useMediaQuery,
  Fab,
  Collapse
} from '@mui/material';
import {
  Person as ProfileIcon,
  Description as DocumentsIcon,
  Assignment as FormIcon,
  Phone as PhoneIcon,
  Business as StrategyIcon,
  Assessment as SimulationIcon,
  Dashboard as DashboardIcon,
  School as EducationIcon,
  Home as HomeIcon,
  Videocam as VideocamIcon,
  AccountBalance as ComptabiliteIcon,
  TrendingUp as InvestissementIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../../config/axios';
import { API_ROUTES } from '../../config/api';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(false);
  const [openDashboard, setOpenDashboard] = useState(false);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleDashboardClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const isExpandIcon = (event.target as HTMLElement).closest('.expand-icon');
    if (isExpandIcon) {
      setOpenDashboard(!openDashboard);
    } else {
      navigate('/dashboard');
      if (isMobile) handleDrawerToggle();
    }
  };

  const mainMenuItems = [
    { text: 'Éducation', icon: <EducationIcon />, path: '/dashboard/education' },
    { text: 'Comptabilité', icon: <ComptabiliteIcon />, path: '/dashboard/compta-fictive' },
    { text: 'Investissement', icon: <InvestissementIcon />, path: '/dashboard/investissement' },
  ];

  const subMenuItems = [
    { text: 'Profil', icon: <ProfileIcon />, path: '/dashboard/profile' },
    { text: 'Mes documents', icon: <DocumentsIcon />, path: '/dashboard/documents' },
    { text: 'Mon formulaire', icon: <FormIcon />, path: '/dashboard/form' },
    { text: 'RDV téléphonique', icon: <PhoneIcon />, path: '/dashboard/appointment/tel' },
    { text: 'RDV stratégique', icon: <StrategyIcon />, path: '/dashboard/appointment/strat' },
    { text: 'Ma simulation', icon: <SimulationIcon />, path: '/dashboard/simulation' },
    { text: 'Visioconférence', icon: <VideocamIcon />, path: '/dashboard/visio' },
  ];

  const drawerContent = (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle}>
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Box>
      
      <List>
        {/* Bouton Accueil */}
        <ListItem
          onClick={() => {
            navigate('/dashboard/accueil');
            if (isMobile) handleDrawerToggle();
          }}
          sx={{
            mb: 2,
            borderRadius: 2,
            border: `2px solid ${location.pathname === '/dashboard/accueil' ? '#1E4625' : '#2E5735'}`,
            backgroundColor: location.pathname === '/dashboard/accueil' ? 'rgba(46, 87, 53, 0.1)' : 'rgba(255, 255, 255, 0.9)',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: '#2E5735',
              '& .MuiListItemIcon-root': { color: 'white' },
              '& .MuiListItemText-primary': { color: 'white' },
              '& .MuiSvgIcon-root': { color: 'white' }
            },
            cursor: 'pointer',
            mx: 1,
            width: 'calc(100% - 16px)'
          }}
        >
          <ListItemIcon sx={{ color: '#2E5735', minWidth: '40px' }}>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Accueil"
            sx={{
              '& .MuiListItemText-primary': {
                color: '#2E5735',
                fontWeight: location.pathname === '/dashboard/accueil' ? 600 : 500
              }
            }}
          />
        </ListItem>

        {/* Bouton Tableau de bord avec sous-menu */}
        <ListItem component="div"
          onClick={handleDashboardClick}
          sx={{
            mb: openDashboard ? 1 : 2,
            borderRadius: 2,
            border: `2px solid ${location.pathname === '/dashboard' && !location.pathname.includes('/accueil') ? '#1E4625' : '#2E5735'}`,
            backgroundColor: location.pathname === '/dashboard' && !location.pathname.includes('/accueil') ? 'rgba(46, 87, 53, 0.1)' : 'rgba(255, 255, 255, 0.9)',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: '#2E5735',
              '& .MuiListItemIcon-root': { color: 'white' },
              '& .MuiListItemText-primary': { color: 'white' },
              '& .MuiSvgIcon-root': { color: 'white' }
            },
            cursor: 'pointer',
            mx: 1,
            width: 'calc(100% - 16px)'
          }}
        >
          <ListItemIcon sx={{ color: '#2E5735', minWidth: '40px' }}>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Tableau de bord"
            sx={{
              '& .MuiListItemText-primary': {
                color: '#2E5735',
                fontWeight: location.pathname === '/dashboard' && !location.pathname.includes('/accueil') ? 600 : 500
              }
            }}
          />
          <Box className="expand-icon">
            {openDashboard ? (
              <ExpandLessIcon sx={{ color: '#2E5735' }} />
            ) : (
              <ExpandMoreIcon sx={{ color: '#2E5735' }} />
            )}
          </Box>
        </ListItem>

        {/* Sous-menu du tableau de bord */}
        <Collapse in={openDashboard} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {subMenuItems.map((item) => (
              <ListItem
                key={item.text}
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) handleDrawerToggle();
                }}
                sx={{
                  pl: 4,
                  mb: 1,
                  borderRadius: 2,
                  border: `2px solid ${location.pathname === item.path ? '#1E4625' : '#2E5735'}`,
                  backgroundColor: location.pathname === item.path ? 'rgba(46, 87, 53, 0.1)' : 'rgba(255, 255, 255, 0.9)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#2E5735',
                    '& .MuiListItemIcon-root': { color: 'white' },
                    '& .MuiListItemText-primary': { color: 'white' }
                  },
                  cursor: 'pointer',
                  mx: 1,
                  width: 'calc(100% - 16px)'
                }}
              >
                <ListItemIcon sx={{ color: '#2E5735', minWidth: '40px' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  sx={{
                    '& .MuiListItemText-primary': {
                      color: '#2E5735',
                      fontWeight: location.pathname === item.path ? 600 : 500
                    }
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Collapse>

        {/* Autres boutons du menu */}
        {mainMenuItems.map((item) => (
          <ListItem
            key={item.text}
            onClick={() => {
              navigate(item.path);
              if (isMobile) handleDrawerToggle();
            }}
            sx={{
              mb: 2,
              borderRadius: 2,
              border: `2px solid ${location.pathname === item.path ? '#1E4625' : '#2E5735'}`,
              backgroundColor: location.pathname === item.path ? 'rgba(46, 87, 53, 0.1)' : 'rgba(255, 255, 255, 0.9)',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: '#2E5735',
                '& .MuiListItemIcon-root': { color: 'white' },
                '& .MuiListItemText-primary': { color: 'white' }
              },
              cursor: 'pointer',
              mx: 1,
              width: 'calc(100% - 16px)'
            }}
          >
            <ListItemIcon sx={{ color: '#2E5735', minWidth: '40px' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text}
              sx={{
                '& .MuiListItemText-primary': {
                  color: '#2E5735',
                  fontWeight: location.pathname === item.path ? 600 : 500
                }
              }}
            />
          </ListItem>
        ))}
      </List>
    </>
  );

  return (
    <>
      {/* Version Desktop - Drawer permanent */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: 240,
            flexShrink: 0,
            zIndex: 1,
            '& .MuiDrawer-paper': {
              width: 240,
              backgroundColor: '#f1e1c6',
              boxSizing: 'border-box',
              borderRight: '1px solid rgba(46, 87, 53, 0.2)',
              top: 64,
              height: 'auto',
              bottom: 0,
              overflow: 'auto'
            }
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Version Mobile - Drawer temporaire */}
      {isMobile && (
        <>
          <Drawer
            variant="temporary"
            anchor="left"
            open={open}
            onClose={handleDrawerToggle}
            sx={{
              zIndex: 1,
              '& .MuiDrawer-paper': {
                width: 240,
                backgroundColor: '#f1e1c6',
                boxSizing: 'border-box',
                borderRight: '1px solid rgba(46, 87, 53, 0.2)',
                top: 64
              }
            }}
          >
            {drawerContent}
          </Drawer>

          <Fab
            color="primary"
            aria-label="menu"
            onClick={handleDrawerToggle}
            sx={{
              position: 'fixed',
              bottom: 16,
              left: 16,
              backgroundColor: '#f1e1c6',
              zIndex: 10000,
              '&:hover': {
                backgroundColor: '#8DAF9C'
              },
              display: { xs: 'flex', md: 'none' }
            }}
          >
            <MenuIcon />
          </Fab>
        </>
      )}
    </>
  );
};

export default Sidebar;
