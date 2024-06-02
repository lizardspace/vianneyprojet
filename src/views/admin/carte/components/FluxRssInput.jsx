import React, { useEffect, useState } from 'react';
import { useEvent } from './../../../../EventContext'; // Assurez-vous que le chemin est correct
import { supabase } from './../../../../supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Text,
    useToast,
} from '@chakra-ui/react';

const FluxRssInput = () => {
    // eslint-disable-next-line no-unused-vars
    const { setEventId, selectedEventId } = useEvent();
    // eslint-disable-next-line no-unused-vars
    const [eventList, setEventList] = useState([]);
    const [rssUrl, setRssUrl] = useState('');
    const toast = useToast();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data, error } = await supabase.from('vianney_event').select('*');
                if (error) {
                    throw error;
                }
                setEventList(data);
            } catch (error) {
                console.error('Error fetching data:', error.message);
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedEventId || !rssUrl) {
            toast({
                title: 'Erreur',
                description: 'Veuillez sélectionner un événement et saisir une URL RSS',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        try {
            const { error } = await supabase
                .from('vianney_flux_rss')
                .insert([{ id: uuidv4(), event_id: selectedEventId, url_du_flux_rss: rssUrl }]);

            if (error) {
                throw error;
            }

            toast({
                title: 'Succès',
                description: 'Flux RSS ajouté avec succès!',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            setRssUrl('');
        } catch (error) {
            console.error('Error inserting data:', error.message);
        }
    };

    return (
        <Box maxW="md" mx="auto" mt={8} p={4} borderWidth={1} borderRadius="md" boxShadow="lg">
            <form onSubmit={handleSubmit}>
                {selectedEventId ? (
                    <Input type="hidden" value={selectedEventId} readOnly />
                ) : (
                    <Text mb={4}>Pas d'événement sélectionné</Text>
                )}

                <FormControl mb={4}>
                    <FormLabel htmlFor="rssUrl">URL du Flux RSS :</FormLabel>
                    <Input
                        id="rssUrl"
                        type="url"
                        value={rssUrl}
                        onChange={(e) => setRssUrl(e.target.value)}
                    />
                </FormControl>

                <Button type="submit" colorScheme="blue" width="full">
                    Ajouter Flux RSS
                </Button>
            </form>
        </Box>
    );
};

export default FluxRssInput;
