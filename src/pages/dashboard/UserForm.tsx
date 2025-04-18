import React, { useState, useEffect } from 'react';
import {
  Box, Button, TextField, Typography, FormControl, FormLabel, 
  RadioGroup, FormControlLabel, Radio, Select, MenuItem, 
  Checkbox, FormGroup, FormHelperText, Paper, CircularProgress,
  Alert, Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from '../../config/axios';
import { API_ROUTES } from '../../config/api';
import { useNavigate } from 'react-router-dom';

// Types complets pour le formulaire
interface FormInputs {
  // Section 1 - Situation familiale
  situationMatrimoniale: string;
  
  // Section 2-3 - Conjoint
  impositionSeparee: string;
  revenuConjoint: string;
  
  // Section 4-5 - Enfants
  enfantsCharge: string;
  nombreParts: string;
  fraisGarde: string;
  
  // Section 6-8 - Patrimoine immobilier
  proprietaireRP: string;
  valeurBien: string;
  mensualiteCredit: string;
  loyerMensuel: string;
  
  // Section 9-12 - Investissement
  biensLocatifs: string;
  nombreBiensLocatifs: string;
  typeDispositif: string[];
  loyersCouvreCreditLocatif: string;
  gainMensuelLocatif: string;
  ajoutMensuelLocatif: string;
  
  // Section 13-17 - Véhicule
  possedeVehicule: string;
  methodeVehicule: string;
  mensualiteVehicule: string;
  dureeRestanteVehicule: string;
  valeurVehicule: string;
  
  // Section 18-22 - Situation professionnelle
  statutActuel: string;
  situationExercice: string;
  montantRetrocessions: string;
  nombreAssocies: string;
  retrocessionsAnnuelles: string;
  structurePartenariat: string;
  creditRachatParts: string;
  montantRemboursementParts: string;
  dureeRestanteParts: string;
  
  // Section 23-24 - Finances professionnelles
  chiffreAffaires: string;
  montantURSSAF: string;
  montantCARPIMKO: string;
  montantImpotRevenu: string;
  
  // Nouveaux noms pour les champs de la section 24
  montantCFE_prof: string;
  montantRCP_prof: string;
  salaireEmploye_prof: string;
  materielConsommable_prof: string;
  loyerCabinet_prof: string;
  
  // Section 25-26 - Dépenses personnelles
  budgetAlimentaire: string;
  divertissement: string;
  assuranceLogement: string;
  assuranceVehicule: string;
  budgetCarburant: string;
  mutuelleSante: string;
  besoinMensuel: string;
  // Nouveaux champs pour les dépenses personnelles
  habillementChaussures: string;
  serviceTransport: string;
  abonnementTelephonique: string;
  abonnementLoisir: string;
  loyerOuCreditRP: string;
  budgetRestauration: string;
  abonnementDivertissement: string;
  animauxCompagnie: string;
  loisirCulturel: string;
  autreDepense: string;
  // Nouveaux champs pour le véhicule dans la section dépenses
  vehiculeMode: string; 
  vehiculeValeur: string;
  vehiculeEstimationValeur2025: string;
  vehiculeCarburant: string;
  vehiculeAssurance: string;
  vehiculeFraisEntretien: string;
  // Nouveaux champs pour les charges dans la section dépenses
  electricite: string;
  eau: string;
  gaz: string;
  internetDomicile: string;
  
  // Section 27-29 - Collaboration et finalisation
  expertComptable: string;
  honorairesComptable: string;
  avisOptimisation: string;
  questions: string;
  consentementRGPD: boolean;
  
  // Ajouter ces propriétés:
  montantCFE: string;
  montantRCP: string;
  salaireEmploye: string;
  materielConsommable: string;
  loyerCabinet: string;
}

function UserForm() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<FormInputs>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitRequested, setIsSubmitRequested] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  
  // Nouveaux états pour gérer un formulaire existant
  const [hasExistingForm, setHasExistingForm] = useState(false);
  const [existingFormId, setExistingFormId] = useState<number | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editSection, setEditSection] = useState<number | null>(null);
  const [showIntro, setShowIntro] = useState(false);
  
  // Vérifier si l'utilisateur a déjà un formulaire au chargement
  useEffect(() => {
    const checkExistingForm = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_ROUTES.user.getUserForms);
        
        if (response.data.success && response.data.formulaires && response.data.formulaires.length > 0) {
          // L'utilisateur a déjà soumis un formulaire
          setHasExistingForm(true);
          setExistingFormId(response.data.formulaires[0].id);
          
          // Si on est en mode édition, charger les données du formulaire
          if (isEditMode) {
            // Récupérer les données du formulaire de manière plus robuste
            let formDataFromServer;
            const formulaire = response.data.formulaires[0];
            
            if (formulaire.data) {
              // Si data existe déjà sous forme d'objet
              formDataFromServer = formulaire.data;
            } else if (formulaire.donnees) {
              // Si donnees existe, vérifier son type
              if (typeof formulaire.donnees === 'string') {
                try {
                  // Essayer de le parser si c'est une chaîne JSON
                  formDataFromServer = JSON.parse(formulaire.donnees);
                } catch (e) {
                  console.error('Erreur de parsing JSON:', e);
                  formDataFromServer = {}; // Valeur par défaut en cas d'erreur
                }
              } else {
                // Si c'est déjà un objet, l'utiliser directement
                formDataFromServer = formulaire.donnees;
              }
            } else {
              // Aucune donnée trouvée
              formDataFromServer = {};
            }
            
            console.log('Données du formulaire récupérées:', formDataFromServer);
            setFormData(formDataFromServer);
          }
        } else {
          setHasExistingForm(false);
          setExistingFormId(null);
          setShowIntro(true);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification des formulaires existants:', error);
        setErrorMessage('Erreur lors de la vérification de vos formulaires');
      } finally {
        setLoading(false);
      }
    };
    
    checkExistingForm();
  }, [isEditMode]);

  // Activer le mode édition
  const handleEditForm = () => {
    setIsEditMode(true);
  };
  
  // Annuler l'édition
  const handleCancelEdit = () => {
    setIsEditMode(false);
    setFormData({});
    setEditSection(null);
  };
  
  // Sauvegarder les modifications
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!existingFormId) return;
    
    try {
      setIsSubmitRequested(true);
      
      if (!validate(currentStep)) {
        setIsSubmitRequested(false);
        return;
      }
      
      // Préparation des données pour envoi au backend
      const dataNettoyees = { ...formData };
      
      // Renommer les champs comme dans la fonction handleSubmit originale
      if (dataNettoyees.montantCFE_prof) {
        dataNettoyees.montantCFE = dataNettoyees.montantCFE_prof;
        delete dataNettoyees.montantCFE_prof;
      }
      
      if (dataNettoyees.montantRCP_prof) {
        dataNettoyees.montantRCP = dataNettoyees.montantRCP_prof;
        delete dataNettoyees.montantRCP_prof;
      }
      
      if (dataNettoyees.salaireEmploye_prof) {
        dataNettoyees.salaireEmploye = dataNettoyees.salaireEmploye_prof;
        delete dataNettoyees.salaireEmploye_prof;
      }
      
      if (dataNettoyees.materielConsommable_prof) {
        dataNettoyees.materielConsommable = dataNettoyees.materielConsommable_prof;
        delete dataNettoyees.materielConsommable_prof;
      }
      
      if (dataNettoyees.loyerCabinet_prof) {
        dataNettoyees.loyerCabinet = dataNettoyees.loyerCabinet_prof;
        delete dataNettoyees.loyerCabinet_prof;
      }
      
      const response = await axios.put(API_ROUTES.user.updateFormulaire(existingFormId), dataNettoyees);
      
      if (response.data.success) {
        setSuccessMessage('Formulaire mis à jour avec succès');
        setRedirecting(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        throw new Error(response.data.message || 'Problème lors de la mise à jour des données');
      }
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour:', error);
      const errorMessage = error.response?.data?.message || "Une erreur est survenue lors de la mise à jour du formulaire";
      setErrorMessage(errorMessage);
    } finally {
      setIsSubmitRequested(false);
    }
  };
  
  // Fonction pour modifier une section spécifique
  const handleEditSection = (sectionIndex: number) => {
    setEditSection(sectionIndex);
  };

  // Fonction de validation pour chaque étape
  const validate = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    switch (step) {
      case 1:
        if (!formData.situationMatrimoniale) {
          newErrors.situationMatrimoniale = 'Ce champ est requis';
          isValid = false;
        }
        break;
      case 2:
        if (formData.situationMatrimoniale !== 'celibataire' && !formData.impositionSeparee) {
          newErrors.impositionSeparee = 'Ce champ est requis';
          isValid = false;
        }
        break;
      case 18:
        if (!formData.situationExercice) {
          newErrors.situationExercice = 'Veuillez sélectionner votre situation d\'exercice.';
          isValid = false;
        }
        break;
      // Ajoutez la validation pour les autres étapes selon vos besoins
    }

    setErrors(newErrors);
    return isValid;
  };

  // Fonction pour mettre à jour les champs
  const handleChange = (field: keyof FormInputs, value: any) => {
    setFormData({
      ...formData,
      [field]: value
    });
    
    // Réinitialiser les erreurs pour ce champ
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  // Navigation avant
  const handleNavigation = () => {
    if (!validate(currentStep)) return;
    setErrorMessage(''); // Réinitialiser le message d'erreur
    
    let nextStep = currentStep + 1;
    
    // Logique de navigation conditionnelle
    switch (currentStep) {
      case 1:
        if (formData.situationMatrimoniale === 'celibataire' || 
            formData.situationMatrimoniale === 'divorce_separe' || 
            formData.situationMatrimoniale === 'concubinage') {
          nextStep = 4; // Aller directement à l'étape des enfants
        } else {
          nextStep = 2; // Aller à l'imposition séparée
        }
        break;

      case 2:
        if (formData.impositionSeparee === 'oui') {
          nextStep = 4; // Si "oui" à l'imposition séparée, aller aux enfants
        } else {
          nextStep = 3; // Si "non" à l'imposition séparée, aller au revenu du conjoint
        }
        break;

      case 4:
        if (formData.enfantsCharge === 'non') {
          // Skip step 5, and 7-17, go directly to step 18 (Situation professionnelle)
          nextStep = 18; 
        } else {
          nextStep = 5; // Aller aux détails des enfants
        }
        break;

      case 5: // S'assurer que l'étape 5 mène maintenant à la 18 (Situation professionnelle)
        // Note: Skips steps 7-17
        nextStep = 18; // Après les détails des enfants, aller à l'étape 18
        break;

      case 18:
        if (formData.situationExercice === 'assistant' || formData.situationExercice === 'remplacant') {
          // Modification: Assistant et Remplaçant vont maintenant à l'étape 23
          nextStep = 23; 
        } else if (formData.situationExercice === 'titulaire') {
          nextStep = 20; // Titulaire (inchangé)
        } else if (formData.situationExercice === 'etudiant') {
          nextStep = 25; // Étudiant (inchangé)
        } else {
          // Cas par défaut pour autres situations (par exemple, si un nouveau statut est ajouté)
          nextStep = 21; // Aller à Achat de parts (inchangé)
        }
        break;

      case 19:
        // Puisque l'étape 21 est supprimée, on va directement à 23 si pas de crédit
        // (l'étape 22 n'est plus pertinente sans la question de l'étape 21)
        nextStep = 23; // Aller à CA/cotisations
        break;

      case 20:
        // L'étape 21 est supprimée, aller directement à l'étape 23
        nextStep = 23; 
        break;

      case 23:
        if (formData.situationExercice === 'assistant') {
          nextStep = 24; // Vers charges professionnelles pour les assistants
        } else if (formData.situationExercice === 'remplacant') {
          nextStep = 24; // Vers charges professionnelles pour les remplaçants
        } else if (formData.situationExercice === 'titulaire') {
          nextStep = 24; // Vers charges professionnelles pour les titulaires
        } else {
          nextStep = 24; // Par défaut, aller aux charges professionnelles
        }
        break;

      case 25: // Après les dépenses personnelles
        if (formData.situationExercice === 'etudiant') {
          // Condition ajoutée pour étudiant : retourne à l'étape 18
          nextStep = 18; 
        } else {
          // Logique existante pour les autres statuts (sauter 26, 27, 28)
          nextStep = 29; // Aller directement à l'étape 29 (Questions)
        }
        break;
      
      // cases 26, 27, 28 sont supprimées ou non pertinentes pour la navigation avant

      // Par défaut, aller à l'étape suivante
      default:
        nextStep = currentStep + 1;
    }
    
    setCurrentStep(nextStep);
  };

  // Navigation arrière
  const handleBack = () => {
    setErrorMessage(''); // Réinitialiser le message d'erreur
    let previousStep = currentStep - 1;
    
    // Logique de navigation arrière conditionnelle
    switch (currentStep) {
      case 4:
        if (formData.situationMatrimoniale === 'celibataire' || 
            formData.situationMatrimoniale === 'divorce_separe' || 
            formData.situationMatrimoniale === 'concubinage') {
          previousStep = 1; // Retour à la situation familiale
        } else if (formData.impositionSeparee === 'oui') {
          previousStep = 2; // Retour à l'imposition séparée si "oui" était sélectionné
        } else {
          previousStep = 3; // Retour au revenu du conjoint si "non" était sélectionné
        }
        break;

      // Les étapes 14, 16 retournent maintenant à 5 ou 4 (cases 15, 17 removed)
      case 14: // Bien que case 14 soit supprimé du rendu, on garde la logique back au cas où
      case 16: // Bien que case 16 soit supprimé du rendu, on garde la logique back au cas où
        if (formData.enfantsCharge === 'oui') {
           previousStep = 5; 
        } else {
           previousStep = 4; 
        }
        break;

      case 18:
        // Le retour depuis l'étape 18 pointe vers l'étape 5 ou 4
        if (formData.enfantsCharge === 'oui') {
           previousStep = 5; // Retour aux détails des enfants si applicable
        } else {
           previousStep = 4; // Sinon, retour à la question sur les enfants
        }
        break;

      case 19:
        previousStep = 18; // Retour à la situation d'exercice
        break;
      
      case 20:
        previousStep = 18; // Retour à la situation d'exercice
        break;
        
      case 23:
         // Simplification : le retour dépend uniquement de la situation d'exercice
         // car les étapes 19, 21, 22 ont été modifiées/supprimées.
        if (formData.situationExercice === 'assistant' || formData.situationExercice === 'remplacant') {
            previousStep = 18; // Retour à Situation professionnelle
        } else if (formData.situationExercice === 'titulaire') {
            previousStep = 20; // Retour à l'étape Titulaire
        } else {
            // Fallback (ex: étudiant qui ne devrait pas arriver ici via le flux normal)
            previousStep = 18; 
        }
        break;

      case 25: // Ajout de la logique de retour depuis Dépenses personnelles (étape 25)
        if (formData.situationExercice === 'etudiant') {
          // Si étudiant, retourner à l'étape 18 (Situation professionnelle)
          previousStep = 18; 
        } else {
          // Sinon, pour les autres statuts, retourner à l'étape 24 (Charges professionnelles)
          previousStep = 24;
        }
        break;

      case 29: // Retour depuis Questions
        // Retourner directement à Dépenses personnelles (étape 25) car 26, 27, et 28 sont supprimées
        previousStep = 25; 
        break;
        
      // Par défaut, aller à l'étape précédente
      default:
         previousStep = currentStep - 1;
    }
    
    setCurrentStep(previousStep);
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Marquer que l'utilisateur a explicitement demandé la soumission
    setIsSubmitRequested(true);
    
    if (!validate(currentStep)) {
      setIsSubmitRequested(false);
      return;
    }
    
    // Vérifier si la soumission est explicitement demandée
    if (!isSubmitRequested) {
      return;
    }
    
    try {
      // Préparation des données pour envoi au backend
      const dataNettoyees = { ...formData };
      
      // Renommer les champs pour cohérence dans les données finales
      if (dataNettoyees.montantCFE_prof) {
        dataNettoyees.montantCFE = dataNettoyees.montantCFE_prof;
        delete dataNettoyees.montantCFE_prof;
      }
      
      if (dataNettoyees.montantRCP_prof) {
        dataNettoyees.montantRCP = dataNettoyees.montantRCP_prof;
        delete dataNettoyees.montantRCP_prof;
      }
      
      if (dataNettoyees.salaireEmploye_prof) {
        dataNettoyees.salaireEmploye = dataNettoyees.salaireEmploye_prof;
        delete dataNettoyees.salaireEmploye_prof;
      }
      
      if (dataNettoyees.materielConsommable_prof) {
        dataNettoyees.materielConsommable = dataNettoyees.materielConsommable_prof;
        delete dataNettoyees.materielConsommable_prof;
      }
      
      if (dataNettoyees.loyerCabinet_prof) {
        dataNettoyees.loyerCabinet = dataNettoyees.loyerCabinet_prof;
        delete dataNettoyees.loyerCabinet_prof;
      }
      
      console.log('Données complètes à envoyer:', dataNettoyees);
      
      // Utilisation d'axios au lieu de fetch
      if (isSubmitRequested) {
        // Remplacer la requête fetch par axios
        const response = await axios.post(API_ROUTES.user.formulaire, dataNettoyees);
        
        // Traitement de la réponse
        console.log('Réponse du serveur:', response.data);
        
        if (response.data.success) {
          setSuccessMessage('Formulaire envoyé avec succès');
          setRedirecting(true);
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        } else {
          throw new Error(response.data.message || 'Problème lors de l\'envoi des données');
        }
      }
      
    } catch (error: any) {
      console.error('Erreur lors de la soumission:', error);
      // Afficher le message d'erreur spécifique si disponible
      const errorMessage = error.response?.data?.message || "Une erreur est survenue lors de l'envoi du formulaire";
      setErrorMessage(errorMessage);
    } finally {
      // Réinitialiser le drapeau après la soumission
      setIsSubmitRequested(false);
    }
  };

  // Rendu des étapes du formulaire
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Box>
            <Typography variant="h6">Situation familiale</Typography>
            <FormControl fullWidth error={!!errors.situationMatrimoniale} sx={{ mt: 2 }}>
              <FormLabel>Situation matrimoniale</FormLabel>
              <RadioGroup
                value={formData.situationMatrimoniale || ''}
                onChange={(e) => handleChange('situationMatrimoniale', e.target.value)}
              >
                <FormControlLabel value="celibataire" control={<Radio />} label="Célibataire" />
                <FormControlLabel value="marie_pacse" control={<Radio />} label="Marié(e)/Pacsé(e)" />
                <FormControlLabel value="divorce_separe" control={<Radio />} label="Divorcé(e)/Séparé(e)" />
                <FormControlLabel value="concubinage" control={<Radio />} label="Concubinage" />
              </RadioGroup>
              {errors.situationMatrimoniale && (
                <FormHelperText>{errors.situationMatrimoniale}</FormHelperText>
              )}
            </FormControl>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6">Imposition du foyer</Typography>
            <FormControl fullWidth error={!!errors.impositionSeparee} sx={{ mt: 2 }}>
              <FormLabel>Imposition séparée ?</FormLabel>
              <RadioGroup
                value={formData.impositionSeparee || ''}
                onChange={(e) => handleChange('impositionSeparee', e.target.value)}
              >
                <FormControlLabel value="oui" control={<Radio />} label="Oui" />
                <FormControlLabel value="non" control={<Radio />} label="Non" />
              </RadioGroup>
              {errors.impositionSeparee && (
                <FormHelperText>{errors.impositionSeparee}</FormHelperText>
              )}
            </FormControl>
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6">Revenu du conjoint</Typography>
            <TextField
              fullWidth
              label="Revenu mensuel du conjoint"
              value={formData.revenuConjoint || ''}
              onChange={(e) => handleChange('revenuConjoint', e.target.value)}
              error={!!errors.revenuConjoint}
              helperText={errors.revenuConjoint}
              sx={{ mt: 2 }}
            />
          </Box>
        );

      case 4:
        return (
          <Box>
            <Typography variant="h6">Enfants</Typography>
            <FormControl fullWidth error={!!errors.enfantsCharge} sx={{ mt: 2 }}>
              <FormLabel>Avez-vous des enfants à charge ?</FormLabel>
              <RadioGroup 
                value={formData.enfantsCharge || ''}
                onChange={(e) => handleChange('enfantsCharge', e.target.value)}
              >
                <FormControlLabel value="oui" control={<Radio />} label="Oui" />
                <FormControlLabel value="non" control={<Radio />} label="Non" />
              </RadioGroup>
              {errors.enfantsCharge && (
                <FormHelperText>{errors.enfantsCharge}</FormHelperText>
              )}
            </FormControl>
          </Box>
        );

      case 5:
        return (
          <Box>
            <Typography variant="h6">Détails concernant les enfants</Typography>
            <TextField
              fullWidth
              label="Nombre de parts fiscales du foyer"
              value={formData.nombreParts || ''}
              onChange={(e) => handleChange('nombreParts', e.target.value)}
              error={!!errors.nombreParts}
              helperText={errors.nombreParts}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Frais de garde mensuels"
              value={formData.fraisGarde || ''}
              onChange={(e) => handleChange('fraisGarde', e.target.value)}
              error={!!errors.fraisGarde}
              helperText={errors.fraisGarde}
              sx={{ mt: 2 }}
            />
          </Box>
        );

      case 18:
        return (
          <Box>
            <Typography variant="h6">Situation professionnelle libérale</Typography>
            <FormControl fullWidth error={!!errors.statutActuel} sx={{ mt: 2 }}>
              <FormLabel>Statut actuel</FormLabel>
              <Select
                value={formData.statutActuel || ''}
                onChange={(e) => handleChange('statutActuel', e.target.value)}
              >
                <MenuItem value="bnc">EI micro-BNC</MenuItem>
                <MenuItem value="ei_ir">EI à l'IR (frais réels)</MenuItem>
                <MenuItem value="ei_is">EI à l'IS</MenuItem>
                <MenuItem value="selarl">SELARL/SELAS</MenuItem>
              </Select>
              {errors.statutActuel && (
                <FormHelperText>{errors.statutActuel}</FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth error={!!errors.situationExercice} sx={{ mt: 2 }}>
              <FormLabel>Situation d'exercice</FormLabel>
              <RadioGroup
                value={formData.situationExercice || ''}
                onChange={(e) => handleChange('situationExercice', e.target.value)}
              >
                <FormControlLabel value="titulaire" control={<Radio />} label="Titulaire" />
                <FormControlLabel value="remplacant" control={<Radio />} label="Remplaçant" />
                <FormControlLabel value="assistant" control={<Radio />} label="Assistant/Collaborateur" />
                <FormControlLabel value="etudiant" control={<Radio />} label="Étudiant" />
              </RadioGroup>
              {errors.situationExercice && (
                <FormHelperText>{errors.situationExercice}</FormHelperText>
              )}
            </FormControl>
          </Box>
        );

      case 19:
        return (
          <Box>
            <Typography variant="h6">Assistant/Collaborateur</Typography>
            <TextField
              fullWidth
              label="Montant des rétrocessions mensuelles"
              value={formData.montantRetrocessions || ''}
              onChange={(e) => handleChange('montantRetrocessions', e.target.value)}
              error={!!errors.montantRetrocessions}
              helperText={errors.montantRetrocessions}
              sx={{ mt: 2 }}
            />
          </Box>
        );

      case 20:
        return (
          <Box>
            <Typography variant="h6">Titulaire</Typography>
            <TextField
              fullWidth
              label="Rétrocessions mensuelles perçues"
              value={formData.retrocessionsAnnuelles || ''}
              onChange={(e) => handleChange('retrocessionsAnnuelles', e.target.value)}
              error={!!errors.retrocessionsAnnuelles}
              helperText={errors.retrocessionsAnnuelles}
              sx={{ mt: 2 }}
            />
          </Box>
        );

      case 23:
        return (
          <Box>
            <Typography variant="h6">CA/Cotisations</Typography>
            <TextField
              fullWidth
              label="Chiffre d'affaires (total brut)"
              value={formData.chiffreAffaires || ''}
              onChange={(e) => handleChange('chiffreAffaires', e.target.value)}
              error={!!errors.chiffreAffaires}
              helperText={errors.chiffreAffaires}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Montant URSSAF (annuel)"
              value={formData.montantURSSAF || ''}
              onChange={(e) => handleChange('montantURSSAF', e.target.value)}
              error={!!errors.montantURSSAF}
              helperText={errors.montantURSSAF}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Montant CARPIMKO (annuel)"
              value={formData.montantCARPIMKO || ''}
              onChange={(e) => handleChange('montantCARPIMKO', e.target.value)}
              error={!!errors.montantCARPIMKO}
              helperText={errors.montantCARPIMKO}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Montant Impôt sur le Revenu"
              value={formData.montantImpotRevenu || ''}
              onChange={(e) => handleChange('montantImpotRevenu', e.target.value)}
              error={!!errors.montantImpotRevenu}
              helperText={errors.montantImpotRevenu}
              sx={{ mt: 2 }}
            />
          </Box>
        );

      case 24:
        return (
          <Box>
            <Typography variant="h6">Charges professionnelles</Typography>
            {/* Suppression du champ "Crédit de rachat de parts" qui était incorrectement placé ici */}
            {/* 
            <TextField
              fullWidth
              label="Crédit de rachat de parts(montat mensuelle)"
              value={formData.creditRachatParts || ''}
              onChange={(e) => handleChange('creditRachatParts', e.target.value)}
              error={!!errors.creditRachatParts}
              helperText={errors.creditRachatParts}
              sx={{ mt: 2 }}
            /> 
            */}
            <TextField
              fullWidth
              label="Montant CFE"
              value={formData.montantCFE_prof || ''}
              onChange={(e) => handleChange('montantCFE_prof', e.target.value)}
              error={!!errors.montantCFE_prof}
              helperText={errors.montantCFE_prof}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Montant RCP"
              value={formData.montantRCP_prof || ''}
              onChange={(e) => handleChange('montantRCP_prof', e.target.value)}
              error={!!errors.montantRCP_prof}
              helperText={errors.montantRCP_prof}
              sx={{ mt: 2 }}
            />
            
            {/* Condition pour n'afficher les champs suivants que pour les titulaires */}
            {formData.situationExercice === 'titulaire' && (
              <>
                <TextField
                  fullWidth
                  label="Salaire employé"
                  value={formData.salaireEmploye_prof || ''}
                  onChange={(e) => handleChange('salaireEmploye_prof', e.target.value)}
                  error={!!errors.salaireEmploye_prof}
                  helperText={errors.salaireEmploye_prof}
                  sx={{ mt: 2 }}
                />
                <TextField
                  fullWidth
                  label="Matériel consommable"
                  value={formData.materielConsommable_prof || ''}
                  onChange={(e) => handleChange('materielConsommable_prof', e.target.value)}
                  error={!!errors.materielConsommable_prof}
                  helperText={errors.materielConsommable_prof}
                  sx={{ mt: 2 }}
                />
                <TextField
                  fullWidth
                  label="Loyer cabinet"
                  value={formData.loyerCabinet_prof || ''}
                  onChange={(e) => handleChange('loyerCabinet_prof', e.target.value)}
                  error={!!errors.loyerCabinet_prof}
                  helperText={errors.loyerCabinet_prof}
                  sx={{ mt: 2 }}
                />
                <TextField
              fullWidth
              label="Crédit de rachat de parts(montat mensuelle)"
              value={formData.creditRachatParts || ''}
              onChange={(e) => handleChange('creditRachatParts', e.target.value)}
              error={!!errors.creditRachatParts}
              helperText={errors.creditRachatParts}
              sx={{ mt: 2 }}
            /> 
              </>
            )}
          </Box>
        );

      case 25:
        return (
          <Box>
            <Typography variant="h6">Dépenses personnelles mensuelles</Typography>
            <TextField
              fullWidth
              label="Budget alimentaire mensuel (hors restaurant)"
              value={formData.budgetAlimentaire || ''}
              onChange={(e) => handleChange('budgetAlimentaire', e.target.value)}
              error={!!errors.budgetAlimentaire}
              helperText={errors.budgetAlimentaire}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Loyer ou remboursement crédit Résidence Principale"
              value={formData.loyerOuCreditRP || ''} 
              onChange={(e) => handleChange('loyerOuCreditRP', e.target.value)}
              sx={{ mt: 2 }}
            />
            {/* NOUVEL Accordion pour les Charges */}
            <Accordion sx={{ mt: 2, boxShadow: 'none', border: '1px solid rgba(0, 0, 0, 0.12)', '&:before': { display: 'none' } }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel-charges-content"
                id="panel-charges-header"
              >
                <Typography>Charges (Domicile)</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TextField
                  fullWidth
                  label="Electricité"
                  value={formData.electricite || ''}
                  onChange={(e) => handleChange('electricite', e.target.value)}
                  sx={{ mt: 2 }}
                />
                <TextField
                  fullWidth
                  label="Eau"
                  value={formData.eau || ''}
                  onChange={(e) => handleChange('eau', e.target.value)}
                  sx={{ mt: 2 }}
                />
                <TextField
                  fullWidth
                  label="Gaz"
                  value={formData.gaz || ''}
                  onChange={(e) => handleChange('gaz', e.target.value)}
                  sx={{ mt: 2 }}
                />
                <TextField
                  fullWidth
                  label="Internet (Domicile)"
                  value={formData.internetDomicile || ''}
                  onChange={(e) => handleChange('internetDomicile', e.target.value)}
                  sx={{ mt: 2 }}
                />
                 <TextField
                  fullWidth
                  label="Abonnement Téléphonique (Mobile)"
                  value={formData.abonnementTelephonique || ''} 
                  onChange={(e) => handleChange('abonnementTelephonique', e.target.value)}
                  sx={{ mt: 2 }}
                />
                <TextField
                 fullWidth
                 label="Assurance logement mensuelle"
                 value={formData.assuranceLogement || ''}
                 onChange={(e) => handleChange('assuranceLogement', e.target.value)}
                 error={!!errors.assuranceLogement}
                 helperText={errors.assuranceLogement}
                 sx={{ mt: 2 }}
                />
              </AccordionDetails>
            </Accordion>
            
            <TextField
              fullWidth
              label="Mutuelle santé mensuelle"
              value={formData.mutuelleSante || ''}
              onChange={(e) => handleChange('mutuelleSante', e.target.value)}
              error={!!errors.mutuelleSante}
              helperText={errors.mutuelleSante}
              sx={{ mt: 2 }}
            />

            {/* Accordion pour les dépenses véhicule */}
            <Accordion sx={{ mt: 2, boxShadow: 'none', border: '1px solid rgba(0, 0, 0, 0.12)', '&:before': { display: 'none' } }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel-vehicule-content"
                id="panel-vehicule-header"
              >
                <Typography>Véhicule</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FormControl fullWidth sx={{ mt: 1 }}>
                  <FormLabel>Mode de financement</FormLabel>
                  <RadioGroup
                    row
                    value={formData.vehiculeMode || ''}
                    onChange={(e) => handleChange('vehiculeMode', e.target.value)}
                  >
                    <FormControlLabel value="credit" control={<Radio />} label="Crédit" />
                    <FormControlLabel value="location" control={<Radio />} label="Location (LLD/LOA)" />
                  </RadioGroup>
                </FormControl>
                <TextField
                  fullWidth
                  label="Indiquez la mensualité"
                  value={formData.vehiculeValeur || ''} 
                  onChange={(e) => handleChange('vehiculeValeur', e.target.value)}
                  sx={{ mt: 2 }}
                />
                 <TextField
                  fullWidth
                  label="Estimation de la valeur du véhicule en 2025"
                  value={formData.vehiculeEstimationValeur2025 || ''}
                  onChange={(e) => handleChange('vehiculeEstimationValeur2025', e.target.value)}
                  sx={{ mt: 2 }}
                />
                 <TextField
                  fullWidth
                  label="Carburant mensuel"
                  value={formData.vehiculeCarburant || ''} 
                  onChange={(e) => handleChange('vehiculeCarburant', e.target.value)}
                  sx={{ mt: 2 }}
                />
                <TextField
                  fullWidth
                  label="Assurance véhicule mensuelle"
                  value={formData.vehiculeAssurance || ''} 
                  onChange={(e) => handleChange('vehiculeAssurance', e.target.value)}
                  sx={{ mt: 2 }}
                />
                <TextField
                  fullWidth
                  label="Frais d'entretien mensuels (pneus, révision, etc.)"
                  value={formData.vehiculeFraisEntretien || ''} 
                  onChange={(e) => handleChange('vehiculeFraisEntretien', e.target.value)}
                  sx={{ mt: 2 }}
                />
              </AccordionDetails>
            </Accordion>
            <TextField
              fullWidth
              label="Services de transport (public, taxi, etc.)"
              value={formData.serviceTransport || ''} 
              onChange={(e) => handleChange('serviceTransport', e.target.value)}
              sx={{ mt: 2 }}
            />
            

            {/* Autres dépenses personnelles existantes (après l'accordéon Charges) */}
            <TextField
              fullWidth
              label="Habillement et chaussures"
              value={formData.habillementChaussures || ''} 
              onChange={(e) => handleChange('habillementChaussures', e.target.value)}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Abonnements loisirs (sport, clubs, etc.)"
              value={formData.abonnementLoisir || ''} 
              onChange={(e) => handleChange('abonnementLoisir', e.target.value)}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Budget restauration (restaurants, sorties, etc.)"
              value={formData.budgetRestauration || ''} 
              onChange={(e) => handleChange('budgetRestauration', e.target.value)}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Abonnements divertissement (streaming, etc.)"
              value={formData.abonnementDivertissement || ''} 
              onChange={(e) => handleChange('abonnementDivertissement', e.target.value)}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Loisirs culturels (cinéma, concerts, livres, etc.)"
              value={formData.loisirCulturel || ''} 
              onChange={(e) => handleChange('loisirCulturel', e.target.value)}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Animaux de compagnie (nourriture, soins, etc.)"
              value={formData.animauxCompagnie || ''} 
              onChange={(e) => handleChange('animauxCompagnie', e.target.value)}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Autres dépenses mensuelles récurrentes"
              value={formData.autreDepense || ''} 
              onChange={(e) => handleChange('autreDepense', e.target.value)}
              sx={{ mt: 2 }}
            />
          </Box>
        );

      case 29:
        return (
          <Box>
            <Typography variant="h6">Vos précisions et Questions</Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Si vous avez des éléments supplémentaires à nous communiquer ou des questions, veuillez les indiquer ici. Cela nous permettra d'adapter au mieux votre simulation."
              value={formData.questions || ''}
              onChange={(e) => handleChange('questions', e.target.value)}
              error={!!errors.questions}
              helperText={errors.questions}
              sx={{ mt: 2 }}
            />
            <FormControl fullWidth sx={{ mt: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                    checked={!!formData.consentementRGPD}
                    onChange={(e) => handleChange('consentementRGPD', e.target.checked)}
                />
              }
                label="J'accepte que mes données soient traitées conformément à la politique de confidentialité"
            />
            {errors.consentementRGPD && (
                <FormHelperText error>{errors.consentementRGPD}</FormHelperText>
            )}
            </FormControl>
          </Box>
        );

      default:
        return null;
    }
  };

  // Rendu conditionnel en fonction de l'existence d'un formulaire
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Si l'utilisateur a déjà un formulaire et n'est pas en mode édition
  if (hasExistingForm && !isEditMode) {
    return (
      <Paper sx={{ p: 3, mb: 3, bgcolor: '#f1e1c6', borderLeft: '4px solid #4caf50' }}>
        <Typography variant="h6" sx={{ color: '#2E5735', mb: 1 }}>
          Vous avez déjà rempli un formulaire
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Vous avez déjà soumis un formulaire de situation. Si vous souhaitez le modifier, cliquez sur le bouton ci-dessous.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="contained" 
            onClick={handleEditForm}
            sx={{ 
              mt: 1,
              backgroundColor: '#2E5735',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(46, 87, 53, 0.9)',
              },
              py: 1,
              px: 3,
              textTransform: 'none',
              fontSize: '1rem',
              borderRadius: '4px',
              fontWeight: 500,
              boxShadow: '0 3px 5px rgba(0,0,0,0.2)'
            }}
          >
            Modifier mon formulaire
          </Button>
          
          <Button 
            variant="outlined" 
            onClick={() => navigate('/dashboard')}
            sx={{ 
              mt: 1,
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
      </Paper>
    );
  }

  // 3) Condition pour afficher la page d'introduction
  if (!loading && !hasExistingForm && !isEditMode && showIntro) {
    return (
      <Box sx={{ p: 3, bgcolor: '#f1e1c6' }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Avant de commencer...
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          Les données que vous allez saisir serviront à générer votre simulation personnalisée.
          Si certaines questions vous semblent difficiles ou non applicables,
          vous pouvez les ignorer ou indiquer "0" – cela n'affectera pas la qualité de votre estimation.
        </Typography>
        <Button
          variant="contained"
          onClick={() => setShowIntro(false)}
          sx={{ 
            backgroundColor: '#2E5735', 
            color: '#fff',
            '&:hover': { backgroundColor: '#23652D' }
          }}
        >
          Commencer le formulaire
        </Button>
      </Box>
    );
  }

  // Le formulaire d'origine ou en mode édition
  return (
    <Box component="form" onSubmit={isEditMode ? handleSaveEdit : handleSubmit} sx={{ mt: 3 }}>
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}
      
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}
      
      {/* Animation de redirection */}
      {redirecting && (
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center',
            mb: 3,
            p: 2,
            bgcolor: '#f1e1c6',
            borderRadius: 1
          }}
        >
          <CircularProgress size={40} sx={{ mb: 1, color: '#2E5735' }} />
          <Typography variant="body1">Redirection en cours...</Typography>
        </Box>
      )}
      
      {isEditMode && (
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Mode édition du formulaire</Typography>
          <Button 
            variant="outlined" 
            color="secondary" 
            onClick={handleCancelEdit}
          >
            Annuler les modifications
          </Button>
        </Box>
      )}
      
      {renderStep()}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        {currentStep > 1 && (
          <Button
            variant="outlined"
            onClick={handleBack}
            sx={{ 
              px: 4,
              color: '#2E5735',
              borderColor: '#2E5735',
              border: '2px solid #2E5735',
              '&:hover': {
                bgcolor: '#2E5735',
                color: 'white',
                borderColor: '#2E5735'
              }
            }}
          >
            Précédent
          </Button>
        )}
        
        {currentStep < 29 ? (
          <Button
            variant="contained"
            onClick={handleNavigation}
            sx={{ 
              px: 4,
              bgcolor: '#2E5735',
              border: '2px solid #2E5735',
              '&:hover': {
                bgcolor: '#2E5735',
              },
              ml: currentStep > 1 ? 0 : 'auto'
            }}
          >
            Suivant
          </Button>
        ) : (
          <Button
            type="submit"
            variant="contained"
            onClick={() => setIsSubmitRequested(true)}
            sx={{ 
              px: 4,
              bgcolor: '#2E5735',
              border: '2px solid #2E5735',
              '&:hover': {
                bgcolor: '#2E5735',
              },
              ml: currentStep > 1 ? 0 : 'auto'
            }}
          >
            {isEditMode ? 'Enregistrer les modifications' : 'Soumettre'}
          </Button>
        )}
      </Box>
    </Box>
  );
}

export default UserForm;
