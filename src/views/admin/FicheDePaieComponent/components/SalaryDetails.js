import React from 'react';
import { Box, Text, Flex } from '@chakra-ui/react';

const SalaryDetails: React.FC = () => {
  return (
    <Box 
      border="1px solid" 
      borderColor="black" 
      p={4} 
      width="450px"
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
