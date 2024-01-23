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
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hvjzemvfstwwhhahecwu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2anplbXZmc3R3d2hoYWhlY3d1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5MTQ4Mjc3MCwiZXhwIjoyMDA3MDU4NzcwfQ.6jThCX2eaUjl2qt4WE3ykPbrh6skE8drYcmk-UCNDSw';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AddEventForm() {
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDescription, setEventDescription] = useState('');
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
    }
  };

  // Function to close the success modal
  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false);
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
        <FormControl id='event-location' mt={4} isRequired> {/* Add event-location input */}
          <FormLabel>Lieu de l'événement</FormLabel>
          <Input
            type='text'
            value={eventLocation}
            onChange={(e) => setEventLocation(e.target.value)}
          />
        </FormControl>
        <FormControl id='event-description' mt={4}> {/* Add event-description input */}
          <FormLabel>Description de l'événement</FormLabel>
          <Textarea
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
          />
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
          ⚠️ Pensez à changer d'évênement dans le menu ↗️
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
