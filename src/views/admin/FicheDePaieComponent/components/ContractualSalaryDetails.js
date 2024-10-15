import React from 'react';
import { Box, Text, Flex } from '@chakra-ui/react';

const ContractualSalaryDetails: React.FC = () => {
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
      <Flex direction="column" spacing={2}>
        {/* Row 1: Salaire contractuel */}
        <Flex justifyContent="space-between">
          <Text fontWeight="bold">Salaire contractuel</Text>
          <Text color="brown" fontStyle="italic" fontWeight="bold">"ex: 3500"</Text>
        </Flex>

        {/* Row 2: Durée mensuelle */}
        <Flex justifyContent="space-between">
          <Text fontWeight="bold">Durée mensuelle</Text>
          <Text color="brown" fontStyle="italic" fontWeight="bold">"ex: 136 H"</Text>
        </Flex>

        {/* Row 3: Taux horaire moyen */}
        <Flex justifyContent="space-between">
          <Text fontWeight="bold">Taux horaire moyen</Text>
          <Text color="brown" fontStyle="italic" fontWeight="bold">"ex: 22.34€"</Text>
        </Flex>
      </Flex>
    </Box>
  );
};

export default ContractualSalaryDetails;
