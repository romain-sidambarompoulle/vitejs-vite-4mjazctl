import React, { useState, useEffect, useRef, Fragment } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Slide,
  useScrollTrigger,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Avatar,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  FormControlLabel,
  FormControl,
  FormHelperText,
  CircularProgress,
  Alert,
  Link
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import axios, { fetchCsrfToken } from '../config/axios';
import { API_ROUTES } from '../config/api';
import odiaLogo from '../assets/odia.avif';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import { useGlobalModal } from '../contexts/GlobalModalContext';

// Helper component for logging inside JSX
const LogValue = ({ value, label }: { value: any, label: string }) => {
  console.log(`${label}:`, value);
  return null;
};

interface HideOnScrollProps {
  children: React.ReactElement;
}

interface NavbarProps {
  user: {
    nom: string;
    prenom: string;
  } | null;
}

interface ISignUpFormInput {
  nom: string;
  email: string;
  telephone: string;
  consentementRGPDNav: boolean;
}

function HideOnScroll(props: HideOnScrollProps) {
  const { children } = props;
  const trigger = useScrollTrigger();
  const location = useLocation();
  const isDashboard = location.pathname.includes('/dashboard');
  const isHomePage = location.pathname === "/";

  if (isDashboard) {
    return children;
  }

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Navbar = ({ user: propUser }: NavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isHomePage = location.pathname === "/";
  const isDashboard = location.pathname.includes('/dashboard');
  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [anchorUserEl, setAnchorUserEl] = useState<null | HTMLElement>(null);
  const [openDiscoverModal, setOpenDiscoverModalState] = useState(false);
  const [openSignUpModal, setOpenSignUpModalState] = useState(false);
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [signUpError, setSignUpError] = useState<string | null>(null);
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const { register: registerSignUp, handleSubmit: handleSubmitSignUp, formState: { errors: errorsSignUp }, reset: resetSignUpForm, setValue } = useForm<ISignUpFormInput>({
    defaultValues: {
      consentementRGPDNav: false
    }
  });
  const { openModal, closeModal, setAnyModalOpen } = useGlobalModal();
  const avatarButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const userFromStorage = storedUser ? JSON.parse(storedUser) : null;
    if (JSON.stringify(userFromStorage) !== JSON.stringify(currentUser)) {
        setCurrentUser(userFromStorage);
    }
  }, [location.pathname, propUser]);

  useEffect(() => {
    if (anchorUserEl) {
        handleUserMenuClose();
    }
  }, [isMobile, currentUser]);

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorUserEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorUserEl(null);
  };

  const handleAuthNavigation = (path: string) => {
    navigate(path);
    handleUserMenuClose();
  };

  const handleLogout = async () => {
    handleUserMenuClose();
    setLogoutLoading(true);
    console.log("Début déconnexion, ajout overlay.");
    const shield = document.createElement('div');
    shield.id = 'logout-shield';
    shield.style.cssText =
      'position:fixed;inset:0;z-index:2147483647;background:#ffffff;' +
      'display:flex;align-items:center;justify-content:center;' +
      'font:600 1.1rem Inter,sans-serif;color:#2E5735';
    shield.textContent = 'Déconnexion…';
    document.body.appendChild(shield);

    const token = await fetchCsrfToken();

    try {
      console.log("Tentative d'appel API /logout");
      await axios.post(
        API_ROUTES.auth.logout,
        { timestamp: Date.now() },
        { headers: { 'csrf-token': token } }
      );
      console.log("API /logout appelée avec succès (ou sans erreur bloquante).");
    } catch (error: unknown) {
      console.warn('Logout API en erreur (ignorée pour la redirection) :', error);
    } finally {
      console.log("Bloc finally de logout : nettoyage et redirection.");
      localStorage.removeItem('user');
      document.getElementById('logout-shield')?.remove();
      
      const loginUrl = `${window.location.origin}/#/login`;
      console.log("Redirection vers:", loginUrl);
      window.location.replace(loginUrl);
    }
  };

  const getInitials = (nom: string, prenom: string) => {
    return `${prenom?.[0] || ''}${nom?.[0] || ''}`.toUpperCase();
  };

  const handleHomeNavigation = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        if (userData.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Erreur lors de la redirection:', error);
        navigate('/');
      }
    } else {
      navigate('/');
    }
  };

  const handleOpenDiscoverModal = () => {
    if (openModal()) {
      setOpenDiscoverModalState(true);
    } else {
      console.log("Ouverture du modal Découvrir bloquée.");
    }
  };

  const handleCloseDiscoverModal = () => {
    closeModal();
    setOpenDiscoverModalState(false);
  };

  const handleOpenSignUpModal = (forceOpen: boolean = false) => {
    handleUserMenuClose();
    if (forceOpen || openModal()) {
       setSignUpSuccess(false);
       setSignUpError(null);
       resetSignUpForm();
       setOpenSignUpModalState(true);
    } else {
      console.log("Ouverture du modal Inscription bloquée (appel normal).");
    }
  };

  const handleCloseSignUpModal = () => {
    closeModal();
    setOpenSignUpModalState(false);
    if (!signUpSuccess) {
        resetSignUpForm();
        setSignUpError(null);
        setSignUpLoading(false);
    }
  };

  const switchToSignUpModal = () => {
    handleCloseDiscoverModal();
    setTimeout(() => {
        setSignUpSuccess(false);
        setSignUpError(null);
        resetSignUpForm();
        setAnyModalOpen(true);
        setOpenSignUpModalState(true);
    }, 0);
  };

  const onSubmitSignUp: SubmitHandler<ISignUpFormInput> = async (data) => {
    setSignUpLoading(true);
    setSignUpError(null);
    setSignUpSuccess(false);

    try {
      const emailLowerCase = data.email.toLowerCase();
      const response = await axios.post(API_ROUTES.submit_form, {
        nom: data.nom,
        email: emailLowerCase,
        telephone: data.telephone,
        consentementRGPDHome: data.consentementRGPDNav,
        autoLogin: true,
        prenom: data.nom
      });

      if (response.data.success) {
        setSignUpSuccess(true);
        if (response.data.credentials) {
          // Assuming response.data.credentials is an object with email, nom, prenom, and role
          const newUser = {
            email: data.email,
            nom: data.nom,
            prenom: data.nom,
            role: response.data.credentials?.role || "visitor"
          };
          localStorage.setItem('user', JSON.stringify(newUser));
          setCurrentUser(newUser);
        }
        setTimeout(() => {
          handleCloseSignUpModal();
          window.location.href = window.location.origin + '/#/dashboard';
        }, 1500);

      } else {
        setSignUpError(response.data.message || "Une erreur est survenue lors de l'inscription.");
        setSignUpLoading(false);
      }
    } catch (error: any) {
      console.error("Erreur lors de l'inscription via Navbar:", error);
      
      if (error.response && error.response.status === 409) {
        setSignUpError("Cette adresse email est déjà utilisée.");
      } else {
        const message = error.response?.data?.message || "Une erreur serveur est survenue. Veuillez réessayer.";
        setSignUpError(message);
      }
      setSignUpLoading(false);
    }
  };

  return (
    <>
      <HideOnScroll>
        <AppBar 
          position="fixed" 
          sx={{ 
            backgroundColor: isHomePage ? 'transparent' : '#f1e1c6',
            zIndex: (theme) => theme.zIndex.drawer + 1,
            boxShadow: 'none',
            border: 'none',
            transition: 'background-color 0.3s ease'
          }}
        >
          <Container maxWidth="xl">
            <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box
                component="img"
                sx={{
                  height: 50,
                  cursor: 'pointer',
                  mr: { xs: 1, md: 2 }
                }}
                alt="ODIA Logo"
                src={odiaLogo}
                onClick={handleHomeNavigation}
              />

              <Button
                variant="text"
                sx={{
                  color: '#2E5735',
                  textTransform: 'none',
                  fontWeight: 500,
                  ml: { xs: 1, md: 2 },
                  fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                  p: { xs: '4px 8px', md: '6px 8px'}
                }}
                onClick={handleOpenDiscoverModal}
              >
                Découvrir ODIA
              </Button>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 }, ml: 'auto' }}>
                {!currentUser && (
                  <>
                    {!isMobile && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar 
                          sx={{ 
                            bgcolor: '#f1e1c6', 
                            pointerEvents: 'none',
                            width: 40,
                            height: 40
                          }}
                        >
                          <AccountCircle fontSize="large" sx={{ color: '#2E5735' }} />
                        </Avatar>
                        <Button 
                          color="inherit" 
                          onClick={() => handleAuthNavigation('/login')}
                          sx={{ 
                            backgroundColor: '#2E5735',
                            color: '#f1e1c6',
                            '&:hover': {
                              backgroundColor: '#8eb9a9'
                            }
                          }}
                        >
                          Se connecter
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={() => handleOpenSignUpModal()}
                          sx={{
                            color: '#2E5735',
                            borderColor: '#2E5735',
                            '&:hover': {
                              backgroundColor: 'rgba(46, 87, 53, 0.04)',
                              borderColor: '#2E5735',
                            },
                            ml: 1
                          }}
                        >
                          S'inscrire
                        </Button>
                      </Box>
                    )}
                    {isMobile && !currentUser && (
                      <Avatar
                        ref={avatarButtonRef}
                        sx={{ bgcolor: '#f1e1c6', cursor: 'pointer', width: 40, height: 40 }}
                        onClick={handleUserMenuOpen}
                        aria-controls={Boolean(anchorUserEl) ? 'user-menu-mobile' : undefined}
                        aria-haspopup="true"
                        aria-expanded={Boolean(anchorUserEl) ? 'true' : undefined}
                        aria-label="Ouvrir le menu utilisateur"
                      >
                        <AccountCircle fontSize="large" sx={{ color: '#2E5735' }} />
                      </Avatar>
                    )}
                  </>
                )}
                {currentUser && (
                  <>
                    {!isMobile && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ color: isDashboard ? '#2E5735' : 'black' }}>
                          Bienvenue, {currentUser.prenom} {currentUser.nom}
                        </Typography>
                        <Avatar
                          ref={avatarButtonRef}
                          onClick={handleUserMenuOpen}
                          aria-controls={Boolean(anchorUserEl) ? 'user-menu-mobile' : undefined}
                          aria-haspopup="true"
                          aria-expanded={Boolean(anchorUserEl) ? 'true' : undefined}
                          sx={{ bgcolor: '#2E5735', cursor: 'pointer', width: 40, height: 40 }}
                          aria-label="Ouvrir le menu utilisateur"
                        >
                          {getInitials(currentUser.nom, currentUser.prenom)}
                        </Avatar>
                        <Button 
                          color="inherit" 
                          onClick={handleLogout} 
                          disabled={logoutLoading}
                          startIcon={logoutLoading ? <CircularProgress size={18} sx={{ color: isDashboard ? '#2E5735' : 'black' }} /> : undefined}
                          sx={{ 
                            color: isDashboard ? '#2E5735' : 'black', 
                            border: isDashboard ? '1px solid #2E5735' : 'none', 
                            '&:hover': { 
                              backgroundColor: isDashboard ? 'rgba(46, 87, 53, 0.1)' : undefined
                            },
                            pl: logoutLoading ? 1.5 : 2, 
                            pr: 2
                          }}
                        >
                          Déconnexion
                        </Button>
                      </Box>
                    )}
                    {isMobile && (
                      <Avatar
                        ref={avatarButtonRef}
                        onClick={handleUserMenuOpen}
                        aria-controls={Boolean(anchorUserEl) ? 'user-menu-mobile' : undefined}
                        aria-haspopup="true"
                        aria-expanded={Boolean(anchorUserEl) ? 'true' : undefined}
                        sx={{ bgcolor: '#2E5735', border: isDashboard ? '2px solid #2E5735' : 'none', cursor: 'pointer', width: 40, height: 40 }}
                        aria-label="Ouvrir le menu utilisateur"
                      >
                        {getInitials(currentUser.nom, currentUser.prenom)}
                      </Avatar>
                    )}
                  </>
                )}
                
                <Menu
                  id="user-menu-mobile"
                  anchorEl={anchorUserEl}
                  open={Boolean(anchorUserEl)}
                  onClose={handleUserMenuClose}
                  MenuListProps={{
                    'aria-labelledby': 'avatar-button',
                  }}
                  sx={{ mt: 1 }}
                >
                  {currentUser ? (
                    <Fragment>
                      <MenuItem onClick={() => handleAuthNavigation('/dashboard/profile')}>Mon Profil</MenuItem>
                      <MenuItem onClick={handleLogout} disabled={logoutLoading}>
                         {logoutLoading && <CircularProgress size={16} sx={{ mr: 1 }} />} 
                         Déconnexion
                      </MenuItem>
                    </Fragment>
                  ) : (
                    <Fragment>
                      <MenuItem key="login" onClick={() => handleAuthNavigation('/login')}>
                        Se connecter
                      </MenuItem>
                      <MenuItem key="signup" onClick={() => handleOpenSignUpModal()}>
                        S'inscrire
                      </MenuItem>
                    </Fragment>
                  )}
                </Menu>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </HideOnScroll>

      <Dialog
        open={openDiscoverModal}
        onClose={handleCloseDiscoverModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2
          }
        }}
      >
        <DialogTitle sx={{ backgroundColor: '#2E5735', color: 'white', textAlign: 'center', py: 2 }}>
          Découvrir ODIA
        </DialogTitle>
        <DialogContent sx={{ mt: 2, p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#2E5735', fontWeight: 'bold' }}>
            ODIA, votre allié pour simplifier la gestion et booster vos économies :
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Accompagnement complet :</strong> ODIA prend en main vos démarches administratives et libère du temps pour ce qui compte vraiment : vos patients et l'évolution de votre carrière.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Optimisation financière :</strong> Transformez vos économies annuelles réalisées en revenu complémentaire grâce aux simulateurs et conseils personnalisés.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Conformité garantie :</strong> Restez toujours à jour vis-à-vis des réglementations, pour une gestion sereine de votre activité.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Ressources utiles :</strong> Profitez de guides pratiques, d'outils d'investissement et d'un tableau de bord centralisé.
          </Typography>
          <Typography variant="body1" sx={{ mt: 3 }}>
            Envie d'en savoir plus ? Découvrez la stratégie ODIA et franchissez une étape supplémentaire vers une carrière libérale plus rentable et plus sereine.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, backgroundColor: 'background.paper', justifyContent: 'flex-end' }}>
          <Button
            onClick={handleCloseDiscoverModal}
            variant="outlined"
            sx={{
              color: '#2E5735',
              borderColor: '#2E5735',
              '&:hover': {
                borderColor: '#303f9f',
                backgroundColor: 'rgba(63, 81, 181, 0.05)'
              },
              px: 3
            }}
          >
            Fermer
          </Button>
          <Button
            onClick={switchToSignUpModal}
            variant="contained"
            sx={{
              ml: 2,
              backgroundColor: '#2E5735',
              color: '#f1e1c6',
              '&:hover': {
                backgroundColor: '#1f4230'
              }
            }}
          >
            S'inscrire
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openSignUpModal}
        onClose={handleCloseSignUpModal}
        aria-labelledby="signup-dialog-title"
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            backgroundColor: 'rgba(255,255,255,0.95)'
          }
        }}
      >
        <DialogTitle id="signup-dialog-title" sx={{
          backgroundColor: '#2E5735',
          color: 'white',
          textAlign: 'center',
          py: 2
        }}>
          Inscription Visiteur Rapide
        </DialogTitle>
        <DialogContent sx={{ mt: 2, p: 4 }}>
          {signUpSuccess && <Alert severity="success" sx={{ mb: 2 }}>✅ Inscription réussie ! Vous allez être redirigé.</Alert>}
          {signUpError && <Alert severity="error" sx={{ mb: 2 }}>{signUpError}</Alert>}

          {!signUpSuccess && (
            <form onSubmit={handleSubmitSignUp(onSubmitSignUp)}>
              <TextField
                fullWidth
                label="Nom complet"
                {...registerSignUp("nom", { 
                  required: "Le nom est requis",
                  pattern: {
                    value: /^\S+$/,
                    message: "Le nom ne doit pas contenir d'espace" 
                  }
                })}
                onChange={(e) => {
                  const value = e.target.value.replace(/\s+/g, "");
                  setValue("nom", value, { shouldValidate: true });
                }}
                inputProps={{ 
                  pattern: "\\S+"
                }}
                error={!!errorsSignUp.nom}
                helperText={errorsSignUp.nom?.message}
                sx={{ mb: 2 }}
                disabled={signUpLoading}
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                {...registerSignUp("email", {
                  required: "L'email est requis",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Adresse email invalide"
                  }
                 })}
                onChange={(e) => {
                  const lowerCaseEmail = e.target.value.toLowerCase();
                  setValue('email', lowerCaseEmail, { shouldValidate: true });
                }}
                error={!!errorsSignUp.email}
                helperText={errorsSignUp.email?.message}
                sx={{ mb: 2 }}
                disabled={signUpLoading}
              />
              <TextField
                fullWidth
                label="Téléphone"
                {...registerSignUp("telephone", { required: "Le téléphone est requis" })}
                error={!!errorsSignUp.telephone}
                helperText={errorsSignUp.telephone?.message}
                sx={{ mb: 2 }}
                disabled={signUpLoading}
              />

              <FormControl sx={{ mb: 2 }} required error={!!errorsSignUp.consentementRGPDNav}>
                <FormControlLabel
                  control={
                    <Checkbox
                      {...registerSignUp('consentementRGPDNav', { required: "Vous devez accepter la politique de confidentialité" })}
                      color="primary"
                      disabled={signUpLoading}
                    />
                  }
                  label={
                    <Typography variant="body2">
                      J'accepte la <Link component={RouterLink} to="/privacy-policy" target="_blank" sx={{ color: '#2E5735' }}>Politique de confidentialité</Link>
                    </Typography>
                  }
                />
                {errorsSignUp.consentementRGPDNav && (
                  <FormHelperText error>
                    {errorsSignUp.consentementRGPDNav.message}
                  </FormHelperText>
                )}
              </FormControl>

              <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={signUpLoading}
                sx={{
                  backgroundColor: '#2E5735',
                  '&:hover': {
                    backgroundColor: '#303f9f'
                  },
                  mt: 2
                }}
              >
                {signUpLoading ? <CircularProgress size={24} color="inherit" /> : "Créer mon compte visiteur"}
              </Button>
            </form>
           )}
        </DialogContent>
        {!signUpSuccess && (
            <DialogActions sx={{ p: 3, backgroundColor: 'background.paper' }}>
              <Button
                onClick={handleCloseSignUpModal}
                variant="outlined"
                disabled={signUpLoading}
                sx={{
                  color: '#2E5735',
                  borderColor: '#2E5735',
                  '&:hover': {
                    borderColor: '#303f9f',
                    backgroundColor: 'rgba(63, 81, 181, 0.05)'
                  },
                  px: 3
                }}
              >
                Fermer
              </Button>
            </DialogActions>
        )}
      </Dialog>
    </>
  );
}

export default Navbar;
