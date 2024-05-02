import React from 'react';
import { Flex, Text, IconButton } from '@chakra-ui/react';
import { FiFolder } from 'react-icons/fi';

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
const BaseDeDonnee = () => {
  const tabs = ["Opérationnel", "Renseignements", "Moyens", "Gestion de crise", "Archives"];
  const [activeTab, setActiveTab] = React.useState(tabs[0]);

  return (
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
  );
};

export default BaseDeDonnee;