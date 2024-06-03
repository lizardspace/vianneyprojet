import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Button,
  VStack,
  CircularProgress,
  CircularProgressLabel,
  Center,
  IconButton,
} from '@chakra-ui/react';
import { PhoneIcon, CheckIcon } from '@chakra-ui/icons';

const AccidentDetected = () => {
  const [counter, setCounter] = useState(120); // 120 seconds countdown

  useEffect(() => {
    if (counter > 0) {
      const timer = setInterval(() => {
        setCounter((prevCounter) => prevCounter - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [counter]);

  return (
    <Center height="100vh" bg="gray.50" p={4}>
      <VStack spacing={8} bg="white" p={6} rounded="md" shadow="md">
        <Text fontSize="lg" color="red.500" fontWeight="bold">
          SOS-sans contact
        </Text>
        <Text fontSize="2xl" fontWeight="bold">
          Demande d'aide
        </Text>
        <Text fontSize="md" color="gray.500">
          Envoi de l'alerte dans
        </Text>
        <CircularProgress
          value={(counter / 120) * 100}
          size="120px"
          color="green.400"
        >
          <CircularProgressLabel>{counter}s</CircularProgressLabel>
        </CircularProgress>
        <VStack spacing={4} width="100%">
          <Button
            leftIcon={<PhoneIcon />}
            colorScheme="red"
            size="lg"
            width="100%"
          >
            Je confirme le SOS
          </Button>
          <Button
            leftIcon={<CheckIcon />}
            colorScheme="green"
            size="lg"
            width="100%"
          >
            Je vais bien
          </Button>
        </VStack>
      </VStack>
    </Center>
  );
};

export default AccidentDetected;
