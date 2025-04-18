import { useState, useEffect, Suspense } from 'react';
import React from 'react';
import {
  Box, Typography, Paper, TextField, Button,
  FormControl, InputLabel, Select, MenuItem,
  CircularProgress, Snackbar, Alert, SelectChangeEvent
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../../config/axios';
import { API_ROUTES } from '../../../config/api';
import { sanitizeHtml } from '../../../utils/htmlSanitizer';

// Lazy load de l'éditeur
const LazyEditor = React.lazy(() => import('../../../components/editor/LazyEditor'));

// Ajouter un type pour la sévérité de la notification
type AlertSeverity = 'error' | 'warning' | 'info' | 'success';

// Interface Section
interface Section {
  id: number;
  titre: string;
  description?: string;
  ordre?: number;
  status?: string;
}

const ContentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sections, setSections] = useState<Section[]>([]);
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    contenu: '',
    section_id: '',
    ordre: 0,
    temps_lecture: 5,
    image_url: '',
    type: 'text',
    status: 'active'
  });
  const [loading, setLoading] = useState(false);
  const [sectionsLoading, setSectionsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: AlertSeverity;
  }>({
    open: false,
    message: '',
    severity: 'info'
  });

  useEffect(() => {
    fetchSections();
    if (id) {
      fetchContent();
    }
  }, [id]);

  const fetchSections = async () => {
    try {
      setSectionsLoading(true);
      const response = await axios.get(API_ROUTES.education.sections);
      if (response.data.success) {
        setSections(response.data.sections);
      } else {
        setSnackbar({
          open: true,
          message: 'Erreur lors de la récupération des sections',
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
      setSectionsLoading(false);
    }
  };

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ROUTES.education.contentById(Number(id)));
      if (response.data.success) {
        setFormData(response.data.content);
      } else {
        setSnackbar({
          open: true,
          message: 'Erreur lors de la récupération du contenu',
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
    // Si c'est un événement provenant d'un input standard
    if (typeof e !== 'string') {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    } 
    // Si c'est un événement provenant de CKEditor
    else {
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
      if (!formData.titre || !formData.section_id) {
        setSnackbar({
          open: true,
          message: 'Le titre et la section sont requis',
          severity: 'error'
        });
        return;
      }

      // Sanitize HTML content before sending
      const sanitizedData = {
        ...formData,
        contenu: sanitizeHtml(formData.contenu || '')
      };

      let response;
      if (id) {
        // Mise à jour
        response = await axios.put(
          API_ROUTES.education.contentById(Number(id)),
          sanitizedData
        );
      } else {
        // Création
        response = await axios.post(
          API_ROUTES.education.contents,
          sanitizedData
        );
      }

      if (response.data.success) {
        setSnackbar({
          open: true,
          message: `Contenu ${id ? 'modifié' : 'créé'} avec succès`,
          severity: 'success'
        });
        
        // Redirection après un court délai
        setTimeout(() => {
          navigate('/admin/education/contents');
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
    navigate('/admin/education/contents');
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading || sectionsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        {id ? 'Modifier un contenu' : 'Créer un contenu'}
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

          <FormControl fullWidth margin="normal" required>
            <InputLabel id="section-label">Section</InputLabel>
            <Select
              labelId="section-label"
              id="section_id"
              name="section_id"
              value={formData.section_id}
              label="Section"
              onChange={handleSelectChange}
            >
              {sections.map(section => (
                <MenuItem key={section.id} value={section.id}>
                  {section.titre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            margin="normal"
            fullWidth
            multiline
            rows={2}
            id="description"
            label="Description"
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
          />

          {/* Éditeur avec Suspense */}
          <Suspense fallback={
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3, height: '400px', alignItems: 'center', border: '1px dashed #ccc' }}>
              <CircularProgress />
              <Typography variant="body2" sx={{ ml: 2 }}>Chargement de l'éditeur...</Typography>
            </Box>
          }>
            <LazyEditor
              name="contenu"
              label="Contenu"
              value={formData.contenu || ''}
              onChange={handleChange}
              height="400px"
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
            type="number"
            id="temps_lecture"
            label="Temps de lecture (minutes)"
            name="temps_lecture"
            value={formData.temps_lecture}
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
            <InputLabel id="type-label">Type de contenu</InputLabel>
            <Select
              labelId="type-label"
              id="type"
              name="type"
              value={formData.type}
              label="Type de contenu"
              onChange={handleSelectChange}
            >
              <MenuItem value="text">Texte</MenuItem>
              <MenuItem value="video">Vidéo</MenuItem>
              <MenuItem value="quiz">Quiz</MenuItem>
            </Select>
          </FormControl>

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

export default ContentForm;