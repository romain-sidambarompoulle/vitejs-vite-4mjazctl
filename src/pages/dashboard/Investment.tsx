import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  useTheme,
  useMediaQuery,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const InvestmentPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const navigate = useNavigate();

  return (
    <Container sx={{ py: { xs: 2, md: 3 }, px: { xs: 2, sm: 3 } }}>
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 4 }, color: '#2E5735', fontWeight: 600, fontSize: { xs: '1.8rem', md: '2.2rem' } }}>
        Stratégies d'Investissement
      </Typography>

      <Paper sx={{ p: { xs: 2, md: 3 }, mb: { xs: 3, md: 4 }, borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
        <Typography variant="h5" sx={{ mb: 2, color: '#2E5735', fontWeight: 500, fontSize: { xs: '1.4rem', md: '1.5rem' } }}>
          1. Investissement en ETF (Exchange Traded Funds)
        </Typography>
        <Typography variant="body1" paragraph>
          Les ETF sont des fonds négociés en bourse qui répliquent un indice, un secteur, une matière
          première ou d'autres actifs. Ils permettent une diversification instantanée à moindre coût.
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Rendement brut estimé:</strong> 7 à 10% annuel sur le long terme
          <br />
          <strong>Rendement net estimé (hors impôts):</strong> 6,5 à 9,5% après frais de courtier
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Avantages:</strong>
          <br />• Diversification facile et instantanée
          <br />• Frais réduits par rapport aux fonds traditionnels
          <br />• Liquidité importante - achat/vente comme des actions
          <br />• Transparence des investissements sous-jacents
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Risques et contraintes:</strong>
          <br />• Dépendance aux marchés financiers
          <br />• Frais de courtage à prendre en compte
          <br />• Possible sous-performance par rapport à certains actifs individuels performants
        </Typography>
      </Paper>

      <Paper sx={{ p: { xs: 2, md: 3 }, mb: { xs: 3, md: 4 }, borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
        <Typography variant="h5" sx={{ mb: 2, color: '#2E5735', fontWeight: 500, fontSize: { xs: '1.4rem', md: '1.5rem' } }}>
          2. Spéculation via Ichimoku
        </Typography>
        <Typography variant="body1" paragraph>
          L'indicateur Ichimoku Kinko Hyo est un système d'analyse technique japonais qui fournit
          plus d'informations sur les mouvements de prix potentiels qu'un simple graphique de prix.
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Rendement brut estimé:</strong> 13 à 15% annuel (potentiel, avec risque élevé)
          <br />
          <strong>Rendement net estimé (hors impôts):</strong> 12 à 14% après frais de courtier
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Avantages:</strong>
          <br />• Potentiel de rendement supérieur
          <br />• Analyse complète des tendances
          <br />• Niveaux de support et résistance dynamiques
          <br />• Signaux d'achat et de vente clairement définis
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Risques et contraintes:</strong>
          <br />• Volatilité nettement plus élevée
          <br />• Nécessite un suivi régulier et des connaissances techniques
          <br />• Possibilité de pertes importantes
          <br />• Instabilité psychologique due aux fluctuations
        </Typography>
      </Paper>

      <Paper sx={{ p: { xs: 2, md: 3 }, mb: { xs: 3, md: 4 }, borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
        <Typography variant="h5" sx={{ mb: 2, color: '#2E5735', fontWeight: 500, fontSize: { xs: '1.4rem', md: '1.5rem' } }}>
          3. Immobilier : Investissement en groupe (mode "SCPI à petit comité")
        </Typography>
        <Typography variant="body1" paragraph>
          Nous proposons un format d'investissement inspiré du principe des SCPI (Sociétés Civiles de Placement Immobilier), 
          mais adapté à de petits groupes d'environ 10 professionnels. Cette formule vous permet de mettre en commun vos 
          ressources pour acquérir, par exemple, un bien immobilier ou une participation dans un projet, sans avoir à 
          passer par un emprunt bancaire.
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Rendement brut estimé:</strong> 7 à 10% selon la nature du projet
          <br />
          <strong>Rendement net estimé (hors impôts):</strong> 6,5 à 9,5% après frais collectifs
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Avantages principaux:</strong>
          <br />• Absence d'intérêts bancaires : En limitant le recours au crédit, vous réduisez fortement les coûts financiers
          <br />• Force de négociation : Un achat au comptant rapide constitue un atout pour obtenir de meilleurs prix ou conditions
          <br />• Encadrement par ODIA : Notre équipe coordonne l'ensemble des démarches administratives et juridiques, assurant un fonctionnement efficace et transparent pour tous les investisseurs
          <br />• Rentabilité potentielle : En général, équivalente à un investissement en ETF (7 à 10% brut / ~6,5 à 9,5% net), selon le type de projet retenu et les conditions du marché
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Risques et contraintes:</strong>
          <br />• Liquidité moins immédiate : La revente de sa part n'est pas aussi rapide que pour des actions cotées
          <br />• Encadrement strict par ODIA : Bien que nous gérions l'organisation collective, tout changement important (revente anticipée, modifications de structure) nécessite un consensus minimal et reste soumis aux termes convenus initialement
        </Typography>
        <Typography variant="body1" paragraph>
          En optant pour notre modèle de "SCPI à petit comité", vous bénéficiez de l'expertise ODIA pour optimiser la gestion, 
          assurer une répartition équitable et régler rapidement les éventuels litiges entre investisseurs. C'est une solution 
          offrant la simplicité d'une structure existante et la flexibilité d'un petit groupe, tout en profitant de la force 
          d'achat collective.
        </Typography>
      </Paper>

      <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
        <Typography variant="h5" sx={{ mb: 3, color: '#2E5735', fontWeight: 500, fontSize: { xs: '1.4rem', md: '1.5rem' } }}>
          Tableau Récapitulatif
        </Typography>
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table aria-label="tableau comparatif des stratégies d'investissement" size={isMobile ? "small" : "medium"}>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'rgba(46, 87, 53, 0.1)', whiteSpace: 'nowrap' }}>
                <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.875rem', md: '1rem' }, padding: { xs: 1, md: 2 } }}>Stratégie</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.875rem', md: '1rem' }, padding: { xs: 1, md: 2 } }}>Rendement Brut (estim.)</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.875rem', md: '1rem' }, padding: { xs: 1, md: 2 } }}>Rendement Net (estim.)</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.875rem', md: '1rem' }, padding: { xs: 1, md: 2 } }}>Avantages Clés</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.875rem', md: '1rem' }, padding: { xs: 1, md: 2 } }}>Risques / Contraintes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow sx={{ '&:nth-of-type(odd)': { backgroundColor: 'rgba(46, 87, 53, 0.03)' } }}>
                <TableCell sx={{ fontSize: { xs: '0.75rem', md: '0.9rem' }, padding: { xs: 1, md: 2 } }}>ETF</TableCell>
                <TableCell sx={{ fontSize: { xs: '0.75rem', md: '0.9rem' }, padding: { xs: 1, md: 2 } }}>7 à 10%</TableCell>
                <TableCell sx={{ fontSize: { xs: '0.75rem', md: '0.9rem' }, padding: { xs: 1, md: 2 } }}>6,5 à 9,5%</TableCell>
                <TableCell sx={{ fontSize: { xs: '0.75rem', md: '0.9rem' }, padding: { xs: 1, md: 2 } }}>Diversification, liquidité, simplicité</TableCell>
                <TableCell sx={{ fontSize: { xs: '0.75rem', md: '0.9rem' }, padding: { xs: 1, md: 2 } }}>Dépendance aux marchés, frais de courtage</TableCell>
              </TableRow>
              <TableRow sx={{ '&:nth-of-type(even)': { backgroundColor: 'rgba(46, 87, 53, 0.03)' } }}>
                <TableCell sx={{ fontSize: { xs: '0.75rem', md: '0.9rem' }, padding: { xs: 1, md: 2 } }}>Ichimoku</TableCell>
                <TableCell sx={{ fontSize: { xs: '0.75rem', md: '0.9rem' }, padding: { xs: 1, md: 2 } }}>13 à 15%</TableCell>
                <TableCell sx={{ fontSize: { xs: '0.75rem', md: '0.9rem' }, padding: { xs: 1, md: 2 } }}>12 à 14%</TableCell>
                <TableCell sx={{ fontSize: { xs: '0.75rem', md: '0.9rem' }, padding: { xs: 1, md: 2 } }}>Rendement potentiel élevé, signaux clairs</TableCell>
                <TableCell sx={{ fontSize: { xs: '0.75rem', md: '0.9rem' }, padding: { xs: 1, md: 2 } }}>Volatilité élevée, suivi régulier nécessaire</TableCell>
              </TableRow>
              <TableRow sx={{ '&:nth-of-type(odd)': { backgroundColor: 'rgba(46, 87, 53, 0.03)' } }}>
                <TableCell sx={{ fontSize: { xs: '0.75rem', md: '0.9rem' }, padding: { xs: 1, md: 2 } }}>Groupe</TableCell>
                <TableCell sx={{ fontSize: { xs: '0.75rem', md: '0.9rem' }, padding: { xs: 1, md: 2 } }}>7 à 10%</TableCell>
                <TableCell sx={{ fontSize: { xs: '0.75rem', md: '0.9rem' }, padding: { xs: 1, md: 2 } }}>6,5 à 9,5%</TableCell>
                <TableCell sx={{ fontSize: { xs: '0.75rem', md: '0.9rem' }, padding: { xs: 1, md: 2 } }}>Puissance collective, absence d'intérêts</TableCell>
                <TableCell sx={{ fontSize: { xs: '0.75rem', md: '0.9rem' }, padding: { xs: 1, md: 2 } }}>Décisions collectives, liquidité réduite</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

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
    </Container>
  );
};

export default InvestmentPage;