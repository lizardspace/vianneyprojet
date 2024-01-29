import React, { useEffect, useState } from 'react';
import { Alert, AlertIcon, Text, Spinner, Input, Button } from '@chakra-ui/react';
import { supabase } from '../../../../supabaseClient';
import { useEvent } from './../../../../EventContext';
import { FcHome } from "react-icons/fc";

const EventLocationComponent = () => {
  const { selectedEventId } = useEvent();
  const [eventLocation, setEventLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false); // Add state for edit mode
  const [newEventLocation, setNewEventLocation] = useState(''); // Add state for new event location

  useEffect(() => {
    if (selectedEventId) {
      setIsLoading(true);
      setError(null);

      // Fetch the specific event data from the Supabase table using the selected event ID
      async function fetchEventLocation() {
        try {
          const { data, error } = await supabase
            .from('vianney_event')
            .select('event_location')
            .eq('event_id', selectedEventId)
            .single();

          if (error) {
            setError('Error fetching event location');
          } else {
            setEventLocation(data.event_location);
          }
        } catch (error) {
          setError('Error fetching event location');
        } finally {
          setIsLoading(false);
        }
      }

      fetchEventLocation();
    } else {
      setEventLocation(null); // Clear the location if no event is selected
    }
  }, [selectedEventId]);

  const handleEditClick = () => {
    setIsEditMode(true);
    setNewEventLocation(eventLocation || ''); // Set the new event location to the current event location
  };

  const handleSaveClick = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Update the event location in the Supabase table
      const { error } = await supabase
        .from('vianney_event')
        .update({ event_location: newEventLocation })
        .eq('event_id', selectedEventId);

      if (error) {
        setError('Error updating event location');
      } else {
        setEventLocation(newEventLocation);
        setIsEditMode(false);
      }
    } catch (error) {
      setError('Error updating event location');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Alert status="info" variant="subtle" flexDirection="column" alignItems="center">
      <AlertIcon as={FcHome} boxSize={8} />
      <Text fontSize='xl' m={4}>
        Lieu de l'événement :
      </Text>
      {isLoading ? (
        <Spinner size="lg" />
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : isEditMode ? (
        <div>
          <Input
            value={newEventLocation}
            onChange={(e) => setNewEventLocation(e.target.value)}
            size="lg"
            placeholder="Enter new event location"
            mr={2}
          />
          <Button onClick={handleSaveClick} colorScheme="teal" size="lg">
            Save
          </Button>
        </div>
      ) : (
        <div>
          <Text fontSize='lg'>{eventLocation}</Text>
          <Button onClick={handleEditClick} colorScheme="teal" size="lg" mt={2}>
            Edit
          </Button>
        </div>
      )}
    </Alert>
  );
};

export default EventLocationComponent;
