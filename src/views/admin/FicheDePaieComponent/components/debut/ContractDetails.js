import React from 'react';
import { Box, Text, Flex } from '@chakra-ui/react';

const ContractDetails: React.FC = () => {
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
        {/* Row 1 */}
        <Flex justifyContent="space-between">
          <Text fontWeight="bold">Début de période</Text>
          <Text color="brown" fontStyle="italic">"ex: 01 octobre 2020"</Text>
        </Flex>

        {/* Row 2 */}
        <Flex justifyContent="space-between">
          <Text fontWeight="bold">Fin de période</Text>
          <Text color="brown" fontStyle="italic">"ex: 31 octobre 2020"</Text>
        </Flex>

        {/* Row 3 */}
        <Flex justifyContent="space-between">
          <Text fontWeight="bold">Début du contrat</Text>
          <Text color="brown" fontStyle="italic">"ex: 24 août 2020"</Text>
        </Flex>

        {/* Row 4 */}
        <Flex justifyContent="space-between">
          <Text fontWeight="bold">Date d'ancienneté</Text>
          <Text color="brown" fontStyle="italic">"ex: 24 août 2020"</Text>
        </Flex>

        {/* Row 5 */}
        <Flex justifyContent="space-between">
          <Text fontWeight="bold">N° de sécurité sociale</Text>
          <Text color="brown" fontStyle="italic">"XXXXXXXX"</Text>
        </Flex>
      </Flex>
    </Box>
  );
};

export default ContractDetails;
