import React, { useState } from 'react';
import { Flex, Text, IconButton, Box, Button } from '@chakra-ui/react';
import { FiFolder, FiChevronLeft } from 'react-icons/fi';
import RenseignementsFichiersFileUploadForm from './renseignements/RenseignementsFichiersFileUploadForm';
import RenseignementsFichiersFichierIconList from './renseignements/RenseignementsFichiersFichierIconList';

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
const BaseDeDonneeRenseignements = () => {
  const tabs = ["Informations", "Fichiers de renseignements"];
  const [activeTab, setActiveTab] = useState(null);

  const handleBackClick = () => {
    setActiveTab(null);
  };

  return (
    <Box width="100%">
      {activeTab === "Fichiers de renseignements" ? (
        <Box>
          <Button leftIcon={<FiChevronLeft />} variant="link" onClick={handleBackClick}>
            Retour
          </Button>
          <RenseignementsFichiersFileUploadForm />
          <RenseignementsFichiersFichierIconList />
        </Box>
      ) : (
        <Flex direction="row" justify="space-between">
          {tabs.map(tab => (
            <FolderTab
              key={tab}
              label={tab}
              isActive={tab === activeTab}
              onClick={() => setActiveTab(tab)}
            />
          ))}
        </Flex>
      )}
    </Box>
  );
};

export default BaseDeDonneeRenseignements;
