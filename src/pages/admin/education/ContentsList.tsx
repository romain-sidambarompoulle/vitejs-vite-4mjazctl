import { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Button, Table, 
  TableBody, TableCell, TableContainer, 
  TableHead, TableRow, IconButton,
  CircularProgress, Snackbar, Alert, AlertColor,
  Chip, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent
} from '@mui/material';
import { 
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from '../../../config/axios';
import { API_ROUTES } from '../../../config/api';

// Définir les interfaces pour les types d'objets
interface Section {
  id: number;
  titre: string;
}

interface Content {
  id: number;
  titre: string;
  section_id: number;
  section_titre: string;
  type?: string;
  ordre?: number;
  status?: string;
}

const ContentsList = () => {
  const [contents, setContents] = useState<Content[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSection, setSelectedSection] = useState('all');
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
  }>({
    open: false,
    message: '',
    severity: 'info'
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchSections();
    fetchContents();
  }, []);

  const fetchSections = async () => {
    try {
      const response = await axios.get(API_ROUTES.education.sections);
      if (response.data.success) {
        setSections(response.data.sections);
      }
    } catch (error) {
      console.error('Erreur chargement sections:', error);
    }
  };

  const fetchContents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ROUTES.education.contents);
      if (response.data.success) {
        setContents(response.data.contents);
      } else {
        setError('Erreur lors de la récupération des contenus');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur serveur');
    } finally {
      setLoading(false);
    }
  };

  const handleAddContent = () => {
    navigate('/admin/education/contents/add');
  };

  const handleEditContent = (contentId: number) => {
    navigate(`/admin/education/contents/${contentId}/edit`);
  };

  const handleViewContent = (contentId: number) => {
    window.open(`/education/contents/${contentId}`, '_blank');
  };

  const handleDeleteContent = async (contentId: number) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce contenu ?')) {
      return;
    }

    try {
      const response = await axios.delete(API_ROUTES.education.contentById(contentId));
      if (response.data.success) {
        setSnackbar({
          open: true,
          message: 'Contenu supprimé avec succès',
          severity: 'success'
        });
        fetchContents(); // Rafraîchir la liste
      } else {
        setSnackbar({
          open: true,
          message: response.data.message || 'Erreur lors de la suppression',
          severity: 'error'
        });
      }
    } catch (error: any) {
      console.error('Erreur:', error);
      setSnackbar({
        open: true,
        message: 'Erreur serveur',
        severity: 'error'
      });
    }
  };

  const handleSectionChange = (event: SelectChangeEvent) => {
    setSelectedSection(event.target.value);
  };

  const filteredContents = selectedSection === 'all' 
    ? contents 
    : contents.filter(content => content.section_id === parseInt(selectedSection));

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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" component="h1">
          Gestion des contenus éducatifs
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={handleAddContent}
        >
          Ajouter un contenu
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="section-filter-label">Filtrer par section</InputLabel>
          <Select
            labelId="section-filter-label"
            id="section-filter"
            value={selectedSection}
            label="Filtrer par section"
            onChange={handleSectionChange}
          >
            <MenuItem value="all">Toutes les sections</MenuItem>
            {sections.map(section => (
              <MenuItem key={section.id} value={section.id}>
                {section.titre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Titre</TableCell>
              <TableCell>Section</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Ordre</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredContents.length > 0 ? (
              filteredContents.map((content) => (
                <TableRow key={content.id}>
                  <TableCell>{content.id}</TableCell>
                  <TableCell>{content.titre}</TableCell>
                  <TableCell>{content.section_titre}</TableCell>
                  <TableCell>
                    <Chip 
                      label={content.type || 'texte'} 
                      color={content.type === 'video' ? 'secondary' : 'primary'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{content.ordre}</TableCell>
                  <TableCell>{content.status}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleViewContent(content.id)}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton onClick={() => handleEditContent(content.id)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteContent(content.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Aucun contenu disponible
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

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

export default ContentsList;