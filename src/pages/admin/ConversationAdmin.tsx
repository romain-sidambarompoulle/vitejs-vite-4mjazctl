import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Paper, List, ListItem, ListItemText, CircularProgress, Alert, Divider, Avatar, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // Icône pour l'utilisateur
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount'; // Icône pour l'admin
import axios from '../../config/axios';
import { API_ROUTES } from '../../config/api';

// Importer les fonctions nécessaires de date-fns et la locale française
import { format, formatDistanceToNowStrict, isToday, isYesterday, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { UserContext } from '../../contexts/UserContext'; // ✨ Importer le contexte

interface Message {
  id: number;
  content: string;
  sender_id: number;
  receiver_id: number;
  is_admin: boolean; // VRAI si envoyé par l'admin, FAUX si par l'utilisateur
  created_at: string; // Format ISO attendu : '2023-10-27T10:30:00.000Z'
}

// Il serait bien d'avoir aussi les infos de l'utilisateur
interface UserInfo {
    nom: string;
    prenom: string;
    email: string;
}

// == Début de la fonction utilitaire de formatage de date ==
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
      // 'addSuffix: true' ajoute "il y a" ou "dans"
      // 'unit' peut être 'minute', 'second', etc. 'auto' est souvent suffisant
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
    // Retourner la date brute ou une chaîne d'erreur en cas de problème
    return dateString; 
  }
};
// == Fin de la fonction utilitaire ==

const ConversationAdmin: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  // ✨ Récupérer setUnreadCount depuis le contexte
  const { setUnreadCount } = useContext(UserContext);

  // États pour la pagination
  const [messages, setMessages] = useState<Message[]>([]);
  const [offset, setOffset] = useState(0); // Nombre de messages déjà chargés
  const [limit] = useState(20); // Nombre de messages à charger par page
  const [totalMessages, setTotalMessages] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Autres états
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null); // Erreur d'envoi
  const [fetchError, setFetchError] = useState<string | null>(null); // Erreur de fetch initial

  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const chatContainerRef = useRef<null | HTMLDivElement>(null); // Ref pour le conteneur de chat
  const previousScrollHeight = useRef<number>(0); // Pour garder la position du scroll

  const numericUserId = Number(userId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" }); // Auto pour l'initialisation
  };

  // Fonction fetchConversation modifiée pour la pagination
  const fetchConversation = useCallback(async (currentOffset: number, isInitialLoad = false) => {
    if (isNaN(numericUserId)) {
      if (isInitialLoad) setFetchError("ID utilisateur invalide.");
      setLoadingInitial(false);
      setLoadingMore(false);
      return;
    }

    if (isInitialLoad) {
      setLoadingInitial(true);
      setFetchError(null);
    } else {
      setLoadingMore(true);
    }

    // Sauvegarder la hauteur de scroll actuelle avant de charger plus
    if (!isInitialLoad && chatContainerRef.current) {
        previousScrollHeight.current = chatContainerRef.current.scrollHeight;
    }


    try {
      // Appel API avec limit et offset
      const response = await axios.get(API_ROUTES.admin.getConversation(numericUserId), {
        params: { limit, offset: currentOffset }
      });

      if (response.data.success) {
        const fetchedMessages = response.data.messages as Message[];
        const total = response.data.totalMessages as number;
        const userInfoData = response.data.userInfo as UserInfo | null;

        // Inverser les messages reçus (ils arrivent DESC) pour les afficher ASC
        const newMessages = fetchedMessages.reverse();

        setMessages(prevMessages =>
          isInitialLoad ? newMessages : [...newMessages, ...prevMessages] // Préfixer les anciens messages
        );

        setOffset(currentOffset + fetchedMessages.length);
        setTotalMessages(total);
        setHasMore(currentOffset + fetchedMessages.length < total);

        if (isInitialLoad) {
          setUserInfo(userInfoData);
          // Scroll vers le bas seulement au chargement initial
          setTimeout(scrollToBottom, 150); // Donner le temps au DOM de se mettre à jour
        } else if (chatContainerRef.current) {
            // Tenter de maintenir la position du scroll après chargement
            const newScrollHeight = chatContainerRef.current.scrollHeight;
            chatContainerRef.current.scrollTop = newScrollHeight - previousScrollHeight.current;
        }

      } else {
        if (isInitialLoad) setFetchError(response.data.message || 'Erreur lors de la récupération.');
        else setError('Erreur lors du chargement de plus de messages.'); // Erreur pour "load more"
      }
    } catch (err: any) {
      console.error(`Erreur récupération conversation (Offset: ${currentOffset}):`, err);
      if (isInitialLoad) setFetchError(err.response?.data?.message || 'Erreur réseau.');
      else setError('Erreur réseau lors du chargement.');
    } finally {
      if (isInitialLoad) setLoadingInitial(false);
      setLoadingMore(false);
    }
  }, [numericUserId, limit]); // Dépendances de la fonction

  // Fonction pour charger plus de messages
  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchConversation(offset, false); // Charger la page suivante (offset actuel)
    }
  };

  // Fonction d'envoi de message (recharge la première page après envoi)
  const sendMessage = async () => {
    if (!newMessage.trim() || isNaN(numericUserId)) return;
    setSending(true);
    setError(null);
    try {
      const response = await axios.post(API_ROUTES.admin.sendMessageToUser(numericUserId), { content: newMessage.trim() });
      if (response.data.success) {
        setNewMessage('');
        // Recharger la première page pour voir le nouveau message et màj le total/hasMore
        setMessages([]); // Vider pour forcer le re-render complet avec scroll en bas
        setOffset(0);
        setHasMore(true);
        await fetchConversation(0, true); // Recharger la première page
      } else {
        setError(response.data.message || "Erreur lors de l'envoi.");
      }
    } catch (err: any) {
      console.error('Erreur envoi message admin:', err);
      setError(err.response?.data?.message || 'Erreur réseau.');
    } finally {
      setSending(false);
    }
  };

  // ✨ useEffect pour marquer les messages comme lus à l'ouverture/changement d'ID
  useEffect(() => {
    if (isNaN(numericUserId)) return; // Ne rien faire si l'ID n'est pas valide

    const markAsRead = async () => {
      try {
        // TODO: Vérifier la méthode HTTP (PUT ou POST) attendue par le backend
        await axios.put(API_ROUTES.admin.markAdminMessagesAsRead(numericUserId)); // ou .post
        console.log(`Messages admin pour user ${numericUserId} marqués comme lus.`);
        // Mettre à jour le compteur global. Note : Ceci affecte TOUS les badges admin,
        // ce qui est généralement OK car l'admin voit une conv à la fois.
        // Si le backend pouvait renvoyer le nouveau total après mark-read, ce serait plus précis.
        // Pour l'instant, on assume que lire une conversation remet le compteur *total* à 0 pour l'admin.
        // Si ce n'est pas le cas, il faudrait re-fetcher le count total après le mark-read.
        setUnreadCount(0); // Simplification: On met à 0, même si d'autres users ont des messages non lus.
      } catch (error) {
        console.error(`Erreur lors du marquage des messages admin pour user ${numericUserId} comme lus:`, error);
        // Ici aussi, on met à jour l'UI pour la cohérence immédiate
         setUnreadCount(0);
      }
    };

    markAsRead();
    // Dépend de l'ID utilisateur et de la fonction (stable) du contexte
  }, [userId, numericUserId, setUnreadCount]);

  // useEffect pour le chargement initial
  useEffect(() => {
    // Réinitialiser l'état si l'ID change
    setMessages([]);
    setOffset(0);
    setHasMore(true);
    setUserInfo(null);
    setError(null);
    setFetchError(null);
    fetchConversation(0, true); // Charger la première page
  }, [userId, fetchConversation]); // Dépendre de fetchConversation car elle est définie avec useCallback

  // Le polling n'est plus nécessaire avec la pagination manuelle et l'actualisation après envoi
  // Si vous voulez garder un polling léger (ex: toutes les 30s) pour vérifier SEULEMENT
  // s'il y a de NOUVEAUX messages depuis le dernier affiché, c'est possible mais plus complexe.
  // Pour l'instant, on retire le polling par intervalle.

  // useEffect pour le scroll (ne s'active que si on est déjà en bas, ou au chargement initial)
  // Le scroll manuel est géré par handleLoadMore pour la position
  // useEffect(() => {
  //    setTimeout(scrollToBottom, 100); // Garder pour le chargement initial et après envoi
  // }, [messages]); // Potentiellement trop agressif si on charge des anciens messages


  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 }, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px - 48px)' /* Ajuster */ }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={() => navigate('/admin/messages-users')} sx={{ mr: 1 }} aria-label="Retour à la liste">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" sx={{ color: 'primary.main' }}>
          Conversation avec {loadingInitial ? '...' : (userInfo ? `${userInfo.prenom} ${userInfo.nom}` : `Utilisateur #${userId}`)}
        </Typography>
      </Box>
      {userInfo && !loadingInitial && <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>{userInfo.email}</Typography>}


      {/* ... Indicateur de chargement initial ... */}
      {loadingInitial && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {/* ... Affichage Erreur Fetch ... */}
      {fetchError && !loadingInitial && <Alert severity="error" sx={{ mb: 2 }}>{fetchError}</Alert>}

      {/* Zone d'affichage des messages */}
      {!loadingInitial && !fetchError && (
        <Paper sx={{ flexGrow: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', mb: 2, p: 1, bgcolor: 'grey.50' }}>
           {/* Conteneur scrollable avec ref */}
          <Box ref={chatContainerRef} sx={{ flexGrow: 1, overflowY: 'auto', p: { xs: 0.5, sm: 1 } }}>
            {/* Bouton Charger plus en haut */}
            {hasMore && (
                <Box sx={{ textAlign: 'center', my: 1 }}>
                    <Button onClick={handleLoadMore} disabled={loadingMore} size="small">
                        {loadingMore ? <CircularProgress size={20} /> : "Charger les messages précédents"}
                    </Button>
                </Box>
            )}
            <List>
              {messages.length === 0 && !hasMore && ( // Afficher seulement si pas plus de messages à charger
                <ListItem>
                  <ListItemText primary="Aucun message dans cette conversation." sx={{ textAlign: 'center', color: 'text.secondary' }} />
                </ListItem>
              )}
              {messages.map((msg) => (
                <ListItem
                  key={msg.id}
                  sx={{
                    display: 'flex',
                    justifyContent: msg.is_admin ? 'flex-end' : 'flex-start',
                    mb: 1,
                    px: 0,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', maxWidth: '75%', flexDirection: msg.is_admin ? 'row-reverse' : 'row' }}>
                     <Avatar sx={{ bgcolor: msg.is_admin ? 'primary.main' : 'secondary.main', mx: 1, width: 32, height: 32 }}>
                        {msg.is_admin ? <SupervisorAccountIcon fontSize='small' /> : <AccountCircleIcon fontSize='small' />}
                     </Avatar>
                     <Paper
                        elevation={1}
                        sx={{
                          p: 1,
                          borderRadius: '10px',
                          bgcolor: msg.is_admin ? 'primary.lighter' : '#e0e0e0',
                          wordBreak: 'break-word',
                        }}
                      >
                        <ListItemText
                          primary={msg.content}
                          secondary={`${msg.is_admin ? 'Vous' : (userInfo ? `${userInfo.prenom}` : 'User')} - ${formatMessageDate(msg.created_at)}`}
                          secondaryTypographyProps={{
                              textAlign: msg.is_admin ? 'right' : 'left',
                              fontSize: '0.7rem',
                              mt: 0.5,
                              color: 'text.secondary'
                          }}
                        />
                      </Paper>
                  </Box>
                </ListItem>
              ))}
              {/* Élément pour le scroll vers le bas */}
              <div ref={messagesEndRef} />
            </List>
          </Box>
        </Paper>
      )}

      {/* Zone de saisie et d'envoi */}
      {!loadingInitial && !fetchError && (
        <Paper sx={{ p: { xs: 1, sm: 2 }, mt: 'auto', flexShrink: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              fullWidth
              label="Répondre..."
              multiline
              maxRows={4}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              variant="outlined"
              size="small"
              disabled={sending}
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
              disabled={sending || !newMessage.trim()}
              sx={{ ml: 1, minWidth: 'auto', p: 1 }}
              aria-label="Envoyer la réponse"
              endIcon={sending ? <CircularProgress size={20} color="inherit"/> : <SendIcon />}
            >
              {!sending && "Envoyer"}
            </Button>
          </Box>
           {error && <Alert severity="error" sx={{ mt: 1, fontSize: '0.8rem', p: '2px 8px' }}>{error}</Alert>}
        </Paper>
      )}
    </Box>
  );
};

export default ConversationAdmin;