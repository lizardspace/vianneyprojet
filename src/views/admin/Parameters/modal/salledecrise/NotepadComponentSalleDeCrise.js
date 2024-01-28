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
import { supabase } from '../../../../../supabaseClient'; // Import your Supabase configuration here
import { useEvent } from './../../../../../EventContext'; // Import the useEvent hook

const NotepadComponentSalleDeCrise = () => {
  const { selectedEventId } = useEvent(); // Get the selected event_id from the context
  const [note, setNote] = useState('');
  const [savedNote, setSavedNote] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const toast = useToast();

  useEffect(() => {
    // Fetch the saved note from the vianney_textarea_salle_de_crise table
    async function fetchSavedNote() {
      const { data, error } = await supabase
        .from('vianney_textarea_salle_de_crise')
        .select('text')
        .eq('event_id', selectedEventId) // Fetch note based on event_id
        .single();

      if (error) {
        console.error('Erreur lors de la récupération de la note enregistrée :', error.message);
      } else {
        setSavedNote(data ? data.text : ''); // Définir savedNote avec la note existante ou une chaîne vide
      }
    }

    fetchSavedNote();
  }, [selectedEventId]); // Re-fetch note when event_id changes

  const handleSaveNote = async () => {
    // Mettre à jour la note dans la table vianney_textarea_salle_de_crise avec event_id
    const { error } = await supabase
      .from('vianney_textarea_salle_de_crise')
      .upsert([{ text: note, event_id: selectedEventId }], { onConflict: ['event_id'] });

    if (error) {
      console.error('Erreur lors de l\'enregistrement de la note :', error.message);
      toast({
        title: 'Erreur',
        description: 'Échec de l\'enregistrement de la note.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } else {
      setSavedNote(note);
      setIsEditing(false);
      toast({
        title: 'Note enregistrée',
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
          value={isEditing ? note : savedNote} // Afficher la note ou savedNote en fonction du mode édition
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
                Enregistrer
              </Button>
              <Spacer />
            </>
          ) : (
            <Tooltip label="Éditer">
              <IconButton
                icon={<AddIcon />}
                variant="outline"
                onClick={() => {
                  setNote(savedNote); // Définir la note à savedNote lorsque vous entrez en mode édition
                  setIsEditing(true);
                }}
              />
            </Tooltip>
          )}
          <Tooltip label="Supprimer la note enregistrée">
            <IconButton
              icon={<DeleteIcon />}
              variant="outline"
              colorScheme="red"
              onClick={async () => {
                const { error } = await supabase
                  .from('vianney_textarea_salle_de_crise')
                  .delete()
                  .eq('event_id', selectedEventId); // Supprimer la note en fonction de l'event_id
                if (error) {
                  console.error('Erreur lors de la suppression de la note enregistrée :', error.message);
                  toast({
                    title: 'Erreur',
                    description: 'Échec de la suppression de la note enregistrée.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                  });
                } else {
                  setSavedNote('');
                  toast({
                    title: 'Note supprimée',
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
          Vous êtes en train de modifier la note.
        </Text>
      ) : (
        <Text fontSize="sm" mt={2} color="gray.500">
          Note enregistrée :
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

export default NotepadComponentSalleDeCrise;
