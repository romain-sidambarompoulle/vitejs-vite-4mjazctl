import { useState } from 'react';
import { 
  Box, 
  List, 
  ListItem, 
  ListItemButton,
  ListItemIcon, 
  ListItemText, 
  IconButton,
  Drawer,
  useTheme,
  useMediaQuery,
  Fab,
  Collapse
} from '@mui/material';
import {
  People as UsersIcon,
  Assignment as FormulariosIcon,
  Description as DocumentsIcon,
  CalendarToday as AppointmentsIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  Dashboard as DashboardIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Logout as LogoutIcon,
  School as SchoolIcon,
  LibraryBooks as LibraryBooksIcon,
  Article as ArticleIcon,
  DesignServices as DesignServicesIcon
} from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../../config/axios';
import { API_ROUTES } from '../../config/api';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(false);
  const [openUsers, setOpenUsers] = useState(false);
  const [openEducation, setOpenEducation] = useState(false);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleUsersClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const isExpandIcon = (event.target as HTMLElement).closest('.expand-icon');
    if (isExpandIcon) {
      setOpenUsers(!openUsers);
    } else {
      navigate('/admin/users');
    }
  };

  const handleLogout = async () => {
    await axios.post(API_ROUTES.auth.logout, {});
    sessionStorage.removeItem('user');
    navigate('/login');
  };

  const handleEducationClick = () => {
    setOpenEducation(!openEducation);
  };

  const mainMenuItems = [
    { text: 'Tableau de bord', icon: <DashboardIcon />, path: '/admin' },
    { text: 'Formulaires', icon: <FormulariosIcon />, path: '/admin/forms' },
    { text: 'Documents', icon: <DocumentsIcon />, path: '/admin/documents' },
    { text: 'Rendez-vous', icon: <AppointmentsIcon />, path: '/admin/appointments' },
    { text: 'Statistiques', icon: <AnalyticsIcon />, path: '/admin/analytics' },
    { text: 'Paramètres', icon: <SettingsIcon />, path: '/admin/settings' },
  ];

  const userSubMenuItems = [
    { text: 'Tous les utilisateurs', icon: <UsersIcon />, path: '/admin/users' },
    { text: 'Ajouter un utilisateur', icon: <UsersIcon />, path: '/admin/users/add' },
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
        {/* Bouton Utilisateurs avec sous-menu */}
        <ListItem component="div"
          onClick={handleUsersClick}
          sx={{
            mb: openUsers ? 1 : 2,
            borderRadius: 2,
            border: '2px solid #3F51B5',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: '#3F51B5',
              '& .MuiListItemIcon-root': { color: 'white' },
              '& .MuiListItemText-primary': { color: 'white' },
              '& .MuiSvgIcon-root': { color: 'white' }
            },
            cursor: 'pointer',
            mx: 1,
            width: 'calc(100% - 16px)'
          }}
        >
          <ListItemIcon sx={{ color: '#3F51B5', minWidth: '40px' }}>
            <UsersIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Utilisateurs"
            sx={{
              '& .MuiListItemText-primary': {
                color: '#3F51B5',
                fontWeight: 500
              }
            }}
          />
          <Box className="expand-icon">
            {openUsers ? (
              <ExpandLessIcon sx={{ color: '#3F51B5' }} />
            ) : (
              <ExpandMoreIcon sx={{ color: '#3F51B5' }} />
            )}
          </Box>
        </ListItem>

        {/* Sous-menu utilisateurs */}
        <Collapse in={openUsers} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {userSubMenuItems.map((item) => (
              <ListItem
                key={item.text}
                onClick={() => navigate(item.path)}
                sx={{
                  pl: 4,
                  mb: 1,
                  borderRadius: 2,
                  border: '2px solid #3F51B5',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#3F51B5',
                    '& .MuiListItemIcon-root': { color: 'white' },
                    '& .MuiListItemText-primary': { color: 'white' }
                  },
                  cursor: 'pointer',
                  mx: 1,
                  width: 'calc(100% - 16px)'
                }}
              >
                <ListItemIcon sx={{ color: '#3F51B5', minWidth: '40px' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  sx={{
                    '& .MuiListItemText-primary': {
                      color: '#3F51B5',
                      fontWeight: 500
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
            onClick={() => navigate(item.path)}
            sx={{
              mb: 2,
              borderRadius: 2,
              border: '2px solid #3F51B5',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: '#3F51B5',
                '& .MuiListItemIcon-root': { color: 'white' },
                '& .MuiListItemText-primary': { color: 'white' }
              },
              cursor: 'pointer',
              mx: 1,
              width: 'calc(100% - 16px)'
            }}
          >
            <ListItemIcon sx={{ color: '#3F51B5', minWidth: '40px' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text}
              sx={{
                '& .MuiListItemText-primary': {
                  color: '#3F51B5',
                  fontWeight: 500
                }
              }}
            />
          </ListItem>
        ))}

        {/* Bouton de déconnexion */}
        <ListItem
          onClick={handleLogout}
          sx={{
            mb: 2,
            borderRadius: 2,
            border: '2px solid #d32f2f',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: '#d32f2f',
              '& .MuiListItemIcon-root': { color: 'white' },
              '& .MuiListItemText-primary': { color: 'white' }
            },
            cursor: 'pointer',
            mx: 1,
            width: 'calc(100% - 16px)'
          }}
        >
          <ListItemIcon sx={{ color: '#d32f2f', minWidth: '40px' }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Déconnexion"
            sx={{
              '& .MuiListItemText-primary': {
                color: '#d32f2f',
                fontWeight: 500
              }
            }}
          />
        </ListItem>

        {/* Bouton Éducation avec sous-menu */}
        <ListItem component="div" onClick={handleEducationClick}>
          <ListItemIcon>
            <SchoolIcon />
          </ListItemIcon>
          <ListItemText primary="Éducation" />
          {openEducation ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ListItem>
        
        <Collapse in={openEducation} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              component={Link} 
              to="/admin/education/sections"
              sx={{ pl: 4 }}
            >
              <ListItemIcon>
                <LibraryBooksIcon />
              </ListItemIcon>
              <ListItemText primary="Sections" />
            </ListItemButton>
            
            <ListItemButton
              component={Link} 
              to="/admin/education/contents"
              sx={{ pl: 4 }}
            >
              <ListItemIcon>
                <ArticleIcon />
              </ListItemIcon>
              <ListItemText primary="Contenus" />
            </ListItemButton>
          </List>
        </Collapse>
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
            '& .MuiDrawer-paper': {
              width: 240,
              backgroundColor: '#A4C3B2',
              boxSizing: 'border-box',
              borderRight: '1px solid rgba(63, 81, 181, 0.2)',
              top: 64
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
              '& .MuiDrawer-paper': {
                width: 240,
                backgroundColor: '#A4C3B2',
                boxSizing: 'border-box',
                borderRight: '1px solid rgba(63, 81, 181, 0.2)',
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
              backgroundColor: '#A4C3B2',
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

export default AdminSidebar;
