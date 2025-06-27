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
          pt: { xs: 8, sm: 10 }
        }}
      >
        <Container maxWidth="md">
          <Stack spacing={3} textAlign="center">
            <Typography variant="h3" fontWeight={700}>
              Diplômé·e dans quelques semaines&nbsp;?
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              Lance ta carrière libéral Sereinement
            </Typography>
            <Typography
              variant="h5"
              fontWeight={700}
              sx={{
                color: '#ff5555',
                
                
              }}
            >
              Le&nbsp;samedi&nbsp;5&nbsp;juillet&nbsp;à&nbsp;11&nbsp;h
            </Typography>
            <Typography variant="h6">
              Web-conférence offerte&nbsp;: assistant, titulaire ou remplaçant&nbsp;? Statuts, démarches
              et aides financières décryptés en 60&nbsp;min.
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
            >
              <Typography>✓ Choisir le statut idéal (assistant, titulaire ou remplaçant)</Typography>
              <Typography>✓ Inscription Ordre • URSSAF • CARPIMKO simplifiée</Typography>
              <Typography>✓ Q&amp;R live + check-list d'installation téléchargeable</Typography>
            </Stack>
            <Button
              variant="contained"
              sx={{ bgcolor: '#EFE9AE', color: '#2E5735', fontWeight: 600 }}
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

      {/* FORMULAIRE  ---------------------------------------------- */}
      <Box id="lead-form" py={10} bgcolor="#f9f9f9">
        <Container maxWidth="sm">
          <Paper elevation={3} sx={{ p: 4 }}>
            {success ? (
              <Stack spacing={2} textAlign="center">
                <Typography variant="h5" fontWeight={700} color="success.main">
                  🎉 Ta place est confirmée !
                </Typography>
                <Typography>
                  Le lien Zoom et la check-list arrivent dans ta boîte mail.
                </Typography>
              </Stack>
            ) : (
              <>
                <Typography
                  variant="h5"
                  fontWeight={700}
                  textAlign="center"
                  mb={2}
                >
                  Réserve ta place gratuite – seulement 100 sièges live
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
                sx={{ p: 3, flex: 1 }}
                variant="outlined"
              >
                <Typography variant="body1" fontStyle="italic" mb={2}>
                  {t.text}
                </Typography>
                <Typography variant="subtitle2" fontWeight={600}>
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
