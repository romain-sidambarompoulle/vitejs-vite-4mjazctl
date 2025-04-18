import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Button,
  CircularProgress,
  Tooltip,
  Switch,
  Alert,
  Snackbar
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Save as SaveIcon, Cancel as CancelIcon, MarkChatRead, MarkChatUnread } from '@mui/icons-material';
import axios from '../../config/axios';
import { API_ROUTES } from '../../config/api';

interface Message {
  id: number;
  email: string;
  content: string;
  read: boolean;
  created_at: string;
  updated_at: string;
}

const MessagesAdmin: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState<string>('');
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
      open: false,
      message: '',
      severity: 'success',
  });

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<{ success: boolean; messages: Message[] }>(API_ROUTES.admin.chatMessages);
      if (response.data.success) {
        setMessages(response.data.messages);
      } else {
        setError('Erreur lors de la récupération des messages.');
      }
    } catch (err) {
      console.error("Erreur fetch messages:", err);
      setError('Une erreur serveur est survenue.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleEdit = (message: Message) => {
    setEditingId(message.id);
    setEditContent(message.content);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  const handleSaveEdit = async (id: number) => {
    try {
      const response = await axios.put(API_ROUTES.admin.updateChatMessage(id), { content: editContent });
      if (response.data.success) {
         setMessages(messages.map(msg => msg.id === id ? { ...msg, content: editContent, updated_at: response.data.updatedMessage.updated_at } : msg));
         handleCancelEdit();
         setSnackbar({ open: true, message: 'Message mis à jour !', severity: 'success' });
      } else {
         setSnackbar({ open: true, message: response.data.message || 'Erreur mise à jour', severity: 'error' });
      }
    } catch (err) {
      console.error("Erreur save edit:", err);
      setSnackbar({ open: true, message: 'Erreur serveur lors de la mise à jour.', severity: 'error' });
    }
  };

  const handleDelete = async (id: number) => {
     if (window.confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
        try {
            const response = await axios.delete(API_ROUTES.admin.deleteChatMessage(id));
            if (response.data.success) {
                setMessages(messages.filter(msg => msg.id !== id));
                setSnackbar({ open: true, message: 'Message supprimé !', severity: 'success' });
            } else {
                 setSnackbar({ open: true, message: response.data.message || 'Erreur suppression', severity: 'error' });
            }
        } catch (err) {
            console.error("Erreur delete:", err);
             setSnackbar({ open: true, message: 'Erreur serveur lors de la suppression.', severity: 'error' });
        }
     }
  };

  const handleToggleRead = async (id: number, currentReadStatus: boolean) => {
      try {
        const response = await axios.put(API_ROUTES.admin.updateChatMessage(id), { read: !currentReadStatus });
        if (response.data.success) {
            setMessages(messages.map(msg => msg.id === id ? { ...msg, read: !currentReadStatus, updated_at: response.data.updatedMessage.updated_at } : msg));
            setSnackbar({ open: true, message: `Message marqué comme ${!currentReadStatus ? 'lu' : 'non lu'}`, severity: 'success' });
        } else {
             setSnackbar({ open: true, message: response.data.message || 'Erreur mise à jour statut', severity: 'error' });
        }
      } catch (err) {
        console.error("Erreur toggle read:", err);
        setSnackbar({ open: true, message: 'Erreur serveur lors de la mise à jour du statut.', severity: 'error' });
      }
  };

   const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };


  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Gestion des Messages du Chat (Anonymes)
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Reçu le</TableCell>
              <TableCell align="center">Statut</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {messages.map((message) => (
              <TableRow
                key={message.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 }, bgcolor: message.read ? 'inherit' : 'action.hover' }}
              >
                <TableCell component="th" scope="row">
                  {message.email}
                </TableCell>
                <TableCell sx={{ maxWidth: 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: editingId === message.id ? 'normal' : 'nowrap' }}>
                  {editingId === message.id ? (
                    <TextField
                      multiline
                      fullWidth
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      variant="outlined"
                      size="small"
                    />
                  ) : (
                     <Tooltip title={message.content}>
                         <span>{message.content}</span>
                    </Tooltip>
                  )}
                </TableCell>
                <TableCell>{new Date(message.created_at).toLocaleString('fr-FR')}</TableCell>
                <TableCell align="center">
                    <Tooltip title={message.read ? "Marquer comme non lu" : "Marquer comme lu"}>
                         <IconButton onClick={() => handleToggleRead(message.id, message.read)} size="small">
                            {message.read ? <MarkChatRead color="success" /> : <MarkChatUnread color="warning" />}
                         </IconButton>
                     </Tooltip>
                </TableCell>
                <TableCell align="center">
                  {editingId === message.id ? (
                    <>
                      <Tooltip title="Enregistrer">
                        <IconButton onClick={() => handleSaveEdit(message.id)} size="small" color="primary">
                          <SaveIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Annuler">
                         <IconButton onClick={handleCancelEdit} size="small">
                            <CancelIcon />
                        </IconButton>
                      </Tooltip>
                    </>
                  ) : (
                    <>
                     <Tooltip title="Modifier">
                         <IconButton onClick={() => handleEdit(message)} size="small">
                            <EditIcon />
                        </IconButton>
                      </Tooltip>
                       <Tooltip title="Supprimer">
                        <IconButton onClick={() => handleDelete(message.id)} size="small" color="error">
                            <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
       <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
       </Snackbar>
    </Box>
  );
};

export default MessagesAdmin;
