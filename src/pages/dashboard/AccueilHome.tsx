import React from 'react';
import { Box, Typography, Button, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { ExpandMore as ExpandMoreIcon, Dashboard as DashboardIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AccueilHome = () => {
  const navigate = useNavigate();

  const handleShowDashboard = () => {
    // Optionnel: Marquer que l'accueil a été vu si nécessaire
    // sessionStorage.setItem('welcomeShown', 'false'); 
    navigate('/dashboard');
  };

  return (
    <Box sx={{ py: 3, maxWidth: '900px', mx: 'auto', px: 2 }}>
      <Button
        variant="outlined"
        startIcon={<DashboardIcon />}
        sx={{
          mb: 3,
          color: '#2E5735',
          borderColor: '#2E5735',
          '&:hover': {
            backgroundColor: 'rgba(46, 87, 53, 0.1)',
            borderColor: '#2E5735',
          },
          textTransform: 'none'
        }}
        onClick={handleShowDashboard}
      >
        Accéder à mon Tableau de bord
      </Button>

      <Typography variant="h4" sx={{ mb: 2, color: '#2E5735', fontWeight: 600 }}>
        Bienvenue sur votre Espace Personnel ODIA
      </Typography>

      <Typography variant="body1" sx={{ mb: 3 }}>
        Découvrez comment ODIA simplifie votre quotidien et optimise votre activité professionnelle. Explorez les sections ci-dessous pour en savoir plus.
      </Typography>

      {/* Accordion: Qui sommes-nous ? */}
      <Accordion sx={{ mb: 2, boxShadow: 'none', border: '1px solid rgba(46, 87, 53, 0.2)', '&:before': { display: 'none' } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" sx={{ color: '#2E5735', fontWeight: 600 }}>
            Qui sommes-nous ?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="h6" sx={{ mt: 1, mb: 1, fontSize: '1.1rem' }}>
             Chers professionnels de santé,
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Nous vous souhaitons la bienvenue dans votre espace personnalisé ODIA, votre partenaire de confiance dédié à l'<strong>optimisation</strong> de vos <strong>démarches administratives</strong> et à la <strong>revalorisation de vos revenus</strong>. ODIA a été conçu pour vous <strong>simplifier</strong> la vie, afin que vous puissiez vous concentrer sur l'essentiel : la prise en charge de vos patients et le <strong>développement</strong> de votre carrière.
          </Typography>
          <Typography variant="body1">
            ODIA est le fruit d'une collaboration entre une kinésithérapeute libérale qui a expérimenté personnellement notre stratégie et un entrepreneur aguerri spécialisé dans l'optimisation. Ensemble, grâce à nos simulateurs avancés, nous avons mis en place une solution clé en main qui vous permet de bénéficier d'un accompagnement complet en gérant toutes vos démarches administratives et en adaptant votre statut aux spécificités de votre activité.
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* Accordion: Ce que nous faisons pour vous */}
      <Accordion sx={{ mb: 2, boxShadow: 'none', border: '1px solid rgba(46, 87, 53, 0.2)', '&:before': { display: 'none' } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" sx={{ color: '#2E5735', fontWeight: 600 }}>
            Ce que nous faisons pour vous
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Grâce à notre expertise, nous vous aidons à :
          </Typography>
          <Box component="ul" sx={{ pl: 3, mb: 2 }}>
            <li><Typography variant="body1"><strong>Optimiser vos revenus :</strong> Transformez vos économies annuelles en opportunités d'investissement et en revenu complémentaire.</Typography></li>
            <li><Typography variant="body1"><strong>Gérer intégralement votre administratif :</strong> Dites adieu à la paperasserie grâce à nos services de gestion clés en main.</Typography></li>
            <li><Typography variant="body1"><strong>Assurer une conformité totale :</strong> Bénéficiez d'un suivi rigoureux, mis à jour en continu avec les dernières réglementations, pour une totale tranquillité d'esprit.</Typography></li>
          </Box>
          <Typography variant="body1" sx={{ mt: 2, mb: 1 }}>
            Dans cet espace, vous trouverez :
          </Typography>
          <Box component="ul" sx={{ pl: 3, mb: 2 }}>
            <li><Typography variant="body1">Des guides pratiques et ressources dédiés à votre profession pour approfondir vos connaissances administratives.</Typography></li>
            <li><Typography variant="body1">Un espace comptabilité et investissement.</Typography></li>
            <li><Typography variant="body1">Votre tableau de bord personnalisé qui centralise votre profil, vos documents, vos rendez-vous et vos simulations.</Typography></li>
          </Box>
           <Typography variant="body1" sx={{ mt: 2, mb: 1 }}>
            Il ne vous reste plus qu'à:
          </Typography>
           <Box component="ul" sx={{ pl: 3, mb: 2 }}>
            <li><Typography variant="body1">Complétez votre formulaire.</Typography></li>
            <li><Typography variant="body1">Planifier un rendez-vous stratégique <strong>GRATUIT</strong>.</Typography></li>
            <li><Typography variant="body1">Découvrez l'opportunité unique qu'ODIA offre à votre avenir professionnel, en vous permettant de réaliser des économies, année après année.</Typography></li>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Accordion: Nos Engagements */}
      <Accordion sx={{ mb: 2, boxShadow: 'none', border: '1px solid rgba(46, 87, 53, 0.2)', '&:before': { display: 'none' } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" sx={{ color: '#2E5735', fontWeight: 600 }}>
            Nos Engagements
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1">
            ODIA, nous mettons en avant l'excellence, la transparence et le service <strong>sur-mesure</strong>. Notre mission est de transformer vos défis administratifs en réelles opportunités d'économies et d'investir dans votre avenir professionnel. Nous croyons fermement qu'un accompagnement <strong>personnalisé</strong>, allié à une expertise éprouvée, est la clé d'une carrière <strong>sereine</strong> et <strong>prospère</strong>.
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* Accordion: Commencez dès aujourd'hui */}
      <Accordion sx={{ mb: 2, boxShadow: 'none', border: '1px solid rgba(46, 87, 53, 0.2)', '&:before': { display: 'none' } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
           <Typography variant="h6" sx={{ color: '#2E5735', fontWeight: 600 }}>
            Commencez dès aujourd'hui
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Prenez le temps de découvrir votre espace personnel et explorez toutes les ressources mises à votre disposition. Si vous avez la moindre question ou besoin de précisions supplémentaires, n'hésitez pas à réserver un rendez-vous stratégique <strong>gratuit</strong> ou à contacter notre équipe d'experts.
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            Encore une fois, bienvenue chez ODIA ! Votre réussite administrative et financière commence ici.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default AccueilHome;