import { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, CircularProgress, Alert,
  Accordion, AccordionSummary, AccordionDetails, Paper, Divider, 
  Card, CardContent, CardHeader, List, ListItem, Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from '../../config/axios';
import { API_ROUTES } from '../../config/api';
import DOMPurify from 'dompurify';

// Interfaces pour typer les données
interface Section {
  id: number;
  titre: string;
  description: string;
  ordre: number;
  image_url?: string;
  status?: string;
  contents?: Content[];
}

interface Content {
  id: number;
  titre: string;
  description?: string;
  contenu: string;
  section_id: number;
  ordre: number;
  temps_lecture?: number;
  type?: string;
  status?: string;
}

const EducationView = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEducationalContent();
  }, []);

  const fetchEducationalContent = async () => {
    try {
      setLoading(true);
      // Récupérer toutes les sections
      const sectionsResponse = await axios.get(API_ROUTES.education.sections);
      
      if (!sectionsResponse.data.success) {
        throw new Error(sectionsResponse.data.message || 'Erreur lors du chargement des sections');
      }
      
      // Trier les sections par ordre
      const sortedSections = [...sectionsResponse.data.sections].sort((a, b) => a.ordre - b.ordre);
      
      // Pour chaque section, récupérer ses contenus
      const sectionsWithContents = await Promise.all(
        sortedSections.map(async (section) => {
          const contentResponse = await axios.get(API_ROUTES.education.sectionById(section.id));
          if (contentResponse.data.success && contentResponse.data.contents) {
            // Trier les contenus par ordre
            const sortedContents = [...contentResponse.data.contents].sort((a, b) => a.ordre - b.ordre);
            return { ...section, contents: sortedContents };
          }
          return { ...section, contents: [] };
        })
      );
      
      setSections(sectionsWithContents);
    } catch (error: any) {
      console.error('Erreur lors de la récupération du contenu éducatif:', error);
      setError(error.message || 'Une erreur est survenue lors du chargement du contenu');
    } finally {
      setLoading(false);
    }
  };

  const handleSectionToggle = (sectionId: number) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, maxWidth: '100vw', overflowX: 'hidden' }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 'bold', color: '#2E5735' }}>
        Espace éducatif
      </Typography>
      
      <Typography variant="body1" paragraph sx={{ mb: 4 }}>
        Découvrez nos ressources éducatives pour approfondir vos connaissances et mieux comprendre votre situation.
      </Typography>

      {sections.length === 0 ? (
        <Alert severity="info">Aucun contenu éducatif n'est disponible pour le moment.</Alert>
      ) : (
        <Box sx={{ mt: 3 }}>
          {sections.map((section) => (
            <Paper 
              key={section.id} 
              elevation={3} 
              sx={{ 
                mb: 3, 
                overflow: 'hidden',
                border: '1px solid rgba(0, 0, 0, 0.1)' 
              }}
            >
              <Accordion 
                expanded={expandedSection === section.id}
                onChange={() => handleSectionToggle(section.id)}
                sx={{ 
                  boxShadow: 'none',
                  '&:before': { display: 'none' }
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.03)',
                    borderBottom: expandedSection === section.id ? '1px solid rgba(0, 0, 0, 0.1)' : 'none'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Typography variant="h6" component="h2" sx={{ flex: 1, wordBreak: 'break-word' }}>
                      {section.titre}
                    </Typography>
                    {section.contents && (
                      <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                        {section.contents.length} module{section.contents.length > 1 ? 's' : ''}
                      </Typography>
                    )}
                  </Box>
                </AccordionSummary>
                
                <AccordionDetails sx={{ p: 0 }}>
                  {section.description && (
                    <Box sx={{ p: 3, backgroundColor: 'rgba(0, 0, 0, 0.01)' }}>
                      <Typography variant="body1" paragraph>
                        {section.description}
                      </Typography>
                    </Box>
                  )}
                  
                  <Divider />
                  
                  {section.contents && section.contents.length > 0 ? (
                    <List sx={{ p: 0 }}>
                      {section.contents.map((content, index) => (
                        <ListItem 
                          key={content.id}
                          disablePadding
                          divider={index < section.contents!.length - 1}
                          sx={{ display: 'block' }}
                        >
                          <Card elevation={0} sx={{ borderRadius: 0 }}>
                            <CardHeader 
                              title={content.titre}
                              subheader={content.description}
                              titleTypographyProps={{ variant: 'h6', sx: { wordBreak: 'break-word' } }}
                              subheaderTypographyProps={{ variant: 'body2' }}
                              sx={{ 
                                backgroundColor: 'rgba(0, 0, 0, 0.02)',
                                borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
                              }}
                            />
                            <CardContent>
                              {content.temps_lecture && (
                                <Typography 
                                  variant="caption" 
                                  color="text.secondary"
                                  sx={{ display: 'block', mb: 2 }}
                                >
                                  Temps de lecture estimé: {content.temps_lecture} minutes
                                </Typography>
                              )}
                              <Box 
                                className="content-html"
                                sx={{ 
                                  '& img': { maxWidth: '100%', height: 'auto' },
                                  '& table': { 
                                    borderCollapse: 'collapse', 
                                    width: '100%', 
                                    tableLayout: 'fixed'
                                  },
                                  '& th, & td': { 
                                    border: '1px solid #ddd', 
                                    padding: '8px', 
                                    wordBreak: 'break-word'
                                  },
                                  '& ul, & ol': { paddingLeft: '20px' }
                                }}
                                dangerouslySetInnerHTML={{ 
                                  __html: DOMPurify.sanitize(content.contenu) 
                                }}
                              />
                            </CardContent>
                          </Card>
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Box sx={{ p: 3 }}>
                      <Typography variant="body2" color="text.secondary">
                        Aucun contenu disponible dans cette section.
                      </Typography>
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>
            </Paper>
          ))}
        </Box>
      )}

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

export default EducationView;