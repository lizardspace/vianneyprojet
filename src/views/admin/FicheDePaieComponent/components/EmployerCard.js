import React from 'react';
import { Box, Text, Flex } from '@chakra-ui/react';

const EmployerCard: React.FC = () => {
  return (
    <Box 
      border="1px solid" 
      borderColor="black" 
      p={4} 
      width="400px"
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
