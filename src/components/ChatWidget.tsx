import React, { useState, useContext /*, useEffect */ } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  Link,
  CircularProgress,
  Alert,
  IconButton,
  Fab,
  Badge
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import MessageIcon from '@mui/icons-material/Message';
import { useNavigate } from 'react-router-dom';
import axios from '../config/axios';
import { API_ROUTES } from '../config/api';
import { UserContext } from '../contexts/UserContext';

const ChatWidget: React.FC = () => {
  const { user, unreadCount } = useContext(UserContext);
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSuccessAnimated, setIsSuccessAnimated] = useState(false);

  const handleToggleChat = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setError(null);
      setSuccess(null);
    }
    setIsSuccessAnimated(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!acceptedPolicy) {
      setError("Vous devez accepter la politique de confidentialité.");
      return;
    }
    if (!email || !message) {
        setError("L'email et le message sont obligatoires.");
        return;
    }

    setLoading(true);

    try {
      const response = await axios.post(API_ROUTES.chat.messages, {
        email,
        content: message,
      });

      if (response.status === 201) {
        setSuccess("Merci ! Votre message a bien été envoyé.");
        setIsSuccessAnimated(true);
        setTimeout(() => {
          setEmail('');
          setMessage('');
          setAcceptedPolicy(false);
          setIsSuccessAnimated(false);
        }, 2000);
      } else {
        setError("Erreur lors de l'envoi du message.");
      }
    } catch (err) {
      console.error("Erreur d'envoi:", err);
      setError("Une erreur serveur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const fabStyles = {
    position: 'fixed',
    bottom: 20,
    right: 20,
    zIndex: 10000,
    bgcolor: '#2E5735',
    color: 'white',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out, opacity 0.3s ease-in-out',
    '&:hover': {
      bgcolor: '#24452A',
      transform: 'scale(1.05)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    },
  };

  const adminFabStyles = {
    ...fabStyles,
    bgcolor: '#3f51b5',
    '&:hover': {
      bgcolor: '#303f9f',
    },
  };

  return (
    <>
      {!user && (
        <>
          {!isOpen && (
            <Fab
              color="primary"
              aria-label="open chat"
              onClick={handleToggleChat}
              sx={{
                ...fabStyles,
                opacity: isOpen ? 0 : 1,
                pointerEvents: isOpen ? 'none' : 'auto',
              }}
            >
              <ChatIcon />
            </Fab>
          )}

          <Box
            sx={{
              position: 'fixed',
              bottom: 20,
              right: 20,
              width: 300,
              bgcolor: 'background.paper',
              p: 2,
              borderRadius: 2,
              boxShadow: 3,
              zIndex: 9999,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              transition: 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out, visibility 0.3s ease-in-out',
              transform: isOpen ? 'translateY(0)' : 'translateY(20px)',
              opacity: isOpen ? 1 : 0,
              visibility: isOpen ? 'visible' : 'hidden',
              pointerEvents: isOpen ? 'auto' : 'none',
              border: '1px solid #ddd',
              background: 'linear-gradient(135deg, #fefefe 0%, #fafafa 100%)',
            }}
            component="form"
            onSubmit={handleSubmit}
            noValidate
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="h6" component="div">
                Besoin d'aide ?
              </Typography>
              <IconButton onClick={handleToggleChat} size="small">
                <CloseIcon />
              </IconButton>
            </Box>

            <Typography variant="body2" sx={{ mb: 1.5, color: 'text.secondary' }}>
              Envoyez-nous un message, nous vous répondrons par mail.
            </Typography>

            {error && <Alert severity="error">{error}</Alert>}
            {success && !isSuccessAnimated && <Alert severity="success">{success}</Alert>}

            <TextField
              label="Votre Email"
              type="email"
              variant="outlined"
              size="small"
              value={email}
              onChange={(e) => setEmail(e.target.value.toLowerCase())}
              required
              fullWidth
              disabled={loading}
            />
            <TextField
              label="Votre Message"
              variant="outlined"
              size="small"
              multiline
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              fullWidth
              disabled={loading}
            />
            <FormControlLabel
              control={
                  <Checkbox
                      checked={acceptedPolicy}
                      onChange={(e) => setAcceptedPolicy(e.target.checked)}
                      name="acceptedPolicy"
                      color="primary"
                      size="small"
                      disabled={loading}
                  />
              }
              label={
                  <Typography variant="body2">
                      J'accepte la{' '}
                      <Link href="/privacy-policy" target="_blank" rel="noopener noreferrer">
                         politique de confidentialité
                      </Link>
                      .*
                  </Typography>
              }
              sx={{ mt: -1 }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={loading || isSuccessAnimated || !acceptedPolicy}
              fullWidth
              startIcon={
                loading ? <CircularProgress size={20} color="inherit" /> :
                isSuccessAnimated ? <CheckIcon /> : null
              }
              sx={{
                bgcolor: isSuccessAnimated ? 'success.main' : '#A4C3B2',
                color: isSuccessAnimated ? 'white' : '#1A4D2E',
                '&:hover': {
                  bgcolor: isSuccessAnimated ? 'success.dark' : '#8FAF9E',
                },
                transition: 'background-color 0.3s ease',
              }}
            >
              {loading ? 'Envoi...' : isSuccessAnimated ? 'Envoyé !' : 'Envoyer'}
            </Button>
          </Box>
        </>
      )}

      {user && user.role !== 'admin' && (
         <Fab
            color="primary"
            aria-label="open internal messages"
            onClick={() => navigate('/dashboard/messages')}
            sx={fabStyles}
          >
            <Badge badgeContent={unreadCount} color="error">
              <MessageIcon />
            </Badge>
          </Fab>
      )}

      {user && user.role === 'admin' && (
          <Fab
            aria-label="open admin messages list"
            onClick={() => navigate('/admin/messages-users')}
            sx={adminFabStyles}
          >
            <Badge badgeContent={unreadCount} color="error">
              <MessageIcon />
            </Badge>
          </Fab>
      )}
    </>
  );
};

export default ChatWidget;