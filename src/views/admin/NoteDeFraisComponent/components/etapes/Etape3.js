import React from 'react';
import { Box, Button, Flex, Text, Link, Icon } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

function TripList() {
  const trips = [
    { name: 'Tassin-Paris', distance: 473 },
    { name: 'Chartres-Tassin', distance: 508 }
  ];

  return (
    <Box
      mt="10"
      p="6"
      boxShadow="lg"
      borderRadius="md"
      borderWidth="1px"
      borderColor="gray.200"
      bg="white"
    >
      {trips.map((trip, index) => (
        <Flex key={index} justifyContent="space-between" alignItems="center" mb="4">
          <Text fontWeight="bold">{trip.name}</Text>
          <Text color="green.500">{trip.distance} KM</Text>
          <Button size="sm">Modifier</Button>
        </Flex>
      ))}

      <Flex alignItems="center" mt="6">
        <Icon as={AddIcon} color="blue.500" mr="2" />
        <Link color="blue.500" href="#">
          Ajouter un trajet
        </Link>
      </Flex>

      <Box textAlign="right" mt="6">
        <Button colorScheme="blue">Suivant</Button>
      </Box>
    </Box>
  );
}

export default TripList;
