import React, { useEffect, useState } from 'react';
import { Alert, AlertIcon, Text, Spinner, Input, Button } from '@chakra-ui/react';
import { supabase } from '../../../../supabaseClient';
import { useEvent } from './../../../../EventContext';
import { FcBusiness } from "react-icons/fc";

const EventNameComponent = () => {
  const { selectedEventId } = useEvent();
  const [eventName, setEventName] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false); // Add state for edit mode
  const [newEventName, setNewEventName] = useState(''); // Add state for new event name

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

  const handleEditClick = () => {
    setIsEditMode(true);
    setNewEventName(eventName || ''); // Set the new event name to the current event name
  };

  const handleSaveClick = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Update the event name in the Supabase table
      const { error } = await supabase
        .from('vianney_event')
        .update({ event_name: newEventName })
        .eq('event_id', selectedEventId);

      if (error) {
        setError('Error updating event name');
      } else {
        setEventName(newEventName);
        setIsEditMode(false);
      }
    } catch (error) {
      setError('Error updating event name');
    } finally {
      setIsLoading(false);
    }
  };

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
      ) : isEditMode ? (
        <div>
          <Input
            value={newEventName}
            onChange={(e) => setNewEventName(e.target.value)}
            size="lg"
            placeholder="Enter new event name"
            mr={2}
          />
          <Button onClick={handleSaveClick} colorScheme="teal" size="lg">
            Enregistrer
          </Button>
        </div>
      ) : (
        <div>
          <Text fontSize='lg'>{eventName}</Text>
          <Button onClick={handleEditClick} colorScheme="teal" size="lg" mt={2}>
            Editer
          </Button>
        </div>
      )}
    </Alert>
  );
};

export default EventNameComponent;
