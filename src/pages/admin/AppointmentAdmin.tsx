import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Tabs, Tab, Button, Dialog, DialogActions, DialogContent, 
         DialogTitle, FormControl, InputLabel, Select, MenuItem, 
         Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
         IconButton, CircularProgress, Snackbar, Alert, Checkbox, FormControlLabel } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, VisibilityOff, CheckCircle as CheckCircleIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from 'date-fns/locale/fr';
import axios from '../../config/axios';
import { API_ROUTES } from '../../config/api';

// Interfaces
interface TimeSlot {
  id: number;
  start_datetime: string;
  end_datetime: string;
  status: string;
  type: string | null;
}

interface Appointment {
  id: number;
  user_id: number;
  time_slot_id: number;
  type: string;
  status: string;
  created_at: string;
  updated_at: string;
  nom: string;
  prenom: string;
  email: string;
  start_datetime: string;
  end_datetime: string;
}

const AppointmentAdmin = () => {
  const [tabValue, setTabValue] = useState(0);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // États pour le dialogue de création/édition
  const [dialog, setDialog] = useState({
    open: false,
    type: 'create',
    timeSlot: null as TimeSlot | null,
    loading: false
  });
  
  // États pour les champs du formulaire
  const [formData, setFormData] = useState({
    start_datetime: new Date(),
    end_datetime: new Date(new Date().getTime() + 30 * 60000), // +30 minutes
    status: 'available',
    type: '',
    repeatCount: 1 // Nouveau champ pour le nombre de répétitions
  });
  
  // État pour les notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info' as 'success' | 'error' | 'info' | 'warning'
  });
  
  // État pour les événements du calendrier
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  
  // Ajouter un nouvel état pour le dialogue de récurrence
  const [recurrenceDialog, setRecurrenceDialog] = useState({
    open: false,
    loading: false
  });
  
  // Ajouter un état pour les paramètres de récurrence
  const [recurrenceParams, setRecurrenceParams] = useState({
    daysOfWeek: [1], // 0 = dimanche, 1 = lundi, etc.
    startDate: new Date(),
    startTime: '08:00',
    endTime: '12:00',
    slotDuration: 60, // en minutes
    weeks: 1, // nombre de semaines
    type: '',
    status: 'available'
  });
  
  // Ajouter un nouvel état pour le dialogue de confirmation de suppression
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    timeSlot: null as TimeSlot | null,
    loading: false
  });
  
  // Ajouter un nouvel état pour les créneaux sélectionnés
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<number[]>([]);
  
  // Ajouter un nouvel état pour le dialogue de confirmation d'annulation de rendez-vous
  const [cancelAppointmentDialog, setCancelAppointmentDialog] = useState({
    open: false,
    appointment: null as Appointment | null,
    loading: false
  });
  
  // Ajouter un état pour les rendez-vous sélectionnés
  const [selectedAppointments, setSelectedAppointments] = useState<number[]>([]);
  
  // Ajouter un état pour contrôler l'affichage des rendez-vous annulés
  const [showCanceled, setShowCanceled] = useState(false);
  
  useEffect(() => {
    // Charger les créneaux horaires pour les onglets 0 et 2 (liste et calendrier)
    if (tabValue === 0 || tabValue === 2) {
      fetchTimeSlots();
    } 
    // Charger les rendez-vous uniquement pour l'onglet 1
    else if (tabValue === 1) {
      fetchAppointments();
    }
  }, [tabValue]);
  
  useEffect(() => {
    if (timeSlots.length > 0) {
      const events = timeSlots.map(slot => {
        // Conversion explicite des chaînes ISO en objets Date puis formatage correct
        const startDate = new Date(slot.start_datetime);
        const endDate = new Date(slot.end_datetime);
        
        return {
          id: `slot-${slot.id}`,
          title: slot.type 
            ? `${slot.status === 'available' ? 'Disponible' : 'Réservé'} - ${slot.type}` 
            : `${slot.status === 'available' ? 'Disponible' : 'Réservé'}`,
          start: startDate.toISOString(), // Format ISO explicite
          end: endDate.toISOString(),     // Format ISO explicite
          backgroundColor: slot.status === 'available' ? '#4caf50' : '#f44336',
          borderColor: slot.status === 'available' ? '#2e7d32' : '#d32f2f',
          extendedProps: {
            type: slot.type,
            status: slot.status,
            id: slot.id
          }
        };
      });
      
      setCalendarEvents(events);
    }
  }, [timeSlots]);
  
  const fetchTimeSlots = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ROUTES.timeSlots.base);
      
      if (response.data.success) {
        // Ajouter un log pour voir les dates reçues
        const slots = response.data.timeSlots;
        console.log('Créneaux récupérés du serveur:', slots.map((slot: TimeSlot) => ({
          id: slot.id,
          start_iso: slot.start_datetime,
          start_local: new Date(slot.start_datetime).toString(),
          start_hours: new Date(slot.start_datetime).getHours()
        })));
        
        setTimeSlots(response.data.timeSlots);
      } else {
        throw new Error(response.data.message || 'Erreur lors de la récupération des créneaux');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError('Impossible de charger les créneaux. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ROUTES.rdv.getAll);
      
      if (response.data.success) {
        setAppointments(response.data.appointments);
      } else {
        throw new Error(response.data.message || 'Erreur lors de la récupération des rendez-vous');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError('Impossible de charger les rendez-vous. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const handleOpenDialog = (type: 'create' | 'edit', timeSlot: TimeSlot | null = null) => {
    if (type === 'edit' && timeSlot) {
      setFormData({
        start_datetime: new Date(timeSlot.start_datetime),
        end_datetime: new Date(timeSlot.end_datetime),
        status: timeSlot.status,
        type: timeSlot.type || '',
        repeatCount: 1 // Réinitialiser le champ repeatCount
      });
    } else {
      // Réinitialiser pour la création
      const now = new Date();
      const later = new Date(now.getTime() + 30 * 60000);
      
      setFormData({
        start_datetime: now,
        end_datetime: later,
        status: 'available',
        type: '',
        repeatCount: 1 // Réinitialiser le champ repeatCount
      });
    }
    
    setDialog({
      open: true,
      type,
      timeSlot,
      loading: false
    });
  };
  
  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSubmit = async () => {
    try {
      setDialog(prev => ({ ...prev, loading: true }));
      
      // Déterminer combien de créneaux à créer
      const count = formData.repeatCount || 1;
      let successCount = 0;
      let errorOccurred = false;
      
      // Récupérer les détails du premier créneau
      const baseStart = new Date(formData.start_datetime);
      const baseEnd = new Date(formData.end_datetime);
      const durationMs = baseEnd.getTime() - baseStart.getTime();
      
      // Créer chaque créneau
      for (let i = 0; i < count; i++) {
        // Calculer les heures de début et de fin pour ce créneau
        const startTime = new Date(baseStart.getTime() + i * 60 * 60 * 1000); // +1h pour chaque itération
        const endTime = new Date(startTime.getTime() + durationMs);
        
        // Ajouter 4 heures pour compenser le décalage UTC
        const adjustedStartTime = new Date(startTime.getTime() + 4 * 60 * 60 * 1000);
        const adjustedEndTime = new Date(endTime.getTime() + 4 * 60 * 60 * 1000);
        
        const payload = {
          start_datetime: adjustedStartTime.toISOString(),
          end_datetime: adjustedEndTime.toISOString(),
          status: formData.status,
          type: formData.type || null
        };
        
        try {
          let response;
          
          if (dialog.type === 'create') {
            response = await axios.post(API_ROUTES.timeSlots.create, payload);
          } else {
            // Pour la modification, on ne modifie que le premier créneau
            response = await axios.put(
              API_ROUTES.timeSlots.update(dialog.timeSlot?.id || 0), 
              payload
            );
            break; // Sortir de la boucle après la modification
          }
          
          if (response.data.success) {
            successCount++;
          } else {
            errorOccurred = true;
          }
        } catch (error) {
          console.error('Erreur:', error);
          errorOccurred = true;
        }
      }
      
      // Déterminer le message de notification approprié
      let message = '';
      let severity: 'success' | 'error' | 'warning' = 'success';
      
      if (dialog.type === 'create') {
        if (successCount === count) {
          message = count > 1 
            ? `${count} créneaux créés avec succès !` 
            : 'Créneau créé avec succès !';
        } else if (successCount > 0) {
          message = `${successCount} sur ${count} créneaux ont été créés.`;
          severity = 'warning';
        } else {
          message = 'Erreur lors de la création des créneaux.';
          severity = 'error';
        }
      } else {
        message = errorOccurred 
          ? 'Erreur lors de la modification du créneau.' 
          : 'Créneau modifié avec succès !';
        severity = errorOccurred ? 'error' : 'success';
      }
      
      setSnackbar({
        open: true,
        message,
        severity
      });
      
      // Fermer le dialogue et rafraîchir les données
      setDialog({
        open: false,
        type: 'create',
        timeSlot: null,
        loading: false
      });
      
      fetchTimeSlots();
    } catch (error) {
      console.error('Erreur:', error);
      setSnackbar({
        open: true,
        message: `Erreur lors de ${dialog.type === 'create' ? 'la création' : 'la modification'} du créneau.`,
        severity: 'error'
      });
    } finally {
      setDialog(prev => ({ ...prev, loading: false }));
    }
  };
  
  // Fonction pour convertir les créneaux et rendez-vous en événements
  const handleEventClick = (info: any) => {
    // L'ID est stocké dans extendedProps.id directement, pas besoin de modifier la chaîne
    const slotId = info.event.extendedProps.id;
    const selectedSlot = timeSlots.find(slot => slot.id === slotId);
    
    if (selectedSlot) {
      // Si le créneau est disponible, ouvrir le dialogue d'édition avec option de suppression
      handleOpenDialog('edit', selectedSlot);
    }
  };
  
  // Ajouter un gestionnaire pour les sélections de plages horaires
  const handleDateSelect = (selectInfo: any) => {
    const startDate = new Date(selectInfo.start);
    const endDate = new Date(selectInfo.end);
    
    // Ajuster les minutes au créneau de 30 minutes le plus proche
    const roundToNearestHalfHour = (date: Date) => {
      const minutes = date.getMinutes();
      const roundedMinutes = Math.round(minutes / 30) * 30;
      const newDate = new Date(date);
      newDate.setMinutes(roundedMinutes === 60 ? 0 : roundedMinutes);
      if (roundedMinutes === 60) {
        newDate.setHours(newDate.getHours() + 1);
      }
      return newDate;
    };
    
    // Ouvrir le dialogue de création avec les dates pré-remplies
    setFormData({
      start_datetime: roundToNearestHalfHour(startDate),
      end_datetime: roundToNearestHalfHour(endDate),
      status: 'available',
      type: '',
      repeatCount: 1
    });
    
    // Ouvrir le dialogue en mode création
    setDialog({
      open: true,
      type: 'create',
      timeSlot: null,
      loading: false
    });
  };
  
  // Ajouter un gestionnaire de changement pour les paramètres de récurrence
  const handleRecurrenceChange = (field: string, value: any) => {
    setRecurrenceParams(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Ajouter un gestionnaire pour les jours de la semaine
  const handleDayToggle = (day: number) => {
    setRecurrenceParams(prev => {
      const daysOfWeek = [...prev.daysOfWeek];
      
      if (daysOfWeek.includes(day)) {
        // Retirer le jour s'il est déjà sélectionné
        return {
          ...prev,
          daysOfWeek: daysOfWeek.filter(d => d !== day)
        };
      } else {
        // Ajouter le jour s'il n'est pas sélectionné
        return {
          ...prev,
          daysOfWeek: [...daysOfWeek, day].sort()
        };
      }
    });
  };
  
  // Ajouter une fonction pour créer des créneaux récurrents
  const handleCreateRecurringSlots = async () => {
    try {
      setRecurrenceDialog(prev => ({ ...prev, loading: true }));
      
      const { daysOfWeek, startDate, startTime, endTime, slotDuration, weeks, type, status } = recurrenceParams;
      
      if (daysOfWeek.length === 0) {
        throw new Error('Veuillez sélectionner au moins un jour de la semaine');
      }
      
      // Convertir les heures en objets Date
      const startTimeArr = startTime.split(':').map(Number);
      const endTimeArr = endTime.split(':').map(Number);
      
      const startHour = startTimeArr[0];
      const startMinute = startTimeArr[1];
      const endHour = endTimeArr[0];
      const endMinute = endTimeArr[1];
      
      // Calculer le nombre de créneaux par jour
      const startMinutes = startHour * 60 + startMinute;
      const endMinutes = endHour * 60 + endMinute;
      const totalMinutes = endMinutes - startMinutes;
      
      if (totalMinutes <= 0) {
        throw new Error('L\'heure de fin doit être après l\'heure de début');
      }
      
      const slotsPerDay = Math.floor(totalMinutes / slotDuration);
      
      if (slotsPerDay === 0) {
        throw new Error('La plage horaire est trop courte pour créer des créneaux');
      }
      
      // Générer toutes les dates à partir des paramètres
      const allSlots = [];
      const baseDate = new Date(startDate);
      baseDate.setHours(0, 0, 0, 0); // Minuit le jour de départ
      
      // Obtenir le décalage horaire local en heures
      const timezoneOffset = -(new Date().getTimezoneOffset() / 60);
      console.log('Décalage horaire local:', timezoneOffset, 'heures');
      
      for (let week = 0; week < weeks; week++) {
        for (const dayOfWeek of daysOfWeek) {
          // Calculer la date pour ce jour de la semaine
          const currentDate = new Date(baseDate);
          currentDate.setDate(currentDate.getDate() + (dayOfWeek - currentDate.getDay() + 7) % 7 + week * 7);
          
          // Générer les créneaux pour cette journée
          for (let slot = 0; slot < slotsPerDay; slot++) {
            const slotStartMinutes = startMinutes + slot * slotDuration;
            const slotEndMinutes = slotStartMinutes + slotDuration;
            
            const slotStartHour = Math.floor(slotStartMinutes / 60);
            const slotStartMinute = slotStartMinutes % 60;
            
            const slotEndHour = Math.floor(slotEndMinutes / 60);
            const slotEndMinute = slotEndMinutes % 60;
            
            // Créer les dates avec les heures locales
            const slotStart = new Date(currentDate);
            slotStart.setHours(slotStartHour, slotStartMinute, 0, 0);
            
            const slotEnd = new Date(currentDate);
            slotEnd.setHours(slotEndHour, slotEndMinute, 0, 0);
            
            // Compenser le décalage horaire en ajoutant des heures
            // Si le décalage est de 4 heures, ajouter 4 heures aux dates
            const adjustedSlotStart = new Date(slotStart.getTime() + 4 * 60 * 60 * 1000);
            const adjustedSlotEnd = new Date(slotEnd.getTime() + 4 * 60 * 60 * 1000);
            
            allSlots.push({
              // Utiliser le format ISO qui sera converti en UTC côté serveur
              start_datetime: adjustedSlotStart.toISOString(),
              end_datetime: adjustedSlotEnd.toISOString(),
              // Ajouter des champs supplémentaires pour le débogage
              start_local: adjustedSlotStart.toString(),
              start_hours: adjustedSlotStart.getHours(),
              status: status,
              type: type || null
            });
          }
        }
      }
      
      // Créer tous les créneaux
      let successCount = 0;
      let errorOccurred = false;
      
      for (const slot of allSlots) {
        try {
          // Retirer les champs de débogage avant l'envoi
          const { start_local, start_hours, ...payloadData } = slot;
          console.log('Envoi du créneau:', {
            start_local, 
            start_hours,
            start_iso: payloadData.start_datetime
          });
          
          const response = await axios.post(API_ROUTES.timeSlots.create, payloadData);
          
          if (response.data.success) {
            successCount++;
          } else {
            errorOccurred = true;
          }
        } catch (error) {
          console.error('Erreur:', error);
          errorOccurred = true;
        }
      }
      
      // Afficher la notification appropriée
      let message = '';
      let severity: 'success' | 'error' | 'warning' = 'success';
      
      if (successCount === allSlots.length) {
        message = `${successCount} créneaux créés avec succès !`;
      } else if (successCount > 0) {
        message = `${successCount} sur ${allSlots.length} créneaux ont été créés.`;
        severity = 'warning';
      } else {
        message = 'Erreur lors de la création des créneaux.';
        severity = 'error';
      }
      
      setSnackbar({
        open: true,
        message,
        severity
      });
      
      // Fermer le dialogue et rafraîchir les données
      setRecurrenceDialog(prev => ({ ...prev, loading: false }));
      
      fetchTimeSlots();
    } catch (error: any) {
      console.error('Erreur:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Erreur lors de la création des créneaux récurrents.',
        severity: 'error'
      });
    } finally {
      setRecurrenceDialog(prev => ({ ...prev, loading: false }));
    }
  };
  
  // Ajouter une fonction pour gérer la sélection/désélection
  const handleSelectTimeSlot = (id: number) => {
    setSelectedTimeSlots(prev => {
      if (prev.includes(id)) {
        return prev.filter(slotId => slotId !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  
  // Ajouter une fonction pour tout sélectionner/désélectionner
  const handleSelectAllTimeSlots = () => {
    if (selectedTimeSlots.length === timeSlots.filter(slot => slot.status === 'available').length) {
      // Si tous sont sélectionnés, désélectionner tout
      setSelectedTimeSlots([]);
    } else {
      // Sinon, sélectionner tous les disponibles
      setSelectedTimeSlots(timeSlots.filter(slot => slot.status === 'available').map(slot => slot.id));
    }
  };
  
  // Ajouter une fonction pour supprimer plusieurs créneaux
  const handleDeleteMultipleTimeSlots = async () => {
    try {
      setDeleteDialog(prev => ({ ...prev, loading: true }));
      
      let successCount = 0;
      let errorCount = 0;
      const deletedIds: number[] = [];
      
      // Supprimer chaque créneau sélectionné
      for (const id of selectedTimeSlots) {
        try {
          const response = await axios.delete(`${API_ROUTES.timeSlots.base}/${id}`);
          
          if (response.data.success) {
            successCount++;
            deletedIds.push(id);
          } else {
            errorCount++;
          }
        } catch (error) {
          console.error('Erreur lors de la suppression:', error);
          errorCount++;
        }
      }
      
      // Mettre à jour l'état local immédiatement
      setTimeSlots(prev => prev.filter(slot => !deletedIds.includes(slot.id)));
      
      // Déterminer le message approprié
      let message = '';
      let severity: 'success' | 'error' | 'warning' = 'success';
      
      if (errorCount === 0) {
        message = `${successCount} créneau(x) supprimé(s) avec succès !`;
      } else if (successCount > 0) {
        message = `${successCount} créneau(x) supprimé(s), ${errorCount} échec(s).`;
        severity = 'warning';
      } else {
        message = 'Erreur lors de la suppression des créneaux.';
        severity = 'error';
      }
      
      setSnackbar({
        open: true,
        message,
        severity
      });
      
      // Réinitialiser l'état 
      setDeleteDialog({
        open: false,
        timeSlot: null,
        loading: false
      });
      setSelectedTimeSlots([]);
      
      // Actualiser les données complètes après un court délai
      setTimeout(() => {
        fetchTimeSlots();
      }, 300);
      
    } catch (error) {
      console.error('Erreur:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors de la suppression des créneaux.',
        severity: 'error'
      });
    } finally {
      setDeleteDialog(prev => ({ ...prev, loading: false }));
    }
  };
  
  // Ajouter une fonction pour gérer la sélection/désélection des rendez-vous
  const handleSelectAppointment = (id: number) => {
    setSelectedAppointments(prev => {
      if (prev.includes(id)) {
        return prev.filter(appId => appId !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  
  // Ajouter une fonction pour tout sélectionner/désélectionner
  const handleSelectAllAppointments = () => {
    const visibleAppointments = appointments.filter(app => showCanceled || app.status !== 'canceled');
    
    if (selectedAppointments.length === visibleAppointments.length) {
      // Si tous sont sélectionnés, désélectionner tout
      setSelectedAppointments([]);
    } else {
      // Sinon, sélectionner tous les visibles
      setSelectedAppointments(visibleAppointments.map(app => app.id));
    }
  };
  
  // Ajouter une fonction pour gérer la suppression
  const handleDeleteTimeSlot = async () => {
    try {
      setDeleteDialog(prev => ({ ...prev, loading: true }));
      
      if (!deleteDialog.timeSlot) {
        throw new Error('Aucun créneau sélectionné pour la suppression');
      }
      
      const response = await axios.delete(`${API_ROUTES.timeSlots.base}/${deleteDialog.timeSlot.id}`);
      
      if (response.data.success) {
        // Supprimer immédiatement le créneau supprimé de l'état local
        setTimeSlots(prev => prev.filter(slot => slot.id !== deleteDialog.timeSlot!.id));
        
        setSnackbar({
          open: true,
          message: 'Créneau supprimé avec succès !',
          severity: 'success'
        });
        
        // Fermer le dialogue
        setDeleteDialog({
          open: false,
          timeSlot: null,
          loading: false
        });
        
        // Actualiser les données complètes après un court délai
        setTimeout(() => {
          fetchTimeSlots();
        }, 300);
        
      } else {
        throw new Error(response.data.message || 'Erreur lors de la suppression du créneau');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors de la suppression du créneau.',
        severity: 'error'
      });
    } finally {
      setDeleteDialog(prev => ({ ...prev, loading: false }));
    }
  };
  
  // Ajouter une fonction pour ouvrir le dialogue de confirmation de suppression
  const handleOpenDeleteDialog = (timeSlot: TimeSlot) => {
    setDeleteDialog({
      open: true,
      timeSlot,
      loading: false
    });
  };
  
  // Ajouter une fonction pour annuler un rendez-vous
  const handleCancelAppointment = async () => {
    try {
      setCancelAppointmentDialog(prev => ({ ...prev, loading: true }));
      
      if (!cancelAppointmentDialog.appointment) {
        throw new Error('Aucun rendez-vous sélectionné pour l\'annulation');
      }
      
      const response = await axios.put(
        `${API_ROUTES.rdv.base}/${cancelAppointmentDialog.appointment.id}/cancel-admin`,
        {}
      );
      
      if (response.data.success) {
        // Mettre à jour l'état local immédiatement
        setAppointments(prev => 
          prev.map(app => 
            app.id === cancelAppointmentDialog.appointment!.id 
              ? { ...app, status: 'canceled' } 
              : app
          )
        );
        
        setSnackbar({
          open: true,
          message: 'Rendez-vous annulé avec succès',
          severity: 'success'
        });
        
        // Fermer le dialogue
        setCancelAppointmentDialog({
          open: false,
          appointment: null,
          loading: false
        });
        
        // Actualiser les données après un court délai
        setTimeout(() => {
          fetchAppointments();
          fetchTimeSlots(); // Rafraîchir également les créneaux qui sont maintenant disponibles
        }, 300);
      } else {
        throw new Error(response.data.message || 'Erreur lors de l\'annulation du rendez-vous');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors de l\'annulation du rendez-vous',
        severity: 'error'
      });
    } finally {
      setCancelAppointmentDialog(prev => ({ ...prev, loading: false }));
    }
  };
  
  if (loading && !timeSlots.length && !appointments.length) {
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
      </Box>
    );
  }
  
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, color: '#3F51B5', fontWeight: 600 }}>
        Gestion des Rendez-vous
      </Typography>
      
      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Créneaux horaires" />
        <Tab label="Rendez-vous réservés" />
        <Tab label="Vue calendrier" />
      </Tabs>
      
      {tabValue === 0 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Créneaux horaires disponibles</Typography>
            <Box>
              {selectedTimeSlots.length > 0 && (
                <Button 
                  variant="contained" 
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => {
                    setDeleteDialog({
                      open: true,
                      timeSlot: null,
                      loading: false
                    });
                  }}
                  sx={{ mr: 2 }}
                >
                  Supprimer ({selectedTimeSlots.length})
                </Button>
              )}
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog('create')}
              >
                Nouveau créneau
              </Button>
            </Box>
          </Box>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={selectedTimeSlots.length > 0 && selectedTimeSlots.length < timeSlots.filter(slot => slot.status === 'available').length}
                      checked={selectedTimeSlots.length > 0 && selectedTimeSlots.length === timeSlots.filter(slot => slot.status === 'available').length}
                      onChange={handleSelectAllTimeSlots}
                    />
                  </TableCell>
                  <TableCell>Date de début</TableCell>
                  <TableCell>Date de fin</TableCell>
                  <TableCell>Statut</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {timeSlots.map((slot) => (
                  <TableRow key={slot.id}>
                    <TableCell padding="checkbox">
                      {slot.status === 'available' && (
                        <Checkbox
                          checked={selectedTimeSlots.includes(slot.id)}
                          onChange={() => handleSelectTimeSlot(slot.id)}
                        />
                      )}
                    </TableCell>
                    <TableCell>{new Date(slot.start_datetime).toLocaleString()}</TableCell>
                    <TableCell>{new Date(slot.end_datetime).toLocaleString()}</TableCell>
                    <TableCell>{slot.status}</TableCell>
                    <TableCell>{slot.type || '-'}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleOpenDialog('edit', slot)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => handleOpenDeleteDialog(slot)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
      
      {tabValue === 1 && (
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Rendez-vous réservés</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showCanceled}
                    onChange={e => setShowCanceled(e.target.checked)}
                  />
                }
                label="Afficher les rendez-vous annulés"
              />
              
              {selectedAppointments.length > 0 && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<VisibilityOff />}
                  onClick={() => {
                    // Masquer les rendez-vous sélectionnés en les filtrant
                    setAppointments(prev => prev.filter(app => !selectedAppointments.includes(app.id)));
                    setSelectedAppointments([]);
                    setSnackbar({
                      open: true,
                      message: `${selectedAppointments.length} rendez-vous masqués`,
                      severity: 'info'
                    });
                  }}
                  sx={{ ml: 2 }}
                >
                  Masquer sélection ({selectedAppointments.length})
                </Button>
              )}
            </Box>
          </Box>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={selectedAppointments.length > 0 && 
                        selectedAppointments.length < appointments.filter(app => showCanceled || app.status !== 'canceled').length}
                      checked={selectedAppointments.length > 0 && 
                        selectedAppointments.length === appointments.filter(app => showCanceled || app.status !== 'canceled').length}
                      onChange={handleSelectAllAppointments}
                    />
                  </TableCell>
                  <TableCell>Client</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Date et heure</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Statut</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments
                  .filter(appointment => showCanceled || appointment.status !== 'canceled')
                  .map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedAppointments.includes(appointment.id)}
                          onChange={() => handleSelectAppointment(appointment.id)}
                        />
                      </TableCell>
                      <TableCell>{`${appointment.prenom} ${appointment.nom}`}</TableCell>
                      <TableCell>{appointment.email}</TableCell>
                      <TableCell>
                        {new Date(appointment.start_datetime).toLocaleString()} - 
                        {new Date(appointment.end_datetime).toLocaleTimeString()}
                      </TableCell>
                      <TableCell>{appointment.type}</TableCell>
                      <TableCell>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          color: appointment.status === 'canceled' ? 'error.main' : 
                                 appointment.status === 'scheduled' ? 'success.main' : 'text.primary'
                        }}>
                          {appointment.status === 'canceled' ? (
                            <CancelIcon fontSize="small" sx={{ mr: 0.5 }} />
                          ) : appointment.status === 'scheduled' ? (
                            <CheckCircleIcon fontSize="small" sx={{ mr: 0.5 }} />
                          ) : null}
                          {appointment.status}
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        {appointment.status === 'scheduled' && (
                          <Button 
                            variant="contained" 
                            color="error"
                            size="small"
                            onClick={() => setCancelAppointmentDialog({
                              open: true,
                              appointment,
                              loading: false
                            })}
                          >
                            Annuler
                          </Button>
                        )}
                        {appointment.status === 'canceled' && (
                          <IconButton
                            color="default"
                            onClick={() => {
                              // Masquer ce rendez-vous
                              setAppointments(prev => prev.filter(app => app.id !== appointment.id));
                              setSnackbar({
                                open: true,
                                message: 'Rendez-vous masqué',
                                severity: 'info'
                              });
                            }}
                          >
                            <VisibilityOff />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
      
      {tabValue === 2 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Vue calendrier des créneaux</Typography>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={() => setRecurrenceDialog({ open: true, loading: false })}
            >
              Créer des créneaux récurrents
            </Button>
          </Box>
          
          <Box sx={{ height: '650px' }}>
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
              }}
              events={calendarEvents}
              eventClick={handleEventClick}
              selectable={true}
              select={handleDateSelect}
              timeZone="local"
              businessHours={{
                daysOfWeek: [1, 2, 3, 4, 5], // Lundi au vendredi
                startTime: '08:00',
                endTime: '18:00',
              }}
              slotMinTime="07:00:00"
              slotMaxTime="21:00:00"
              allDaySlot={false}
              height="650px"
              forceEventDuration={true}
              eventTimeFormat={{
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              }}
              slotEventOverlap={false}
              slotDuration="00:30:00"
              slotLabelInterval="01:00"
              expandRows={true}
              nowIndicator={true}
              snapDuration="00:30:00"
            />
          </Box>
        </Paper>
      )}
      
      {/* Dialogue de création/édition de créneau */}
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={frLocale}>
        <Dialog 
          open={dialog.open} 
          onClose={() => !dialog.loading && setDialog(prev => ({ ...prev, open: false }))}
        >
          <DialogTitle>
            {dialog.type === 'create' ? 'Créer un nouveau créneau' : 'Modifier le créneau'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ width: '500px', maxWidth: '100%', mt: 2 }}>
              <DateTimePicker
                label="Date et heure de début"
                value={formData.start_datetime}
                onChange={(newValue) => handleFormChange('start_datetime', newValue)}
                sx={{ display: 'block', mb: 3, width: '100%' }}
              />
              
              <DateTimePicker
                label="Date et heure de fin"
                value={formData.end_datetime}
                onChange={(newValue) => handleFormChange('end_datetime', newValue)}
                sx={{ display: 'block', mb: 3, width: '100%' }}
              />
              
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Statut</InputLabel>
                <Select
                  value={formData.status}
                  label="Statut"
                  onChange={(e) => handleFormChange('status', e.target.value)}
                >
                  <MenuItem value="available">Disponible</MenuItem>
                  <MenuItem value="booked">Réservé</MenuItem>
                  <MenuItem value="closed">Fermé</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={formData.type}
                  label="Type"
                  onChange={(e) => handleFormChange('type', e.target.value)}
                >
                  <MenuItem value="">Aucun</MenuItem>
                  <MenuItem value="tel">Téléphonique</MenuItem>
                  <MenuItem value="strat">Stratégique</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth sx={{ mt: 3, mb: 3 }}>
                <InputLabel>Nombre de créneaux à créer</InputLabel>
                <Select
                  value={formData.repeatCount}
                  label="Nombre de créneaux à créer"
                  onChange={(e) => handleFormChange('repeatCount', e.target.value)}
                  disabled={dialog.type !== 'create'} // Désactiver pour l'édition
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <MenuItem key={num} value={num}>{num}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setDialog(prev => ({ ...prev, open: false }))}
              disabled={dialog.loading}
            >
              Annuler
            </Button>
            
            {/* Ajouter ce bouton de suppression pour les éditions uniquement */}
            {dialog.type === 'edit' && dialog.timeSlot && dialog.timeSlot.status === 'available' && (
              <Button 
                onClick={() => {
                  setDialog(prev => ({ ...prev, open: false }));
                  handleOpenDeleteDialog(dialog.timeSlot!);
                }}
                variant="contained" 
                color="error"
                disabled={dialog.loading}
                sx={{ mr: 'auto' }}
              >
                Supprimer
              </Button>
            )}
            
            <Button 
              onClick={handleSubmit}
              variant="contained" 
              disabled={dialog.loading}
            >
              {dialog.loading ? <CircularProgress size={24} /> : 'Enregistrer'}
            </Button>
          </DialogActions>
        </Dialog>
      </LocalizationProvider>
      
      {/* Dialogue de création de créneaux récurrents */}
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={frLocale}>
        <Dialog 
          open={recurrenceDialog.open} 
          onClose={() => !recurrenceDialog.loading && setRecurrenceDialog(prev => ({ ...prev, open: false }))}
          maxWidth="md"
        >
          <DialogTitle>Créer des créneaux récurrents</DialogTitle>
          <DialogContent>
            <Box sx={{ width: '100%', mt: 2 }}>
              {/* Sélection des jours de la semaine */}
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Jours de la semaine</Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map((day, index) => (
                  <Button 
                    key={day} 
                    variant={recurrenceParams.daysOfWeek.includes(index) ? "contained" : "outlined"}
                    onClick={() => handleDayToggle(index)}
                    sx={{ minWidth: '40px' }}
                  >
                    {day}
                  </Button>
                ))}
              </Box>
              
              {/* Date de début */}
              <DateTimePicker
                label="Date de début"
                value={recurrenceParams.startDate}
                onChange={(newValue) => handleRecurrenceChange('startDate', newValue)}
                sx={{ display: 'block', mb: 3, width: '100%' }}
              />
              
              {/* Plage horaire et durée des créneaux */}
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <FormControl sx={{ flex: 1 }}>
                  <InputLabel>Heure de début</InputLabel>
                  <Select
                    value={recurrenceParams.startTime}
                    label="Heure de début"
                    onChange={(e) => handleRecurrenceChange('startTime', e.target.value)}
                  >
                    {Array.from({ length: 24 }).map((_, h) => (
                      ['00', '30'].map(m => (
                        <MenuItem key={`${h}:${m}`} value={`${h.toString().padStart(2, '0')}:${m}`}>
                          {`${h.toString().padStart(2, '0')}:${m}`}
                        </MenuItem>
                      ))
                    ))}
                  </Select>
                </FormControl>
                
                <FormControl sx={{ flex: 1 }}>
                  <InputLabel>Heure de fin</InputLabel>
                  <Select
                    value={recurrenceParams.endTime}
                    label="Heure de fin"
                    onChange={(e) => handleRecurrenceChange('endTime', e.target.value)}
                  >
                    {Array.from({ length: 24 }).map((_, h) => (
                      ['00', '30'].map(m => (
                        <MenuItem key={`${h}:${m}`} value={`${h.toString().padStart(2, '0')}:${m}`}>
                          {`${h.toString().padStart(2, '0')}:${m}`}
                        </MenuItem>
                      ))
                    ))}
                  </Select>
                </FormControl>
                
                <FormControl sx={{ flex: 1 }}>
                  <InputLabel>Durée du créneau</InputLabel>
                  <Select
                    value={recurrenceParams.slotDuration}
                    label="Durée du créneau"
                    onChange={(e) => handleRecurrenceChange('slotDuration', e.target.value)}
                  >
                    <MenuItem value={30}>30 minutes</MenuItem>
                    <MenuItem value={60}>1 heure</MenuItem>
                    <MenuItem value={90}>1h30</MenuItem>
                    <MenuItem value={120}>2 heures</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              
              {/* Nombre de semaines */}
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Nombre de semaines</InputLabel>
                <Select
                  value={recurrenceParams.weeks}
                  label="Nombre de semaines"
                  onChange={(e) => handleRecurrenceChange('weeks', e.target.value)}
                >
                  {Array.from({ length: 12 }).map((_, i) => (
                    <MenuItem key={i + 1} value={i + 1}>{i + 1} semaine{i > 0 ? 's' : ''}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              {/* Type et statut */}
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <FormControl sx={{ flex: 1 }}>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={recurrenceParams.type}
                    label="Type"
                    onChange={(e) => handleRecurrenceChange('type', e.target.value)}
                  >
                    <MenuItem value="">Aucun</MenuItem>
                    <MenuItem value="tel">Téléphonique</MenuItem>
                    <MenuItem value="strat">Stratégique</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl sx={{ flex: 1 }}>
                  <InputLabel>Statut</InputLabel>
                  <Select
                    value={recurrenceParams.status}
                    label="Statut"
                    onChange={(e) => handleRecurrenceChange('status', e.target.value)}
                  >
                    <MenuItem value="available">Disponible</MenuItem>
                    <MenuItem value="closed">Fermé</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              
              {/* Visualisation */}
              <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1, mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Résumé</Typography>
                <Typography variant="body2">
                  {recurrenceParams.daysOfWeek.length === 0 
                    ? 'Aucun jour sélectionné' 
                    : `Créneaux ${recurrenceParams.daysOfWeek.map(d => ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'][d]).join(', ')} `}
                  de {recurrenceParams.startTime} à {recurrenceParams.endTime},
                  d'une durée de {recurrenceParams.slotDuration} minutes,
                  sur {recurrenceParams.weeks} semaine(s).
                </Typography>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setRecurrenceDialog(prev => ({ ...prev, open: false }))}
              disabled={recurrenceDialog.loading}
            >
              Annuler
            </Button>
            <Button 
              onClick={handleCreateRecurringSlots}
              variant="contained" 
              disabled={recurrenceDialog.loading}
            >
              {recurrenceDialog.loading ? <CircularProgress size={24} /> : 'Créer les créneaux'}
            </Button>
          </DialogActions>
        </Dialog>
      </LocalizationProvider>
      
      {/* Dialogue de confirmation de suppression */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => !deleteDialog.loading && setDeleteDialog(prev => ({ ...prev, open: false }))}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>
            {deleteDialog.timeSlot ? (
              <>
                Êtes-vous sûr de vouloir supprimer ce créneau?
                <Box component="span" sx={{ display: 'block', mt: 2, fontWeight: 'bold' }}>
                  {new Date(deleteDialog.timeSlot.start_datetime).toLocaleString()} - 
                  {new Date(deleteDialog.timeSlot.end_datetime).toLocaleTimeString()}
                </Box>
              </>
            ) : (
              <>
                Êtes-vous sûr de vouloir supprimer les {selectedTimeSlots.length} créneaux sélectionnés?
              </>
            )}
            Cette action est irréversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialog(prev => ({ ...prev, open: false }))}
            disabled={deleteDialog.loading}
          >
            Annuler
          </Button>
          <Button 
            onClick={deleteDialog.timeSlot ? handleDeleteTimeSlot : handleDeleteMultipleTimeSlots}
            variant="contained" 
            color="error"
            disabled={deleteDialog.loading}
          >
            {deleteDialog.loading ? <CircularProgress size={24} /> : 'Supprimer'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Dialogue de confirmation d'annulation de rendez-vous */}
      <Dialog
        open={cancelAppointmentDialog.open}
        onClose={() => !cancelAppointmentDialog.loading && setCancelAppointmentDialog(prev => ({ ...prev, open: false }))}
      >
        <DialogTitle>Confirmer l'annulation</DialogTitle>
        <DialogContent>
          <Typography>
            {cancelAppointmentDialog.appointment ? (
              <>
                Êtes-vous sûr de vouloir annuler ce rendez-vous?
                <Box component="span" sx={{ display: 'block', mt: 2, fontWeight: 'bold' }}>
                  Client: {cancelAppointmentDialog.appointment.prenom} {cancelAppointmentDialog.appointment.nom}
                  <br />
                  Date: {new Date(cancelAppointmentDialog.appointment.start_datetime).toLocaleString()} 
                </Box>
              </>
            ) : (
              'Aucun rendez-vous sélectionné'
            )}
            Cette action libérera le créneau horaire pour d'autres utilisateurs.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setCancelAppointmentDialog(prev => ({ ...prev, open: false }))}
            disabled={cancelAppointmentDialog.loading}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleCancelAppointment}
            variant="contained" 
            color="error"
            disabled={cancelAppointmentDialog.loading}
          >
            {cancelAppointmentDialog.loading ? <CircularProgress size={24} /> : 'Confirmer l\'annulation'}
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

export default AppointmentAdmin;
