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
  const [loading, setLoading] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    // Récupérer les identifiants depuis l'état de navigation
    if (location.state?.email && location.state?.password) {
      // Pré-remplir les champs du formulaire
      setFormData({
        email: location.state.email,
        password: location.state.password
      });
      
      // Optionnel : nettoyer l'état après utilisation
      navigate(location.pathname, { replace: true });
    }
    
    // Alternative : récupérer depuis localStorage si l'état n'est pas disponible
    else {
      const tempCredentials = localStorage.getItem('tempCredentials');
      if (tempCredentials) {
        const { email, password } = JSON.parse(tempCredentials);
        setFormData({
          email: email,
          password: password
        });
        localStorage.removeItem('tempCredentials'); // Nettoyage après utilisation
      }
    }
  }, [location]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Convertir automatiquement l'email en minuscules pour éviter les erreurs de casse
    if (e.target.name === 'email') {
      setFormData({ ...formData, [e.target.name]: e.target.value.toLowerCase() });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log("Tentative de connexion pour:", formData.email);
      
      const response = await axios.post(API_ROUTES.auth.login, formData);

      console.log("Réponse de connexion:", response.data);

      if (response.data.success && response.data.user) {
        // Stockage complet des informations
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Log pour vérifier (ne contient pas le mot de passe)
        console.log("Utilisateur stocké:", response.data.user);
        
        // Mise à jour du contexte
        setUser(response.data.user);
        
        // Navigation plus simple
        if (response.data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError('Réponse du serveur incorrecte');
      }
    } catch (err: any) {
      console.error("Erreur d'authentification");
      setError(err.response?.data?.message || 'Erreur lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 64px)', // ou la hauteur de ta barre de navigation
        width: '90%',
        maxWidth: '400px',
        mx: 'auto',
        p: 2
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
          disabled={loading}
          sx={{
            backgroundColor: '#2E5735',
            '&:hover': { backgroundColor: '#303f9f' }
          }}
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </Button>
      </form>
      
      {/* Bouton de retour */}
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
              backgroundColor: 'rgba(63, 81, 181, 0.1)',
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
          Retour à l'accueil
        </Button>
      </Box>
    </Box>
  );
}

export default Login;
