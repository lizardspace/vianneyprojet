import React, { useState } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Textarea,
  useToast,
  Modal, // Import Modal component
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react';
import { v4 as uuidv4 } from 'uuid';
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

export default function AddEventForm() {
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [password, setPassword] = useState(generatePassword()); // Auto-generate password
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false); // State for success modal
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const eventId = uuidv4();

    const { error } = await supabase.from('vianney_event').insert([
      {
        event_id: eventId,
        event_name: eventName,
        event_date: new Date(eventDate).toISOString(),
        event_location: eventLocation,
        event_description: eventDescription,
        password: password, // Add generated password
      },
    ]);

    if (error) {
      toast({
        title: 'Erreur lors de l\'ajout de l\'événement',
        description: error.message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    } else {
      // Show the success modal
      setIsSuccessModalOpen(true);
      toast({
        title: 'Événement ajouté avec succès',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      // Clear the form fields
      setEventName('');
      setEventDate('');
      setEventLocation('');
      setEventDescription('');
      setPassword(generatePassword()); // Generate a new password for the next event
    }
  };

  // Function to close the success modal
  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false);
  };

  // Function to copy the password to clipboard
  const handleCopyPassword = () => {
    navigator.clipboard.writeText(password);
    toast({
      title: 'Mot de passe copié dans le presse-papier',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Box p={5}>
      <form onSubmit={handleSubmit}>
        <FormControl id='event-name' isRequired>
          <FormLabel>Nom de l'événement</FormLabel>
          <Input
            type='text'
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
          />
        </FormControl>
        <FormControl id='event-date' mt={4} isRequired>
          <FormLabel>Date de l'événement</FormLabel>
          <Input
            type='datetime-local'
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
          <FormLabel>Mot de passe généré automatiquement</FormLabel>
          <Input
            type='text'
            value={password}
            isReadOnly
            onClick={handleCopyPassword} // Allow users to click to copy password
          />
          <Button mt={2} colorScheme='gray' size='sm' onClick={handleCopyPassword}>
            Copier le mot de passe
          </Button>
        </FormControl>
        <Button
          mt={4}
          colorScheme='blue'
          type='submit'
          isDisabled={!eventName || !eventDate || !eventLocation}
        >
          Ajouter l'événement
        </Button>
      </form>

      {/* Success Modal */}
      <Modal isOpen={isSuccessModalOpen} onClose={handleCloseSuccessModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Événement ajouté avec succès</ModalHeader>
          <ModalBody>
            ⚠️ Pensez à changer d'événement dans le menu ↗️
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleCloseSuccessModal}>
              Fermer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
