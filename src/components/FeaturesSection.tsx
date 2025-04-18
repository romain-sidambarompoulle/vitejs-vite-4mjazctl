import React from 'react';
import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GavelIcon from '@mui/icons-material/Gavel';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SavingsIcon from '@mui/icons-material/Savings';
import StarIcon from '@mui/icons-material/Star';

const FeaturesSection = () => {
  return (
    <Box sx={{ py: 2, backgroundColor: '#f1e1c6' }}>
      <Container maxWidth="lg">
        <Typography variant="h4" align="center" sx={{ mb: 2, fontWeight: 600, color: '#2E5735' }}>
          Pourquoi nous faire confiance
        </Typography>

        <Grid container spacing={3} sx={{ mb: 3, justifyContent: "center" }}>
          <Grid item xs={6} sm={6} md={3}>
            <Paper elevation={1} sx={{ p: 3, height: '100%', maxWidth: 220, display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#f1e1c6' }}>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                <AccessTimeIcon sx={{ width: 48, height: 48, color: '#2E5735' }} />
              </Box>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: '#2E5735', textAlign: 'center' }}>
                Gain de temps
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={6} sm={6} md={3}>
            <Paper elevation={1} sx={{ p: 3, height: '100%', maxWidth: 220, display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#f1e1c6' }}>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                <GavelIcon sx={{ width: 48, height: 48, color: '#2E5735' }} />
              </Box>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: '#2E5735', textAlign: 'center' }}>
              En toute Conformité
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={6} sm={6} md={3}>
            <Paper elevation={1} sx={{ p: 3, height: '100%', maxWidth: 220, display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#f1e1c6' }}>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                <AssignmentIcon sx={{ width: 48, height: 48, color: '#2E5735' }} />
              </Box>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: '#2E5735', textAlign: 'center' }}>
                Zéro Paprasse 
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={6} sm={6} md={3}>
            <Paper elevation={1} sx={{ p: 3, height: '100%', maxWidth: 220, display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#f1e1c6' }}>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                <SavingsIcon sx={{ width: 48, height: 48, color: '#2E5735' }} />
              </Box>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: '#2E5735', textAlign: 'center' }}>
                Économie Récurente
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        
        <Typography variant="h4" align="center" sx={{ mb: 2, fontWeight: 600, color: '#2E5735' }}>
          Témoignages
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4, height: '100%', backgroundColor: '#f1e1c6' }}>
              <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 1 }}>
                  "ODIA Stratégie m'a permise de consacrer plus de temps à mes patients tout en réduisant mes charges."
                </Typography>
                <Typography variant="subtitle2" sx={{ textAlign: 'right', color: '#2E5735' }}>
                  Laura G. - Kinésithérapeute
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mt: 1 }}>
                  <Typography variant="body2" sx={{ mr: 1 }}>Satisfaction :</Typography>
                  <StarIcon sx={{ color: '#FFD700', fontSize: 18 }} />
                  <StarIcon sx={{ color: '#FFD700', fontSize: 18 }} />
                  <StarIcon sx={{ color: '#FFD700', fontSize: 18 }} />
                  <StarIcon sx={{ color: '#FFD700', fontSize: 18 }} />
                  <StarIcon sx={{ color: '#FFD700', fontSize: 18 }} />
                </Box>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4, height: '100%', backgroundColor: '#f1e1c6' }}>
              <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 1 }}>
                  "Grâce à leur accompagnement, j'ai pu économiser plus de 15 000€ sur ma première année."
                </Typography>
                <Typography variant="subtitle2" sx={{ textAlign: 'right', color: '#2E5735' }}>
                  Thomas M. - Infirmier libéral
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mt: 1 }}>
                  <Typography variant="body2" sx={{ mr: 1 }}>Satisfaction :</Typography>
                  <StarIcon sx={{ color: '#FFD700', fontSize: 18 }} />
                  <StarIcon sx={{ color: '#FFD700', fontSize: 18 }} />
                  <StarIcon sx={{ color: '#FFD700', fontSize: 18 }} />
                  <StarIcon sx={{ color: '#FFD700', fontSize: 18 }} />
                  <StarIcon sx={{ color: '#FFD700', fontSize: 18 }} />
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default FeaturesSection;