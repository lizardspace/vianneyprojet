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

const AlertForm = () => {
    const [textAlert, setTextAlert] = useState("");
    const [teamsId, setTeamsId] = useState("");
    const [readOrNot, setReadOrNot] = useState(false);
    const [teams, setTeams] = useState([]);
    const toast = useToast();

    // Fetch teams data from vianney_teams table
    useEffect(() => {
        async function fetchTeams() {
            try {
                const { data, error } = await supabase
                    .from("vianney_teams")
                    .select("id, name_of_the_team"); // Select both id and name_of_the_team

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
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data, error } = await supabase
                .from('vianney_alertes_specifiques')
                .insert([
                    {
                        id: uuidv4(),
                        text_alert: textAlert,
                        teams_id: teamsId,
                        read_or_not: readOrNot
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
                    <FormLabel>Text Alert</FormLabel>
                    <Input
                        type="text"
                        value={textAlert}
                        onChange={(e) => setTextAlert(e.target.value)}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Teams ID</FormLabel>
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
                        Read or Not
                    </Checkbox>
                </FormControl>
                <Button type="submit" colorScheme="blue">
                    Submit
                </Button>
            </VStack>
        </form>
    );
};

export default AlertForm;
