import React from 'react';
import { Box, Text } from '@chakra-ui/react';

const EmployeeInfo: React.FC = () => {
  return (
    <Box 
      border="1px solid" 
      borderColor="black" 
      p={6} 
      width="600px"
      borderRadius="md"
      boxShadow="md"
      bg="white"
      textAlign="center"
    >
      <Text color="brown" fontStyle="italic" mb={2}>
        "Prénom / Nom du salarié"
      </Text>
      <Text color="brown" fontStyle="italic">
        "Adresse du salarié"
      </Text>
    </Box>
  );
};

export default EmployeeInfo;
