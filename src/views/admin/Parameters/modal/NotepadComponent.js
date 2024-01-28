import React, { useState, useEffect } from 'react';
import {
  Box,
  Textarea,
  Button,
  VStack,
  HStack,
  Spacer,
  IconButton,
  Tooltip,
  useToast,
  Text,
} from '@chakra-ui/react';
import { AddIcon, DownloadIcon, DeleteIcon } from '@chakra-ui/icons';
import { supabase } from '../../../../supabaseClient'; // Import your Supabase configuration here
import { useEvent } from './../../../../EventContext'; // Import the useEvent hook

const NotepadComponent = () => {
  const { selectedEventId } = useEvent(); // Get the selected event_id from the context
  const [note, setNote] = useState('');
  const [savedNote, setSavedNote] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const toast = useToast();

  useEffect(() => {
    // Fetch the saved note from the textarea table
    async function fetchSavedNote() {
      const { data, error } = await supabase
        .from('textarea')
        .select('text')
        .eq('event_id', selectedEventId) // Fetch note based on event_id
        .single();

      if (error) {
        console.error('Error fetching saved note:', error.message);
      } else {
        setSavedNote(data ? data.text : '');
      }
    }

    fetchSavedNote();
  }, [selectedEventId]); // Re-fetch note when event_id changes

  const handleSaveNote = async () => {
    // Update the note in the textarea table with the event_id
    const { error } = await supabase
      .from('textarea')
      .upsert([{ text: note, event_id: selectedEventId }], { onConflict: ['event_id'] });

    if (error) {
      console.error('Error saving note:', error.message);
      toast({
        title: 'Error',
        description: 'Failed to save the note.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } else {
      setSavedNote(note);
      setIsEditing(false);
      toast({
        title: 'Note Saved',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4} borderWidth={1} borderRadius="md">
      <VStack align="stretch">
        <Textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          isReadOnly={!isEditing}
          resize="vertical"
          minH="150px"
        />
        <HStack>
          {isEditing ? (
            <>
              <Button
                colorScheme="teal"
                leftIcon={<DownloadIcon />}
                onClick={handleSaveNote}
              >
                Save
              </Button>
              <Spacer />
            </>
          ) : (
            <Tooltip label="Edit">
              <IconButton
                icon={<AddIcon />}
                variant="outline"
                onClick={() => setIsEditing(true)}
              />
            </Tooltip>
          )}
          <Tooltip label="Delete Saved Note">
            <IconButton
              icon={<DeleteIcon />}
              variant="outline"
              colorScheme="red"
              onClick={async () => {
                const { error } = await supabase
                  .from('textarea')
                  .delete()
                  .eq('event_id', selectedEventId); // Delete note based on event_id
                if (error) {
                  console.error('Error deleting saved note:', error.message);
                  toast({
                    title: 'Error',
                    description: 'Failed to delete the saved note.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                  });
                } else {
                  setSavedNote('');
                  toast({
                    title: 'Note Deleted',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                  });
                }
              }}
            />
          </Tooltip>
        </HStack>
      </VStack>
      {isEditing ? (
        <Text fontSize="sm" mt={2} color="gray.500">
          You are currently editing the note.
        </Text>
      ) : (
        <Text fontSize="sm" mt={2} color="gray.500">
          Saved Note:
        </Text>
      )}
      <Textarea
        value={savedNote}
        isReadOnly={true}
        resize="vertical"
        minH="100px"
        mt={2}
        color="gray.700"
      />
    </Box>
  );
};

export default NotepadComponent;
