// src/views/admin/Parameters/index.js
import React from 'react';
import { Box } from '@chakra-ui/react';
import VianneyTeamsTable from './components/VianneyTeamsTable';
import VianneyActionsTable from './components/VianneyActionsTable'; // Import the VianneyActionsTable component
import VianneyFormUtileSalleDeCriseTable from './components/VianneyFormUtileSalleDeCriseTable'; // Import the VianneyFormUtileSalleDeCriseTable component
import VianneyPdfDocumentsTable from './components/VianneyPdfDocumentsTable'; // Import the VianneyPdfDocumentsTable component
import VianneyPdfDocumentsSalleDeCriseTable from './components/VianneyPdfDocumentsSalleDeCriseTable'; // Import the VianneyPdfDocumentsSalleDeCriseTable component
import VianneyTextareaTable from './components/VianneyTextareaTable'; // Import the VianneyTextareaTable component
import VianneyTextareaSalleDeCriseTable from './components/VianneyTextareaSalleDeCriseTable'; // Import the VianneyTextareaSalleDeCriseTable component

const InterfaceEquipe = () => {
  return (
    <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
      <VianneyTeamsTable />
      <VianneyActionsTable /> {/* Include the VianneyActionsTable component */}
      <VianneyFormUtileSalleDeCriseTable /> {/* Include the VianneyFormUtileSalleDeCriseTable component */}
      <VianneyPdfDocumentsTable /> {/* Include the VianneyPdfDocumentsTable component */}
      <VianneyPdfDocumentsSalleDeCriseTable /> {/* Include the VianneyPdfDocumentsSalleDeCriseTable component */}
      <VianneyTextareaTable /> {/* Include the VianneyTextareaTable component */}
      <VianneyTextareaSalleDeCriseTable /> {/* Include the VianneyTextareaSalleDeCriseTable component */}
    </Box>
  );
};

export default InterfaceEquipe;
