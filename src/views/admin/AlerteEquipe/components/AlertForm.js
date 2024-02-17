import React, { useState, useEffect } from "react";
import {
    FormControl,
    FormLabel,
    Input,
    Button,
    Checkbox,
    VStack,
    useToast,
    Select // Import Select from Chakra UI
    } from "@chakra-ui/react";
import { v4 as uuidv4 } from "uuid";
import { supabase } from './../../../../supabaseClient';
import { useEvent } from '../../../../EventContext';

const AlertForm = () => {
    const [textAlert, setTextAlert] = useState("");
    const [teamsId, setTeamsId] = useState("");
    const [readOrNot, setReadOrNot] = useState(false);
    const [teams, setTeams] = useState([]);
    const toast = useToast();
    const { selectedEventId } = useEvent();

    useEffect(() => {
        async function fetchTeams() {
            try {
                let query = supabase.from("vianney_teams").select("id, name_of_the_team");

                // Filter teams based on the selected event ID
                if (selectedEventId) {
                    query = query.eq('event_id', selectedEventId);
                }

                const { data, error } = await query;

                if (error) {
                    throw error;
                }

                // Set teams data in state
                setTeams(data);
            } catch (error) {
                console.error("Error fetching teams:", error.message);
            }
        }

        fetchTeams();
    }, [selectedEventId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const {  error } = await supabase
                .from('vianney_alertes_specifiques')
                .insert([
                    {
                        id: uuidv4(),
                        text_alert: textAlert,
                        teams_id: teamsId,
                        read_or_not: readOrNot,
                        event_id: selectedEventId // Include selectedEventId in the insert operation
                    }
                ]);
    
            if (error) {
                throw error;
            }
    
            // Reset form fields
            setTextAlert("");
            setTeamsId("");
            setReadOrNot(false);
            // Show success toast
            toast({
                title: "Alert created.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            // Show error toast
            toast({
                title: "An error occurred.",
                description: error.message,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };    

    return (
                    <form onSubmit={handleSubmit}>
                <VStack spacing="4" alignItems="flex-start">
                    <FormControl>
                        <FormLabel>Texte d'Alerte</FormLabel> {/* Translate UI elements to French */}
                        <Input
                            type="text"
                            value={textAlert}
                            onChange={(e) => setTextAlert(e.target.value)}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>ID des Équipes</FormLabel> {/* Translate UI elements to French */}
                        <Select
                            value={teamsId}
                            onChange={(e) => setTeamsId(e.target.value)}
                        >
                            {/* Map over teams data and create options for each team */}
                            {teams.map((team) => (
                                <option key={team.id} value={team.id}>
                                    {team.name_of_the_team}
                                </option>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl>
                        <Checkbox
                            isChecked={readOrNot}
                            onChange={(e) => setReadOrNot(e.target.checked)}
                        >
                            Lu ou Non lu
                        </Checkbox> {/* Translate UI elements to French */}
                    </FormControl>
                    <Button type="submit" colorScheme="blue">
                        Soumettre
                    </Button> {/* Translate UI elements to French */}
                </VStack>
            </form>
            );
};

export default AlertForm;
