import React, { useState } from 'react';
import { Flex, Text, IconButton, Box, Button, VStack } from '@chakra-ui/react';
import { FiFolder, FiChevronLeft } from 'react-icons/fi';
import MoyensEffectifsFichiersFileUploadForm from './moyenseffectifs/MoyensEffectifsFichiersFileUploadForm';
import MoyensEffectifsFichierIconList from './moyenseffectifs/MoyensEffectifsFichierIconList';
import MoyensMaterielsFichiersFileUploadForm from './moyensmateriels/MoyensMaterielsFichiersFileUploadForm';
import MoyensMaterielsFichierIconList from './moyensmateriels/MoyensMaterielsFichierIconList';

// FolderTab component
const FolderTab = ({ label, isActive, onClick, ...rest }) => {
  return (
    <Flex
      direction="column"
      align="center"
      p={2}
      borderRadius="lg"
      bg={isActive ? "yellow.300" : "yellow.100"}
      boxShadow={isActive ? "md" : ""}
      cursor="pointer"
      onClick={onClick}
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
const BaseDeDonneeMoyens = () => {
  const tabs = ["Matériels", "Effectifs"];
  const [activeTab, setActiveTab] = useState(null);
  const [showSubfolders, setShowSubfolders] = useState(false);
  const [subTab, setSubTab] = useState(null);

  const handleBackClick = () => {
    if (subTab) {
      setSubTab(null);
    } else {
      setActiveTab(null);
      setShowSubfolders(false);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setShowSubfolders(true);
  };

  const handleSubTabClick = (subTab) => {
    setSubTab(subTab);
  };

  return (
    <Flex direction="column" align="start" width="100%">
      {showSubfolders ? (
        <>
          <Button leftIcon={<FiChevronLeft />} variant="link" onClick={handleBackClick}>
            Retour
          </Button>
          {subTab === "Fichiers importés" && activeTab === "Matériels" ? (
            <Box width="100%">
              <MoyensMaterielsFichiersFileUploadForm />
              <MoyensMaterielsFichierIconList />
            </Box>
          ) : subTab === "Fichiers importés" && activeTab === "Effectifs" ? (
            <Box width="100%">
              <MoyensEffectifsFichiersFileUploadForm />
              <MoyensEffectifsFichierIconList />
            </Box>
          ) : (
            <VStack align="start" pl={5} mt={2} spacing={2}>
              {activeTab === "Matériels" && (
                <>
                  <FolderTab label="Liste matériel enregistré et historique" />
                  <FolderTab label="Fichiers importés" onClick={() => handleSubTabClick("Fichiers importés")} />
                </>
              )}
              {activeTab === "Effectifs" && (
                <>
                  <FolderTab label="Liste Effectifs enregistré et historique" />
                  <FolderTab label="Fichiers importés" onClick={() => handleSubTabClick("Fichiers importés")} />
                  <FolderTab label="Emploi du temps" />
                </>
              )}
            </VStack>
          )}
        </>
      ) : (
        <Flex direction="row" justify="space-between" width="100%">
          {tabs.map(tab => (
            <FolderTab
              key={tab}
              label={tab}
              isActive={tab === activeTab}
              onClick={() => handleTabClick(tab)}
            />
          ))}
        </Flex>
      )}
    </Flex>
  );
};

export default BaseDeDonneeMoyens;
