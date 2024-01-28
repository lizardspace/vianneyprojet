import React, { useEffect, useState} from 'react';
import { Box, Text } from '@chakra-ui/react';
import { supabase } from '../../../../supabaseClient';
import { useEvent } from './../../../../EventContext';

const EventDateComponent = () => {
  const { selectedEventId } = useEvent();
  const [eventDate, setEventDate] = useState(null);

  useEffect(() => {
    if (selectedEventId) {
      // Fetch the specific event data from the Supabase table using the selected event ID
      async function fetchEventDate() {
        const { data, error } = await supabase
          .from('vianney_event')
          .select('event_date')
          .eq('event_id', selectedEventId)
          .single();

        if (error) {
          console.error('Error fetching event date:', error.message);
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
      }

      fetchEventDate();
    } else {
      setEventDate(null); // Clear the date if no event is selected
    }
  }, [selectedEventId]);

  return (
    <Box>
      <Text fontSize='xl' m={4}>
        Date de l'événement :
      </Text>
      <Text fontSize='lg'>{eventDate}</Text>
    </Box>
  );
};

export default EventDateComponent;
