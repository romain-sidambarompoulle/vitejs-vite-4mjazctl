import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  Grid,
  LinearProgress,
  Alert,
  Snackbar
} from '@mui/material';
import axios from '../../config/axios';
import { API_ROUTES } from '../../config/api';
import { format, parseISO } from 'date-fns';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function Profile() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
    dateNaissance: '',
    situationFamiliale: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Nouveaux états pour le changement de mot de passe
  const [passwordForm, setPasswordForm] = useState({
    ancienMotDePasse: '',
    nouveauMotDePasse: '',
    confirmationNouveauMotDePasse: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const formatDateForInput = (dateString: string | null) => {
    if (!dateString) return '';
    try {
      return format(parseISO(dateString), 'yyyy-MM-dd');
    } catch {
      return '';
    }
  };

  // Déplacer fetchUserInfo ici et l'envelopper dans useCallback
  const fetchUserInfo = useCallback(async () => {
    try {
      console.log('Tentative de récupération du profil...');
      const response = await axios.get(API_ROUTES.user.profile);
      console.log('Réponse profil:', response.data);
      
      if (response.data.success) {
        const profileData = response.data.profile.informations;
        const userData = response.data.profile.user || {}; // Récupérer les infos utilisateur
        setUserInfo({
          nom: userData.nom || '',
          prenom: userData.prenom || '',
          email: userData.email || '',
          ...profileData,
          dateNaissance: formatDateForInput(profileData.dateNaissance)
        });
      }
    } catch (error) {
      console.error('Erreur profil:', error);
      setError('Erreur lors du chargement des informations');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const user = localStorage.getItem('user');
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        console.log('User from session:', JSON.parse(user)); // Debug
        const response = await axios.get(API_ROUTES.auth.user_data);
        if (response.data.success) {
          // L'utilisateur est authentifié, maintenant on peut charger le profil
          fetchUserInfo();
        }
      } catch (error) {
        console.error('Erreur d\'authentification:', error);
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate, fetchUserInfo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      const dataToSend = {
        ...userInfo,
        dateNaissance: userInfo.dateNaissance || null
      };
      
      console.log('Données envoyées:', dataToSend);
      const response = await axios.put(API_ROUTES.user.informations, dataToSend);
      console.log('Réponse complète:', response.data);
      
      if (response.data.success && response.data.profile) {
        const profileData = response.data.profile; // Directement le profil
        console.log('Données du profil:', profileData);

        setUserInfo({
          nom: profileData.nom || '',
          prenom: profileData.prenom || '',
          email: profileData.email || '',
          telephone: profileData.telephone || '',
          adresse: profileData.adresse || '',
          dateNaissance: formatDateForInput(profileData.date_naissance),
          situationFamiliale: profileData.situation_familiale || ''
        });
        
        setSuccess('Profil mis à jour avec succès');
        fetchUserInfo(); // Appel de la fonction définie en dehors
      } else {
        throw new Error('Données de profil manquantes dans la réponse');
      }
    } catch (error: any) {
      console.error('Erreur détaillée:', error);
      setError(error.message || 'Erreur lors de la mise à jour du profil');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value || ''; // Évite les valeurs null
    // Convertir l'e-mail en minuscules
    if (e.target.name === 'email') {
      value = value.toLowerCase();
    }
    setUserInfo(prev => ({
      ...prev,
      [e.target.name]: value
    }));
  };

  // Nouvelle fonction pour gérer les changements dans le formulaire de mot de passe
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    
    // Réinitialiser les messages d'erreur/succès quand l'utilisateur commence à modifier le formulaire
    setPasswordError('');
    setPasswordSuccess('');
  };

  // Nouvelle fonction pour soumettre le changement de mot de passe
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    
    // Vérifier que les deux nouveaux mots de passe correspondent
    if (passwordForm.nouveauMotDePasse !== passwordForm.confirmationNouveauMotDePasse) {
      setPasswordError('Les deux mots de passe ne correspondent pas');
      return;
    }
    
    // Vérifier que l'ancien mot de passe est renseigné
    if (!passwordForm.ancienMotDePasse) {
      setPasswordError('Veuillez entrer votre mot de passe actuel');
      return;
    }
    
    // Vérifier que le nouveau mot de passe est renseigné
    if (!passwordForm.nouveauMotDePasse) {
      setPasswordError('Veuillez entrer un nouveau mot de passe');
      return;
    }
    
    setPasswordLoading(true);
    
    try {
      const response = await axios.put(
        '/api/user/change-password', 
        {
          ancienMotDePasse: passwordForm.ancienMotDePasse,
          nouveauMotDePasse: passwordForm.nouveauMotDePasse
        }
      );
      
      if (response.data.success) {
        setPasswordSuccess('Mot de passe mis à jour avec succès');
        // Réinitialiser le formulaire
        setPasswordForm({
          ancienMotDePasse: '',
          nouveauMotDePasse: '',
          confirmationNouveauMotDePasse: ''
        });
      } else {
        throw new Error(response.data.message || 'Une erreur est survenue');
      }
    } catch (error: any) {
      console.error('Erreur lors du changement de mot de passe:', error);
      setPasswordError(error.response?.data?.message || error.message || 'Une erreur est survenue');
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, color: '#2E5735', fontWeight: 600 }}>
        Mon Profil
      </Typography>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, mb: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nom"
                name="nom"
                value={userInfo.nom || ""}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Prénom"
                name="prenom"
                value={userInfo.prenom || ""}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={userInfo.email || ""}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Téléphone"
                name="telephone"
                value={userInfo.telephone || ""}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Adresse"
                name="adresse"
                value={userInfo.adresse || ""}
                onChange={handleChange}
                variant="outlined"
                multiline
                rows={2}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date de naissance"
                name="dateNaissance"
                type="date"
                value={userInfo.dateNaissance || ""}
                onChange={handleChange}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Situation familiale"
                name="situationFamiliale"
                value={userInfo.situationFamiliale || ""}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <Button 
                type="submit"
                variant="contained"
                sx={{ 
                  mt: 2,
                  backgroundColor: '#2E5735',
                  '&:hover': {
                    backgroundColor: '#2E5735'
                  }
                }}
              >
                Enregistrer les modifications
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 3, color: '#2E5735', fontWeight: 600 }}>
          Changer mon mot de passe
        </Typography>
        
        {passwordError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {passwordError}
          </Alert>
        )}
        
        {passwordSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {passwordSuccess}
          </Alert>
        )}
        
        <form onSubmit={handlePasswordSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="password"
                label="Mot de passe actuel"
                name="ancienMotDePasse"
                value={passwordForm.ancienMotDePasse || ""}
                onChange={handlePasswordChange}
                variant="outlined"
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="password"
                label="Nouveau mot de passe"
                name="nouveauMotDePasse"
                value={passwordForm.nouveauMotDePasse || ""}
                onChange={handlePasswordChange}
                variant="outlined"
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="password"
                label="Confirmer le nouveau mot de passe"
                name="confirmationNouveauMotDePasse"
                value={passwordForm.confirmationNouveauMotDePasse || ""}
                onChange={handlePasswordChange}
                variant="outlined"
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <Button 
                type="submit"
                variant="contained"
                disabled={passwordLoading}
                sx={{ 
                  mt: 2,
                  backgroundColor: '#2E5735',
                  '&:hover': {
                    backgroundColor: '#2E5735'
                  }
                }}
              >
                {passwordLoading ? "Chargement..." : "Changer mon mot de passe"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Snackbar 
        open={!!error || !!success} 
        autoHideDuration={6000} 
        onClose={() => {
          setError('');
          setSuccess('');
        }}
      >
        <Alert 
          severity={error ? "error" : "success"} 
          sx={{ width: '100%' }}
        >
          {error || success}
        </Alert>
      </Snackbar>

      {/* Bouton de retour */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center',
        mt: { xs: 2, sm: 3 },
        mb: { xs: 4, sm: 6 }
      }}>
        <Button 
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard')}
          sx={{
            color: '#2E5735',
            borderColor: '#2E5735',
            backgroundColor: 'transparent',
            '&:hover': {
              backgroundColor: 'rgba(46, 87, 53, 0.1)',
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
          Retour au tableau de bord
        </Button>
      </Box>
    </Box>
  );
}

export default Profile;
