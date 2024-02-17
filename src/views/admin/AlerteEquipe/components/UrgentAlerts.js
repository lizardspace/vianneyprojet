import React, { useState, useEffect } from "react";
import {
  Alert,
  AlertIcon,
  Box,
  Text,
  Stack,
  Spinner,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Textarea,
  FormControl,
  FormLabel,
  FormHelperText,
} from "@chakra-ui/react";
import { supabase } from '../../../../supabaseClient';
import { useEvent } from '../../../../EventContext'; // Import useEvent

const UrgentAlerts = () => {
  const [urgentAlerts, setUrgentAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [selectedAlertId, setSelectedAlertId] = useState(null);
  const [responseText, setResponseText] = useState("");
  const { selectedEventId } = useEvent(); // Get selectedEventId from context

  useEffect(() => {
    async function fetchUrgentAlerts() {
      try {
        let query = supabase.from('vianney_alertes_specifiques').select("*").order('created_at', { ascending: false }).limit(5);
        
        // Filter alerts based on the selected event ID
        if (selectedEventId) {
          query = query.eq('event_id', selectedEventId);
        }
  
        const { data: alertsData, error: alertsError } = await query;
  
        if (alertsError) {
          throw alertsError;
        }
  
        // Fetch team names corresponding to teams_id
        const teamIds = alertsData.map(alert => alert.teams_id);
        const { data: teamsData, error: teamsError } = await supabase.from('vianney_teams').select('id, name_of_the_team').in('id', teamIds);
  
        if (teamsError) {
          throw teamsError;
        }
  
        // Create a map of team id to team name
        const teamNameMap = {};
        teamsData.forEach(team => {
          teamNameMap[team.id] = team.name_of_the_team;
        });
  
        // Combine alert data with team names
        const enrichedAlertsData = alertsData.map(alert => ({
          ...alert,
          team_name: teamNameMap[alert.teams_id]
        }));
  
        setUrgentAlerts(enrichedAlertsData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching urgent alerts:", error.message);
      }
    }
  
    fetchUrgentAlerts();
  }, [selectedEventId]); // Re-fetch alerts when selectedEventId changes
  

  const handleToggleReadStatus = async (id, currentStatus) => {
    try {
      const { error } = await supabase
        .from('vianney_alertes_specifiques')
        .update({ read_or_not: !currentStatus })
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Update the read_or_not status locally
      setUrgentAlerts((prevAlerts) =>
        prevAlerts.map((alert) =>
          alert.id === id ? { ...alert, read_or_not: !currentStatus } : alert
        )
      );

      if (!currentStatus) {
        // If the alert is marked as read, show the response form
        setSelectedAlertId(id);
        setShowResponseForm(true);
      }
    } catch (error) {
      console.error("Error toggling read status:", error.message);
    }
  };

  const handleSubmitResponse = async () => {
    try {
      const { error } = await supabase
        .from('vianney_alertes_specifiques')
        .update({ response: responseText })
        .eq('id', selectedAlertId);

      if (error) {
        throw error;
      }

      // Close the response form modal
      setShowResponseForm(false);
      // Reset response text
      setResponseText("");
    } catch (error) {
      console.error("Error submitting response:", error.message);
    }
  };

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg">
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Alertes Urgentes
      </Text>
      {isLoading ? (
        <Spinner />
      ) : (
        <Stack spacing={4}>
          {urgentAlerts.map((alert) => (
            <Alert
              key={alert.id}
              status={alert.read_or_not ? "success" : "error"}
              variant="subtle"
              flexDirection="column"
              alignItems="flex-start"
              justifyContent="center"
              textAlign="left"
              position="relative"
              width="100%"
              px={6}
              py={4}
              pr={14}
              rounded="md"
            >
              <AlertIcon />
              <Stack spacing={2}>
                <Text fontWeight="bold" fontSize="lg">
                  {alert.text_alert}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Équipe: {alert.team_name} {alert.teams_id}
                </Text>
                <Button
                  onClick={() =>
                    handleToggleReadStatus(alert.id, alert.read_or_not)
                  }
                  size="sm"
                  variant="outline"
                  colorScheme={alert.read_or_not ? "green" : "red"}
                >
                  {alert.read_or_not ? "Lu" : "Non lu"}
                </Button>
                <Text fontSize="sm" color="gray.500">
                  Créé le: {new Date(alert.created_at).toLocaleString()}
                </Text>
                {alert.response && (
                  <Text fontWeight="bold" fontSize="lg">
                    Réponse: {alert.response}
                  </Text>
                )}
              </Stack>
            </Alert>
          ))}
        </Stack>
      )}
      <Modal isOpen={showResponseForm} onClose={() => setShowResponseForm(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Entrez votre réponse</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Réponse</FormLabel>
              <Textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Entrez votre réponse ici..."
                size="lg"
              />
              <FormHelperText>Entrez votre réponse à cette alerte urgente.</FormHelperText>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmitResponse}>
              Soumettre
            </Button>
            <Button onClick={() => setShowResponseForm(false)}>Annuler</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
  
export default UrgentAlerts;
