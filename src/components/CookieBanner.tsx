import React, { useState, useEffect } from 'react';
import {
  Paper, Typography, Button, Box, Link as MuiLink,
  Modal, Checkbox, FormControlLabel, FormGroup, IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Link as RouterLink } from 'react-router-dom';
import { useGlobalModal } from '../contexts/GlobalModalContext';

// Structure pour stocker les préférences
interface CookiePreferences {
  analytics: boolean;
  clarity: boolean;
}

// Structure pour l'état global du consentement
interface ConsentStatus {
  status: 'accepted' | 'declined' | 'custom' | 'unset';
  preferences: CookiePreferences;
}

const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [currentPreferences, setCurrentPreferences] = useState<CookiePreferences>({
    analytics: false,
    clarity: false,
  });
  const { openModal, closeModal } = useGlobalModal();

  useEffect(() => {
    const consentData = localStorage.getItem('cookieConsent');
    let consent: ConsentStatus = { status: 'unset', preferences: { analytics: false, clarity: false } };

    if (consentData) {
      try {
        consent = JSON.parse(consentData);
        // Initialiser les préférences actuelles si des préférences custom existent déjà
        if (consent.status === 'custom' || consent.status === 'accepted') {
            setCurrentPreferences(consent.preferences);
        }
      } catch (e) {
        console.error("Erreur de parsing du consentement cookie:", e);
        // En cas d'erreur, on considère que le consentement n'est pas donné
        consent = { status: 'unset', preferences: { analytics: false, clarity: false } };
        localStorage.removeItem('cookieConsent'); // Nettoyer la donnée corrompue
      }
    }

    // Afficher le bandeau si aucun choix n'a été fait ('unset')
    if (consent.status === 'unset') {
      setIsVisible(true);
      // Pré-cocher les options par défaut dans le modal (optionnel, ici tout décoché)
      setCurrentPreferences({ analytics: false, clarity: false });
    } else {
      // Si un choix a été fait (accepted, declined, custom), masquer le bandeau
      setIsVisible(false);
      // Injecter les scripts selon les préférences enregistrées
      if (consent.status === 'accepted' || consent.status === 'custom') {
        injectScripts(consent.preferences);
      }
    }
  }, []);

  // Sauvegarde le consentement dans localStorage
  const saveConsent = (consent: ConsentStatus) => {
    localStorage.setItem('cookieConsent', JSON.stringify(consent));
    setIsVisible(false); // Masquer le bandeau principal après sauvegarde
    // Important : fermer le modal global si on ferme le modal des cookies
    if (showSettingsModal) {
      closeModal();
      setShowSettingsModal(false);
    }
    if (consent.status === 'accepted' || consent.status === 'custom') {
        injectScripts(consent.preferences);
    } else {
        // Optionnel : supprimer les scripts si l'utilisateur a tout refusé
        removeScripts();
    }
  };

  // Fonction d'injection adaptée pour prendre les préférences
  const injectScripts = (prefs: CookiePreferences) => {
    // Inject Google Analytics si autorisé
    if (prefs.analytics) {
        const gaScriptId = 'ga-script';
        if (!document.getElementById(gaScriptId)) {
            const scriptGA = document.createElement('script');
            scriptGA.id = gaScriptId;
            scriptGA.async = true;
            scriptGA.src = `https://www.googletagmanager.com/gtag/js?id=G-7SMT5BMKTJ`;
            document.head.appendChild(scriptGA);

            const scriptGAConfig = document.createElement('script');
            scriptGAConfig.id = 'ga-config-script';
            scriptGAConfig.innerHTML = `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-7SMT5BMKTJ');
            `;
            document.head.appendChild(scriptGAConfig);
            console.log("Google Analytics injecté (selon préférences).");
        }
    } else {
        // Optionnel : Supprimer GA si non autorisé
        removeScript('ga-script');
        removeScript('ga-config-script');
    }

    // Inject Microsoft Clarity si autorisé
    if (prefs.clarity) {
        const clarityScriptId = 'clarity-script';
         if (!document.getElementById(clarityScriptId)) {
            const scriptClarity = document.createElement('script');
            scriptClarity.id = clarityScriptId;
            scriptClarity.innerHTML = `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "r1fr3f4f34");
            `;
            document.head.appendChild(scriptClarity);
            console.log("Microsoft Clarity injecté (selon préférences).");
        }
    } else {
        // Optionnel : Supprimer Clarity si non autorisé
        removeScript('clarity-script');
    }
  };

  // Fonction pour supprimer un script par ID
  const removeScript = (id: string) => {
    const script = document.getElementById(id);
    if (script) {
        script.remove();
        console.log(`Script ${id} supprimé.`);
    }
  };

  // Fonction pour supprimer tous les scripts gérés
  const removeScripts = () => {
    removeScript('ga-script');
    removeScript('ga-config-script');
    removeScript('clarity-script');
  };

  // Gère le clic sur "Accepter" (tout accepter)
  const handleAccept = () => {
    const acceptedPrefs: CookiePreferences = { analytics: true, clarity: true };
    saveConsent({ status: 'accepted', preferences: acceptedPrefs });
  };

  // Gère le clic sur "Refuser" (tout refuser)
  const handleDecline = () => {
    const declinedPrefs: CookiePreferences = { analytics: false, clarity: false };
    saveConsent({ status: 'declined', preferences: declinedPrefs });
    console.log("Consentement aux cookies refusé.");
  };

  // Ouvre le modal de personnalisation
  const handleCustomize = () => {
    if (openModal()) { // Tente d'ouvrir le modal globalement
      const consentData = localStorage.getItem('cookieConsent');
      if (consentData) {
          try {
              const consent: ConsentStatus = JSON.parse(consentData);
              if (consent.status !== 'unset') {
                  setCurrentPreferences(consent.preferences);
              } else {
                   setCurrentPreferences({ analytics: false, clarity: false });
              }
          } catch (e) {
               setCurrentPreferences({ analytics: false, clarity: false });
          }
      } else {
           setCurrentPreferences({ analytics: false, clarity: false });
      }
      setShowSettingsModal(true); // Ouvre le modal local seulement si openModal() a réussi
    } else {
      console.log("Ouverture du modal cookies bloquée car un autre modal est déjà ouvert.");
      // Optionnel: afficher un message à l'utilisateur ?
    }
  };

  // Gère le changement d'état d'une checkbox dans le modal
  const handlePreferenceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPreferences({
      ...currentPreferences,
      [event.target.name]: event.target.checked,
    });
  };

  // Sauvegarde les choix personnalisés faits dans le modal
  const handleSaveCustom = () => {
    saveConsent({ status: 'custom', preferences: currentPreferences });
    // Note: saveConsent gère déjà closeModal() et setShowSettingsModal(false)
  };

   // Gère le "Tout Accepter" dans le modal
   const handleAcceptAllInModal = () => {
    const acceptedPrefs: CookiePreferences = { analytics: true, clarity: true };
    setCurrentPreferences(acceptedPrefs);
    saveConsent({ status: 'accepted', preferences: acceptedPrefs });
    // Note: saveConsent gère déjà closeModal() et setShowSettingsModal(false)
   };

   // Gère le "Tout Refuser" dans le modal
   const handleDeclineAllInModal = () => {
    const declinedPrefs: CookiePreferences = { analytics: false, clarity: false };
    setCurrentPreferences(declinedPrefs);
    saveConsent({ status: 'declined', preferences: declinedPrefs });
    // Note: saveConsent gère déjà closeModal() et setShowSettingsModal(false)
   };

   // Modifié : Gérer la fermeture manuelle du modal (icône X ou clic extérieur)
   const handleCloseSettingsModal = () => {
       closeModal(); // Libère le verrou global
       setShowSettingsModal(false);
   };

  if (!isVisible && !showSettingsModal) { // Ne rien afficher si bandeau caché ET modal fermé
    return null;
  }

  return (
    <>
      {/* Bandeau principal (visible si isVisible est true) */}
      <Paper
        elevation={4}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          width: '100%',
          p: 2,
          zIndex: 99999,
          borderTop: '1px solid rgba(46, 87, 53, 0.2)',
          backgroundColor: 'rgba(241, 225, 198, 0.85)',
          backdropFilter: 'blur(5px)',
          WebkitBackdropFilter: 'blur(5px)',
          display: isVisible ? 'block' : 'none',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, maxWidth: 'lg', mx: 'auto' }}
        >
          <Typography variant="body2" sx={{ flexGrow: 1, mr: 2, color: '#2E5735' }}>
            Nous utilisons des cookies pour analyser le trafic et améliorer votre expérience. Consultez notre {' '}
            <MuiLink component={RouterLink} to="/privacy-policy" sx={{ color: '#2E5735', fontWeight: 'bold' }}>
              Politique de confidentialité
            </MuiLink> pour en savoir plus ou personnalisez vos choix.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="small"
              onClick={handleAccept}
              sx={{
                backgroundColor: '#2E5735',
                color: '#ffffff',
                '&:hover': {
                  backgroundColor: '#1c3a23',
                }
              }}
            >
              Tout Accepter
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={handleDecline}
              sx={{
                color: '#2E5735',
                borderColor: '#2E5735',
                '&:hover': {
                  backgroundColor: 'rgba(46, 87, 53, 0.08)',
                  borderColor: '#1c3a23',
                }
              }}
            >
              Tout Refuser
            </Button>
            <Button
              variant="text"
              size="small"
              onClick={handleCustomize}
              sx={{
                 color: '#2E5735',
                 textDecoration: 'underline',
                 '&:hover': {
                   backgroundColor: 'rgba(46, 87, 53, 0.04)'
                 }
              }}
            >
              Personnaliser
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Modal de personnalisation */}
      <Modal
        open={showSettingsModal}
        onClose={handleCloseSettingsModal}
        aria-labelledby="cookie-settings-title"
        aria-describedby="cookie-settings-description"
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        slotProps={{
            backdrop: {
              sx: {
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(3px)',
                WebkitBackdropFilter: 'blur(3px)',
              },
            },
          }}
      >
        <Paper sx={{
           p: { xs: 2, sm: 3, md: 4 },
           width: '90%',
           maxWidth: 550,
           maxHeight: '90vh',
           overflowY: 'auto',
           position: 'relative',
           backgroundColor: '#ffffff',
           borderRadius: 2
         }}>
           <IconButton
             aria-label="close"
             onClick={handleCloseSettingsModal}
             sx={{
               position: 'absolute',
               right: 8,
               top: 8,
               color: (theme) => theme.palette.grey[600],
             }}
           >
             <CloseIcon />
           </IconButton>
          <Typography id="cookie-settings-title" variant="h6" component="h2" gutterBottom sx={{ color: '#2E5735', mb: 2 }}>
            Paramètres des cookies
          </Typography>
          <Typography id="cookie-settings-description" variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
            Choisissez les types de cookies que vous souhaitez autoriser. Vous pouvez consulter notre {' '}
             <MuiLink component={RouterLink} to="/privacy-policy" onClick={handleCloseSettingsModal} sx={{ color: '#2E5735', fontWeight: 'bold' }}>
               Politique de confidentialité
             </MuiLink> pour plus de détails.
          </Typography>

          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={currentPreferences.analytics}
                  onChange={handlePreferenceChange}
                  name="analytics"
                  sx={{ '&.Mui-checked': { color: '#2E5735' } }}
                />
              }
              label={
                <Box>
                    <Typography variant="body2" component="span" sx={{ fontWeight: 'bold', color: '#2E5735' }}>Cookies d'analyse </Typography>
                    <Typography variant="caption" display="block" color="text.secondary">
                        Permettent de mesurer l'audience et d'analyser le trafic pour améliorer le site. 
                    </Typography>
                </Box>
               }
              sx={{ mb: 2 }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={currentPreferences.clarity}
                  onChange={handlePreferenceChange}
                  name="clarity"
                  sx={{ '&.Mui-checked': { color: '#2E5735' } }}
                />
               }
               label={
                <Box>
                    <Typography variant="body2" component="span" sx={{ fontWeight: 'bold', color: '#2E5735' }}>Cookies de suivi comportemental </Typography>
                    <Typography variant="caption" display="block" color="text.secondary">
                        Aident à comprendre comment les utilisateurs interagissent avec le site (clics, défilement).
                    </Typography>
                </Box>
               }
               sx={{ mb: 3 }}
            />
          </FormGroup>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5, mt: 3, borderTop: '1px solid #eee', pt: 3 }}>
             <Button
                variant="outlined"
                size="small"
                onClick={handleAcceptAllInModal}
                sx={{
                  color: '#2E5735',
                  borderColor: '#2E5735',
                   '&:hover': {
                    backgroundColor: 'rgba(46, 87, 53, 0.08)',
                    borderColor: '#1c3a23',
                  }
                }}
             >
                Tout Accepter
             </Button>
             <Button
                variant="outlined"
                size="small"
                onClick={handleDeclineAllInModal}
                sx={{
                  color: '#2E5735',
                  borderColor: '#2E5735',
                   '&:hover': {
                    backgroundColor: 'rgba(46, 87, 53, 0.08)',
                    borderColor: '#1c3a23',
                  }
                }}
             >
                Tout Refuser
             </Button>
             <Button
                variant="contained"
                size="small"
                onClick={handleSaveCustom}
                sx={{
                  backgroundColor: '#2E5735',
                  color: '#ffffff',
                  '&:hover': {
                    backgroundColor: '#1c3a23',
                  }
                }}
              >
               Valider mes choix
             </Button>
          </Box>
        </Paper>
      </Modal>
    </>
  );
};

export default CookieBanner;