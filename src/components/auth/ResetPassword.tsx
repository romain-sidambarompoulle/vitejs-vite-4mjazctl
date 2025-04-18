import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Alert, CircularProgress } from '@mui/material';
import axios from '../../config/axios'; // Votre instance axios configurée
import { API_ROUTES } from '../../config/api'; // Vos routes API

function ResetPassword() {
  const { token } = useParams<{ token: string }>(); // Récupérer le token de l'URL
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTokenChecked, setIsTokenChecked] = useState(false); // Nouvel état pour savoir si le token a été vérifié initialement

  useEffect(() => {
    // Vérifier si le token est présent dès le montage
    if (!token) {
      setError('Aucun jeton de réinitialisation fourni dans l\'URL.');
      setIsTokenChecked(true); // Marquer comme vérifié même s'il est absent
    } else {
      // Optionnel : on pourrait faire un appel GET rapide ici pour pré-vérifier le token
      // mais pour l'instant, on suppose qu'il est potentiellement valide
      setIsTokenChecked(true); // Marquer comme vérifié
    }
  }, [token]); // Déclenché seulement quand le token change (au montage)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    if (!token) {
      setError('Jeton de réinitialisation invalide ou manquant.');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    setLoading(true);

    try {
      // Appel à la route POST pour réinitialiser
      const response = await axios.post(API_ROUTES.auth.resetPassword(token), {
        newPassword: password,
      });

      if (response.data.success) {
        // Afficher le message de succès
        setSuccess(response.data.message || 'Mot de passe réinitialisé avec succès ! Vous allez être redirigé vers la page de connexion.');
        // Vider les champs
        setPassword('');
        setConfirmPassword('');
        // Rediriger vers la page de connexion après un délai de 3 secondes
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        // Gérer les erreurs métier renvoyées par le backend (même si success: false)
        throw new Error(response.data.message || 'Une erreur est survenue lors de la réinitialisation.');
      }
    } catch (err: any) {
      console.error('Erreur détaillée lors de la réinitialisation:', err);
      // Afficher le message d'erreur spécifique du backend (token invalide/expiré, etc.)
      setError(err.response?.data?.message || err.message || 'Une erreur technique est survenue.');
    } finally {
      setLoading(false);
    }
  };

  // Affichage conditionnel basé sur l'état
  const renderContent = () => {
    if (!isTokenChecked) {
      // Afficher un chargement tant que le token n'est pas vérifié (ou présent)
      return <CircularProgress />;
    }

    if (error && !success) {
        // Afficher l'erreur principale s'il y en a une et pas de succès
        return <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>;
    }
    
    if (success) {
        // Afficher le message de succès s'il est défini
        return <Alert severity="success" sx={{ width: '100%', mb: 2 }}>{success}</Alert>;
    }


    // Si le token est présent (ou était présent initialement) et pas de succès/erreur bloquante, afficher le formulaire
    if (token && !success) {
      return (
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
           {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>} {/* Afficher aussi les erreurs de validation ici */}
          <TextField
            fullWidth
            label="Nouveau mot de passe"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{ mb: 2 }}
            disabled={loading}
          />
          <TextField
            fullWidth
            label="Confirmer le nouveau mot de passe"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Réinitialiser le mot de passe'}
          </Button>
        </form>
      );
    }
    
    // Cas par défaut (ne devrait pas arriver si error est bien géré au début)
     return <Alert severity="warning" sx={{ width: '100%', mb: 2 }}>Impossible d'afficher le formulaire.</Alert>;

  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 64px)',
        p: 3,
        maxWidth: '450px',
        mx: 'auto',
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Réinitialiser mon mot de passe
      </Typography>
      
      {renderContent()}

    </Box>
  );
}

export default ResetPassword;