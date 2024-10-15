import React from 'react';
import { Box, Text, Flex } from '@chakra-ui/react';

const EmployerCard: React.FC = () => {
  return (
    <Box 
      border="1px solid" 
      borderColor="black" 
      p={4} 
      width="90%"             // Set width to 90% of the container
      minWidth="90%"         // Set minimum width to 300px (or any value)
      maxWidth="90%"        // Set maximum width to 1200px (or any value)
      mx="auto" 
      borderRadius="md"
      boxShadow="md"
      bg="white"
    >
      <Flex alignItems="center" justifyContent="space-between">
        {/* Logo Section */}
        <Box textAlign="center">
          <Text fontStyle="italic" color="brown">
            "Logo de l'entreprise"
          </Text>
        </Box>

        {/* Info Section */}
        <Box textAlign="right">
          <Text fontWeight="bold" color="brown">
            "Nom de l'employeur"
          </Text>
          <Text fontStyle="italic" color="brown">
            "Adresse de l'employeur"
          </Text>
          <Text fontStyle="italic" color="brown">
            "Code postal de l'employeur"
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};

export default EmployerCard;
