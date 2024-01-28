import React, { useEffect, useState } from 'react';
import { Alert, AlertIcon, Text, Spinner } from '@chakra-ui/react';
import { supabase } from '../../../../supabaseClient';
import { useEvent } from './../../../../EventContext';
import { FcBusiness } from "react-icons/fc";

const EventNameComponent = () => {
  const { selectedEventId } = useEvent();
  const [eventName, setEventName] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedEventId) {
      setIsLoading(true);
      setError(null);

      // Fetch the specific event data from the Supabase table using the selected event ID
      async function fetchEventName() {
        try {
          const { data, error } = await supabase
            .from('vianney_event')
            .select('event_name')
            .eq('event_id', selectedEventId)
            .single();

          if (error) {
            setError('Error fetching event name');
          } else {
            setEventName(data.event_name);
          }
        } catch (error) {
          setError('Error fetching event name');
        } finally {
          setIsLoading(false);
        }
      }

      fetchEventName();
    } else {
      setEventName(null); // Clear the event name if no event is selected
    }
  }, [selectedEventId]);

  return (
    <Alert status="info" variant="subtle" flexDirection="column" alignItems="center">
      <AlertIcon as={FcBusiness} boxSize={8} />
      <Text fontSize='xl' m={4}>
        Nom de l'événement :
      </Text>
      {isLoading ? (
        <Spinner size="lg" />
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : (
        <Text fontSize='lg'>{eventName}</Text>
      )}
    </Alert>
  );
};

export default EventNameComponent;
