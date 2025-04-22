import {
  Typography,
  Button,
  Container,
  Box,
  Paper,
  Grid,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Collapse,
  TextField,
  MenuItem,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Chip,
  List,
  ListItem,
  FormControlLabel,
  Checkbox,
  FormHelperText
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import React, { useState, useRef, useEffect, useLayoutEffect, useContext } from 'react';
import backgroundImage from '../assets/damefond.avif';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import axios from '../config/axios';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import { API_ROUTES } from '../config/api';
import { useForm, SubmitHandler, UseFormSetValue } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import FeaturesSection from '../components/FeaturesSection';
import { useGlobalModal } from '../contexts/GlobalModalContext';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { UserContext } from '../contexts/UserContext';

// Ajout du type pour les simulateurs disponibles
type SimulatorType = 'kine' | 'sagefemme' | 'infirmier';

// Interface pour typer les données du formulaire
interface IFormInput {
  nom: string;
  email: string;
  telephone: string;
  consentementRGPDHome: boolean;
}

// Fonction pour formater les nombres
const formatNumber = (num: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0
  }).format(num);
};

// Définition des données de la FAQ
const faqData = [
  {
    question: "Qu'est-ce qu'ODIA Stratégie et à qui s'adresse cette solution ?",
    answer: "ODIA Stratégie est un accompagnement destiné aux professionnels de santé libéraux (kinésithérapeutes, infirmiers, pédicures-podologues, orthophonistes, orthoptistes, sages-femmes) souhaitant optimiser leur gestion administrative et financière pour réduire leurs charges (URSSAF, CARPIMKO/CARCDSF, impôts) et augmenter leur épargne disponible, tout en restant conformes au cadre légal français. Nous aidons à transformer les défis administratifs en opportunités de croissance financière."
  },
  {
    question: "Quels sont les avantages concrets d'utiliser la stratégie ODIA ?",
    answer: "Les avantages incluent une réduction significative de vos cotisations sociales et impôts (en moyenne nos clients économisent 20 000€ par an), une augmentation de votre capacité d'épargne et d'investissement, un gain de temps considérable sur la gestion administrative, et une tranquillité d'esprit grâce à un accompagnement conforme et sécurisé."
  },
  {
    question: "Combien de temps faut-il pour voir les premiers résultats d'économie ?",
    answer: "Les premiers résultats sont observés dès les premiers mois. L'impact complet se mesure sur une année fiscale complète."
  },
  {
    question: "Quels sont les tarifs de la stratégie ODIA ?",
    answer: "Le coût de nos prestations dépend du forfait qui vous est proposé suite à votre simulation personnalisée. Chez ODIA, nous proposons des conditions de paiement exceptionnelles : vous ne payez qu'avec une partie des économies que nous vous aidons à générer. Cela signifie que vous êtes rentable dès la première année, et que, pour le reste de votre carrière, vous bénéficiez de notre stratégie sans dépenser plus. En d'autres termes, vous pouvez passer à l'action immédiatement, puisque nos honoraires ne sont prélevés qu'une fois que tout est mis en place pour vous."
  },
  {
    question: "Je suis encore étudiant(e) et je vais bientôt être diplômé(e). Est-ce qu'ODIA peut m'aider à bien démarrer ?",
    answer: "Absolument ! Pour ceux qui s'apprêtent à lancer leur carrière, ODIA intervient dès le début en prenant en charge l'intégralité des démarches administratives. Mettre en place une stratégie d'optimisation de vos revenus dès vos premiers pas professionnels est essentiel pour maximiser vos économies et bâtir un avenir financier solide. Nous sommes là pour que vous démarriez votre carrière dans les meilleures conditions possibles."
  }
];

function Home() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const { width, height } = useWindowSize();
  const simulateurRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const rdvRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { openModal, closeModal, anyModalOpen, setAnyModalOpen } = useGlobalModal();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // États pour le simulateur
  const [selectedSim, setSelectedSim] = useState<SimulatorType>("kine");
  const [chiffreAffaires, setChiffreAffaires] = useState<string>("");
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [resultsExpanded, setResultsExpanded] = useState(true);
  const [simLoading, setSimLoading] = useState<boolean>(false);
  const [simError, setSimError] = useState<string>("");
  const [showResults, setShowResults] = useState<boolean>(false);

  // États pour le formulaire
  const [formExpanded, setFormExpanded] = useState(true);
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<IFormInput>({ 
    defaultValues: {
      consentementRGPDHome: false 
    }
  });
  const [success, setSuccess] = useState(false);

  // Ajouter un état de chargement spécifique pour le formulaire
  const [formLoading, setFormLoading] = useState(false);

  // Ajouter les états pour la modal
  const [openModalState, setOpenModalState] = useState(false);
  const [userCredentials, setUserCredentials] = useState({ email: '', password: '', nom: '' });
  // Ajouter un état pour le token d'auto-login
  const [autoLoginToken, setAutoLoginToken] = useState<string | null>(null);

  // Ajouter cet état pour gérer l'ouverture/fermeture du modal du formulaire
  const [openFormModalState, setOpenFormModalState] = useState<boolean>(false);

  // Ajouter cet état pour gérer l'ouverture/fermeture de la modale du simulateur
  const [openSimModalState, setOpenSimModalState] = useState<boolean>(false);

  // Définir les valeurs par défaut pour les select
  const defaultValues = {
    consentementRGPDHome: false,
    // ... autres valeurs par défaut si nécessaire
  };

  // Ajouter votre nouvel useEffect ICI
  useEffect(() => {
    const resetScroll = () => {
      window.scrollTo(0, 0);
    };
    resetScroll();
    const timer = setTimeout(resetScroll, 50);
    return () => clearTimeout(timer);
  }, []);

  // Remplacer cet useEffect par useLayoutEffect pour qu'il s'exécute AVANT le rendu visuel
  useLayoutEffect(() => {
    // Forcer le scroll en haut de la page lors du chargement initial
    if (!location.state?.scrollTo && !window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, []);
  
  // Modifier cet useEffect pour supprimer les références à "inscription"
  useEffect(() => {
    // Récupérer la section depuis l'état de navigation ou depuis l'URL
    const { state } = location;
    // Suppression de la vérification du hash
    
    // Navigation intentionnelle via state
    if (state?.scrollTo) {
      setTimeout(() => {
        switch (state.scrollTo) {
          case 'simulateur':
            simulateurRef.current?.scrollIntoView({ behavior: 'smooth' });
            break;
          case 'contact':
            contactRef.current?.scrollIntoView({ behavior: 'smooth' });
            break;
          case 'rdv':
            rdvRef.current?.scrollIntoView({ behavior: 'smooth' });
            setFormExpanded(true);
            break;
          // Suppression du cas 'inscription'
        }
      }, 100); // Petit délai pour s'assurer que le DOM est prêt
    }
    // Suppression de la vérification du hash "#inscription"
  }, [location]);

  // Ajouter cet useEffect pour empêcher le comportement de défilement automatique du navigateur
  useEffect(() => {
    // Fonction pour empêcher le défilement automatique lorsqu'un hash est présent dans l'URL
    const handleHashChange = () => {
      // Ne rien faire ici, juste empêcher le comportement par défaut
      // Le défilement sera géré manuellement par l'autre useEffect
    };
    
    // Intercepter les événements hashchange
    window.addEventListener('hashchange', handleHashChange);
    
    // Nettoyage lors du démontage du composant
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Gestion de la soumission du simulateur
  const handleSimulatorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSimLoading(true);
    setSimError("");
    // --- Début Nouveau Code ---
    // Réinitialiser l'affichage des résultats et confetti si une nouvelle simulation est lancée
    setData(null);
    setShowResults(false);
    setShowConfetti(false);
    // --- Fin Nouveau Code ---

    if (!chiffreAffaires) {
      // Utiliser setSimError au lieu de alert pour la cohérence de l'UI
      setSimError("Veuillez entrer un chiffre d'affaires.");
      setSimLoading(false);
      return;
    }

    // --- Début Nouveau Code ---
    // Ajout de la vérification du montant minimal
    if (Number(chiffreAffaires) < 51000) {
      // MODIFICATION: Mise à jour du message d'erreur
      setSimError("Le montant minimal pour une simulation est de 51 000 €. Vous pouvez réserver un Appel Gratuit ou inscrivez-vous à l'espace visiteur pour échanger avec un conseiller.");
      setSimLoading(false);
      return; // Arrêter l'exécution si le montant est trop bas
    }
    // --- Fin Nouveau Code ---

    try {
      // --- Début Modification ---
      // S'assurer que simError est bien vide avant de faire l'appel
      // setSimError(""); // Déplacé au début de la fonction
      // --- Fin Modification ---
      const response = await axios.get(`/api/simulateur/${selectedSim}?brut=${chiffreAffaires}`);

      // Stocker les données dans l'état
      setData(response.data);

      // Activer l'animation Confetti
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);

      // Afficher les résultats
      setShowResults(true);
      // --- Début Nouveau Code ---
      // S'assurer que les résultats sont visibles si le Collapse était fermé
      setResultsExpanded(true);
      // --- Fin Nouveau Code ---

    } catch (error) {
      setSimError("Une erreur est survenue lors du calcul. Veuillez réessayer.");
      // --- Début Nouveau Code ---
      // S'assurer que les anciens résultats/confetti sont cachés en cas d'erreur
      setData(null);
      setShowResults(false);
      setShowConfetti(false);
      // --- Fin Nouveau Code ---
    } finally {
      setSimLoading(false);
    }
  };

  // Vérifier l'état de la session au chargement
  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (userData && token) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  // Modifié: Utiliser closeModal lors de la fermeture du modal des credentials
  const handleCloseCredentialsModal = () => {
    closeModal(); // S'assurer que le contexte est notifié de la fermeture
    setOpenModalState(false);
  };

  // Modifié: Simplifier l'ouverture du modal des credentials
  const handleOpenCredentialsModal = () => {
     // On force la fermeture de tout modal potentiellement encore considéré comme ouvert par le contexte
     closeModal(); 
     // On ouvre ensuite la modale des credentials localement
     setOpenModalState(true);
  };

  // Modifié: Mettre à jour le contexte utilisateur avant la redirection
  const handleModalAction = async () => {
    try {
      // Étape 1: Stocker le token si disponible
      if (autoLoginToken) {
        localStorage.setItem('token', autoLoginToken);
        console.log('Token stocké dans localStorage avant récupération user');
      } else {
           console.warn("Pas de token d'auto-login disponible pour stocker.");
           // Idéalement, gérer ce cas (peut-être afficher une erreur et ne pas naviguer ?)
           // Pour l'instant, on continue, mais la récupération user échouera probablement.
      }

      // Étape 2: Récupérer les données utilisateur complètes depuis le serveur
      try {
        // L'instance axios devrait être configurée pour envoyer le token automatiquement
        const me = await axios.get(API_ROUTES.auth.user_data);
        if (me.data.success && me.data.user) {
          setUser(me.data.user);
          console.log('UserContext mis à jour:', me.data.user);
        } else {
          console.error('Échec de la récupération des données utilisateur ou utilisateur manquant:', me.data);
          // Envisager d'afficher une erreur à l'utilisateur ici
          // setError("Impossible de charger vos informations utilisateur.");
        }
      } catch (e) {
        console.error('Erreur lors de la récupération user_data:', e);
        // Envisager d'afficher une erreur à l'utilisateur ici
        setError("Une erreur réseau est survenue lors du chargement de vos informations.");
        // On pourrait choisir de ne pas naviguer en cas d'échec critique ici
        // return; 
      }

      // Étape 3: Fermer la modale et naviguer vers la page de prise de RDV
      closeModal();
      setOpenModalState(false);
      navigate('/dashboard/appointment/tel', { replace: true });

    } catch (error) { // Attrape les erreurs de stockage de token ou autres erreurs inattendues
      console.error("Erreur dans handleModalAction:", error);
      setError("Une erreur est survenue lors de la finalisation de l'inscription."); // Informer l'utilisateur
      // S'assurer que la modale est fermée même en cas d'erreur
      closeModal();
      setOpenModalState(false);
    }
  };

  // Définition de la fonction onSubmit
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setFormLoading(true);
    setError("");
    setSuccess(false);

    try {
      // La conversion est gérée par onChange, mais gardée ici par sécurité
      const emailLowerCase = data.email.toLowerCase();
      const response = await axios.post(API_ROUTES.submit_form, {
        ...data,
        email: emailLowerCase, // Assurer que l'email envoyé est en minuscule
        autoLogin: true,
        prenom: data.nom // Utiliser le nom comme prénom par défaut
      });

      if (response.data.success) {
        setSuccess(true);
        handleCloseFormModal(); // Fermer la modale du formulaire

        // Gérer les credentials retournés pour la modale suivante
        if (response.data.credentials) {
          setUserCredentials(response.data.credentials);
          if (response.data.autoLoginToken) {
            setAutoLoginToken(response.data.autoLoginToken);
          }
          // Ouvrir la modale des credentials après un court délai
          setTimeout(() => {
            handleOpenCredentialsModal();
          }, 100); 
        } else {
          // Que faire si pas de credentials ? Peut-être rediriger directement ?
          // Pour l'instant, ne rien faire de plus que fermer la modale.
           console.warn("Inscription réussie mais pas de credentials reçus.");
        }
      } else {
         // Gérer les erreurs métier retournées par le backend
        setError(response.data.message || "Une erreur est survenue.");
      }
    } catch (error: any) { // Utiliser any pour accéder à error.response
      console.error("Erreur lors de l'envoi du formulaire:", error);
      
      // ✨ MODIFICATION: Gérer spécifiquement l'erreur 409 (Email déjà utilisé)
      if (error.response && error.response.status === 409) {
        setError("Cette adresse email est déjà utilisée.");
      } else {
        // Gérer les autres erreurs (serveur, réseau, etc.)
        const message = error.response?.data?.message || "Une erreur est survenue lors de l'envoi du formulaire.";
        setError(message);
      }
    } finally {
      setFormLoading(false); // Arrêter le chargement dans tous les cas (succès ou erreur)
    }
  };

  // --- Nouvelles fonctions pour gérer l'ouverture/fermeture des modaux spécifiques ---

  const handleOpenSimModal = () => {
    if (openModal()) {
      setOpenSimModalState(true);
    } else {
      console.log("Ouverture du modal simulateur bloquée.");
    }
  };

  const handleCloseSimModal = () => {
    closeModal();
    setOpenSimModalState(false);
  };

  const handleOpenFormModal = () => {
    if (openModal()) {
      setOpenFormModalState(true);
    } else {
      console.log("Ouverture du modal formulaire bloquée.");
    }
  };

  const handleCloseFormModal = () => {
    closeModal();
    setOpenFormModalState(false);
  };

  // Fonction spécifique pour passer de SimModal à FormModal
  const switchToFormModal = () => {
    // 1. Fermer la modale Simulateur (appelle closeModal())
    handleCloseSimModal();

    // 2. Attendre la prochaine itération
    setTimeout(() => {
        // 3. Réinitialiser les états du formulaire si nécessaire (optionnel ici, car géré par handleOpenFormModal original mais peut être utile)
        // setSuccess(false);
        // setError("");
        // resetForm(); // Si vous aviez un reset spécifique pour ce formulaire

        // 4. Signaler manuellement au contexte qu'un modal s'ouvre
        setAnyModalOpen(true);

        // 5. Ouvrir la modale Formulaire localement
        setOpenFormModalState(true);

    }, 0); // Délai minimal
  };

  return (
    <Box sx={{ 
      backgroundColor: '#f1e1c6', // Couleur de fond pour toute la page
      minHeight: '100vh'  
    }}>
      {/* Hero Section avec image de fond optimisée */}
      <Box 
        sx={{
          position: 'relative',
          minHeight: '55vh',
          width: '100%',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'top center',
            backgroundRepeat: 'no-repeat',
            zIndex: 0
          }
        }}
      >
        {/* Contenu centré sur l'image */}
        <Container 
          maxWidth="lg" 
          sx={{
            position: 'relative',
            zIndex: 2,
            height: 'auto',
            display: 'flex',
            alignItems: 'center',
            pt: 12,
            pl: { 
              xs: 4,     // 2cm sur mobile (environ)
              md: 0     // 2cm sur desktop (environ)
            }  // Padding left augmenté
          }}
        >
          <Box maxWidth="600px">
            <Box sx={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.35)', 
              p: 2, 
              borderRadius: 2,
              backdropFilter: 'blur(2px)'
            }}>
              <Typography 
                variant="h1" 
                sx={{ 
                  fontWeight: 700,
                  fontSize: { xs: '1.8rem', md: '2.8rem' },
                  mb: 2,
                  color: '#2E5735',
                  lineHeight: { xs: 1.1, md: 1.2 },
                  opacity: 0.9,
                  textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)'
                }}
              >
                Professionnels de Santé:<br />
                Gagnez du Temps et<br />
                Économisez Jusqu'à<br />
                20 000 € par An 
                
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 4,
                  color: '#2E5735',
                  fontSize: { xs: '1rem', md: '1.2rem' },
                  lineHeight: { xs: 1.3, md: 1.5 },
                  opacity: 0.9,
                  textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)'
                }}
              >
                Accompagnement administratif complet<br />
                et conforme au cadre légal français
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 0 }}>
              <Button 
                variant="outlined"
                size="large"
                onClick={handleOpenSimModal}
                sx={{
                  color: '#2E5735',
                  borderColor: '#2E5735',
                  backgroundColor: 'rgba(255, 255, 255, 0.35)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.57)',
                    borderColor: '#2E5735',
                  },
                  py: { xs: 0.8, md: 1.5 },
                  px: { xs: 2, md: 4 },
                  textTransform: 'none',
                  fontSize: { xs: '0.9rem', md: '1.1rem' },
                  borderWidth: '2px',
                  mt: 4
                }}
              >
                Faire une simulation
              </Button>
              <Button 
                variant="contained" 
                onClick={handleOpenFormModal}
                sx={{
                  backgroundColor: '#D32F2F',
                  '&:hover': {
                    backgroundColor: '#303f9f',
                    boxShadow: '0 4px 10px rgba(48, 63, 159, 0.4)'
                  },
                  py: { xs: 0.8, md: 1.5 },
                  px: { xs: 2, md: 4 },
                  mt: 4,
                  ml: { xs: 1, md: 2 },
                  fontSize: { xs: '0.9rem', md: '1.2rem' },
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  textTransform: 'none'
                }}
              >
                <PhoneIcon sx={{ fontSize: { xs: '1rem', md: '1.2rem' } }} /> Appel Gratuit 
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Section des caractéristiques */}
      <FeaturesSection />

      {/* Nouvelle Section FAQ (modifiée) */}
      <Container sx={{ py: 2 }}>
        <Box sx={{ maxWidth: '800px', mx: 'auto' }}> 
          {/* Accordion parent pour toute la FAQ */}
          <Accordion 
            sx={{ 
              mb: 1.5, 
              '&:before': { display: 'none' }, 
              borderRadius: '8px !important', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)', 
              backgroundColor: '#f1e1c6' 
            }}
          >
            <AccordionSummary 
              expandIcon={<ExpandMoreIcon sx={{ color: '#2E5735' }} />} 
              sx={{ 
                py: 1, 
                '& .MuiAccordionSummary-content': {
                   margin: '12px 0 !important' 
                }
              }}
            >
              {/* Titre principal de la FAQ dans le Summary */}
              <Typography variant="h4" sx={{ color: '#2E5735', fontWeight: 'bold', width: '100%', textAlign: 'center' }}> 
                FAQ
              </Typography>
            </AccordionSummary>
            {/* Les Q/R individuelles dans les Details */}
            <AccordionDetails sx={{ backgroundColor: '#f7f7f7', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px', p: 3 }}>
              {faqData.map((item, index) => (
                <Accordion 
                  key={index} 
                  sx={{ 
                    mb: 1.5, 
                    '&:before': { display: 'none' }, 
                    borderRadius: '8px !important', 
                    boxShadow: '0 1px 4px rgba(0,0,0,0.08)', 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)' 
                  }}
                >
                  <AccordionSummary 
                    expandIcon={<ExpandMoreIcon sx={{ color: '#2E5735' }} />} 
                    sx={{ 
                      py: 0.5, 
                      '& .MuiAccordionSummary-content': {
                         margin: '10px 0 !important' 
                      }
                    }}
                  >
                    <Typography sx={{ fontWeight: 'bold', color: '#2E5735' }}>{item.question}</Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ backgroundColor: '#fff' }}> 
                    <Typography sx={{ color: '#333' }}>{item.answer}</Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </AccordionDetails>
          </Accordion>
        </Box>
      </Container>

      {/* Section des parcours */}
      {/* <Container sx={{ py: 8 }}>
        {/* Les Grid items pour Parcours Client et Nos Missions ont été supprimés */}
      {/* </Container> */}

      {/* Section Simulateur avec formulaire et règles */}
      <Container ref={simulateurRef} sx={{ py: 0, textAlign: 'center' }}>
        {/* Section RDV Stratégique */}
        <Container sx={{ py: 1 }} ref={rdvRef}>
          {/* Conteneur pour centrer le bouton */}
        </Container>
      </Container>

      {/* Modal des credentials */}
      <Dialog
        open={openModalState}
        onClose={handleCloseCredentialsModal}
        aria-labelledby="credentials-dialog-title"
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            backgroundColor: 'rgba(255,255,255,0.95)'
          }
        }}
      >
        <DialogTitle id="credentials-dialog-title" sx={{ 
          backgroundColor: '#2E5735', 
          color: 'white',
          textAlign: 'center',
          py: 2
        }}>
          Prendre un rendez-vous téléphonique
        </DialogTitle>
        <DialogContent sx={{ mt: 2, p: 4 }}>
          <Typography variant="body1" paragraph>
            Félicitations ! Vous pouvez maintenant choisir un créneau pour votre rendez-vous téléphonique dans votre espace visiteur.
          </Typography>
          <Typography variant="body2" sx={{ mt: 3, color: 'text.secondary', fontStyle: 'italic' }}>
            Un conseiller vous contactera au numéro que vous avez renseigné.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, backgroundColor: 'background.paper' }}>
          <Button 
            onClick={handleModalAction}
            variant="contained"
            sx={{
              backgroundColor: '#2E5735',
              '&:hover': {
                backgroundColor: '#303f9f'
              },
              px: 3
            }}
          >
            Choisir un créneau
          </Button>
          <Button 
            onClick={handleCloseCredentialsModal}
            variant="outlined"
            sx={{
              color: '#2E5735',
              borderColor: '#2E5735',
              '&:hover': {
                borderColor: '#303f9f',
                backgroundColor: 'rgba(63, 81, 181, 0.05)'
              },
              px: 3
            }}
          >
            Fermer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Ajouter cette nouvelle modale pour le formulaire */}
      <Dialog
        open={openFormModalState}
        onClose={handleCloseFormModal}
        aria-labelledby="form-dialog-title"
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            backgroundColor: 'rgba(255,255,255,0.95)'
          }
        }}
      >
        <DialogTitle id="form-dialog-title" sx={{ 
          backgroundColor: '#2E5735', 
          color: 'white',
          textAlign: 'center',
          py: 2
        }}>
          Rendez-vous téléphonique / Inscription visiteur
        </DialogTitle>
        <DialogContent sx={{ mt: 2, p: 4 }}>
          {success && <Alert severity="success">✅ Votre demande a bien été envoyée.</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField 
              fullWidth 
              label="Nom" 
              {...register("nom", { 
                required: "Le nom est requis",
                pattern: {
                  value: /^\S+$/, // Regex: Doit ne contenir que des caractères non-espaces
                  message: "Le nom ne doit pas contenir d'espace" 
                }
              })}
              onChange={(e) => {
                // Nettoyage en temps réel : supprime tous les espaces
                const value = e.target.value.replace(/\s+/g, "");
                // Met à jour la valeur dans react-hook-form et valide
                setValue("nom", value, { shouldValidate: true }); 
              }}
              inputProps={{ 
                pattern: "\\S+" // Attribut HTML5 pour validation navigateur (double échappement nécessaire)
              }}
              error={!!errors.nom}
              helperText={errors.nom ? errors.nom.message : ""}
              sx={{ mb: 2 }} 
            />
            <TextField 
              fullWidth 
              label="Email" 
              type="email"
              {...register("email", { 
                required: "L'email est requis",
                 pattern: { // Garder la validation de pattern si elle existe
                   value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                   message: "Adresse email invalide"
                 }
              })}
              onChange={(e) => {
                const lowerCaseEmail = e.target.value.toLowerCase();
                setValue('email', lowerCaseEmail, { shouldValidate: true });
              }}
              error={!!errors.email}
              helperText={errors.email ? errors.email.message : ""}
              sx={{ mb: 2 }} 
            />
            <TextField 
              fullWidth 
              label="Téléphone" 
              {...register("telephone", { required: true })}
              error={!!errors.telephone}
              helperText={errors.telephone ? "Ce champ est requis" : ""}
              sx={{ mb: 2 }} 
            />

            <FormControl sx={{ mb: 2 }} required error={!!errors.consentementRGPDHome}>
              <FormControlLabel
                control={
                  <Checkbox
                    {...register('consentementRGPDHome', { required: true })}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2">
                    J'accepte la <Link component={RouterLink} to="/privacy-policy" sx={{ color: '#2E5735' }}>Politique de confidentialité</Link>
                  </Typography>
                }
              />
              {errors.consentementRGPDHome && (
                <FormHelperText error>
                  Vous devez accepter la Politique de confidentialité pour continuer
                </FormHelperText>
              )}
            </FormControl>

            <Button 
              fullWidth 
              variant="contained" 
              type="submit" 
              disabled={formLoading}
              sx={{
                backgroundColor: '#2E5735',
                '&:hover': {
                  backgroundColor: '#303f9f'
                }
              }}
            >
              {formLoading ? <CircularProgress size={24} color="inherit" /> : "📱 Prendre un rendez-vous téléphonique"}
            </Button>
          </form>
        </DialogContent>
        <DialogActions sx={{ p: 3, backgroundColor: 'background.paper' }}>
          <Button 
            onClick={handleCloseFormModal}
            variant="outlined"
            sx={{
              color: '#2E5735',
              borderColor: '#2E5735',
              '&:hover': {
                borderColor: '#303f9f',
                backgroundColor: 'rgba(63, 81, 181, 0.05)'
              },
              px: 3
            }}
          >
            Fermer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Ajouter la nouvelle modale pour le simulateur */}
      <Dialog
        open={openSimModalState}
        onClose={handleCloseSimModal}
        aria-labelledby="simulator-dialog-title"
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            backgroundColor: 'rgba(255,255,255,0.95)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }
        }}
        sx={{
          zIndex: 10000
        }}
      >
        <DialogTitle id="simulator-dialog-title" sx={{
          backgroundColor: '#2E5735',
          color: 'white',
          textAlign: 'center',
          py: 2,
          position: 'sticky',
          top: 0,
          zIndex: 1
        }}>
          🧮 Simulation
        </DialogTitle>

        {isMobile && (
           <Box sx={{ 
               p: 2, 
               bgcolor: 'background.paper',
               borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
               position: 'sticky',
               top: '64px',
               zIndex: 1,
               display: 'flex', 
               flexDirection: 'column',
               alignItems: 'center', 
               gap: 1
           }}>
               <Typography variant="body2" sx={{ textAlign: 'center', mb: 1, fontWeight: 'medium' }}>
                  Simulation personnalisée ? <br/> Inscrivez-vous ou réservez un appel gratuit.
               </Typography>
               <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, width: '100%'}}>
                   <Button
                     variant="contained"
                     onClick={switchToFormModal}
                     size="small"
                     sx={{
                       flexGrow: 1,
                       backgroundColor: '#D32F2F',
                       '&:hover': {
                         backgroundColor: '#B71C1C',
                       },
                       py: 0.8,
                       px: 1.5,
                       fontSize: '0.8rem',
                       textTransform: 'none'
                     }}
                   >
                     Appel Gratuit
                   </Button>
                   <Button
                     onClick={handleCloseSimModal}
                     variant="outlined"
                     size="small"
                     sx={{
                       flexGrow: 1,
                       color: '#2E5735',
                       borderColor: '#2E5735',
                       '&:hover': {
                         borderColor: '#303f9f',
                         backgroundColor: 'rgba(63, 81, 181, 0.05)'
                       },
                       py: 0.8,
                       px: 1.5,
                       fontSize: '0.8rem',
                     }}
                   >
                     Fermer
                   </Button>
               </Box>
           </Box>
         )}

        <DialogContent sx={{ 
            mt: 0,
            p: { xs: 2, sm: 4 }
        }}>
          {showConfetti && <Confetti width={width} height={height} style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999 }} />}
          
          {/* Tabs de sélection */}
          <Tabs 
            value={selectedSim}
            onChange={(_, newValue) => setSelectedSim(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              mb: 4,
              '& .MuiTab-root': {
                color: '#2E5735',
                fontWeight: 500,
                fontSize: '1.1rem',
                textTransform: 'none',
                minWidth: 'auto',
                flexShrink: 0,
                '&.Mui-selected': {
                  color: '#2E5735',
                  fontWeight: 700
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#2E5735'
              },
              overflowX: 'auto',
            }}
          >
            <Tab label="Kinésithérapeute" value="kine" />
            <Tab label="Sage-Femme" value="sagefemme" />
            <Tab label="Infirmier" value="infirmier" />
          </Tabs>

          {/* Formulaire */}
          <Box sx={{ mt: 6, width: "100%", textAlign: "center" }}>
            <Paper elevation={3} sx={{ p: 4, maxWidth: "600px", margin: "auto", backgroundColor: "white" }}>
              {simError && <Alert severity="warning" sx={{ mb: 3 }}>{simError}</Alert>}

              <form onSubmit={handleSimulatorSubmit}>
                <TextField
                  fullWidth
                  label="Chiffre d'Affaires Annuel (€)"
                  variant="outlined"
                  type="number"
                  value={chiffreAffaires}
                  onChange={(e) => setChiffreAffaires(e.target.value)}
                  placeholder="Entrez votre CA annuel"
                  sx={{ mb: 3 }}
                />
                <Box sx={{ display: "inline-flex", gap: 2 }}>
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={simLoading}
                    sx={{
                      backgroundColor: '#2E5735',
                      '&:hover': {
                        backgroundColor: '#303f9f'
                      }
                    }}
                  >
                    {simLoading ? <CircularProgress size={24} /> : "CALCULER"}
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    type="button"
                    onClick={(e) => {
                      e.preventDefault(); // Empêche toute soumission de formulaire
                      handleCloseSimModal();
                      navigate("/regles-de-calcul");
                    }}
                    sx={{
                      color: '#2E5735',
                      borderColor: '#2E5735',
                      '&:hover': {
                        borderColor: '#303f9f', 
                        backgroundColor: 'rgba(63, 81, 181, 0.15)',
                        boxShadow: '0 4px 8px rgba(63, 81, 181, 0.3)',
                        transition: 'all 0.2s ease'
                      }
                    }}
                  >
                    Règles de calcul
                  </Button>
                </Box>
              </form>
            </Paper>
          </Box>

          {/* Bouton pour masquer/afficher les résultats */}
          {showResults && data && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 2 }}>
              <Button 
                variant="contained"
                onClick={() => setResultsExpanded(!resultsExpanded)}
                endIcon={resultsExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                sx={{ 
                  bgcolor: '#4A4A4A',
                  '&:hover': {
                    bgcolor: '#3A3A3A'
                  }
                }}
              >
                Voir les résultats
              </Button>
            </Box>
          )}

          {/* Affichage des résultats du simulateur */}
          {simLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {simError && (
            <Alert severity="error" sx={{ my: 2 }}>
              {simError}
            </Alert>
          )}

          {showResults && data && (
            <Collapse in={resultsExpanded}>
              <>
                {/* Résultats BNC et ODIA */}
                <Grid container spacing={3} sx={{ mt: 2 }}>
                  <Grid item xs={12} md={6}>
                    <Paper elevation={1} sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                      <Box
                        sx={{
                          backgroundColor: '#4A4A4A',
                          color: '#fff',
                          padding: '8px 16px',
                          borderRadius: '4px',
                          fontWeight: 500,
                          textAlign: 'center',
                          display: 'inline-block',
                          marginBottom: '16px',
                          fontSize: '0.875rem',
                          textTransform: 'uppercase',
                          lineHeight: 1.75,
                          minWidth: '64px'
                        }}
                      >
                        Avant ODIA
                      </Box>
                      <List>
                        {Object.entries({
                          cotisations: "CARPIMKO ou CARCDSF",
                          contribution: "URSSAF",
                          impot_sur_le_revenu: "IMPÔT (IR)",
                          epargne_disponible: "MONTANT À RÉINVESTIR (épargne disponible)"
                        }).map(([key, label]) => (
                          <ListItem key={key} sx={{ justifyContent: 'center' }}>
                            {`${label} :`}<strong>{formatNumber(data.simulation_bnc[key] || 0)}</strong>
                          </ListItem>
                        ))}
                      </List>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Paper elevation={1} sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                      <Box
                        sx={{
                          backgroundColor: '#2E5735',
                          color: '#fff',
                          padding: '8px 16px',
                          borderRadius: '4px',
                          fontWeight: 500,
                          textAlign: 'center',
                          display: 'inline-block',
                          marginBottom: '16px',
                          fontSize: '0.875rem',
                          textTransform: 'uppercase',
                          lineHeight: 1.75,
                          minWidth: '64px'
                        }}
                      >
                        Après ODIA
                      </Box>
                      <List>
                        {Object.entries({
                          cotisations: "CARPIMKO ou CARCDSF",
                          contribution: "URSSAF",
                          impot_sur_le_revenu: "IMPÔT (IR)",
                          total_epargne_disponible: "MONTANT À RÉINVESTIR (épargne disponible)"
                        }).map(([key, label]) => (
                          <ListItem key={key} sx={{ justifyContent: 'center' }}>
                            {`${label} :`}<strong>{formatNumber(data.simulation_odia[key] || 0)}</strong>
                          </ListItem>
                        ))}
                      </List>
                    </Paper>
                  </Grid>
                </Grid>

                {/* Indicateurs financiers supplémentaires */}
                {data.simulation_odia.performance_montage && (
                  <Paper elevation={1} sx={{ p: 2, mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <Box
                      sx={{
                        backgroundColor: '#2E5735',
                        color: '#fff',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        fontWeight: 500,
                        textAlign: 'center',
                        display: 'inline-block',
                        marginBottom: '16px',
                        fontSize: '0.875rem',
                        textTransform: 'uppercase',
                        lineHeight: 1.75,
                        minWidth: '64px'
                      }}
                    >
                      Vos bénéfices ODIA
                    </Box>
                    <List>
                      <ListItem sx={{ justifyContent: 'center' }}>
                        {`Économie annuelle :`}<strong>{formatNumber(data.simulation_odia.performance_montage || 0)}</strong>
                      </ListItem>
                      {data.simulation_odia.capital_revenu_place_10ans && (
                        <ListItem sx={{ justifyContent: 'center' }}>
                          {`Capital investi accumulé en 10 ans :`}<strong>{formatNumber(data.simulation_odia.capital_revenu_place_10ans || 0)}</strong>
                        </ListItem>
                      )}
                      {data.simulation_odia.interet_mensuel_capital_10ans && (
                        <ListItem sx={{ justifyContent: 'center' }}>
                          {`Revenu mensuel généré par ce capital en 10 ans :`}<strong>{formatNumber(data.simulation_odia.interet_mensuel_capital_10ans || 0)}</strong>
                        </ListItem>
                      )}
                    </List>
                  </Paper>
                )}

                {/* Graphique 1 : Charges (URSSAF, CARPIMKO, impôt) */}
                <Typography variant="h5" sx={{ mt: 6, mb: 2 }}>
                  Voyez immédiatement combien vous économisez sur vos charges grâce à ODIA
                </Typography>
                <Box sx={{ width: "100%", height: 300, backgroundColor: '#fff', borderRadius: '4px', p: 2 }}>
                  <ResponsiveContainer>
                    <BarChart
                      data={[
                        {
                          name: "URSSAF",
                          BNC: data.simulation_bnc?.cotisations || 0,
                          ODIA: data.simulation_odia?.cotisations || 0
                        },
                        {
                          name: "CARPIMKO ou CARCDSF",
                          BNC: data.simulation_bnc?.contribution || 0,
                          ODIA: data.simulation_odia?.contribution || 0
                        },
                        {
                          name: "Impôt IR",
                          BNC: data.simulation_bnc?.impot_sur_le_revenu || 0,
                          ODIA: data.simulation_odia?.impot_sur_le_revenu || 0
                        }
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatNumber(value as number)} />
                      <Legend />
                      <Bar dataKey="BNC" name="Avant ODIA" fill="#F39C12" />
                      <Bar dataKey="ODIA" name="Après ODIA" fill="#1ABC9C" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>

                {/* Graphique 2 : Épargne disponible */}
                <Typography variant="h5" sx={{ mt: 6, mb: 2 }}>
                  Découvrez à quel point votre épargne augmente chaque année avec notre stratégie
                </Typography>
                <Box sx={{ width: "100%", height: 300, backgroundColor: '#fff', borderRadius: '4px', p: 2 }}>
                  <ResponsiveContainer>
                    <BarChart
                      data={[
                        {
                          name: "Épargne Disponible",
                          BNC: data.simulation_bnc?.epargne_disponible || 0,
                          ODIA: data.simulation_odia?.total_epargne_disponible || 0
                        }
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatNumber(value as number)} />
                      <Legend />
                      <Bar dataKey="BNC" name="Avant ODIA" fill="#F39C12" />
                      <Bar dataKey="ODIA" name="Après ODIA" fill="#1ABC9C" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </>
            </Collapse>
          )}
        </DialogContent>
        <DialogActions sx={{
            p: { xs: 1, sm: 3 },
            backgroundColor: 'background.paper',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(0, 0, 0, 0.12)',
            position: 'sticky',
            bottom: 0,
            zIndex: 1,
            display: { xs: 'none', sm: 'flex' }
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              alignSelf: 'center',
              mr: 2,
              fontWeight: 'bold',
              fontSize: '1.1rem',
            }}
          >
            Simulation personnalisée ? Inscrivez-vous à l'espace visiteur ou réservez un appel gratuit
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              variant="contained"
              onClick={switchToFormModal}
              sx={{
                backgroundColor: '#D32F2F',
                '&:hover': {
                  backgroundColor: '#B71C1C',
                  boxShadow: '0 4px 10px rgba(183, 28, 28, 0.4)'
                },
                py: { xs: 0.8, md: 1 },
                px: { xs: 2, md: 3 },
                fontSize: { xs: '0.9rem', md: '1rem' },
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                textTransform: 'none',
                mr: 1
              }}
            >
              Appel Gratuit
            </Button>
            <Button
              onClick={handleCloseSimModal}
              variant="outlined"
              sx={{
                color: '#2E5735',
                borderColor: '#2E5735',
                '&:hover': {
                  borderColor: '#303f9f',
                  backgroundColor: 'rgba(63, 81, 181, 0.05)'
                },
                px: 3
              }}
            >
              Fermer
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Home;
