// src/views/auth/Login.js
import React, { useState, useEffect } from 'react';
import { Box, Input, Button, Heading, useToast, InputGroup, InputRightElement, IconButton } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

const Login = () => {
  const [eventName, setEventName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [allEvents, setAllEvents] = useState([]); // State to store all events for debugging
  const toast = useToast();
  const history = useHistory();

  // Fetch all events on component mount
  useEffect(() => {
    const fetchAllEvents = async () => {
      // eslint-disable-next-line
      const { data, error } = await supabase
        .from('vianney_event')
        .select('*');

      console.log("All Events:", data);
      setAllEvents(data); // Store fetched data for potential use
    };

    fetchAllEvents();
  }, []);

  const handleLogin = async () => {
    const trimmedEventName = eventName.trim();
    console.log("Event Name Entered (trimmed):", trimmedEventName);

    // Check if entered event name matches any fetched event (trimmed comparison)
    const eventExists = allEvents.find(
      (event) => event.event_name.trim().toLowerCase() === trimmedEventName.toLowerCase()
    );

    if (!eventExists) {
      console.log("Event not found in fetched data.");
      toast({
        title: 'Erreur',
        description: 'Nom de l\'événement incorrect ou introuvable',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    // Check if the password matches
    console.log("Entered Password:", password);
    console.log("Stored Password:", eventExists.password);

    if (eventExists.password !== password) {
      toast({
        title: 'Erreur',
        description: 'Mot de passe incorrect',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    // Debugging Redirection
    console.log("Login successful! Redirecting...");

    // Save login status in localStorage
    localStorage.setItem('isLoggedIn', 'true');
    
    // Redirect to the admin page
    history.push('/admin/default'); // Adjust the route as needed
    alert('Redirection triggered');  // Add an alert to confirm if the redirection is happening
  };

  return (
    <Box
      maxW="400px"
      mx="auto"
      p={6}
      boxShadow="lg"
      borderRadius="md"
      mt={12}
      bg="white"
      _dark={{ bg: 'gray.700' }}
    >
      <Heading as="h2" size="lg" mb={6} textAlign="center">
        Connexion à l'événement
      </Heading>
      <Input
        placeholder="Nom de l'événement"
        value={eventName}
        onChange={(e) => setEventName(e.target.value)}
        mb={4}
      />
      <InputGroup size="md">
        <Input
          pr="4.5rem"
          type={showPassword ? "text" : "password"}
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          mb={4}
        />
        <InputRightElement width="4.5rem">
          <IconButton
            h="1.75rem"
            size="sm"
            onClick={() => setShowPassword(!showPassword)}
            icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
          />
        </InputRightElement>
      </InputGroup>
      <Button colorScheme="blue" onClick={handleLogin} width="full">
        Connexion
      </Button>
    </Box>
  );
};

export default Login;
