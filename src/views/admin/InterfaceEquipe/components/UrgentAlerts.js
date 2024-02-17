import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Badge,
  Stack,
  Divider,
  useColorModeValue,
  Spinner
} from "@chakra-ui/react";
import { supabase } from './../../../../supabaseClient';

const UrgentAlerts = () => {
  const [urgentAlerts, setUrgentAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUrgentAlerts() {
      try {
        const { data, error } = await supabase
          .from('vianney_alertes_specifiques')
          .select("*")
          .order('created_at', { ascending: false })
          .limit(5); // Limit to the latest 5 urgent alerts

        if (error) {
          throw error;
        }

        setUrgentAlerts(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching urgent alerts:", error.message);
      }
    }

    fetchUrgentAlerts();
  }, []);

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg">
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Urgent Alerts
      </Text>
      {isLoading ? (
        <Spinner />
      ) : (
        <Stack spacing={4}>
          {urgentAlerts.map((alert) => (
            <Box key={alert.id}>
              <Text fontSize="lg" fontWeight="bold">
                {alert.text_alert}
              </Text>
              <Text fontSize="sm" color="gray.500">
                Teams ID: {alert.teams_id}
              </Text>
              <Text>
                <Badge colorScheme={alert.read_or_not ? "green" : "red"}>
                  {alert.read_or_not ? "Read" : "Not Read"}
                </Badge>
              </Text>
              <Text fontSize="sm" color="gray.500">
                Created At: {new Date(alert.created_at).toLocaleString()}
              </Text>
              <Divider mt={2} />
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default UrgentAlerts;
