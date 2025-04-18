import { useState, useEffect, Suspense } from 'react';
import {
  Box, Typography, Paper, TextField, Button,
  FormControl, InputLabel, Select, MenuItem,
  CircularProgress, Snackbar, Alert, AlertColor,
  SelectChangeEvent
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../../config/axios';
import { API_ROUTES } from '../../../config/api';
import { sanitizeHtml } from '../../../utils/htmlSanitizer';
import React from 'react';

// Lazy load de l'éditeur
const LazyEditor = React.lazy(() => import('../../../components/editor/LazyEditor'));

const SectionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    ordre: 0,
    image_url: '',
    status: 'active'
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
  }>({
    open: false,
    message: '',
    severity: 'info'
  });

  useEffect(() => {
    if (id) {
      fetchSection();
    }
  }, [id]);

  const fetchSection = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ROUTES.education.sectionById(Number(id)));
      if (response.data.success) {
        setFormData(response.data.section);
      } else {
        setSnackbar({
          open: true,
          message: 'Erreur lors de la récupération de la section',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Erreur:', error);
      setSnackbar({
        open: true,
        message: 'Erreur serveur',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string, editorValue?: string) => {
    if (typeof e !== 'string') {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    } else {
      const name = e;
      const value = editorValue || '';
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setSaving(true);
      
      // Validation basique
      if (!formData.titre) {
        setSnackbar({
          open: true,
          message: 'Le titre est requis',
          severity: 'error'
        });
        return;
      }

      // Sanitize le HTML de la description avant l'envoi
      const sanitizedData = {
        ...formData,
        description: sanitizeHtml(formData.description || '')
      };

      let response;
      if (id) {
        // Mise à jour
        response = await axios.put(
          API_ROUTES.education.sectionById(Number(id)),
          sanitizedData
        );
      } else {
        // Création
        response = await axios.post(
          API_ROUTES.education.sections,
          sanitizedData
        );
      }

      if (response.data.success) {
        setSnackbar({
          open: true,
          message: `Section ${id ? 'modifiée' : 'créée'} avec succès`,
          severity: 'success'
        });
        
        // Redirection après un court délai
        setTimeout(() => {
          navigate('/admin/education/sections');
        }, 1500);
      } else {
        throw new Error(response.data.message || "Une erreur est survenue");
      }
    } catch (error: any) {
      console.error('Erreur:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Erreur serveur',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/education/sections');
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        {id ? 'Modifier une section' : 'Créer une section'}
      </Typography>

      <Paper sx={{ p: 3, mt: 2 }}>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="titre"
            label="Titre"
            name="titre"
            value={formData.titre}
            onChange={handleChange}
          />

          {/* Éditeur avec Suspense */}
          <Suspense fallback={
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3, height: '200px', alignItems: 'center', border: '1px dashed #ccc' }}>
              <CircularProgress />
              <Typography variant="body2" sx={{ ml: 2 }}>Chargement de l'éditeur...</Typography>
            </Box>
          }>
            <LazyEditor
              name="description"
              label="Description"
              value={formData.description || ''}
              onChange={handleChange}
              height="200px"
            />
          </Suspense>

          <TextField
            margin="normal"
            fullWidth
            type="number"
            id="ordre"
            label="Ordre d'affichage"
            name="ordre"
            value={formData.ordre}
            onChange={handleChange}
          />

          <TextField
            margin="normal"
            fullWidth
            id="image_url"
            label="URL de l'image"
            name="image_url"
            value={formData.image_url || ''}
            onChange={handleChange}
            placeholder="https://exemple.com/image.jpg"
          />

          <FormControl fullWidth margin="normal">
            <InputLabel id="status-label">Statut</InputLabel>
            <Select
              labelId="status-label"
              id="status"
              name="status"
              value={formData.status}
              label="Statut"
              onChange={handleSelectChange}
            >
              <MenuItem value="active">Actif</MenuItem>
              <MenuItem value="inactive">Inactif</MenuItem>
              <MenuItem value="draft">Brouillon</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={handleCancel}
              disabled={saving}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={saving}
              startIcon={saving ? <CircularProgress size={24} /> : null}
            >
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </Box>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SectionForm;