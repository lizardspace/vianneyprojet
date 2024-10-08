import React, { useState } from 'react';
import { Flex, Text, IconButton, Box, Button } from '@chakra-ui/react';
import { FiFolder, FiChevronLeft } from 'react-icons/fi';
import ListFicheBilanSUAPminiFichier from 'views/admin/alertejesuisendanger/components/ListFicheBilanSUAPminiFichier';
import OperationnelFichiersFileUploadForm from './operationnel/OperationnelFichiersFileUploadForm';
import OperationnelFichiersFichierIconList from './operationnel/OperationnelFichiersFichierIconList';
import VianneyAlertChat from 'views/admin/TableauDeBord/components/VianneyAlertChat';
import VianneyAlertTableEvent from 'views/admin/TableauExcel/componentsEventContext/VianneyAlertTableEvent';

// FolderTab component
const FolderTab = ({ label, isActive, ...rest }) => {
  return (
    <Flex
      direction="column"
      align="center"
      p={2}
      borderRadius="lg"
      bg={isActive ? "yellow.300" : "yellow.100"}
      boxShadow={isActive ? "md" : ""}
      cursor="pointer"
      {...rest}
    >
      <IconButton
        aria-label={`Folder ${label}`}
        icon={<FiFolder />}
        isRound
        size="lg"
        bg="yellow.500"
        color="white"
        marginBottom={2}
      />
      <Text fontSize="sm">{label}</Text>
    </Flex>
  );
};

// Main component
const BaseDeDonneeOperationnel = () => {
  const tabs = ["Fichiers", "Secours", "Journal officiel"];
  const [activeTab, setActiveTab] = useState(null);

  const handleBackClick = () => {
    setActiveTab(null);
  };

  return (
    <Box width="100%">
      {activeTab === "Secours" ? (
        <Box>
          <Button leftIcon={<FiChevronLeft />} variant="link" onClick={handleBackClick}>
            Retour
          </Button>
          <ListFicheBilanSUAPminiFichier />
        </Box>
      ) : activeTab === "Fichiers" ? (
        <Box>
          <Button leftIcon={<FiChevronLeft />} variant="link" onClick={handleBackClick}>
            Retour
          </Button>
          <OperationnelFichiersFileUploadForm />
          <OperationnelFichiersFichierIconList />
        </Box>
      ) : activeTab === "Journal officiel" ? (
        <Box>
          <Button leftIcon={<FiChevronLeft />} variant="link" onClick={handleBackClick}>
            Retour
          </Button>
          <VianneyAlertTableEvent />
          <Box my={4}></Box> {/* Adds space between components */}
          <VianneyAlertChat />
        </Box>
      ) : (
        <Flex direction="row" align="center">
          {tabs.map(tab => (
            <FolderTab
              key={tab}
              label={tab}
              isActive={tab === activeTab}
              onClick={() => setActiveTab(tab)}
              mr={4} // Adds margin between tabs
            />
          ))}
        </Flex>
      )}
    </Box>
  );
};

export default BaseDeDonneeOperationnel;
