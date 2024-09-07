import React, { useState } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Textarea,
  useToast,
} from '@chakra-ui/react';

import { supabase } from './../../../../supabaseClient';

// Utility function to generate a random password
const generatePassword = (length = 12) => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*!';
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};

export default function EditEventForm({ event, refreshEvents }) {
  const [eventName, setEventName] = useState(event?.event_name || '');
  const [eventDate, setEventDate] = useState(event.event_date);
  const [eventLocation, setEventLocation] = useState(event.event_location);
  const [eventDescription, setEventDescription] = useState(event.event_description);
  const [password, setPassword] = useState(event?.password || ''); // Include password state
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleUpdate = async () => {
    setIsLoading(true);
    const { error } = await supabase.from('vianney_event').update([
      {
        event_name: eventName,
        event_date: eventDate,
        event_location: eventLocation,
        event_description: eventDescription,
        password: password, // Update password field
      },
    ]).match({ event_id: event.event_id });

    setIsLoading(false);

    if (error) {
      toast({
        title: 'Erreur lors de la mise à jour de l\'événement',
        description: error.message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Événement mis à jour avec succès',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      refreshEvents();
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    const { error } = await supabase.from('vianney_event').delete().match({ event_id: event.event_id });

    setIsLoading(false);

    if (error) {
      toast({
        title: 'Erreur lors de la suppression de l\'événement',
        description: error.message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Événement supprimé avec succès',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      refreshEvents();
    }
  };

  // Function to generate a new password
  const handleGeneratePassword = () => {
    const newPassword = generatePassword();
    setPassword(newPassword);
    toast({
      title: 'Nouveau mot de passe généré',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Box p={5}>
      <FormControl id='event-name' isRequired>
        <FormLabel>Nom de l'événement</FormLabel>
        <Input
          type='text'
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
        />
      </FormControl>
      <FormControl id='event-date' mt={4} isRequired>
        <FormLabel>Date de l'événement (YYYY-MM-DD)</FormLabel>
        <Input
          type='text'
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
        />
      </FormControl>
      <FormControl id='event-location' mt={4} isRequired>
        <FormLabel>Lieu de l'événement</FormLabel>
        <Input
          type='text'
          value={eventLocation}
          onChange={(e) => setEventLocation(e.target.value)}
        />
      </FormControl>
      <FormControl id='event-description' mt={4}>
        <FormLabel>Description de l'événement</FormLabel>
        <Textarea
          value={eventDescription}
          onChange={(e) => setEventDescription(e.target.value)}
        />
      </FormControl>
      <FormControl id='event-password' mt={4} isRequired>
        <FormLabel>Mot de passe de l'événement</FormLabel>
        <Input
          type='text'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Générer un mot de passe sécurisé'
        />
        <Button colorScheme='gray' size='sm' mt={2} onClick={handleGeneratePassword}>
          Générer un mot de passe sécurisé
        </Button>
      </FormControl>
      <Box pt="10px">
        <Button colorScheme='blue' onClick={handleUpdate} isLoading={isLoading}>
          Modifier
        </Button>
        <Button colorScheme='red' onClick={handleDelete} isLoading={isLoading} ml={3}>
          Supprimer
        </Button>
      </Box>
    </Box>
  );
}
