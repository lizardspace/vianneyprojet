import React from 'react';
import { Box, Text, Flex } from '@chakra-ui/react';

const SalaryDetails: React.FC = () => {
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
        {/* Row 1: Minimum Coefficient */}
        <Flex justifyContent="space-between">
          <Text fontWeight="bold">Minimum coefficient</Text>
          <Text color="brown" fontStyle="italic">"ex: 2.543€"</Text>
        </Flex>

        {/* Row 2: Rémunération totale du mois */}
        <Flex justifyContent="space-between">
          <Text fontWeight="bold">Rémunération totale du mois</Text>
          <Text color="brown" fontStyle="italic">"ex: 4.600€"</Text>
        </Flex>
      </Flex>
    </Box>
  );
};

export default SalaryDetails;
