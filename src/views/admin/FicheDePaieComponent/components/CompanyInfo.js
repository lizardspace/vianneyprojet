import React from 'react';
import { Box, Text, Flex } from '@chakra-ui/react';

const CompanyInfo: React.FC = () => {
  return (
    <Box 
      border="1px solid" 
      borderColor="black" 
      p={4} 
      borderRadius="md"
      boxShadow="md"
      bg="white"
      width="90%"             // Set width to 90% of the container
      minWidth="90%"         // Set minimum width to 300px (or any value)
      maxWidth="90%"        // Set maximum width to 1200px (or any value)
      mx="auto"                // Center the component horizontally
    >
      <Flex direction="column" spacing={2}>
        {/* Row 1: N° de SIRET */}
        <Flex justifyContent="space-between">
          <Text fontWeight="bold">N° de SIRET</Text>
          <Text color="brown" fontStyle="italic">"ex : 054312354323"</Text>
        </Flex>

        {/* Row 2: Code APE */}
        <Flex justifyContent="space-between">
          <Text fontWeight="bold">Code APE</Text>
          <Text color="brown">"6534Z"</Text>
        </Flex>

        {/* Row 3: Convention collective */}
        <Flex justifyContent="space-between" alignItems="flex-start">
          <Text fontWeight="bold">Convention collective</Text>
          <Text color="brown" fontStyle="italic" textAlign="right">
            "ex: bureaux d'études techniques, cabinets d'ingénieurs-conseils et sociétés de conseil (syntec)"
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
};

export default CompanyInfo;
