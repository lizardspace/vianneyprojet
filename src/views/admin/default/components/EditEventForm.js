import React, { useState, useEffect } from 'react';
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

const supabaseUrl = 'https://hvjzemvfstwwhhahecwu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2anplbXZmc3R3d2hoYWhlY3d1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5MTQ4Mjc3MCwiZXhwIjoyMDA3MDU4NzcwfQ.6jThCX2eaUjl2qt4WE3ykPbrh6skE8drYcmk-UCNDSw';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function EditEventForm({ event, refreshEvents }) {
    const [eventName, setEventName] = useState(event?.event_name || '');
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

    useEffect(() => {
        if (event) {
            setEventName(event.event_name);
            setEventDate(event.event_date);
            setEventLocation(event.event_location);
            setEventDescription(event.event_description);
        }
    }, [event]);


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
