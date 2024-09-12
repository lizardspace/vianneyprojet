import React, { useState, useEffect } from 'react';
import { Box, Input, Button, Heading, useToast, InputGroup, InputRightElement, IconButton } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useEvent } from '../../EventContext'; // Import the EventContext

const Login = () => {
  const [eventName, setEventName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [allEvents, setAllEvents] = useState([]);
  const { setEvent } = useEvent(); // Use setEvent from EventContext
  const toast = useToast();
  const history = useHistory();

  // Fetch all events on component mount
  useEffect(() => {
    const fetchAllEvents = async () => {
      const { data, error } = await supabase.from('vianney_event').select('*');
      if (error) {
        console.error('Error fetching events:', error.message);
      } else {
        console.log("All Events:", data);
        setAllEvents(data); // Store fetched data for potential use
      }
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

    // Save eventId, eventName, latitude, and longitude in the EventContext and localStorage
    setEvent(eventExists.event_id, eventExists.event_name, eventExists.latitude, eventExists.longitude);

    // Save login status in localStorage
    localStorage.setItem('isLoggedIn', 'true');

    // Redirect to the admin page
    history.push('/admin/default'); 
    console.log('Login successful! Event selected:', eventExists.event_name);
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
