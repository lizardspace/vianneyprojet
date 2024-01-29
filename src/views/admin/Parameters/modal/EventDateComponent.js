import React, { useEffect, useState } from 'react';
import { Alert, AlertIcon, Text, Spinner, Input, Button } from '@chakra-ui/react';
import { supabase } from '../../../../supabaseClient';
import { useEvent } from './../../../../EventContext';
import { FcCalendar } from "react-icons/fc";

const EventDateComponent = () => {
  const { selectedEventId } = useEvent();
  const [eventDate, setEventDate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false); // Add state for edit mode
  const [newEventDate, setNewEventDate] = useState(''); // Add state for new event date

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

  const handleEditClick = () => {
    setIsEditMode(true);
    setNewEventDate(eventDate || ''); // Set the new event date to the current event date
  };

  const handleSaveClick = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Convert the new date string to a JavaScript Date object
      const parsedDate = new Date(newEventDate);

      // Update the event date in the Supabase table
      const { error } = await supabase
        .from('vianney_event')
        .update({ event_date: parsedDate })
        .eq('event_id', selectedEventId);

      if (error) {
        setError('Error updating event date');
      } else {
        setEventDate(parsedDate.toLocaleDateString('fr-FR', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }));
        setIsEditMode(false);
      }
    } catch (error) {
      setError('Error updating event date');
    } finally {
      setIsLoading(false);
    }
  };

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
      ) : isEditMode ? (
        <div>
          <Input
            type="date"
            value={newEventDate}
            onChange={(e) => setNewEventDate(e.target.value)}
            size="lg"
            placeholder="Enter new event date"
            mr={2}
          />
          <Button onClick={handleSaveClick} colorScheme="teal" size="lg">
            Save
          </Button>
        </div>
      ) : (
        <div>
          <Text fontSize='lg'>{eventDate}</Text>
          <Button onClick={handleEditClick} colorScheme="teal" size="lg" mt={2}>
            Edit
          </Button>
        </div>
      )}
    </Alert>
  );
};

export default EventDateComponent;
