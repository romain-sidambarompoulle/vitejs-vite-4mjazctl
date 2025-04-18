import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, List, ListItem, ListItemText, ListItemAvatar, Avatar,
  CircularProgress, Alert, Divider, Badge, ListItemButton, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent,
  IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import axios from '../../config/axios';
import { API_ROUTES } from '../../config/api';
import DeleteIcon from '@mui/icons-material/Delete';
import { Snackbar } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { formatDistanceToNowStrict, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

// Interface pour représenter un utilisateur dans la liste
interface UserWithMessage {
  user_id: number;
  nom: string;
  prenom: string;
  email: string;
  last_message_date: string | null; // Peut être null si pas de message
  unread_count: number; // Doit être renvoyé par le backend (nombre de messages non lus par l'admin)
  last_admin_message_sent_at: string | null;
  last_admin_message_read_status: boolean | null;
}

const MessagesUsersList: React.FC = () => {
  const navigate = useNavigate();
  // Séparer les utilisateurs en deux listes
  const [usersWithConversation, setUsersWithConversation] = useState<UserWithMessage[]>([]);
  const [usersWithoutConversation, setUsersWithoutConversation] = useState<UserWithMessage[]>([]);
  const [selectedNewUserId, setSelectedNewUserId] = useState<string>(''); // Pour le Select
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserWithMessage | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    severity: 'info',
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsersWithMessage = async () => {
      setLoading(true);
      setUsersWithConversation([]);
      setUsersWithoutConversation([]);
      setError(null);
      try {
        const response = await axios.get(API_ROUTES.admin.messagesUsersList);
        if (response.data.success) {
          const allUsers = response.data.users as UserWithMessage[];
          // Filtrer les utilisateurs selon l'existence d'une conversation
          const withConv = allUsers.filter(user => user.last_message_date !== null);
          const withoutConv = allUsers.filter(user => user.last_message_date === null);

          setUsersWithConversation(withConv);
          setUsersWithoutConversation(withoutConv);
        } else {
          setError(response.data.message || 'Erreur lors de la récupération des utilisateurs.');
        }
      } catch (err: any) {
        console.error('Erreur récupération utilisateurs avec messages:', err);
        setError(err.response?.data?.message || 'Une erreur réseau est survenue.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsersWithMessage();
  }, []);

  const handleUserClick = (userId: number) => {
    navigate(`/admin/messages/${userId}`);
  };

  // Ouvre la boîte de dialogue de confirmation
  const handleDeleteClick = (user: UserWithMessage) => {
    setUserToDelete(user);
    setConfirmDialogOpen(true);
  };

  // Ferme la boîte de dialogue
  const handleCloseConfirmDialog = () => {
    setConfirmDialogOpen(false);
    setUserToDelete(null);
  };

  // Gère la suppression confirmée
  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    setDeleting(userToDelete.user_id);
    setDeleteError(null);
    handleCloseConfirmDialog(); // Ferme la dialog avant l'appel

    try {
      const response = await axios.delete(API_ROUTES.admin.deleteConversation(userToDelete.user_id));
      if (response.data.success) {
        // Filtrer l'utilisateur supprimé de la liste
        setUsersWithConversation(prev => prev.filter(u => u.user_id !== userToDelete.user_id));
        setSnackbar({ open: true, message: response.data.message || 'Conversation supprimée.', severity: 'success' });
      } else {
        throw new Error(response.data.message || 'Erreur lors de la suppression.');
      }
    } catch (err: any) {
      console.error('Erreur suppression conversation:', err);
      const message = err.response?.data?.message || 'Une erreur est survenue lors de la suppression.';
      setSnackbar({ open: true, message: message, severity: 'error' });
      setDeleteError(message);
    } finally {
      setDeleting(null);
      setUserToDelete(null); // Nettoyer après l'opération
    }
  };

  // Navigue vers une nouvelle conversation (ou existante vide) depuis le Select
  const handleNewConversationSelect = (event: SelectChangeEvent<string>) => {
    const userId = event.target.value;
    if (userId) {
      setSelectedNewUserId(userId); // Garde la sélection visible (optionnel)
      navigate(`/admin/messages/${userId}`);
    }
  };

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  // ✨ Fonction utilitaire pour afficher le statut du dernier message admin
  const renderAdminMessageStatus = (user: UserWithMessage) => {
    if (!user.last_admin_message_sent_at) {
      return null; // L'admin n'a jamais envoyé de message
    }
    const isRead = user.last_admin_message_read_status;
    const timeAgo = formatDistanceToNowStrict(parseISO(user.last_admin_message_sent_at), { locale: fr, addSuffix: true });

    return (
      <Typography component="span" variant="caption" sx={{ display: 'flex', alignItems: 'center', color: isRead ? 'text.secondary' : 'text.primary', mt: 0.5 }}>
        {isRead ? <DoneAllIcon fontSize="inherit" sx={{ mr: 0.5, color: 'success.main' }} /> : <CheckIcon fontSize="inherit" sx={{ mr: 0.5 }} />}
        {isRead ? `Lu` : `Envoyé ${timeAgo}`} 
      </Typography>
    );
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Typography variant="h4" sx={{ mb: 3, color: 'primary.main' }}>
        Messages Internes Utilisateurs
      </Typography>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {!loading && !error && (
        <>
          {/* Section 1: Utilisateurs avec conversation */}
          <Typography variant="h6" sx={{ mb: 2, mt: 3 }}>
            Conversations Actives
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Cliquez sur un utilisateur pour voir et répondre aux messages.
          </Typography>
          <Paper elevation={2}>
            <List disablePadding sx={{ position: 'relative' }}>
              {usersWithConversation.length === 0 ? (
                <ListItem>
                  <ListItemText primary="Aucune conversation active pour le moment." />
                </ListItem>
              ) : (
                usersWithConversation.map((user, index) => (
                  <React.Fragment key={user.user_id}>
                    <ListItem
                      disablePadding
                      secondaryAction={
                        deleting === user.user_id ? (
                          <CircularProgress size={24} sx={{ mr: 1 }}/>
                        ) : (
                          <IconButton
                            edge="end"
                            aria-label="supprimer la conversation"
                            onClick={(e) => {
                              handleDeleteClick(user);
                            }}
                            color="error"
                            sx={{ mr: 1 }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        )
                      }
                    >
                      <ListItemButton
                        onClick={() => handleUserClick(user.user_id)}
                        sx={{ alignItems: 'flex-start' }}
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'secondary.main' }}>
                            <Badge
                              badgeContent={user.unread_count > 0 ? ' ' : 0}
                              color="error"
                              variant="dot"
                              invisible={user.unread_count === 0}
                              anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                              }}
                            >
                              <PersonIcon />
                            </Badge>
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={`${user.prenom} ${user.nom}`}
                          secondary={
                            <>
                              {user.email}
                              {user.last_message_date && (
                                <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block' }}>
                                  Dernier message: {new Date(user.last_message_date).toLocaleString('fr-FR')}
                                </Typography>
                              )}
                              {/* ✨ Afficher le statut du dernier message de l'admin */}
                              {renderAdminMessageStatus(user)}
                            </>
                          }
                        />
                        {user.unread_count > 0 && (
                          <Badge
                            badgeContent={user.unread_count}
                            color="error"
                            sx={{ ml: 'auto', alignSelf: 'center', mr: 6 }}
                            max={99}
                          />
                        )}
                      </ListItemButton>
                    </ListItem>
                    {index < usersWithConversation.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))
              )}
            </List>
          </Paper>

          {/* Section 2: Utilisateurs sans conversation (Menu déroulant) */}
          <Typography variant="h6" sx={{ mb: 2, mt: 4 }}>
            Démarrer une nouvelle conversation
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Sélectionnez un utilisateur pour lui envoyer le premier message.
          </Typography>
          <Paper elevation={2} sx={{ p: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="select-new-conversation-label">Choisir un utilisateur</InputLabel>
              <Select
                labelId="select-new-conversation-label"
                id="select-new-conversation"
                value={selectedNewUserId} // Contrôlé mais la navigation se fait au onChange
                label="Choisir un utilisateur"
                onChange={handleNewConversationSelect}
              >
                <MenuItem value="" disabled>-- Sélectionnez --</MenuItem>
                {usersWithoutConversation.map((user) => (
                  <MenuItem key={user.user_id} value={user.user_id.toString()}>
                    {user.prenom} {user.nom} ({user.email})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>
        </>
      )}

      {/* Boîte de dialogue de confirmation */}
      <Dialog
        open={confirmDialogOpen}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Êtes-vous sûr de vouloir supprimer tous les messages de la conversation avec{' '}
            <strong>{userToDelete?.prenom} {userToDelete?.nom}</strong> ?
            Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="primary" disabled={!!deleting}>
            Annuler
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus disabled={!!deleting}>
            {deleting ? <CircularProgress size={20} color="inherit"/> : 'Supprimer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar pour les notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MessagesUsersList;
