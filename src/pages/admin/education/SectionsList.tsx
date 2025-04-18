import { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Button, Table, 
  TableBody, TableCell, TableContainer, 
  TableHead, TableRow, IconButton,
  CircularProgress, Snackbar, Alert, AlertColor
} from '@mui/material';
import { 
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from '../../../config/axios';
import { API_ROUTES } from '../../../config/api';

// Interface pour les sections
interface Section {
  id: number;
  titre: string;
  description?: string;
  ordre?: number;
  status?: string;
}

const SectionsList = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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
  }, []);

  const fetchSections = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ROUTES.education.sections);
      if (response.data.success) {
        setSections(response.data.sections);
      } else {
        setError('Erreur lors de la récupération des sections');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur serveur');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSection = () => {
    navigate('/admin/education/sections/add');
  };

  const handleEditSection = (sectionId: number) => {
    navigate(`/admin/education/sections/${sectionId}/edit`);
  };

  const handleDeleteSection = async (sectionId: number) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cette section ?')) {
      return;
    }

    try {
      const response = await axios.delete(API_ROUTES.education.sectionById(sectionId));
      if (response.data.success) {
        setSnackbar({
          open: true,
          message: 'Section supprimée avec succès',
          severity: 'success'
        });
        fetchSections(); // Rafraîchir la liste
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
          Gestion des sections éducatives
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={handleAddSection}
        >
          Ajouter une section
        </Button>
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
              <TableCell>Description</TableCell>
              <TableCell>Ordre</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sections.length > 0 ? (
              sections.map((section) => (
                <TableRow key={section.id}>
                  <TableCell>{section.id}</TableCell>
                  <TableCell>{section.titre}</TableCell>
                  <TableCell>{section.description?.substring(0, 100)}...</TableCell>
                  <TableCell>{section.ordre}</TableCell>
                  <TableCell>{section.status}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditSection(section.id)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteSection(section.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Aucune section disponible
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

export default SectionsList;