import React, { useEffect, useState } from 'react';
import { Alert, AlertIcon, Box, Text, Spinner } from '@chakra-ui/react';
import { supabase } from '../../../../supabaseClient';
import { useEvent } from './../../../../EventContext';
import { FcCalendar } from "react-icons/fc";

const EventDateComponent = () => {
  const { selectedEventId } = useEvent();
  const [eventDate, setEventDate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedEventId) {
      setIsLoading(true);
      setError(null);

      // Fetch the specific event data from the Supabase table using the selected event ID
      async function fetchEventDate() {
        try {
          const { data, error } = await supabase
            .from('vianney_event')
            .select('event_date')
            .eq('event_id', selectedEventId)
            .single();

          if (error) {
            setError('Error fetching event date');
          } else {
            // Format the date in French format (you can use a library like date-fns for more advanced formatting)
            const formattedDate = new Date(data.event_date).toLocaleDateString('fr-FR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            });

            setEventDate(formattedDate);
          }
        } catch (error) {
          setError('Error fetching event date');
        } finally {
          setIsLoading(false);
        }
      }

      fetchEventDate();
    } else {
      setEventDate(null); // Clear the date if no event is selected
    }
  }, [selectedEventId]);

  return (
    <Alert status="info" variant="subtle" flexDirection="column" alignItems="center">
      <AlertIcon as={FcCalendar} boxSize={8} />
      <Text fontSize='xl' m={4}>
        Date de l'événement :
      </Text>
      {isLoading ? (
        <Spinner size="lg" />
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : (
        <Text fontSize='lg'>{eventDate}</Text>
      )}
    </Alert>
  );
};

export default EventDateComponent;
