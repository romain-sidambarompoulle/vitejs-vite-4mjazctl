import { Container, Typography, Box } from "@mui/material";

function ReglesDeCalcul() {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom align="center">
        Règles de Calcul des Simulations
      </Typography>

      <Typography variant="body1" paragraph>
        Afin d'offrir une comparaison pertinente et réaliste entre les différents statuts professionnels, 
        nos simulations utilisent une même base de calcul pour chaque scénario. Cela signifie que les charges 
        et dépenses prises en compte dans une simulation en BNC (Bénéfices Non Commerciaux) sont strictement 
        identiques à celles d'une simulation avec notre stratégie optimisée.
      </Typography>

      <Typography variant="h5" gutterBottom>
        Principes de Calcul
      </Typography>
      <Typography variant="body1" paragraph>
        Dans nos deux simulations, nous utilisons les mêmes montants pour :
      </Typography>
      <ul>
        <li>Budget personnel : alimentaire, logement, crédits , assurances (habitation, voiture, santé, etc.).</li>
        <li>Frais professionnels : matériel professionnel, consommables, cotisation foncière des entreprises (CFE), formations, responsabilité civile professionnelle.</li>
        <li>Coûts administratifs : frais de comptabilité, frais de mutuelle, charges sociales.</li>
      </ul>
      <Typography variant="body1" paragraph>
        L'objectif est de garantir que seule la structure juridique et fiscale varie afin que le client puisse voir, 
        à niveau de vie égal, l'impact réel de notre stratégie d'optimisation.
      </Typography>

      <Typography variant="h5" gutterBottom>
        Calcul des Cotisations Sociales
      </Typography>
      <Typography variant="body1" paragraph>
        Pour assurer la précision de nos calculs, nous utilisons une API connectée directement aux serveurs de l'URSSAF. 
        Cette connexion nous permet de récupérer en temps réel les barèmes et taux en vigueur, garantissant ainsi 
        l'exactitude des cotisations sociales calculées dans nos simulations.
      </Typography>
      <Typography variant="body1" paragraph>
        Ainsi, toute mise à jour effectuée par l'URSSAF est automatiquement prise en compte, évitant tout risque d'erreur 
        et assurant des simulations parfaitement conformes à la réglementation en vigueur.
      </Typography>

      <Typography variant="h5" gutterBottom>
        Pourquoi cette approche ?
      </Typography>
      <Typography variant="body1" paragraph>
        Notre méthodologie permet à nos clients de mesurer la performance de notre stratégie d'optimisation en conservant 
        un niveau de vie constant. Cela leur offre une vision claire et objective des gains réalisables en changeant de statut professionnel.
      </Typography>
      <Typography variant="body1" paragraph>
        Nous mettons tout en œuvre pour garantir une transparence totale et une prise de décision informée, en s'appuyant 
        sur des calculs fiables et mis à jour en temps réel.
      </Typography>
    </Container>
  );
}

export default ReglesDeCalcul;
