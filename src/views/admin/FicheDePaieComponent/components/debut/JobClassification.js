import React from 'react';
import { Box, Text, Flex } from '@chakra-ui/react';

const JobClassification: React.FC = () => {
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
        {/* Row 1: Classification */}
        <Flex justifyContent="space-between">
          <Text fontWeight="bold">Classification</Text>
          <Text color="brown" fontStyle="italic">"ex: salarié-cadre"</Text>
        </Flex>

        {/* Row 2: Catégorie */}
        <Flex justifyContent="space-between">
          <Text fontWeight="bold">Catégorie</Text>
          <Text color="brown" fontStyle="italic">"ex: ingénieurs et cadres - 130 - 2.2"</Text>
        </Flex>

        {/* Row 3: Emploi */}
        <Flex justifyContent="space-between">
          <Text fontWeight="bold">Emploi</Text>
          <Text color="brown" fontStyle="italic">"ex: juriste"</Text>
        </Flex>
      </Flex>
    </Box>
  );
};

export default JobClassification;
