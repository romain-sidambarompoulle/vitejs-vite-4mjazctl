import React from 'react';
import { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Button, TextField,
  CircularProgress, Chip, Stack, Dialog, DialogActions, DialogContent, DialogContentText, Snackbar, Alert, AlertColor,
  DialogTitle
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from '../../config/axios';
import { API_ROUTES } from '../../config/api';
import VideocamIcon from '@mui/icons-material/Videocam';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';

// Ajoutez un type pour les utilisateurs
interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  progression_formulaire: number;
  created_at: string;
}

const UsersList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({
    nom: '',
    prenom: '',
    email: ''
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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        console.log('Récupération des utilisateurs depuis la base de données...');
        
        const response = await axios.get(API_ROUTES.admin.users);
        console.log('Réponse API:', response.data);
        
        if (response.data.success) {
          setUsers(response.data.users);
        } else {
          setError('Erreur lors de la récupération des utilisateurs: ' + response.data.message);
        }
      } catch (error) {
        console.error('Erreur complète:', error);
        const err = error as any;
        setError('Erreur de connexion à la base de données: ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      setEditForm({
        nom: selectedUser.nom,
        prenom: selectedUser.prenom,
        email: selectedUser.email
      });
    }
  }, [selectedUser]);

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.prenom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (userId: number) => {
    navigate(`/admin/users/${userId}`);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setOpenEditModal(true);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setOpenDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;
    
    try {
      setLoading(true);
      const response = await axios.delete(`${API_ROUTES.admin.users}/${selectedUser.id}`);
      if (response.data.success) {
        setUsers(prev => prev.filter(u => u.id !== selectedUser.id));
        setSnackbar({ open: true, message: 'Utilisateur supprimé avec succès', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: 'Erreur: ' + response.data.message, severity: 'error' });
      }
    } catch (error) {
      const err = error as any;
      setSnackbar({ open: true, message: 'Erreur: ' + (err.response?.data?.message || err.message), severity: 'error' });
    } finally {
      setLoading(false);
      setOpenDeleteModal(false);
    }
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const submitEdit = async () => {
    if (!selectedUser) return;
    
    try {
      setLoading(true);
      const response = await axios.put(`${API_ROUTES.admin.users}/${selectedUser.id}`, editForm);
      if (response.data.success) {
        setUsers(prev => prev.map(u => 
          u.id === selectedUser.id 
            ? { ...u, nom: editForm.nom, prenom: editForm.prenom, email: editForm.email }
            : u
        ));
        setSnackbar({ open: true, message: 'Utilisateur modifié avec succès', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: 'Erreur: ' + response.data.message, severity: 'error' });
      }
    } catch (error) {
      const err = error as any;
      setSnackbar({ open: true, message: 'Erreur: ' + (err.response?.data?.message || err.message), severity: 'error' });
    } finally {
      setLoading(false);
      setOpenEditModal(false);
    }
  };

  return (
    <Box sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ color: '#3F51B5', fontWeight: 600 }}>
          Gestion des Utilisateurs
        </Typography>
        
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => navigate('/admin/users/add')}
          sx={{ bgcolor: '#4CAF50', '&:hover': { bgcolor: '#388E3C' } }}
        >
          Ajouter un utilisateur
        </Button>
      </Box>

      <TextField
        fullWidth
        label="Rechercher un utilisateur"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 4 }}
      />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" sx={{ textAlign: 'center', my: 4 }}>
          {error}
        </Typography>
      ) : (
        <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#3F51B5' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nom</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Prénom</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Statut Formulaire</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date d'inscription</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} sx={{ '&:hover': { backgroundColor: 'rgba(63, 81, 181, 0.08)' } }}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.nom}</TableCell>
                  <TableCell>{user.prenom}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip 
                      label={user.progression_formulaire === 100 ? "Complet" : "Incomplet"} 
                      color={user.progression_formulaire === 100 ? "success" : "warning"}
                    />
                  </TableCell>
                  <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Button 
                        variant="contained" 
                        onClick={() => handleViewDetails(user.id)}
                        sx={{ bgcolor: '#3F51B5', '&:hover': { bgcolor: '#303F9F' } }}
                      >
                        Détails
                      </Button>
                      
                      <Button 
                        variant="contained" 
                        onClick={() => handleEditUser(user)}
                        sx={{ bgcolor: '#FFA000', '&:hover': { bgcolor: '#FF8F00' } }}
                      >
                        Modifier
                      </Button>
                      
                      <Button 
                        variant="contained" 
                        onClick={() => handleDeleteUser(user)}
                        sx={{ bgcolor: '#F44336', '&:hover': { bgcolor: '#D32F2F' } }}
                      >
                        Supprimer
                      </Button>
                      
                      <Button
                        variant="contained"
                        color="info"
                        startIcon={<VideocamIcon />}
                        onClick={() => {
                          const nomSlug = user.nom.trim().replace(/\s+/g, '-');
                          const visioUrl = `https://meet.jit.si/OdiaStrategie-${nomSlug}`;
                          window.open(visioUrl, '_blank');
                        }}
                      >
                        Visio Jitsi
                      </Button>
                      <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<CheckCircleOutlineIcon />}
                        onClick={async () => {
                          const nomSlug = user.nom.trim().replace(/\s+/g, '-');
                          const url = `https://meet.jit.si/OdiaStrategie-${nomSlug}`;
                          try {
                            await axios.post(API_ROUTES.admin.visio, { user_id: user.id, visio_url: url });
                            setSnackbar({ open: true, message: `Visio activée pour ${user.prenom} ${user.nom}`, severity: 'success' });
                          } catch (err) {
                            setSnackbar({ open: true, message: 'Erreur lors de l\'activation de la visio', severity: 'error' });
                          }
                        }}
                      >
                        Activer Visio
                      </Button>
                      <Button
                        variant="outlined"
                        color="warning"
                        startIcon={<CancelIcon />}
                        onClick={async () => {
                          try {
                            await axios.delete(API_ROUTES.admin.deactivateVisio(user.id));
                            setSnackbar({ open: true, message: `Visio désactivée pour ${user.prenom} ${user.nom}`, severity: 'success' });
                          } catch (err) {
                            setSnackbar({ open: true, message: 'Erreur lors de la désactivation de la visio', severity: 'error' });
                          }
                        }}
                      >
                        Désactiver Visio
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Modal de modification */}
      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <DialogTitle>Modifier l'utilisateur</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField 
              label="Nom"
              name="nom"
              value={editForm.nom}
              onChange={handleEditFormChange}
              fullWidth
            />
            <TextField 
              label="Prénom"
              name="prenom"
              value={editForm.prenom}
              onChange={handleEditFormChange}
              fullWidth
            />
            <TextField 
              label="Email"
              name="email"
              value={editForm.email}
              onChange={handleEditFormChange}
              fullWidth
              disabled
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditModal(false)}>Annuler</Button>
          <Button onClick={submitEdit} variant="contained" color="primary">Enregistrer</Button>
        </DialogActions>
      </Dialog>

      {/* Modal de confirmation de suppression */}
      <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer l'utilisateur {selectedUser?.prenom} {selectedUser?.nom} ?
            Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteModal(false)}>Annuler</Button>
          <Button onClick={confirmDelete} variant="contained" color="error">Supprimer</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar pour les notifications */}
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

export default UsersList; 