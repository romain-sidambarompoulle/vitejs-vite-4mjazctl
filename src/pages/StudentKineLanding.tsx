// frontend/src/pages/StudentKineLanding.tsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import LeadForm from '../components/LeadForm';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

const StudentKineLanding: React.FC = () => {
  const [success, setSuccess] = useState<boolean>(false);

  return (
    <>
      {/* HERO  ---------------------------------------------------- */}
      <Box
        component="header"
        sx={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          color: '#fff',
          position: 'relative',
          backgroundImage:
            "linear-gradient(rgba(46,87,53,0.75),rgba(46,87,53,0.75)), url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1920&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          pt: { xs: 8, sm: 10 },
          '@keyframes slideFade': {
            '0%':   { opacity: 0, transform: 'translateY(30px)' },
            '100%': { opacity: 1, transform: 'translateY(0)' }
          }
        }}
      >
        <Container maxWidth="md">
          <Stack spacing={3} textAlign="center">
            {/* Titre principal re-stylisé */}
            <Typography
              variant="h3"
              fontWeight={800}
              sx={{
                color: '#EFE9AE',                       // accent jaune-poudré
                textShadow: '0 2px 6px rgba(0,0,0,0.35)',
                letterSpacing: 1,
                animation: 'slideFade 0.8s ease-out forwards',
                opacity: 0,
              }}
            >
              Jeune&nbsp;diplômé
            </Typography>

            {/* Sous-titre avec soulignement animé */}
            <Typography
              variant="h4"
              fontWeight={700}
              sx={{
                position: 'relative',
                color: '#FFFFFF',
                textShadow: '0 1px 4px rgba(0,0,0,0.4)',
                animation: 'slideFade 0.8s 0.15s ease-out forwards',
                opacity: 0,
                px: 1,
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  bottom: -4,
                  width: '100%',
                  height: '4px',
                  background: 'linear-gradient(90deg,#A4C3B2 0%,#98C1D9 100%)',
                  borderRadius: 2,
                  animation: 'underlineGrow 1s 0.3s ease-out forwards',
                  transformOrigin: 'left',
                  transform: 'scaleX(0)',
                },
                '@keyframes underlineGrow': {
                  to: { transform: 'scaleX(1)' },
                },
              }}
            >
              Lance ta carrière libéral&nbsp;Sereinement
            </Typography>
            <Typography
              variant="h5"
              fontWeight={700}
              sx={{
                color: '#ff5555',
                animation: 'slideFade 0.8s 0.3s ease-out forwards',
                opacity: 0
              }}
            >
              Le&nbsp;samedi&nbsp;5&nbsp;juillet&nbsp;2025&nbsp;à&nbsp;11&nbsp;h
            </Typography>
            <Typography
              variant="h6"
              sx={{ animation: 'slideFade 0.8s 0.45s ease-out forwards', opacity: 0 }}
            >
              Web&nbsp;conférence offerte&nbsp;: découvre la solution administrative ultra&nbsp;simplifiée
              qui te fera économiser en moyenne&nbsp;20&nbsp;000&nbsp;€ par an&nbsp;!
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
              sx={{ animation: 'slideFade 0.8s 0.6s ease-out forwards', opacity: 0 }}
            >
              <Typography display="flex" alignItems="flex-start" gap={1}>
                <KeyboardDoubleArrowRightIcon fontSize="small" sx={{ mt: '2px', color: '#EFE9AE' }} />
                Accède gratuitement à des solutions concrètes qui te simplifieront la vie&nbsp;!
              </Typography>
              <Typography display="flex" alignItems="flex-start" gap={1}>
                <KeyboardDoubleArrowRightIcon fontSize="small" sx={{ mt: '2px', color: '#EFE9AE' }} />
                Travaille pour toi, économise plus grâce aux conseils du webinaire gratuit&nbsp;!
              </Typography>
              <Typography display="flex" alignItems="flex-start" gap={1}>
                <KeyboardDoubleArrowRightIcon fontSize="small" sx={{ mt: '2px', color: '#EFE9AE' }} />
                Bien faire dès le départ&nbsp;: ce webinaire est ton point de départ pour lancer une belle carrière de libéral&nbsp;!
              </Typography>
            </Stack>
            <Button
              variant="contained"
              sx={{ 
                bgcolor: '#EFE9AE',
                color: '#2E5735',
                fontWeight: 600,
                animation: 'slideFade 0.8s 0.75s ease-out forwards',
                opacity: 0,
                '&:hover': { bgcolor: '#e5df8c' }
              }}
              onClick={() =>
                document
                  .getElementById('lead-form')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Je m'inscris gratuitement
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* FORMULAIRE animé + carte re-stylisée */}
      <Box id="lead-form" py={10} bgcolor="#f9f9f9">
        <Container maxWidth="sm">
          <Paper
            elevation={6}
            sx={{
              p: { xs: 3, sm: 4 },
              border: '2px solid #EFE9AE',
              borderRadius: 3,
              boxShadow: 5,
              backgroundColor: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(4px)',
              /* ⚡ petite animation d'apparition */
              opacity: 0,
              animation: 'fadeInUp 0.8s ease-out forwards',
              '@keyframes fadeInUp': {
                '0%': { opacity: 0, transform: 'translateY(30px)' },
                '100%': { opacity: 1, transform: 'translateY(0)' },
              },
            }}
          >
            {success ? (
              <Stack spacing={2} textAlign="center">
                <Typography variant="h5" fontWeight={700} color="success.main">
                  🎉 Ta place est confirmée !
                </Typography>
                <Typography>
                  Le lien de la web-conférence sera envoyé dans ta boîte mail 1h avant le début de l'évènement.
                </Typography>
              </Stack>
            ) : (
              <>
                <Typography
                  variant="h5"
                  fontWeight={700}
                  textAlign="center"
                  mb={3}
                  sx={{ color: '#2E5735', letterSpacing: 0.3 }}
                >
                  ✨ Réserve ta place gratuite – seulement&nbsp;100&nbsp;sièges live
                </Typography>
                <LeadForm onSuccess={() => setSuccess(true)} />
              </>
            )}
          </Paper>
        </Container>
      </Box>

      {/* TÉMOIGNAGES  --------------------------------------------- */}
      <Box py={10}>
        <Container maxWidth="md">
          <Typography
            variant="h4"
            fontWeight={700}
            textAlign="center"
            mb={6}
            color="#2E5735"
          >
            Ils ont adoré
          </Typography>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={4}
            alignItems="stretch"
          >
            {[
              {
                name: 'Pauline G.',
                text: '“En 15 jours j\'avais mon numéro RPPS et un contrat d\'assistanat prêt à signer !”',
              },
              {
                name: 'Yanis D.',
                text: '“Grâce au simulateur Odia, j\'ai choisi le statut le plus adapté à mes besoins : +2 800 € d\'économie par mois dés la 1ère année.”',
              },
              {
                name: 'Emma T.',
                text: '“Je ne me suis occupée d\'aucun papier ; Odia a tout déposé auprès de l\'Ordre et de l\'URSSAF.”',
              },
            ].map((t) => (
              <Paper
                key={t.name}
                sx={{
                  p: 4,
                  flex: 1,
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRadius: 2,
                  boxShadow: 3,
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    transition: 'transform 0.2s ease',
                  },
                }}
              >
                <FormatQuoteIcon
                  sx={{
                    position: 'absolute',
                    top: -10,
                    left: -10,
                    fontSize: 80,
                    color: '#EFE9AE',
                    opacity: 0.15
                  }}
                />

                <Typography
                  variant="body1"
                  fontStyle="italic"
                  mb={3}
                  sx={{ position: 'relative', zIndex: 1, lineHeight: 1.6 }}
                >
                  {t.text}
                </Typography>

                <Typography
                  variant="subtitle1"
                  fontWeight={700}
                  sx={{ position: 'relative', zIndex: 1, color: '#2E5735' }}
                >
                  {t.name}
                </Typography>
              </Paper>
            ))}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default StudentKineLanding;
