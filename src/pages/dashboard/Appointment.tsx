import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, Paper, Button, Dialog, DialogActions, DialogContent, 
         DialogContentText, DialogTitle, CircularProgress, Snackbar, Alert, useMediaQuery, useTheme } from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import axios from '../../config/axios';
import { API_ROUTES } from '../../config/api';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Types
interface TimeSlot {
  id: number;
  start_datetime: string;
  end_datetime: string;
  status: string;
  type: string | null;
}

interface Event {
  id: string;
  title: string;
  start: string;
  end: string;
  extendedProps: {
    timeSlotId: number;
    type: string | null;
  };
}

interface UserAppointment {
  id: number;
  time_slot_id: number;
  user_id: number;
  type: string;
  status: string;
  created_at: string;
  updated_at: string;
  start_datetime: string;
  end_datetime: string;
}

const Appointment = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // État pour la boîte de dialogue de confirmation
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    slot: null as TimeSlot | null,
    loading: false
  });
  
  // État pour la boîte de dialogue d'annulation
  const [cancelDialog, setCancelDialog] = useState({
    open: false,
    loading: false
  });
  
  // État pour les notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info' as 'success' | 'error' | 'info' | 'warning'
  });
  
  // État pour le dernier rendez-vous confirmé (récupéré de la BD)
  const [userAppointment, setUserAppointment] = useState<UserAppointment | null>(null);
  // État pour suivre si un rendez-vous vient d'être confirmé
  const [justConfirmed, setJustConfirmed] = useState<TimeSlot | null>(null);
  
  // Ajout des états pour la responsivité
  const [calendarView, setCalendarView] = useState('');
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  // Détecter les changements de taille d'écran
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Déterminer la vue initiale en fonction de la taille d'écran
  useEffect(() => {
    if (isMobile) {
      setCalendarView('timeGridDay');
    } else if (isTablet) {
      setCalendarView('timeGridThreeDay');
    } else {
      setCalendarView('timeGridWeek');
    }
  }, [isMobile, isTablet, windowSize]);
  
  // Charger les créneaux disponibles et le dernier rendez-vous au chargement
  useEffect(() => {
    console.log("Rechargement complet des données (type ou navigation)...");
    
    // Réinitialiser les états pour éviter les données fantômes
    setUserAppointment(null);
    setJustConfirmed(null);
    
    // Rechargement complet
    const loadData = async () => {
      setLoading(true);
      try {
        await fetchUserAppointment();
        await fetchAvailableTimeSlots();
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [type, location.key]); // Ajouter location.key pour détecter les changements de navigation
  
  // Convertir les créneaux en événements pour FullCalendar
  useEffect(() => {
    if (timeSlots.length > 0) {
      const calendarEvents = timeSlots.map(slot => {
        const startDate = new Date(slot.start_datetime);
        const endDate = new Date(slot.end_datetime);
        
        return {
          id: `${slot.id}`,
          title: slot.type ? `RDV ${slot.type}` : 'RDV Disponible',
          start: startDate.toISOString(),
          end: endDate.toISOString(),
          backgroundColor: '#4caf50',
          borderColor: '#2e7d32',
          extendedProps: {
            timeSlotId: slot.id,
            type: slot.type
          }
        };
      });
      
      setEvents(calendarEvents);
    }
  }, [timeSlots]);
  
  // Fonction pour récupérer les créneaux disponibles
  const fetchAvailableTimeSlots = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ROUTES.timeSlots.getAvailable);
      
      if (response.data.success) {
        let filteredSlots = response.data.timeSlots;
        if (type && ['tel', 'strat'].includes(type)) {
          filteredSlots = filteredSlots.filter(
            (slot: TimeSlot) => !slot.type || slot.type === type
          );
        }
        
        setTimeSlots(filteredSlots);
      } else {
        throw new Error(response.data.message || 'Erreur lors de la récupération des créneaux');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError('Impossible de charger les créneaux disponibles. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };
  
  // Fonction pour récupérer le dernier rendez-vous de l'utilisateur
  const fetchUserAppointment = async () => {
    try {
      const response = await axios.get(API_ROUTES.rdv.getUserAppointments);
      
      if (response.data.success && response.data.appointments.length > 0) {
        // S'il y a des rendez-vous, filtrer par type si nécessaire
        let appointments = response.data.appointments;
        
        // Filtrer les rendez-vous actifs (non annulés)
        appointments = appointments.filter((appt: UserAppointment) => 
          appt.status !== 'canceled' && appt.status !== 'done'
        );
        
        // Si un type est spécifié, filtrer par ce type
        if (type && ['tel', 'strat'].includes(type)) {
          appointments = appointments.filter((appt: UserAppointment) => appt.type === type);
        }
        
        // Trier par date de création (le plus récent d'abord)
        appointments.sort((a: UserAppointment, b: UserAppointment) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        
        if (appointments.length > 0) {
          setUserAppointment(appointments[0]);
        } else {
          setUserAppointment(null);
        }
      } else {
        setUserAppointment(null);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du rendez-vous:', error);
      setUserAppointment(null);
    }
  };
  
  // Gérer le clic sur un événement (créneau)
  const handleEventClick = (info: any) => {
    // Si l'utilisateur a déjà un rendez-vous de ce type, ne pas permettre d'en prendre un autre
    if (userAppointment && !justConfirmed) {
      setSnackbar({
        open: true,
        message: `Vous avez déjà un rendez-vous ${type === 'tel' ? 'téléphonique' : 'stratégique'} prévu. Veuillez l'annuler avant d'en réserver un nouveau.`,
        severity: 'warning'
      });
      return;
    }
  
    const slotId = parseInt(info.event.id);
    const selectedSlot = timeSlots.find(slot => slot.id === slotId);
    
    if (selectedSlot) {
      setConfirmDialog({
        open: true,
        slot: selectedSlot,
        loading: false
      });
    }
  };
  
  // Confirmer la réservation d'un créneau
  const confirmBooking = async () => {
    if (!confirmDialog.slot) return;
    
    try {
      setConfirmDialog(prev => ({ ...prev, loading: true }));
      
      const response = await axios.post(API_ROUTES.rdv.create, {
        time_slot_id: confirmDialog.slot.id,
        type: type || confirmDialog.slot.type
      });
      
      if (response.data.success) {
        // Stocker temporairement le rendez-vous qui vient d'être confirmé
        setJustConfirmed(confirmDialog.slot);
        
        setSnackbar({
          open: true,
          message: 'Rendez-vous réservé avec succès !',
          severity: 'success'
        });
        
        // Rediriger l'utilisateur vers le tableau de bord après 2 secondes
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
        
        // Fermer la boîte de dialogue
        setConfirmDialog({
          open: false,
          slot: null,
          loading: false
        });
        
        // Actualiser les créneaux disponibles et le rendez-vous de l'utilisateur
        await fetchUserAppointment();
        await fetchAvailableTimeSlots();
      } else {
        throw new Error(response.data.message || 'Erreur lors de la réservation');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setSnackbar({
        open: true,
        message: 'Impossible de réserver ce créneau. Veuillez réessayer.',
        severity: 'error'
      });
    } finally {
      setConfirmDialog(prev => ({ ...prev, loading: false }));
    }
  };
  
  // Fonction pour annuler un rendez-vous
  const cancelAppointment = async () => {
    if (!userAppointment) return;
    
    try {
      setCancelDialog(prev => ({ ...prev, loading: true }));
      
      console.log("Annulation du RDV:", userAppointment.id);
      const cancelResponse = await axios.put(API_ROUTES.rdv.cancel(userAppointment.id));
      
      if (cancelResponse.data.success) {
        // Fermer la boîte de dialogue
        setCancelDialog({
          open: false,
          loading: false
        });
        
        // Mettre à jour localement sans recharger la page
        setUserAppointment(null);
        
        // Afficher un message de succès
        setSnackbar({
          open: true,
          message: 'Rendez-vous annulé avec succès!',
          severity: 'success'
        });
        
        // Rafraîchir les créneaux disponibles
        await fetchAvailableTimeSlots();
      } else {
        throw new Error(cancelResponse.data.message || 'Erreur lors de l\'annulation');
      }
    } catch (error) {
      console.error('Erreur lors de l\'annulation:', error);
      setSnackbar({
        open: true,
        message: 'Impossible d\'annuler ce rendez-vous. Veuillez réessayer.',
        severity: 'error'
      });
    } finally {
      setCancelDialog(prev => ({ ...prev, loading: false }));
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
        <Button 
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard')} 
          sx={{
            mt: 2,
            color: '#3F51B5',
            borderColor: '#3F51B5',
            backgroundColor: 'transparent',
            '&:hover': {
              backgroundColor: 'rgba(63, 81, 181, 0.1)',
              borderColor: '#3F51B5',
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
    );
  }
  
  // Déterminer quel rendez-vous afficher, privilégier celui qui vient d'être confirmé
  const appointmentToShow = justConfirmed || (userAppointment ? {
    id: userAppointment.time_slot_id,
    start_datetime: userAppointment.start_datetime,
    end_datetime: userAppointment.end_datetime,
    status: userAppointment.status,
    type: userAppointment.type
  } as TimeSlot : null);
  
  // Déterminer si l'utilisateur peut réserver (un seul RDV par type)
  const canBookAppointment = !userAppointment || justConfirmed;
  
  // Configuration du calendrier adaptative
  const getCalendarConfig = () => {
    // Configuration de base commune
    const config = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
      initialView: calendarView,
      events: events,
      eventClick: handleEventClick,
      locale: "fr",
      timeZone: "local",
      businessHours: false, // Désactiver les heures ouvrées
      weekends: true, // Afficher le week-end
      slotMinTime: '00:00:00', // Début à minuit
      slotMaxTime: '24:00:00', // Fin à minuit le lendemain
      allDaySlot: false,
      forceEventDuration: true,
      eventTimeFormat: {
        hour: "2-digit" as "2-digit",
        minute: "2-digit" as "2-digit",
        hour12: false
      },
      slotEventOverlap: false,
      expandRows: true,
      nowIndicator: true,
    };
    
    // Ajustements spécifiques selon la taille d'écran
    if (isMobile) {
      return {
        ...config,
        headerToolbar: {
          left: 'prev,next',
          center: 'title',
          right: 'timeGridDay,listWeek'
        },
        height: 'auto',
        slotDuration: '01:00:00',
        slotLabelInterval: '01:00',
      };
    } else if (isTablet) {
      return {
        ...config,
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'timeGridDay,listWeek,dayGridMonth'
        },
        height: 550,
        slotDuration: '00:30:00',
        slotLabelInterval: '01:00',
        views: {
          timeGridThreeDay: {
            type: 'timeGrid',
            duration: { days: 3 }
          }
        }
      };
    } else {
      return {
        ...config,
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        },
        height: 650,
        slotDuration: '00:30:00',
        slotLabelInterval: '01:00',
        snapDuration: '00:30:00'
      };
    }
  };
  
  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          {type === 'tel' ? 'Rendez-vous téléphonique' : 
           type === 'strat' ? 'Rendez-vous stratégique' : 
           'Prendre rendez-vous'}
        </Typography>
        
        {canBookAppointment ? (
          <>
            <Typography sx={{ mb: 3 }}>
              Sélectionnez un créneau disponible dans le calendrier ci-dessous pour réserver votre rendez-vous.
            </Typography>
            
            <Box sx={{ 
              width: '100%', 
              overflow: 'hidden',
              height: isMobile ? 'auto' : 'auto',
              minHeight: isMobile ? '400px' : '500px'
            }}>
              <FullCalendar
                {...getCalendarConfig()}
              />
            </Box>
          </>
        ) : (
          <Typography sx={{ mb: 3, color: 'error.main' }}>
            Vous avez déjà un rendez-vous {type === 'tel' ? 'téléphonique' : 'stratégique'} prévu. 
            Veuillez l'annuler si vous souhaitez en réserver un nouveau.
          </Typography>
        )}
      </Paper>
      
      {/* Afficher le résumé du rendez-vous s'il existe */}
      {appointmentToShow && (
        <Paper sx={{ p: 3, mb: 3, bgcolor: '#f1e1c6', borderLeft: '4px solid #4caf50' }}>
          <Typography variant="h6" sx={{ color: '#2E5735', mb: 1 }}>
            {justConfirmed ? 'Votre rendez-vous a été confirmé !' : 'Votre prochain rendez-vous'}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Date et heure:</strong> {new Date(appointmentToShow.start_datetime).toLocaleString('fr-FR')}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Durée:</strong> {
              Math.round(
                (new Date(appointmentToShow.end_datetime).getTime() - 
                new Date(appointmentToShow.start_datetime).getTime()) / 60000
              )
            } minutes
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Type:</strong> {
              appointmentToShow.type === 'tel' ? 'Rendez-vous téléphonique' : 
              appointmentToShow.type === 'strat' ? 'Rendez-vous stratégique' : 
              'Rendez-vous standard'
            }
          </Typography>
          
          {userAppointment && !justConfirmed && (
            <Button 
              variant="contained" 
              color="error" 
              onClick={() => setCancelDialog({ open: true, loading: false })}
              sx={{ mt: 1 }}
            >
              Annuler ce rendez-vous
            </Button>
          )}
          
          <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
            Ce rendez-vous est enregistré dans votre compte et accessible depuis n'importe quel appareil.
          </Typography>
        </Paper>
      )}
      
      <Button 
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/dashboard')} 
        sx={{
          mt: 2,
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
      
      {/* Boîte de dialogue de confirmation de réservation */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => !confirmDialog.loading && setConfirmDialog(prev => ({ ...prev, open: false }))}
      >
        <DialogTitle>Confirmer la réservation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Souhaitez-vous réserver ce créneau du{' '}
            {confirmDialog.slot && new Date(confirmDialog.slot.start_datetime).toLocaleString('fr-FR')} au{' '}
            {confirmDialog.slot && new Date(confirmDialog.slot.end_datetime).toLocaleString('fr-FR')} ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setConfirmDialog(prev => ({ ...prev, open: false }))}
            disabled={confirmDialog.loading}
          >
            Annuler
          </Button>
          <Button 
            onClick={confirmBooking}
            variant="contained" 
            color="primary"
            disabled={confirmDialog.loading}
          >
            {confirmDialog.loading ? <CircularProgress size={24} /> : 'Confirmer'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Boîte de dialogue de confirmation d'annulation */}
      <Dialog
        open={cancelDialog.open}
        onClose={() => !cancelDialog.loading && setCancelDialog(prev => ({ ...prev, open: false }))}
      >
        <DialogTitle>Confirmer l'annulation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir annuler votre rendez-vous prévu le{' '}
            {userAppointment && new Date(userAppointment.start_datetime).toLocaleString('fr-FR')} ?
            <br /><br />
            <strong>Attention :</strong> Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setCancelDialog(prev => ({ ...prev, open: false }))}
            disabled={cancelDialog.loading}
          >
            Revenir
          </Button>
          <Button 
            onClick={cancelAppointment}
            variant="contained" 
            color="error"
            disabled={cancelDialog.loading}
          >
            {cancelDialog.loading ? <CircularProgress size={24} /> : 'Annuler le rendez-vous'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Appointment;
