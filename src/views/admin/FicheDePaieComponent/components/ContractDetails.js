import React from 'react';
import { Box, Text, Flex } from '@chakra-ui/react';

const ContractDetails: React.FC = () => {
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
