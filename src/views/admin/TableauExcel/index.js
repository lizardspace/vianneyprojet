import React from 'react';
import { Box, Heading, SimpleGrid } from '@chakra-ui/react';
import VianneyTeamsTable from './components/VianneyTeamsTable';
import VianneyActionsTable from './components/VianneyActionsTable';
import VianneyFormUtileSalleDeCriseTable from './components/VianneyFormUtileSalleDeCriseTable';
import VianneyPdfDocumentsTable from './components/VianneyPdfDocumentsTable';
import VianneyPdfDocumentsSalleDeCriseTable from './components/VianneyPdfDocumentsSalleDeCriseTable';
import VianneyTextareaTable from './components/VianneyTextareaTable';
import VianneyTextareaSalleDeCriseTable from './components/VianneyTextareaSalleDeCriseTable';
import VianneyActionsTableEvent from './componentsEventContext/VianneyActionsTableEvent';
import VianneyAlertTableEvent from './componentsEventContext/VianneyAlertTableEvent';

const InterfaceEquipe = () => {
  return (
    <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
      <Box p={{ base: 4, md: 8, xl: 12 }}>
        <Heading as="h1" size="lg" mb={4}>
          Exportation brute des excels
        </Heading>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={4}>
          <VianneyTeamsTable />
          <VianneyActionsTable />
          <VianneyFormUtileSalleDeCriseTable />
          <VianneyPdfDocumentsTable />
          <VianneyPdfDocumentsSalleDeCriseTable />
          <VianneyTextareaTable />
          <VianneyTextareaSalleDeCriseTable />
        </SimpleGrid>
        <Heading as="h1" size="lg" mb={4} mt={4}>
          On pourra faire des exportations excels plus complexes avec des views à ta demande
        </Heading>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={4}>
          <VianneyActionsTableEvent />
          <VianneyAlertTableEvent/>
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default InterfaceEquipe;
