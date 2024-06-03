import React from 'react';
import { Box, Button, VStack, Icon } from '@chakra-ui/react';
import { FaPhone, FaCheck } from 'react-icons/fa';

const AlerteJeSuisEnDanger = () => {
  const handleEmergencyCall = () => {
    alert("Calling 112...");
    // Here you can add the functionality to call emergency services or navigate to the phone dialer
  };

  const handleOk = () => {
    alert("I'm okay.");
    // Here you can add any functionality for the "I'm okay" button
  };

  return (
    <VStack spacing={4}>
      <Button
        w="100%"
        h="100px"
        colorScheme="red"
        onClick={handleEmergencyCall}
        leftIcon={<Icon as={FaPhone} />}
      >
        J'appelle le 112
      </Button>
      <Button
        w="100%"
        h="100px"
        colorScheme="green"
        onClick={handleOk}
        leftIcon={<Icon as={FaCheck} />}
      >
        Je vais bien
      </Button>
    </VStack>
  );
};

export default AlerteJeSuisEnDanger;
