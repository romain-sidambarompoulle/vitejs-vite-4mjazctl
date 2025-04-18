import { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, CircularProgress, Alert, Paper } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import axios from '../../config/axios'; // Utiliser l'instance configurée
import { useNavigate } from 'react-router-dom'; // ✨ Importer useNavigate
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // ✨ Importer l'icône
import { API_ROUTES } from '../../config/api'; // Utiliser les routes API
import VideocamIcon from '@mui/icons-material/Videocam';

const VisioUserPage = () => {
  const [visioUrl, setVisioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate(); // ✨ Initialiser navigate

  const fetchVisioLink = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get<{ success: boolean; visio_url?: string; message?: string }>(
        API_ROUTES.user.visio // Utiliser la nouvelle route API
      );

      if (response.data.success && response.data.visio_url) {
        setVisioUrl(response.data.visio_url);
      } else {
        // Pas d'erreur serveur, mais aucune visio active
        setVisioUrl(null);
        console.log(response.data.message || 'Aucune visio active trouvée.');
      }
    } catch (err: any) {
      console.error("Erreur lors de la récupération du lien visio:", err);
      setError(err.response?.data?.message || "Une erreur est survenue lors de la récupération des informations de visioconférence.");
      setVisioUrl(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVisioLink();
  }, [fetchVisioLink]);

  return (
    <Box sx={{ py: 4, px: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" sx={{ color: '#2E5735', fontWeight: 600 }}>
          Visioconférence
        </Typography>
        <Button variant="outlined" onClick={fetchVisioLink} startIcon={<RefreshIcon />} disabled={loading}>
          Actualiser
        </Button>
      </Box>

      {/* ✨ Nouveau Paper pour les conseils ✨ */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2, backgroundColor: 'grey.100' }}>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
          💡 Conseil d'utilisation
        </Typography>
        <Typography component="div" variant="body2" sx={{ mb: 0.5 }}>
          1 - Si votre conseiller vient d'activer un lien de visioconférence pour vous et qu'il n'apparaît pas, cliquez sur "Actualiser".
        </Typography>
        <Typography component="div" variant="body2">
          2 - Lorsque la page de la visio s'ouvre, pensez à cliquer sur "<strong>Rejoindre la réunion</strong>".
        </Typography>
        <Typography component="div" variant="body2" sx={{ mt: 0.5 }}>
          3 - Si la visioconférence s'arrête ou s'il y a un bug, veuillez quitter la visioconférence, actualiser cette page, et attendre que votre conseiller active un nouveau lien que vous pourrez rejoindre.
        </Typography>
      </Paper>

      <Paper sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
        {/* Texte explicatif initial (peut être conservé ou supprimé selon votre préférence) */}
        {/* <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontStyle: 'italic' }}>
          Si votre conseiller vient d'activer un lien de visioconférence pour vous et qu'il n'apparaît pas, cliquez sur "Actualiser".
        </Typography> */}

        {loading && <CircularProgress sx={{ my: 3 }} />}

        {!loading && error && (
          <Alert severity="error" sx={{ my: 3 }}>{error}</Alert>
        )}

        {!loading && !error && (
          <>
            {visioUrl ? (
              <>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Une visioconférence est prête pour vous.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<VideocamIcon />}
                  onClick={() => {
                    if (visioUrl) {
                      window.open(visioUrl, '_blank', 'noopener,noreferrer');
                    }
                  }}
                  sx={{ 
                    bgcolor: '#2E5735',
                    '&:hover': { bgcolor: '#1E4625' }
                  }}
                >
                  Rejoindre ma visio
                </Button>
              </>
            ) : (
              <Typography variant="body1" sx={{ my: 3 }}>
                Aucune visioconférence n'est active pour le moment. Votre conseiller l'activera si nécessaire.
              </Typography>
            )}
          </>
        )}
      </Paper>

      {/* ✨ Bouton de retour copié depuis Profile.tsx ✨ */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        mt: { xs: 2, sm: 3 },
        mb: { xs: 4, sm: 6 }
      }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard')} // ✨ Assurer la bonne navigation
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
};

export default VisioUserPage;