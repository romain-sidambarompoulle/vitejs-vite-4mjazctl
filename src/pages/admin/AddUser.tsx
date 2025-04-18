import { useState } from 'react';
import { 
  Box, Typography, Paper, TextField, Button, 
  CircularProgress, Snackbar, Alert, AlertColor 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from '../../config/axios';
import { API_ROUTES } from '../../config/api';

const AddUser = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: ''
  });
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
  }>({
    open: false,
    message: '',
    severity: 'info'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await axios.post(API_ROUTES.admin.createUser, formData);
      
      if (response.data.success) {
        setSnackbar({
          open: true,
          message: 'Utilisateur créé avec succès',
          severity: 'success'
        });
        
        // Réinitialiser le formulaire
        setFormData({
          nom: '',
          prenom: '',
          email: '',
          password: ''
        });
        
        // Rediriger vers la liste des utilisateurs après 2 secondes
        setTimeout(() => {
          navigate('/admin/users');
        }, 2000);
      }
    } catch (error) {
      const err = error as any;
      setSnackbar({
        open: true,
        message: 'Erreur: ' + (err.response?.data?.message || err.message),
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ py: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, color: '#3F51B5', fontWeight: 600 }}>
        Ajouter un Utilisateur
      </Typography>
      
      <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto', borderRadius: 2 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nom"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          
          <TextField
            label="Prénom"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          
          <TextField
            label="Mot de passe"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          
          <Box sx={{ mt: 4, textAlign: 'right' }}>
            <Button 
              type="button" 
              onClick={() => navigate('/admin/users')}
              sx={{ mr: 2 }}
            >
              Annuler
            </Button>
            
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Ajouter'}
            </Button>
          </Box>
        </form>
      </Paper>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddUser;
