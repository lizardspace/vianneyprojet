import React, { useState } from 'react';
import { Box, Heading, SimpleGrid, Button } from '@chakra-ui/react';
import VianneyTeamsTable from './components/VianneyTeamsTable';
import VianneyActionsTable from './components/VianneyActionsTable';
import VianneyFormUtileSalleDeCriseTable from './components/VianneyFormUtileSalleDeCriseTable';
import VianneyPdfDocumentsTable from './components/VianneyPdfDocumentsTable';
import VianneyPdfDocumentsSalleDeCriseTable from './components/VianneyPdfDocumentsSalleDeCriseTable';
import VianneyTextareaTable from './components/VianneyTextareaTable';
import VianneyTextareaSalleDeCriseTable from './components/VianneyTextareaSalleDeCriseTable';
import VianneyActionsTableEvent from './componentsEventContext/VianneyActionsTableEvent';
import VianneyAlertTableEvent from './componentsEventContext/VianneyAlertTableEvent';

// Import the missing event components here
import VianneyTeamsTableEvent from './componentsEventContext/VianneyTeamsTableEvent'; // Replace with the actual import path
import VianneyFormUtileSalleDeCriseTableEvent from './componentsEventContext/VianneyFormUtileSalleDeCriseTableEvent'; // Replace with the actual import path
import VianneyPdfDocumentsTableEvent from './componentsEventContext/VianneyPdfDocumentsTableEvent'; // Replace with the actual import path
import VianneyPdfDocumentsSalleDeCriseTableEvent from './componentsEventContext/VianneyPdfDocumentsSalleDeCriseTableEvent'; // Replace with the actual import path
import VianneyTextareaTableEvent from './componentsEventContext/VianneyTextareaTableEvent'; // Replace with the actual import path
import VianneyTextareaSalleDeCriseTableEvent from './componentsEventContext/VianneyTextareaSalleDeCriseTableEvent'; // Replace with the actual import path

const InterfaceEquipe = () => {
  const [showRawData, setShowRawData] = useState(false);

  const toggleRawDataVisibility = () => {
    setShowRawData(!showRawData);
  };

  return (
    <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
      <Box p={{ base: 4, md: 8, xl: 12 }}>
        <Heading as="h1" size="lg" mb={4}>
          Exportation brute des excels
        </Heading>
        <Button onClick={toggleRawDataVisibility} mb={4}>
          {showRawData ? 'Hide Raw Data' : 'Show Raw Data'}
        </Button>
        {showRawData && (
          <SimpleGrid columns={{ base: 1, sm: 1, md: 2, lg: 2 }} spacing={4}>
            <VianneyTeamsTable />
            <VianneyActionsTable />
            <VianneyFormUtileSalleDeCriseTable />
            <VianneyPdfDocumentsTable />
            <VianneyPdfDocumentsSalleDeCriseTable />
            <VianneyTextareaTable />
            <VianneyTextareaSalleDeCriseTable />
          </SimpleGrid>
        )}
        <Heading as="h1" size="lg" mb={4} mt={4}>
          On pourra faire des exportations excels plus complexes avec des views à ta demande
        </Heading>
                  <SimpleGrid columns={{ base: 1, sm: 1, md: 2, lg: 2 }} spacing={4}>
            <VianneyActionsTableEvent />
            <VianneyAlertTableEvent />
            <VianneyTeamsTableEvent />
            <VianneyFormUtileSalleDeCriseTableEvent />
            <VianneyPdfDocumentsTableEvent />
            <VianneyPdfDocumentsSalleDeCriseTableEvent />
            <VianneyTextareaTableEvent />
            <VianneyTextareaSalleDeCriseTableEvent />
          </SimpleGrid>
              </Box>
    </Box>
  );
};

export default InterfaceEquipe;
