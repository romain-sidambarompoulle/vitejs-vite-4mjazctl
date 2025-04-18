import React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Grid, Button, CircularProgress,
  Tabs, Tab, Accordion, AccordionSummary, AccordionDetails,
  List, ListItem, ListItemText, Divider, LinearProgress,
  IconButton, TextField, RadioGroup, Radio, FormControlLabel, FormControl, FormLabel,
  Checkbox, Select, MenuItem, Snackbar, Alert, AlertColor,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  TableContainer, Table, TableHead, TableRow, TableBody, TableCell
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import axios from '../../config/axios';
import { API_ROUTES } from '../../config/api';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import frLocale from 'date-fns/locale/fr';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

interface UserData {
  id?: number;
  nom?: string;
  prenom?: string;
  email?: string;
  telephone?: string;
  adresse?: string;
  created_at?: string;
  formulaires?: any[];
  documents?: any[];
  rendez_vous?: any[];
  progression_profile?: number;
  progression_documents?: number;
  progression_formulaire?: number;
}

interface FormData {
  situationMatrimoniale?: string;
  impositionSeparee?: string;
  revenuConjoint?: string;
  enfantsCharge?: string;
  nombreParts?: string;
  fraisGarde?: string;
  statutActuel?: string;
  situationExercice?: string;
  montantRetrocessions?: string;
  retrocessionsAnnuelles?: string;
  chiffreAffaires?: string;
  montantURSSAF?: string;
  montantCARPIMKO?: string;
  montantImpotRevenu?: string;
  montantCFE?: string;
  montantRCP?: string;
  salaireEmploye?: string;
  materielConsommable?: string;
  loyerCabinet?: string;
  creditRachatParts?: string;
  budgetAlimentaire?: string;
  loyerOuCreditRP?: string;
  electricite?: string;
  eau?: string;
  gaz?: string;
  internetDomicile?: string;
  abonnementTelephonique?: string;
  assuranceLogement?: string;
  mutuelleSante?: string;
  vehiculeMode?: string;
  vehiculeValeur?: string;
  vehiculeEstimationValeur2025?: string;
  vehiculeCarburant?: string;
  vehiculeAssurance?: string;
  vehiculeFraisEntretien?: string;
  serviceTransport?: string;
  habillementChaussures?: string;
  abonnementLoisir?: string;
  budgetRestauration?: string;
  abonnementDivertissement?: string;
  loisirCulturel?: string;
  animauxCompagnie?: string;
  autreDepense?: string;
  questions?: string;
  consentementRGPD?: boolean;
  [key: string]: any;
}

interface Appointment {
  id: number;
  user_id: number;
  time_slot_id: number;
  type: string;
  status: string;
  created_at: string;
  updated_at: string;
  start_datetime: string;
  end_datetime: string;
}

const UserDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  
  // Nouveaux états pour l'édition du formulaire
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editSection, setEditSection] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
  }>({
    open: false,
    message: '',
    severity: 'info'
  });

  // Ajouter un état pour la boîte de dialogue de confirmation
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    formulaireId: number | null;
  }>({
    open: false,
    formulaireId: null
  });

  // Ajouter ces nouveaux états
  const [showCanceled, setShowCanceled] = useState(false);
  const [cancelDialog, setCancelDialog] = useState({
    open: false,
    appointment: null as any,
    loading: false
  });

  // ✨ NOUVEAU: États pour le dialogue de création de RDV
  const [appointmentDialog, setAppointmentDialog] = useState<{
    open: boolean;
    loading: boolean;
  }>({
    open: false,
    loading: false,
  });
  const [appointmentFormData, setAppointmentFormData] = useState<{
    type: 'tel' | 'strat' | '';
    start_datetime: Date | null;
    end_datetime: Date | null;
  }>({
    type: '',
    start_datetime: null,
    end_datetime: null
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_ROUTES.admin.users}/${userId}`);
        if (response.data.success) {
          const fetchedUserData = response.data.userData;
          if (fetchedUserData.formulaires && fetchedUserData.formulaires.length > 0) {
            fetchedUserData.formulaires.forEach((form: any) => {
              if (typeof form.donnees === 'string') {
                try {
                  form.donnees = JSON.parse(form.donnees);
                } catch (e) {
                  console.error("Erreur parsing JSON des données du formulaire:", e);
                  form.donnees = {};
                }
              } else if (form.donnees === null || typeof form.donnees !== 'object') {
                form.donnees = {};
              }
            });
          }
          setUserData(fetchedUserData);
        } else {
          setError('Erreur lors de la récupération des détails utilisateur');
        }
      } catch (error: any) {
        console.error('Erreur:', error);
        setError('Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const goBack = () => {
    navigate('/admin/users');
  };

  // Fonctions pour l'édition du formulaire
  const handleEditSection = (sectionIndex: number) => {
    const currentFormData = userData?.formulaires?.[0]?.donnees;
    if (!currentFormData || typeof currentFormData !== 'object') {
      console.error("Données du formulaire non disponibles ou invalides pour l'édition.");
      setSnackbar({ open: true, message: "Impossible de charger les données du formulaire pour l'édition.", severity: 'error' });
      return;
    }

    setFormData(currentFormData);
    setEditSection(sectionIndex);
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditSection(null);
    setFormData(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: FormData | null) => ({
      ...(prev ?? {}),
      [name]: value
    }));
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: FormData | null) => ({
      ...(prev ?? {}),
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev: FormData | null) => ({
      ...(prev ?? {}),
      [name]: checked
    }));
  };

  const handleSaveSection = async () => {
    if (!formData) {
      console.error("Aucune donnée à sauvegarder.");
      setSnackbar({ open: true, message: "Aucune donnée à sauvegarder.", severity: 'warning' });
      return;
    }

    // Récupérer l'ID utilisateur et l'ID potentiel du formulaire
    const currentUserId = Number(userId); // Assurer que userId est un nombre
    const formId = userData?.formulaires?.[0]?.id; // Peut être -1 si c'est une création

    // Vérifier si l'ID utilisateur est valide
    if (isNaN(currentUserId)) {
         console.error("ID utilisateur invalide.");
         setSnackbar({ open: true, message: "Erreur : ID utilisateur non valide.", severity: 'error' });
         return;
    }

    // Logique pour déterminer si c'est une création (POST) ou une mise à jour (PUT)
    const isCreating = formId === -1; // Utiliser l'ID temporaire -1 pour détecter la création
    const requestMethod = isCreating ? axios.post : axios.put;
    const requestUrl = isCreating
      ? API_ROUTES.admin.userFormulaire(currentUserId) // Route POST pour la création
      : API_ROUTES.admin.updateFormulaire(currentUserId, formId as number); // Route PUT pour la mise à jour

    try {
      setSaving(true);

      console.log(`Tentative de ${isCreating ? 'création' : 'modification'} du formulaire pour l'utilisateur:`, currentUserId);
      console.log('Données à envoyer:', formData);
      console.log('URL utilisée:', requestUrl);
      console.log('Méthode:', isCreating ? 'POST' : 'PUT');


      // Exécuter la requête POST ou PUT
      const response = await requestMethod(requestUrl, {
        donnees: formData
      });

      console.log('Réponse du serveur:', response.data);

      if (response.data.success) {
        // Rafraîchir les données utilisateur après succès (création ou mise à jour)
        const userResponse = await axios.get(`${API_ROUTES.admin.users}/${currentUserId}`);
        if (userResponse.data.success) {
            const updatedUserData = userResponse.data.userData;
            if (updatedUserData.formulaires && updatedUserData.formulaires.length > 0) {
                updatedUserData.formulaires.forEach((form: any) => {
                if (typeof form.donnees === 'string') {
                    try {
                    form.donnees = JSON.parse(form.donnees);
                    } catch (e) {
                    console.error("Erreur parsing JSON après sauvegarde:", e);
                    form.donnees = {};
                    }
                } else if (form.donnees === null || typeof form.donnees !== 'object') {
                    form.donnees = {};
                }
                });
            }
          setUserData(updatedUserData);
        }

        setSnackbar({
          open: true,
          message: `Formulaire ${isCreating ? 'créé' : 'modifié'} avec succès`,
          severity: 'success'
        });

        setEditMode(false);
        setEditSection(null);
        setFormData(null); // Réinitialiser après succès
      } else {
        throw new Error(response.data.message || `Erreur lors de ${isCreating ? 'la création' : 'la mise à jour'} du formulaire`);
      }
    } catch (error: any) {
      console.error(`Erreur détaillée lors de ${isCreating ? 'la création' : 'la sauvegarde'}:`, error);
      let errorMessage = error.response?.data?.message || `Erreur lors de ${isCreating ? 'la création' : 'la sauvegarde'} des modifications`;
      if (error.response?.status === 404 && !isCreating) { // Si 404 lors d'un PUT
         errorMessage = "Erreur : La route de mise à jour du formulaire n'a pas été trouvée sur le serveur (PUT /api/admin/users/:userId/formulaire/:formId). Vérifiez la configuration du backend.";
         console.error(errorMessage);
      } else if (error.response?.status === 404 && isCreating) { // Si 404 lors d'un POST
         errorMessage = "Erreur : La route de création du formulaire n'a pas été trouvée sur le serveur (POST /api/admin/users/:userId/formulaire). Vérifiez la configuration du backend.";
          console.error(errorMessage);
      }

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCreateNewForm = () => {
    console.log("🚀 Initialisation de la création d'un nouveau formulaire (Admin)");
    const initialEmptyForm: FormData = {
      situationMatrimoniale: "",
      impositionSeparee: "",
      revenuConjoint: "",
      enfantsCharge: "",
      nombreParts: "",
      fraisGarde: "",
      statutActuel: "",
      situationExercice: "",
      montantRetrocessions: "",
      retrocessionsAnnuelles: "",
      chiffreAffaires: "",
      montantURSSAF: "",
      montantCARPIMKO: "",
      montantImpotRevenu: "",
      montantCFE: "",
      montantRCP: "",
      salaireEmploye: "",
      materielConsommable: "",
      loyerCabinet: "",
      creditRachatParts: "",
      budgetAlimentaire: "",
      loyerOuCreditRP: "",
      electricite: "",
      eau: "",
      gaz: "",
      internetDomicile: "",
      abonnementTelephonique: "",
      assuranceLogement: "",
      mutuelleSante: "",
      vehiculeMode: "",
      vehiculeValeur: "",
      vehiculeEstimationValeur2025: "",
      vehiculeCarburant: "",
      vehiculeAssurance: "",
      vehiculeFraisEntretien: "",
      serviceTransport: "",
      habillementChaussures: "",
      abonnementLoisir: "",
      budgetRestauration: "",
      abonnementDivertissement: "",
      loisirCulturel: "",
      animauxCompagnie: "",
      autreDepense: "",
      questions: "",
      consentementRGPD: false,
    };
    setFormData(initialEmptyForm);

    // Simuler un formulaire avec ID temporaire dans l'état local
    setUserData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        formulaires: [
          {
            id: -1,
            type: 'situation',
            created_at: new Date().toISOString(),
            donnees: initialEmptyForm
          },
        ]
      };
    });

    // Ouvrir la première section pour édition et passer en mode édition
    setEditSection(1);
    setEditMode(true);
  };

  const renderReadOnlyField = (label: string, value: any) => (
    <Grid item xs={12} sm={6}>
      <Box>
        <Typography variant="subtitle2" color="textSecondary">{label}</Typography>
        <Typography>{String(value) || 'Non renseigné'}</Typography>
      </Box>
    </Grid>
  );

  const renderReadOnlyCheckbox = (label: string, checked: boolean | undefined) => (
    <Grid item xs={12} sm={6}>
      <Box>
        <Typography variant="subtitle2" color="textSecondary">{label}</Typography>
        <Typography>{checked ? 'Oui' : 'Non'}</Typography>
      </Box>
    </Grid>
  );

  const renderFormSection = (form: any, sectionIndex: number, title: string, 
    fields: (isEditing: boolean, data: FormData) => React.ReactNode) => {
    const isEditing = editMode && editSection === sectionIndex;
    const currentData = isEditing ? (formData || {}) : (form.donnees || {});
    
    return (
      <Accordion key={sectionIndex} defaultExpanded={isEditing}>
        <AccordionSummary 
          expandIcon={<ExpandMoreIcon />}
          sx={{ 
            '.MuiAccordionSummary-content': {
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              width: '100%',
            }
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <Typography>{title}</Typography>
            {!isEditing && (
              <Box
                component="span"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditSection(sectionIndex);
                }}
                sx={{
                  ml: 1,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  color: 'primary.main',
                  p: 0.5
                }}
                aria-label={`Modifier la section ${title}`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.stopPropagation();
                    handleEditSection(sectionIndex);
                  }
                 }}
              >
                <EditIcon fontSize="inherit" />
              </Box>
            )}
          </Box>
        </AccordionSummary>
        <AccordionDetails>
              <Grid container spacing={2}>
            {fields(isEditing, currentData)}
              </Grid>
          {isEditing && (
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button 
                  variant="outlined" 
                  startIcon={<CancelIcon />} 
                  onClick={handleCancelEdit}
                >
                  Annuler
                </Button>
                <Button 
                  variant="contained" 
                  startIcon={<SaveIcon />} 
                  onClick={handleSaveSection}
                  disabled={saving}
                >
                  {saving ? <CircularProgress size={24} /> : 'Enregistrer'}
                </Button>
              </Box>
          )}
        </AccordionDetails>
      </Accordion>
    );
  };

  const handleDeleteForm = async (formulaireId: number) => {
    setDeleteDialog({
      open: true,
      formulaireId
    });
  };

  const confirmDeleteForm = async () => {
    try {
      setSaving(true);
      if (!deleteDialog.formulaireId) return;
      
      console.log(`Tentative de suppression du formulaire ${deleteDialog.formulaireId} pour l'utilisateur:`, userId);
      
      const response = await axios.delete(API_ROUTES.admin.deleteFormulaire(Number(userId), deleteDialog.formulaireId));
      
      console.log('Réponse du serveur:', response.data);
      
      if (response.data.success) {
        setUserData(prev => {
          if (!prev) return null;
          return {
            ...prev,
            formulaires: prev.formulaires?.filter(f => f.id !== deleteDialog.formulaireId) || [],
            progression_formulaire: 0
          };
        });
        
        setSnackbar({
          open: true,
          message: "Formulaire supprimé avec succès",
          severity: 'success'
        });
      } else {
        throw new Error(response.data.message || "Erreur lors de la suppression");
      }
    } catch (error: any) {
      console.error('Erreur détaillée:', error);
      const errorMessage = error.response?.data?.message || "Erreur lors de la suppression du formulaire";
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setSaving(false);
      setDeleteDialog({
        open: false,
        formulaireId: null
      });
    }
  };

  const handleCancelAppointment = async () => {
    if (!cancelDialog.appointment) return;

    try {
      setCancelDialog(prev => ({ ...prev, loading: true }));
      
      const response = await axios.put(
        `${API_ROUTES.rdv.base}/${cancelDialog.appointment.id}/cancel-admin`,
        {}
      );
      
      if (response.data.success) {
        const userResponse = await axios.get(`${API_ROUTES.admin.users}/${userId}`);
        if (userResponse.data.success) {
          const updatedUserData = userResponse.data.userData;
          if (updatedUserData.formulaires && updatedUserData.formulaires.length > 0) {
            updatedUserData.formulaires.forEach((form: any) => {
              if (typeof form.donnees === 'string') {
                try {
                  form.donnees = JSON.parse(form.donnees);
                } catch (e) { form.donnees = {}; }
              } else if (form.donnees === null || typeof form.donnees !== 'object') {
                form.donnees = {};
              }
            });
          }
          setUserData(updatedUserData);
        }
        
        setSnackbar({
          open: true,
          message: 'Rendez-vous annulé avec succès',
          severity: 'success'
        });
        
        setCancelDialog({
          open: false,
          appointment: null,
          loading: false
        });
      } else {
        throw new Error(response.data.message || 'Erreur lors de l\'annulation du rendez-vous');
      }
    } catch (error: any) {
      console.error('Erreur:', error);
      const message = error.response?.data?.message || 'Erreur lors de l\'annulation du rendez-vous';
      setSnackbar({
        open: true,
        message: message,
        severity: 'error'
      });
    } finally {
      setCancelDialog(prev => ({ ...prev, loading: false }));
    }
  };

  // ✨ NOUVEAU: Fonction pour ouvrir le dialogue de création de RDV
  const handleOpenAppointmentDialog = () => {
    setAppointmentFormData({
      type: '',
      start_datetime: new Date(),
      end_datetime: new Date(new Date().getTime() + 30 * 60000) // +30 min par défaut
    });
    setAppointmentDialog({ open: true, loading: false });
  };

  // ✨ NOUVEAU: Fonction pour fermer le dialogue
  const handleCloseAppointmentDialog = () => {
    if (!appointmentDialog.loading) {
      setAppointmentDialog({ open: false, loading: false });
    }
  };

  // ✨ NOUVEAU: Fonction pour gérer les changements dans le formulaire de RDV
  const handleAppointmentFormChange = (field: string, value: any) => {
    setAppointmentFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // ✨ NOUVEAU: Fonction pour soumettre la création du RDV
  const handleCreateAppointment = async () => {
    if (!appointmentFormData.type || !appointmentFormData.start_datetime || !appointmentFormData.end_datetime) {
      setSnackbar({ open: true, message: 'Veuillez remplir tous les champs.', severity: 'warning' });
      return;
    }
    if (appointmentFormData.end_datetime <= appointmentFormData.start_datetime) {
        setSnackbar({ open: true, message: 'La date de fin doit être après la date de début.', severity: 'warning' });
        return;
    }

    setAppointmentDialog(prev => ({ ...prev, loading: true }));

    try {
      // ✨ Appliquer le même décalage +4h que dans AppointmentAdmin.tsx
      const baseStartDate = appointmentFormData.start_datetime!;
      const baseEndDate = appointmentFormData.end_datetime!;

      const adjustedStartDate = new Date(baseStartDate.getTime() + 4 * 60 * 60 * 1000);
      const adjustedEndDate = new Date(baseEndDate.getTime() + 4 * 60 * 60 * 1000);

      const payload = {
        user_id: Number(userId),
        type: appointmentFormData.type,
        // Utiliser les dates ajustées pour la conversion ISO
        start_datetime: adjustedStartDate.toISOString(),
        end_datetime: adjustedEndDate.toISOString(),
      };
      
      console.log('🚀 Envoi de la requête de création RDV admin (avec +4h):', payload);
      const response = await axios.post(API_ROUTES.rdv.adminCreate, payload);
      console.log('✅ Réponse serveur:', response.data);

      if (response.data.success) {
        setSnackbar({
          open: true,
          message: 'Rendez-vous planifié avec succès !',
          severity: 'success'
        });
        handleCloseAppointmentDialog();
        // Rafraîchir les données utilisateur pour voir le nouveau RDV
        const userResponse = await axios.get(`${API_ROUTES.admin.users}/${userId}`);
        if (userResponse.data.success) {
            const updatedUserData = userResponse.data.userData;
            // Retraiter les données du formulaire si elles existent
            if (updatedUserData.formulaires && updatedUserData.formulaires.length > 0) {
                updatedUserData.formulaires.forEach((form: any) => {
                if (typeof form.donnees === 'string') {
                    try { form.donnees = JSON.parse(form.donnees); } catch (e) { form.donnees = {}; }
                } else if (form.donnees === null || typeof form.donnees !== 'object') {
                    form.donnees = {};
                }
                });
            }
          setUserData(updatedUserData);
        }
      } else {
        throw new Error(response.data.message || 'Erreur lors de la planification du rendez-vous.');
      }
    } catch (error: any) {
      console.error('❌ Erreur création RDV admin:', error);
      const message = error.response?.data?.message || 'Une erreur est survenue lors de la planification.';
      setSnackbar({
        open: true,
        message: message,
        severity: 'error'
      });
    } finally {
      setAppointmentDialog(prev => ({ ...prev, loading: false }));
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', my: 4 }}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={goBack} sx={{ mt: 2 }}>
          Retour à la liste
        </Button>
      </Box>
    );
  }

  const form = userData?.formulaires?.[0];

  return (
    <Box sx={{ py: 3 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={goBack} sx={{ mb: 3 }}>
        Retour à la liste
      </Button>

      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant="h4" sx={{ color: '#3F51B5', fontWeight: 600, mb: 3 }}>
          {userData?.nom} {userData?.prenom}
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Email:</strong> {userData?.email}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Téléphone:</strong> {userData?.telephone || 'Non renseigné'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Adresse:</strong> {userData?.adresse || 'Non renseignée'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Date d'inscription:</strong> {userData?.created_at ? new Date(userData.created_at).toLocaleDateString() : 'Non disponible'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ width: '100%', mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="user data tabs">
            <Tab label="Formulaire" />
            <Tab label="Documents" />
            <Tab label="Rendez-vous" />
            <Tab label="Progression" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Formulaire de Situation</Typography>
              {!form && !editMode && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCreateNewForm}
                  sx={{ bgcolor: '#3F51B5' }}
                >
                  Créer un formulaire
                </Button>
              )}
            </Box>
            
            {form ? (
              <Box key={form.id} sx={{ mt: 2 }}>
                {form.id !== -1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography sx={{ fontWeight: 'bold' }}>
                      Soumis le: {new Date(form.created_at).toLocaleString()}
                    </Typography>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteForm(form.id)}
                      disabled={saving}
                      title="Supprimer le formulaire"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                )}
                
                {renderFormSection(form, 1, "1. Situation familiale", 
                (isEditing, data) => isEditing ? (
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <FormLabel>Situation matrimoniale</FormLabel>
                      <RadioGroup name="situationMatrimoniale" value={data.situationMatrimoniale || ''} onChange={handleChange} row>
                          <FormControlLabel value="celibataire" control={<Radio />} label="Célibataire" />
                          <FormControlLabel value="marie_pacse" control={<Radio />} label="Marié(e)/Pacsé(e)" />
                          <FormControlLabel value="divorce_separe" control={<Radio />} label="Divorcé(e)/Séparé(e)" />
                          <FormControlLabel value="concubinage" control={<Radio />} label="Concubinage" />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                ) : renderReadOnlyField("Situation matrimoniale", data.situationMatrimoniale)
              )}

                {renderFormSection(form, 2, "2. Conjoint", 
                (isEditing, data) => isEditing ? (
                    <>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <FormLabel>Imposition séparée ?</FormLabel>
                          <RadioGroup name="impositionSeparee" value={data.impositionSeparee || ''} onChange={handleChange} row>
                            <FormControlLabel value="oui" control={<Radio />} label="Oui" />
                            <FormControlLabel value="non" control={<Radio />} label="Non" />
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Revenu mensuel du conjoint" name="revenuConjoint" value={data.revenuConjoint || ''} onChange={handleChange} />
                      </Grid>
                    </>
                  ) : (
                    <>
                    {renderReadOnlyField("Imposition séparée", data.impositionSeparee)}
                    {renderReadOnlyField("Revenu conjoint", data.revenuConjoint)}
                    </>
                  )
                )}

                {renderFormSection(form, 3, "3. Enfants", 
                (isEditing, data) => isEditing ? (
                    <>
                      <Grid item xs={12}>
                        <FormControl fullWidth>
                          <FormLabel>Avez-vous des enfants à charge ?</FormLabel>
                          <RadioGroup name="enfantsCharge" value={data.enfantsCharge || ''} onChange={handleChange} row>
                            <FormControlLabel value="oui" control={<Radio />} label="Oui" />
                            <FormControlLabel value="non" control={<Radio />} label="Non" />
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Nombre de parts fiscales" name="nombreParts" value={data.nombreParts || ''} onChange={handleChange} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Frais de garde mensuels" name="fraisGarde" value={data.fraisGarde || ''} onChange={handleChange} />
                      </Grid>
                    </>
                  ) : (
                    <>
                    {renderReadOnlyField("Enfants à charge", data.enfantsCharge)}
                    {renderReadOnlyField("Nombre de parts", data.nombreParts)}
                    {renderReadOnlyField("Frais de garde", data.fraisGarde)}
                    </>
                  )
                )}

              {renderFormSection(form, 4, "4. Situation professionnelle",
                (isEditing, data) => isEditing ? (
                  <>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <FormLabel>Statut actuel</FormLabel>
                          <Select name="statutActuel" value={data.statutActuel || ''} onChange={handleSelectChange} displayEmpty>
                            <MenuItem value="" disabled>Sélectionnez...</MenuItem>
                              <MenuItem value="bnc">EI micro-BNC</MenuItem>
                              <MenuItem value="ei_ir">EI à l'IR</MenuItem>
                              <MenuItem value="ei_is">EI à l'IS</MenuItem>
                              <MenuItem value="selarl">SELARL/SELAS</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth>
                            <FormLabel>Situation d'exercice</FormLabel>
                            <RadioGroup name="situationExercice" value={data.situationExercice || ''} onChange={handleChange} row>
                              <FormControlLabel value="titulaire" control={<Radio />} label="Titulaire" />
                              <FormControlLabel value="remplacant" control={<Radio />} label="Remplaçant" />
                            <FormControlLabel value="assistant" control={<Radio />} label="Assistant/Collab" />
                            </RadioGroup>
                          </FormControl>
                        </Grid>
                      <Grid item xs={12} sm={6}><TextField fullWidth label="Rétrocessions mensuelles (Assistant/Collab)" name="montantRetrocessions" value={data.montantRetrocessions || ''} onChange={handleChange} /></Grid>
                      <Grid item xs={12} sm={6}><TextField fullWidth label="Rétrocessions mensuelles perçues (Titulaire)" name="retrocessionsAnnuelles" value={data.retrocessionsAnnuelles || ''} onChange={handleChange} /></Grid>
                      </>
                    ) : (
                      <>
                      {renderReadOnlyField("Statut actuel", data.statutActuel)}
                      {renderReadOnlyField("Situation d'exercice", data.situationExercice)}
                      {renderReadOnlyField("Rétrocessions (Assist./Collab)", data.montantRetrocessions)}
                      {renderReadOnlyField("Rétrocessions (Titulaire)", data.retrocessionsAnnuelles)}
                      </>
                    )
                  )}

                {renderFormSection(form, 5, "5. Finances professionnelles",
                  (isEditing, data) => isEditing ? (
                    <>
                      <Grid item xs={12} sm={6}><TextField fullWidth label="Chiffre d'affaires" name="chiffreAffaires" value={data.chiffreAffaires || ''} onChange={handleChange} /></Grid>
                      <Grid item xs={12} sm={6}><TextField fullWidth label="Montant URSSAF (annuel)" name="montantURSSAF" value={data.montantURSSAF || ''} onChange={handleChange} /></Grid>
                      <Grid item xs={12} sm={6}><TextField fullWidth label="Montant CARPIMKO (annuel)" name="montantCARPIMKO" value={data.montantCARPIMKO || ''} onChange={handleChange} /></Grid>
                      <Grid item xs={12} sm={6}><TextField fullWidth label="Montant Impôt sur le Revenu" name="montantImpotRevenu" value={data.montantImpotRevenu || ''} onChange={handleChange} /></Grid>
                      <Grid item xs={12} sm={6}><TextField fullWidth label="Montant CFE" name="montantCFE" value={data.montantCFE || ''} onChange={handleChange} /></Grid>
                      <Grid item xs={12} sm={6}><TextField fullWidth label="Montant RCP" name="montantRCP" value={data.montantRCP || ''} onChange={handleChange} /></Grid>
                      {data.situationExercice === 'titulaire' && (
                        <>
                          <Grid item xs={12} sm={6}><TextField fullWidth label="Salaire employé (Titulaire)" name="salaireEmploye" value={data.salaireEmploye || ''} onChange={handleChange} /></Grid>
                          <Grid item xs={12} sm={6}><TextField fullWidth label="Matériel consommable (Titulaire)" name="materielConsommable" value={data.materielConsommable || ''} onChange={handleChange} /></Grid>
                          <Grid item xs={12} sm={6}><TextField fullWidth label="Loyer cabinet (Titulaire)" name="loyerCabinet" value={data.loyerCabinet || ''} onChange={handleChange} /></Grid>
                          <Grid item xs={12} sm={6}><TextField fullWidth label="Crédit rachat parts (Titulaire)" name="creditRachatParts" value={data.creditRachatParts || ''} onChange={handleChange} /></Grid>
                        </>
                      )}
                      </>
                    ) : (
                      <>
                      {renderReadOnlyField("Chiffre d'affaires", data.chiffreAffaires)}
                      {renderReadOnlyField("Montant URSSAF", data.montantURSSAF)}
                      {renderReadOnlyField("Montant CARPIMKO", data.montantCARPIMKO)}
                      {renderReadOnlyField("Montant Impôt Revenu", data.montantImpotRevenu)}
                      {renderReadOnlyField("Montant CFE", data.montantCFE)}
                      {renderReadOnlyField("Montant RCP", data.montantRCP)}
                      {data.situationExercice === 'titulaire' && (
                        <>
                          {renderReadOnlyField("Salaire employé (Titul.)", data.salaireEmploye)}
                          {renderReadOnlyField("Matériel consommable (Titul.)", data.materielConsommable)}
                          {renderReadOnlyField("Loyer cabinet (Titul.)", data.loyerCabinet)}
                          {renderReadOnlyField("Crédit rachat parts (Titul.)", data.creditRachatParts)}
                        </>
                      )}
                      </>
                    )
                  )}

                {renderFormSection(form, 6, "6. Dépenses personnelles mensuelles",
                  (isEditing, data) => isEditing ? (
                    <>
                      <Grid item xs={12} sm={6}><TextField fullWidth label="Budget alimentaire (hors resto)" name="budgetAlimentaire" value={data.budgetAlimentaire || ''} onChange={handleChange} /></Grid>
                      <Grid item xs={12} sm={6}><TextField fullWidth label="Loyer ou Crédit RP" name="loyerOuCreditRP" value={data.loyerOuCreditRP || ''} onChange={handleChange} /></Grid>
                      <Grid item xs={12} sm={4}><TextField fullWidth label="Electricité" name="electricite" value={data.electricite || ''} onChange={handleChange} /></Grid>
                      <Grid item xs={12} sm={4}><TextField fullWidth label="Eau" name="eau" value={data.eau || ''} onChange={handleChange} /></Grid>
                      <Grid item xs={12} sm={4}><TextField fullWidth label="Gaz" name="gaz" value={data.gaz || ''} onChange={handleChange} /></Grid>
                      <Grid item xs={12} sm={6}><TextField fullWidth label="Internet Domicile" name="internetDomicile" value={data.internetDomicile || ''} onChange={handleChange} /></Grid>
                      <Grid item xs={12} sm={6}><TextField fullWidth label="Abonnement Téléphonique" name="abonnementTelephonique" value={data.abonnementTelephonique || ''} onChange={handleChange} /></Grid>
                      <Grid item xs={12} sm={6}><TextField fullWidth label="Assurance Logement" name="assuranceLogement" value={data.assuranceLogement || ''} onChange={handleChange} /></Grid>
                      <Grid item xs={12} sm={6}><TextField fullWidth label="Mutuelle Santé" name="mutuelleSante" value={data.mutuelleSante || ''} onChange={handleChange} /></Grid>

                      <Grid item xs={12}><Typography variant="subtitle1" sx={{ mt: 1 }}>Véhicule</Typography></Grid>
                        <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <FormLabel>Mode financement véhicule</FormLabel>
                          <RadioGroup name="vehiculeMode" value={data.vehiculeMode || ''} onChange={handleChange} row>
                            <FormControlLabel value="credit" control={<Radio />} label="Crédit" />
                            <FormControlLabel value="location" control={<Radio />} label="Location" />
                          </RadioGroup>
                        </FormControl>
                        </Grid>
                      <Grid item xs={12} sm={6}><TextField fullWidth label="Mensualité Crédit/Location" name="vehiculeValeur" value={data.vehiculeValeur || ''} onChange={handleChange} /></Grid>
                      <Grid item xs={12} sm={6}><TextField fullWidth label="Estimation valeur véhicule 2025" name="vehiculeEstimationValeur2025" value={data.vehiculeEstimationValeur2025 || ''} onChange={handleChange} /></Grid>
                      <Grid item xs={12} sm={6}><TextField fullWidth label="Carburant véhicule" name="vehiculeCarburant" value={data.vehiculeCarburant || ''} onChange={handleChange} /></Grid>
                      <Grid item xs={12} sm={6}><TextField fullWidth label="Assurance véhicule" name="vehiculeAssurance" value={data.vehiculeAssurance || ''} onChange={handleChange} /></Grid>
                      <Grid item xs={12} sm={6}><TextField fullWidth label="Frais entretien véhicule" name="vehiculeFraisEntretien" value={data.vehiculeFraisEntretien || ''} onChange={handleChange} /></Grid>
                      <Grid item xs={12} sm={6}><TextField fullWidth label="Services de transport (public, taxi)" name="serviceTransport" value={data.serviceTransport || ''} onChange={handleChange} /></Grid>

                      <Grid item xs={12}><Typography variant="subtitle1" sx={{ mt: 1 }}>Autres Dépenses</Typography></Grid>
                      <Grid item xs={12} sm={6}><TextField fullWidth label="Habillement et chaussures" name="habillementChaussures" value={data.habillementChaussures || ''} onChange={handleChange} /></Grid>
                      <Grid item xs={12} sm={6}><TextField fullWidth label="Abonnements loisirs (sport...)" name="abonnementLoisir" value={data.abonnementLoisir || ''} onChange={handleChange} /></Grid>
                      <Grid item xs={12} sm={6}><TextField fullWidth label="Budget restauration (sorties...)" name="budgetRestauration" value={data.budgetRestauration || ''} onChange={handleChange} /></Grid>
                      <Grid item xs={12} sm={6}><TextField fullWidth label="Abonnements divertissement (stream...)" name="abonnementDivertissement" value={data.abonnementDivertissement || ''} onChange={handleChange} /></Grid>
                      <Grid item xs={12} sm={6}><TextField fullWidth label="Loisirs culturels (cinéma...)" name="loisirCulturel" value={data.loisirCulturel || ''} onChange={handleChange} /></Grid>
                      <Grid item xs={12} sm={6}><TextField fullWidth label="Animaux de compagnie" name="animauxCompagnie" value={data.animauxCompagnie || ''} onChange={handleChange} /></Grid>
                      <Grid item xs={12}><TextField fullWidth label="Autres dépenses récurrentes" name="autreDepense" value={data.autreDepense || ''} onChange={handleChange} /></Grid>
                      </>
                    ) : (
                      <>
                      {renderReadOnlyField("Budget alimentaire", data.budgetAlimentaire)}
                      {renderReadOnlyField("Loyer ou Crédit RP", data.loyerOuCreditRP)}
                      {renderReadOnlyField("Electricité", data.electricite)}
                      {renderReadOnlyField("Eau", data.eau)}
                      {renderReadOnlyField("Gaz", data.gaz)}
                      {renderReadOnlyField("Internet Domicile", data.internetDomicile)}
                      {renderReadOnlyField("Abonnement Téléphonique", data.abonnementTelephonique)}
                      {renderReadOnlyField("Assurance Logement", data.assuranceLogement)}
                      {renderReadOnlyField("Mutuelle Santé", data.mutuelleSante)}
                      <Grid item xs={12}><Typography variant="subtitle1" sx={{ mt: 1, color: 'text.secondary' }}>Véhicule</Typography></Grid>
                      {renderReadOnlyField("Mode financement véhicule", data.vehiculeMode)}
                      {renderReadOnlyField("Mensualité Crédit/Location", data.vehiculeValeur)}
                      {renderReadOnlyField("Estimation valeur véhicule 2025", data.vehiculeEstimationValeur2025)}
                      {renderReadOnlyField("Carburant véhicule", data.vehiculeCarburant)}
                      {renderReadOnlyField("Assurance véhicule", data.vehiculeAssurance)}
                      {renderReadOnlyField("Frais entretien véhicule", data.vehiculeFraisEntretien)}
                      {renderReadOnlyField("Services de transport", data.serviceTransport)}
                      <Grid item xs={12}><Typography variant="subtitle1" sx={{ mt: 1, color: 'text.secondary' }}>Autres Dépenses</Typography></Grid>
                      {renderReadOnlyField("Habillement et chaussures", data.habillementChaussures)}
                      {renderReadOnlyField("Abonnements loisirs", data.abonnementLoisir)}
                      {renderReadOnlyField("Budget restauration", data.budgetRestauration)}
                      {renderReadOnlyField("Abonnements divertissement", data.abonnementDivertissement)}
                      {renderReadOnlyField("Loisirs culturels", data.loisirCulturel)}
                      {renderReadOnlyField("Animaux de compagnie", data.animauxCompagnie)}
                      {renderReadOnlyField("Autres dépenses récurrentes", data.autreDepense)}
                      </>
                    )
                  )}

                {renderFormSection(form, 7, "7. Précisions et Finalisation",
                  (isEditing, data) => isEditing ? (
                      <>
                        <Grid item xs={12}>
                          <TextField
                          fullWidth multiline rows={4}
                          label="Questions ou commentaires" name="questions"
                          value={data.questions || ''} onChange={handleChange}
                          />
                        </Grid>
                        <Grid item xs={12}>
                        <FormControlLabel control={ <Checkbox name="consentementRGPD" checked={!!data.consentementRGPD} onChange={handleCheckboxChange} /> }
                            label="Consentement RGPD accordé"
                          />
                        </Grid>
                      </>
                    ) : (
                      <>
                      {renderReadOnlyField("Questions/Commentaires", data.questions)}
                      {renderReadOnlyCheckbox("Consentement RGPD", data.consentementRGPD)}
                      </>
                    )
                  )}
              </Box>
            ) : (
              <Box>
                <Typography sx={{ mb: 2 }}>Aucun formulaire soumis par cet utilisateur.</Typography>
              </Box>
            )}
          </Paper>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            {userData?.documents && userData.documents.length > 0 ? (
              <List>
                {userData.documents.map((doc, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemText
                        primary={doc.nom}
                        secondary={`Type: ${doc.type} | Ajouté le: ${new Date(doc.created_at).toLocaleDateString()}`}
                      />
                      <Button 
                        variant="contained" 
                        href={doc.url} 
                        target="_blank"
                        sx={{ bgcolor: '#3F51B5' }}
                      >
                        Voir
                      </Button>
                    </ListItem>
                    {index < (userData?.documents?.length ?? 0) - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography>Aucun document téléchargé</Typography>
            )}
          </Paper>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Rendez-vous de l'utilisateur</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {/* ✨ NOUVEAU: Bouton Planifier RDV */}
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleOpenAppointmentDialog}
                  sx={{ bgcolor: '#3F51B5' }}
                >
                  Planifier un RDV
                </Button>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={showCanceled}
                      onChange={e => setShowCanceled(e.target.checked)}
                    />
                  }
                  label="Afficher les rendez-vous annulés"
                />
              </Box>
            </Box>
            
            {userData?.rendez_vous && userData.rendez_vous.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date et heure</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Statut</TableCell>
                      <TableCell>Créé le</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {userData.rendez_vous
                      .filter(rdv => showCanceled || rdv.status !== 'canceled')
                      .map((rdv, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            {new Date(rdv.start_datetime).toLocaleString()} - 
                            {new Date(rdv.end_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </TableCell>
                          <TableCell>
                            {rdv.type === 'tel' ? 'Téléphonique' : 
                             rdv.type === 'strat' ? 'Stratégique' : rdv.type}
                          </TableCell>
                          <TableCell>
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              color: rdv.status === 'canceled' ? 'error.main' : 
                                     rdv.status === 'scheduled' ? 'success.main' : 'text.primary'
                            }}>
                              {rdv.status === 'canceled' ? (
                                <CancelIcon fontSize="small" sx={{ mr: 0.5 }} />
                              ) : rdv.status === 'scheduled' ? (
                                <CheckCircleIcon fontSize="small" sx={{ mr: 0.5 }} />
                              ) : null}
                              {rdv.status === 'scheduled' ? 'Planifié' : rdv.status === 'canceled' ? 'Annulé' : rdv.status}
                            </Box>
                          </TableCell>
                          <TableCell>{new Date(rdv.created_at).toLocaleString()}</TableCell>
                          <TableCell align="right">
                            {rdv.status === 'scheduled' && (
                              <Button 
                                variant="contained" 
                                color="error"
                                size="small"
                                onClick={() => setCancelDialog({
                                  open: true,
                                  appointment: rdv,
                                  loading: false
                                })}
                              >
                                Annuler
                              </Button>
                            )}
                            {rdv.status === 'canceled' && (
                              <Typography variant="body2" color="text.secondary">
                                Annulé
                              </Typography>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography>Aucun rendez-vous planifié</Typography>
            )}
          </Paper>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle1">Profil</Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={userData?.progression_profile || 0}
                  sx={{ height: 10, borderRadius: 5 }}
                />
                <Typography variant="body2" align="right">
                  {userData?.progression_profile || 0}%
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle1">Documents</Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={userData?.progression_documents || 0}
                  sx={{ height: 10, borderRadius: 5 }}
                />
                <Typography variant="body2" align="right">
                  {userData?.progression_documents || 0}%
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle1">Formulaire</Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={userData?.progression_formulaire || 0}
                  sx={{ height: 10, borderRadius: 5 }}
                />
                <Typography variant="body2" align="right">
                  {userData?.progression_formulaire || 0}%
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </TabPanel>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, formulaireId: null })}
      >
        <DialogTitle>Confirmation de suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer ce formulaire ? Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialog({ open: false, formulaireId: null })} 
            color="primary"
          >
            Annuler
          </Button>
          <Button 
            onClick={confirmDeleteForm} 
            color="error" 
            startIcon={<DeleteIcon />}
            disabled={saving}
          >
            {saving ? <CircularProgress size={24} /> : 'Supprimer'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={cancelDialog.open}
        onClose={() => !cancelDialog.loading && setCancelDialog(prev => ({ ...prev, open: false }))}
      >
        <DialogTitle>Confirmer l'annulation du rendez-vous</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir annuler ce rendez-vous? Cette action est irréversible.
            {cancelDialog.appointment && (
              <Box component="div" sx={{ mt: 2, fontWeight: 'bold' }}>
                <Typography variant="body2">Date: {new Date(cancelDialog.appointment.start_datetime).toLocaleString()}</Typography>
                <Typography variant="body2">Type: {cancelDialog.appointment.type === 'tel' ? 'Téléphonique' :
                       cancelDialog.appointment.type === 'strat' ? 'Stratégique' : 
                       cancelDialog.appointment.type}</Typography>
              </Box>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setCancelDialog(prev => ({ ...prev, open: false }))}
            disabled={cancelDialog.loading}
          >
            Non
          </Button>
          <Button 
            onClick={handleCancelAppointment}
            color="error" 
            variant="contained"
            disabled={cancelDialog.loading}
          >
            {cancelDialog.loading ? <CircularProgress size={24} /> : 'Oui, annuler le RDV'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ✨ NOUVEAU: Dialogue de création de RDV */}
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={frLocale}>
        <Dialog 
          open={appointmentDialog.open} 
          onClose={handleCloseAppointmentDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Planifier un nouveau rendez-vous</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <FormLabel>Type de rendez-vous *</FormLabel>
                <Select
                  name="type"
                  value={appointmentFormData.type}
                  onChange={(e) => handleAppointmentFormChange('type', e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="" disabled>Sélectionnez...</MenuItem>
                  <MenuItem value="tel">Téléphonique</MenuItem>
                  <MenuItem value="strat">Stratégique</MenuItem>
                </Select>
              </FormControl>

              <DateTimePicker
                label="Date et heure de début *"
                value={appointmentFormData.start_datetime}
                onChange={(newValue) => handleAppointmentFormChange('start_datetime', newValue)}
                sx={{ display: 'block', mb: 3, width: '100%' }}
                ampm={false} // Format 24h
              />
              
              <DateTimePicker
                label="Date et heure de fin *"
                value={appointmentFormData.end_datetime}
                onChange={(newValue) => handleAppointmentFormChange('end_datetime', newValue)}
                sx={{ display: 'block', mb: 3, width: '100%' }}
                ampm={false} // Format 24h
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={handleCloseAppointmentDialog}
              disabled={appointmentDialog.loading}
            >
              Annuler
            </Button>
            <Button 
              onClick={handleCreateAppointment}
              variant="contained" 
              disabled={appointmentDialog.loading || !appointmentFormData.type || !appointmentFormData.start_datetime || !appointmentFormData.end_datetime}
            >
              {appointmentDialog.loading ? <CircularProgress size={24} /> : 'Planifier'}
            </Button>
          </DialogActions>
        </Dialog>
      </LocalizationProvider>
    </Box>
  );
};

export default UserDetails;
