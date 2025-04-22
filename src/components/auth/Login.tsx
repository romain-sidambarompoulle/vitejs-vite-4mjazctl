import { useState, useContext, useEffect, useRef } from 'react';
import { TextField, Button, Box, Typography, Alert, Link } from '@mui/material';
import axios from '../../config/axios';
import { API_ROUTES } from '../../config/api';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (location.state?.email && location.state?.password) {
      setFormData({
        email: location.state.email,
        password: location.state.password
      });
    }
    
    else {
      const tempCredentials = localStorage.getItem('tempCredentials');
      if (tempCredentials) {
        const { email, password } = JSON.parse(tempCredentials);
        setFormData({
          email: email,
          password: password
        });
        localStorage.removeItem('tempCredentials');
      }
    }
  }, [location.state]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'email') {
      setFormData({ ...formData, [e.target.name]: e.target.value.toLowerCase() });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // === Overlay plein‑écran IMMÉDIAT pour masquer tout contenu ===
    console.log("Ajout de l'overlay de masquage immédiat.");
    const shield = document.createElement('div');
    shield.id = 'login-shield'; // Donner un ID pour pouvoir le retirer
    shield.style.cssText =
      'position:fixed;inset:0;z-index:2147483647;background:#ffffff;' + // z-index très élevé
      'display:flex;align-items:center;justify-content:center;' +
      'font:600 1.1rem Inter,sans-serif;color:#2E5735'; // Police et couleur
    shield.textContent = 'Connexion en cours…';
    document.body.appendChild(shield);
    // ==============================================================

    setError('');

    try {
      console.log("Tentative de connexion pour:", formData.email);
      
      const response = await axios.post(API_ROUTES.auth.login, formData);

      console.log("Réponse de connexion:", response.data);

      if (response.data.success && response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        console.log("Utilisateur stocké:", response.data.user);
        setUser(response.data.user);
        localStorage.setItem('loginInProgress', 'true');
        console.log("Flag 'loginInProgress' mis à true dans localStorage.");

        const targetUrl = 
          `${window.location.origin}/#/` +
          (response.data.user.role === 'admin' ? 'admin' : 'dashboard/accueil');
        
        console.log("Remplacement de l'URL par:", targetUrl);
        window.location.replace(targetUrl); 
        console.log("Rechargement de la page en cours...");
        window.location.reload(); 

      } else {
        setError(response.data.message || 'Réponse du serveur incorrecte');
        document.getElementById('login-shield')?.remove();
        console.log("Overlay retiré (erreur serveur contrôlée).");
      }
    } catch (err: any) {
      console.error("Erreur d'authentification", err);
      if (isMounted.current) {
        setError(err.response?.data?.message || err.message || 'Erreur lors de la connexion');
        document.getElementById('login-shield')?.remove();
        console.log("Overlay retiré (erreur catchée).");
      }
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 64px)',
        width: '90%',
        maxWidth: '400px',
        mx: 'auto',
        p: 2,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Connexion
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Mot de passe"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          sx={{ mb: 2 }}
        />

        <Box sx={{ textAlign: 'right', mb: 2 }}>
          <Link 
            component="button"
            variant="body2"
            onClick={() => navigate('/forgot-password')}
            sx={{ cursor: 'pointer' }} 
          >
            Mot de passe oublié ?
          </Link>
        </Box>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            backgroundColor: '#2E5735',
            '&:hover': { backgroundColor: '#1c3a21' }, 
            transition: 'background-color 0.3s', 
            py: 1.5 
          }}
        >
          Se connecter 
        </Button>
      </form>
      
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center',
        mt: { xs: 4, sm: 5 },
        mb: { xs: 2, sm: 3 }
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
              borderColor: '#1c3a21', 
            },
            py: 1,
            px: 3,
            textTransform: 'none',
            fontSize: '1rem',
            borderWidth: '2px',
            borderRadius: '4px',
            fontWeight: 500,
            transition: 'background-color 0.3s, border-color 0.3s' 
          }}
        >
          Retour à l'accueil
        </Button>
      </Box>
    </Box>
  );
}

export default Login;
