import React, { useEffect, useState } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { supabase } from '../../../../supabaseClient'; // Import your Supabase configuration here

const EventDateComponent = () => {
  const [eventDate, setEventDate] = useState(null);

  useEffect(() => {
    // Fetch the event data from the Supabase table
    async function fetchEventDate() {
      const { data, error } = await supabase
        .from('vianney_event')
        .select('event_date')
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
  }, []);

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
