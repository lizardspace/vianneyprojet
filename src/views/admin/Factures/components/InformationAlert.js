import React from 'react';
import { Alert, AlertIcon, AlertTitle, AlertDescription, Box } from '@chakra-ui/react';

const InformationAlert = () => {
  return (
    <Box m={2} p={2}>
      <Alert
        status="info"
        variant="left-accent"
        borderRadius="md"
        boxShadow="md"
      >
        <AlertIcon />
        <Box flex="1">
          <AlertTitle>Attention !</AlertTitle>
          <AlertDescription>
            Avant de produire une facture, merci de compléter vos informations société en bas ou dans l'onglet <strong>Paramètres</strong>.
            <br />
            Vous pourrez consulter et imprimer vos factures en bas dans <strong>"Détails des factures"</strong>.
          </AlertDescription>
        </Box>
      </Alert>
    </Box>
  );
};

export default InformationAlert;
