import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import axios from '../../config/axios';
import { API_ROUTES } from '../../config/api';
import { useNavigate } from 'react-router-dom';

const ChangeAdminPassword = () => {
  const [ancienMotDePasse, setAncienMotDePasse] = useState('');
  const [nouveauMotDePasse, setNouveauMotDePasse] = useState('');
  const [confirmationMotDePasse, setConfirmationMotDePasse] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (nouveauMotDePasse !== confirmationMotDePasse) {
      setError('Le nouveau mot de passe et sa confirmation ne correspondent pas.');
      return;
    }

    if (nouveauMotDePasse.length < 6) { // Ajout d'une validation simple
        setError('Le nouveau mot de passe doit contenir au moins 6 caractères.');
        return;
    }

    setLoading(true);

    try {
      const response = await axios.put(
        API_ROUTES.admin.changePassword,
        {
          ancienMotDePasse,
          nouveauMotDePasse,
        }
      );

      if (response.data.success) {
        setSuccess('Mot de passe modifié avec succès. Vous allez être déconnecté.');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(response.data.message || 'Une erreur est survenue.');
      }
    } catch (err: any) {
      console.error('Erreur lors du changement de mot de passe:', err);
      setError(
        err.response?.data?.message ||
          'Une erreur est survenue lors de la tentative de changement de mot de passe.'
      );
    } finally {
      setLoading(false);
      if (!success) {
          setAncienMotDePasse('');
          setNouveauMotDePasse('');
          setConfirmationMotDePasse('');
      }
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: 400,
        mx: 'auto',
        p: 3,
        border: '1px solid #ccc',
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography variant="h5" component="h1" sx={{ mb: 3 }}>
        Changer mon mot de passe Administrateur
      </Typography>

      {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ width: '100%', mb: 2 }}>{success}</Alert>}

      <TextField
        label="Ancien mot de passe"
        type="password"
        variant="outlined"
        fullWidth
        margin="normal"
        required
        value={ancienMotDePasse}
        onChange={(e) => setAncienMotDePasse(e.target.value)}
        disabled={loading}
      />
      <TextField
        label="Nouveau mot de passe"
        type="password"
        variant="outlined"
        fullWidth
        margin="normal"
        required
        value={nouveauMotDePasse}
        onChange={(e) => setNouveauMotDePasse(e.target.value)}
        disabled={loading}
      />
      <TextField
        label="Confirmer le nouveau mot de passe"
        type="password"
        variant="outlined"
        fullWidth
        margin="normal"
        required
        value={confirmationMotDePasse}
        onChange={(e) => setConfirmationMotDePasse(e.target.value)}
        error={nouveauMotDePasse !== confirmationMotDePasse && confirmationMotDePasse !== ''}
        helperText={nouveauMotDePasse !== confirmationMotDePasse && confirmationMotDePasse !== '' ? 'Les mots de passe ne correspondent pas' : ''}
        disabled={loading}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 3 }}
        disabled={loading || !!success}
      >
        {loading ? <CircularProgress size={24} /> : 'Changer le mot de passe'}
      </Button>
    </Box>
  );
};

export default ChangeAdminPassword;