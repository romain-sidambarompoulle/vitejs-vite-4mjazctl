import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { Box, Typography, TextField, Button, Paper, List, ListItem, ListItemText, CircularProgress, Alert, Divider, Avatar, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from '../../config/axios';
import { API_ROUTES } from '../../config/api';
import SendIcon from '@mui/icons-material/Send';
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // Icône pour l'utilisateur
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount'; // Icône pour l'admin

// Importer les fonctions nécessaires de date-fns et la locale française
import { format, formatDistanceToNowStrict, isToday, isYesterday, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { UserContext } from '../../contexts/UserContext'; // ✨ Importer le contexte

interface Message {
  id: number;
  content: string;
  sender_id: number; // Garder une trace de qui a envoyé
  receiver_id: number;
  is_admin: boolean; // Indique si le message vient de l'admin (utile si l'admin répond plus tard)
  created_at: string;
}

// == Début de la fonction utilitaire de formatage de date (identique à celle côté admin) ==
/**
 * Formate une date ISO pour l'affichage dans la messagerie.
 * @param dateString Date au format ISO string.
 * @returns Date formatée lisible.
 */
const formatMessageDate = (dateString: string): string => {
  try {
    const date = parseISO(dateString); // Convertit la chaîne ISO en objet Date
    const now = new Date();

    // Vérifier si la date est très récente (moins d'une heure)
    const differenceInMinutes = (now.getTime() - date.getTime()) / (1000 * 60);
    if (differenceInMinutes < 60) {
      return formatDistanceToNowStrict(date, { addSuffix: true, locale: fr });
    }

    // Vérifier si c'est aujourd'hui
    if (isToday(date)) {
      return `aujourd'hui à ${format(date, 'HH:mm', { locale: fr })}`;
    }

    // Vérifier si c'était hier
    if (isYesterday(date)) {
      return `hier à ${format(date, 'HH:mm', { locale: fr })}`;
    }

    // Sinon, afficher la date complète avec l'heure
    return format(date, 'dd/MM/yyyy à HH:mm', { locale: fr });

  } catch (error) {
    console.error("Erreur de formatage de date:", error);
    return dateString; 
  }
};
// == Fin de la fonction utilitaire ==

const Messages: React.FC = () => {
  const navigate = useNavigate();
  // ✨ Récupérer setUnreadCount depuis le contexte
  const { setUnreadCount } = useContext(UserContext);

  // États pour la pagination
  const [messages, setMessages] = useState<Message[]>([]);
  const [offset, setOffset] = useState(0);
  const [limit] = useState(20);
  const [totalMessages, setTotalMessages] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Autres états
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [showNewMessageSnackbar, setShowNewMessageSnackbar] = useState(false);

  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const chatContainerRef = useRef<null | HTMLDivElement>(null);
  const previousScrollHeight = useRef<number>(0);
  const previousLatestMessageId = useRef<number | null>(null); // Pour détecter nouveau message via polling

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  // fetchMessages avec pagination
  const fetchMessages = useCallback(async (currentOffset: number, isInitialLoad = false, isPolling = false) => {
    if (isInitialLoad) {
      setLoadingInitial(true);
      setFetchError(null);
    } else if (!isPolling) { // Ne pas montrer le loader "more" pendant le polling
      setLoadingMore(true);
    }

    // Sauvegarder la hauteur de scroll avant de charger plus (sauf polling)
    if (!isInitialLoad && !isPolling && chatContainerRef.current) {
      previousScrollHeight.current = chatContainerRef.current.scrollHeight;
    }

    try {
      const response = await axios.get(API_ROUTES.user.getMessages, {
        params: { limit, offset: currentOffset }
      });

      if (response.data.success) {
        const fetchedMessages = response.data.messages as Message[];
        const total = response.data.totalMessages as number;
        const newMessages = fetchedMessages.reverse(); // Inverser pour avoir ASC

        // Gérer la détection de nouveaux messages spécifiquement pour le polling
        if (isPolling && newMessages.length > 0) {
            const latestReceivedId = newMessages[newMessages.length - 1].id;
            const lastMessageIsAdmin = newMessages[newMessages.length - 1].is_admin;
            // Afficher le snackbar seulement si le dernier message est de l'admin et plus récent que le dernier connu
            if (lastMessageIsAdmin && latestReceivedId !== previousLatestMessageId.current) {
                setShowNewMessageSnackbar(true);
                console.log('[Polling] New admin message detected by ID!');
                // On met à jour la liste (préfixer anciens, MAIS ici on remplace car on a fetch la page 0)
                 setMessages(newMessages);
                 setTimeout(() => scrollToBottom("smooth"), 100); // Scroll si nouveau message en bas
            }
            previousLatestMessageId.current = latestReceivedId; // Mémoriser le dernier ID vu
        } else {
             // Logique standard pour chargement initial ou "load more"
             setMessages(prevMessages =>
                 isInitialLoad ? newMessages : [...newMessages, ...prevMessages]
             );
             if (!isPolling) {
                 setOffset(currentOffset + newMessages.length);
                 setTotalMessages(total);
                 setHasMore(currentOffset + newMessages.length < total);
             }
             // Gérer le scroll
            if (isInitialLoad) {
                // Commenter cette ligne pour désactiver le scroll initial
                // setTimeout(() => scrollToBottom("auto"), 150); 
            } else if (!isPolling && chatContainerRef.current) {
                const newScrollHeight = chatContainerRef.current.scrollHeight;
                chatContainerRef.current.scrollTop = newScrollHeight - previousScrollHeight.current;
            }
        }
         // Mettre à jour l'ID du dernier message connu même si pas de notif (pour la prochaine vérification)
         if (newMessages.length > 0) {
            previousLatestMessageId.current = newMessages[newMessages.length - 1].id;
        }


      } else {
        if (isInitialLoad) setFetchError(response.data.message || 'Erreur récupération.');
        else if (!isPolling) setError('Erreur chargement.');
      }
    } catch (err: any) {
      console.error(`Erreur fetchMessages (Offset: ${currentOffset}, Polling: ${isPolling}):`, err);
       if (isInitialLoad) setFetchError(err.response?.data?.message || 'Erreur réseau.');
       else if (!isPolling) setError('Erreur réseau chargement.');
       // Ignorer les erreurs de polling silencieusement dans la console
       if (isPolling) console.warn('[Polling] Fetch/Network error ignored.');
    } finally {
      if (isInitialLoad) setLoadingInitial(false);
      if (!isPolling) setLoadingMore(false);
    }
  }, [limit]); // Dépendances pour useCallback

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchMessages(offset, false, false); // offset actuel, pas initial, pas polling
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    setSending(true);
    setError(null);
    try {
      const response = await axios.post(API_ROUTES.user.sendMessage, { content: newMessage.trim() });
      if (response.data.success) {
        setNewMessage('');
        // Recharger la première page après envoi
        setMessages([]); // Vider pour forcer le re-render avec scroll
        setOffset(0);
        setHasMore(true);
        await fetchMessages(0, true, false); // Recharger page 0, considérer comme chargement initial pour scroll
      } else {
        setError(response.data.message || "Erreur envoi.");
      }
    } catch (err: any) {
      console.error('Erreur envoi message :', err);
      setError(err.response?.data?.message || 'Erreur réseau envoi.');
    } finally {
      setSending(false);
    }
  };

  // ✨ useEffect pour marquer les messages comme lus à l'ouverture
  useEffect(() => {
    const markAsRead = async () => {
      try {
        // TODO: Vérifier la méthode HTTP (PUT ou POST) attendue par le backend
        await axios.put(API_ROUTES.user.markUserMessagesAsRead); // ou .post si nécessaire
        console.log("Messages utilisateur marqués comme lus.");
        // Mettre à jour le compteur dans le contexte global
        setUnreadCount(0);
      } catch (error) {
        console.error("Erreur lors du marquage des messages comme lus:", error);
        // Optionnel : Gérer l'erreur (ex: afficher un message discret)
        // Ne pas remettre le compteur à 0 si l'appel échoue ? Ou le faire quand même pour l'UI ?
        // Pour l'instant, on met à jour l'UI même si l'API échoue pour éviter confusion
         setUnreadCount(0);
      }
    };

    markAsRead();
    // Ce useEffect ne dépend que de setUnreadCount (qui est stable via useContext)
    // et s'exécute une seule fois au montage du composant Messages.
  }, [setUnreadCount]);

  // useEffect pour chargement initial
  useEffect(() => {
     setMessages([]);
     setOffset(0);
     setHasMore(true);
     setError(null);
     setFetchError(null);
     previousLatestMessageId.current = null; // Réinitialiser
     fetchMessages(0, true, false); // Page 0, initial, pas polling
  }, [fetchMessages]); // Depend de fetchMessages car useCallback

  // useEffect pour Polling (récupère seulement la page 0)
  useEffect(() => {
    console.log('[Polling] Setting up interval...');
    const intervalId = setInterval(() => {
      console.log('[Polling] Interval triggered: fetching latest messages (page 0)...');
      // Ne fetch que la première page (offset 0) pour détecter les nouveaux messages
      fetchMessages(0, false, true); 
    }, 10000);

    return () => {
      console.log('[Polling] Clearing interval.');
      clearInterval(intervalId);
    };
  }, [fetchMessages]); // Depend de fetchMessages car useCallback

  // Handler pour fermer le Snackbar
  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowNewMessageSnackbar(false);
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 }, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)' /* Ajuster selon hauteur Navbar */ }}>
      <Typography variant="h5" sx={{ mb: 2, color: '#2E5735' }}>Messagerie Interne</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Échangez directement avec un administrateur ODIA. Votre historique de conversation est conservé ici.
      </Typography>

      {fetchError && <Alert severity="error" sx={{ mb: 2 }}>{fetchError}</Alert>}

      <Paper sx={{ flexGrow: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', mb: 2, p: 1, bgcolor: 'grey.50' }}>
        <Box ref={chatContainerRef} sx={{ flexGrow: 1, overflowY: 'auto', p: 1 }}>
          {hasMore && !loadingInitial && (
            <Box sx={{ textAlign: 'center', my: 1 }}>
              <Button onClick={handleLoadMore} disabled={loadingMore} size="small">
                {loadingMore ? <CircularProgress size={20} /> : "Charger les messages précédents"}
              </Button>
            </Box>
          )}
          <List>
            {loadingInitial && messages.length === 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}><CircularProgress /></Box>
            )}
            {!loadingInitial && messages.length === 0 && !hasMore && (
              <ListItem>
                <ListItemText primary="Commencez la conversation en envoyant un message à l'administrateur." sx={{ textAlign: 'center', color: 'text.secondary' }} />
              </ListItem>
            )}
            {messages.map((msg) => (
              <ListItem 
                key={msg.id} 
                sx={{ 
                  display: 'flex', 
                  justifyContent: !msg.is_admin ? 'flex-end' : 'flex-start',
                  mb: 1, 
                  px: 0,
                  alignItems: 'flex-start' 
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', maxWidth: '75%', flexDirection: !msg.is_admin ? 'row-reverse' : 'row' }}>
                  <Avatar sx={{ bgcolor: msg.is_admin ? 'secondary.main' : 'primary.main', mx: 1, width: 32, height: 32 }}>
                    {msg.is_admin ? <SupervisorAccountIcon fontSize='small' /> : <AccountCircleIcon fontSize='small' />}
                  </Avatar>
                  <Paper 
                    elevation={1} 
                    sx={{ 
                      p: 1, 
                      borderRadius: '10px', 
                      bgcolor: msg.is_admin ? '#f0f0f0' : 'primary.lighter',
                      wordBreak: 'break-word',
                    }}
                  >
                    <ListItemText
                      primary={msg.content}
                      secondary={`${msg.is_admin ? 'Conseiller ODIA' : 'Vous'} - ${formatMessageDate(msg.created_at)}`}
                      secondaryTypographyProps={{ 
                        textAlign: msg.is_admin ? 'left' : 'right', 
                        fontSize: '0.7rem', 
                        mt: 0.5,
                        color: 'text.secondary' 
                      }}
                    />
                  </Paper>
                </Box>
              </ListItem>
            ))}
            <div ref={messagesEndRef} />
          </List>
        </Box>
      </Paper>

      <Paper sx={{ p: { xs: 1, sm: 2 }, mt: 'auto', flexShrink: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            fullWidth
            label="Écrire un message à l'administrateur..."
            multiline
            maxRows={4}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            variant="outlined"
            size="small"
            disabled={sending || loadingInitial}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <Button
            variant="contained"
            onClick={sendMessage}
            disabled={sending || loadingInitial || !newMessage.trim()}
            sx={{ ml: 1, minWidth: 'auto', p: 1 }}
            aria-label="Envoyer le message"
            endIcon={sending ? <CircularProgress size={20} color="inherit"/> : <SendIcon />}
          >
            {!sending && "Envoyer"}
          </Button>
        </Box>
        {error && <Alert severity="error" sx={{ mt: 1, fontSize: '0.8rem', p: '2px 8px' }}>{error}</Alert>}
      </Paper>

      <Snackbar
        open={showNewMessageSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message="Nouveau message de l'administrateur !"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center',
        mt: { xs: 2, sm: 3 },
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
};

export default Messages;