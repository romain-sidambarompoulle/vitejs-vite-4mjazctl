import React from 'react';
import {
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Card,
  CardContent,
  Box,
  Divider,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LockIcon from '@mui/icons-material/Lock';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import InventoryIcon from '@mui/icons-material/Inventory';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import VerifiedIcon from '@mui/icons-material/Verified';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import PaymentsIcon from '@mui/icons-material/Payments';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import PersonIcon from '@mui/icons-material/Person';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ReceiptIcon from '@mui/icons-material/Receipt';

interface Item {
  title: string;
  icon: React.ReactNode;
}

interface Category {
  categoryTitle: string;
  items: Item[];
}

const ComptaFictive: React.FC = () => {
  const navigate = useNavigate();
  // Définir plusieurs catégories logiques
  const categories: Category[] = [
    {
      categoryTitle: 'Banque & Trésorerie',
      items: [
        { title: 'Relevé bancaire', icon: <AccountBalanceIcon /> },
        { title: 'Trésorerie', icon: <MonetizationOnIcon /> },
        { title: 'Flux de trésorerie', icon: <AttachMoneyIcon /> },
      ],
    },
    {
      categoryTitle: 'Justificatifs & Dépenses',
      items: [
        { title: 'Justificatif de dépense', icon: <ReceiptLongIcon /> },
        {
          title: "Justificatif d'encaissement (Ameli, mutuelle, dépassement honoraire)",
          icon: <VerifiedIcon />
        },
        { title: 'Note de frais', icon: <ReceiptIcon /> },
      ],
    },
    {
      categoryTitle: 'Gestion & Immobilisations',
      items: [
        { title: 'Immobilisation', icon: <InventoryIcon /> },
        { title: "Compte courant d'associé", icon: <AccountBalanceWalletIcon /> },
        { title: 'Amortissement', icon: <TrendingDownIcon /> },
      ],
    },
    {
      categoryTitle: 'Rémunérations & Charges',
      items: [
        { title: 'Avantage en nature', icon: <TipsAndUpdatesIcon /> },
        { title: 'Rémunération gérant', icon: <PaymentsIcon /> },
        { title: 'Impôt prévisionnel', icon: <WarningAmberIcon /> },
        { title: 'Rémunération salarié', icon: <PersonIcon /> },
        { title: 'Rétrocession', icon: <SyncAltIcon /> },
      ],
    },
    {
      categoryTitle: 'Organismes & Déclarations',
      items: [
        { title: 'CARPIMKO', icon: <VolunteerActivismIcon /> },
        { title: 'URSSAF', icon: <LocalHospitalIcon /> },
        { title: 'Crédit en cours', icon: <LocalAtmIcon /> },
      ],
    },
    {
      categoryTitle: 'Autres',
      items: [
        { title: 'Véhicule', icon: <DirectionsCarIcon /> },
      ],
    },
  ];

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      {/* Filigrane (cadenas) */}
      <Box
        sx={{
          position: 'absolute',
          top: '80px',
          left: '50px',
          opacity: 0.15,
          color: '#3F51B5',
          pointerEvents: 'none',
          zIndex: 999,
          overflow: 'hidden',
          maxWidth: '100%'
        }}
      >
        <LockIcon sx={{ fontSize: { xs: 260, sm: 400, md: 600 } }} />
      </Box>

      <Container sx={{
        position: 'relative',
        zIndex: 1,
        mt: 4,
        maxWidth: '100vw',
        overflowX: 'hidden'
      }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: '#2E5735' }}>
          Espace Comptabilité
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          Voici un aperçu de ce que contiendra notre futur logiciel de comptabilité
          spécialisé pour les professionnels libéraux. 
        </Typography>

        {categories.map((category, catIndex) => (
          <Accordion key={catIndex}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2E5735' }}>
                {category.categoryTitle}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {category.items.map((item, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card
                      sx={{
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                        },
                      }}
                    >
                      <CardContent>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mb: 1,
                            gap: 1,
                            color: '#2E5735'
                          }}
                        >
                          {item.icon}
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', wordBreak: 'break-word' }}>
                            {item.title}
                          </Typography>
                        </Box>
                        <Divider sx={{ mb: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          Transférez vos justificatifs et vos documents comptables ici.
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>
        ))}
      </Container>

      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        mt: { xs: 2, sm: 3 },
        mb: { xs: 4, sm: 6 }
      }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard')}
          sx={{
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
    </Box>
  );
};

export default ComptaFictive;