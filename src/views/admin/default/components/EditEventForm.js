import React, { useState } from 'react';
import {
    Box,
    FormControl,
    FormLabel,
    Input,
    Button,
    Textarea,
    useToast,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from '@chakra-ui/react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function EditEventForm({ event, refreshEvents }) {
    const [eventName, setEventName] = useState(event.event_name);
    const [eventDate, setEventDate] = useState(event.event_date);
    const [eventLocation, setEventLocation] = useState(event.event_location);
    const [eventDescription, setEventDescription] = useState(event.event_description);
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const handleUpdate = async () => {
        setIsLoading(true);
        const { error } = await supabase.from('vianney_event').update([
            {
                event_name: eventName,
                event_date: new Date(eventDate).toISOString(),
                event_location: eventLocation,
                event_description: eventDescription,
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
            refreshEvents(); // Refresh the events list
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
            refreshEvents(); // Refresh the events list
        }
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
            <Button colorScheme='blue' onClick={handleUpdate} isLoading={isLoading}>
                Modifier l'événement
            </Button>
            <Button colorScheme='red' onClick={handleDelete} isLoading={isLoading} ml={3}>
                Supprimer l'événement
            </Button>
        </Box>
    );
}
