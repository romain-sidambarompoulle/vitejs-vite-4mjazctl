import { useState } from 'react';
import { TextField, Button, Box, Typography, Alert, CircularProgress, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from '../../config/axios';
import { API_ROUTES } from '../../config/api';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await axios.post(API_ROUTES.auth.forgotPassword, { email });

      if (response.data.success) {
        setSuccess(response.data.message || 'Un lien de réinitialisation a été envoyé à votre adresse email.');
        setEmail(''); // Optionnel: vider le champ après succès
      } else {
        // Gérer les erreurs métier spécifiques si le backend en renvoie
        throw new Error(response.data.message || 'Une erreur est survenue.');
      }
    } catch (err: any) {
      console.error('Erreur lors de la demande de réinitialisation:', err);
      setError(err.response?.data?.message || err.message || 'Erreur lors de l\'envoi de la demande.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 64px)', // Ajuster si nécessaire
        p: 3,
        maxWidth: '450px',
        mx: 'auto',
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ mb: 1 }}>
        Mot de passe oublié
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
        Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
      </Typography>

      {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ width: '100%', mb: 2 }}>{success}</Alert>}

      {!success && ( // N'afficher le formulaire que s'il n'y a pas de message de succès
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField
            fullWidth
            label="Adresse Email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value.toLowerCase())}
            required
            sx={{ mb: 3 }}
            disabled={loading}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              backgroundColor: '#2E5735',
              '&:hover': { backgroundColor: '#303f9f' },
              py: 1.5
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Envoyer le lien'}
          </Button>
        </form>
      )}

      {/* Lien pour retourner à la page de connexion */}
      <Box sx={{ mt: 3 }}>
        <Link 
            component="button" 
            variant="body2" 
            onClick={() => navigate('/login')}
            sx={{ cursor: 'pointer' }}
          >
           <ArrowBackIcon sx={{ verticalAlign: 'bottom', mr: 0.5, fontSize: '1rem' }} /> Retour à la connexion
        </Link>
      </Box>

    </Box>
  );
}

export default ForgotPassword;