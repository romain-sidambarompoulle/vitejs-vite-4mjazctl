import { useState } from 'react';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import axios from '../../config/axios';
import { API_ROUTES } from '../../config/api';
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nom: '',
    prenom: '',
    role: 'visitor'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        API_ROUTES.auth.register,
        formData
      );

      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/tableau-de-bord');
      }
    } catch (err: any) {
      console.error("Erreur inscription:", err);
      setError(err.response?.data?.message || "Erreur lors de l'inscription");
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
        minHeight: 'calc(100vh - 64px)',
        width: '90%',
        maxWidth: '400px',
        mx: 'auto',
        p: 2
      }}
    >
      <Typography variant="h4" gutterBottom>
        Inscription Visiteur
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Mot de passe"
          name="password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Nom"
          name="nom"
          value={formData.nom}
          onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
          required
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Prénom"
          name="prenom"
          value={formData.prenom}
          onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
          required
          sx={{ mb: 2 }}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{
            backgroundColor: '#3F51B5',
            '&:hover': { backgroundColor: '#303f9f' }
          }}
        >
          {loading ? 'Inscription en cours...' : 'S\'inscrire'}
        </Button>
      </form>
    </Box>
  );
}

export default Register;
