// src/components/ResponseViewer.tsx
import React, { useEffect, useState, useRef } from 'react';
import { supabase } from './../../../../../supabaseClient';
import {
  Box,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Spinner,
  useToast,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from '@chakra-ui/react';
import { Response } from '../Types';
import { useEvent } from './../../../../../EventContext'; // Mettez le bon chemin

interface ResponseViewerProps {
  formId: string;
}

const ResponseViewer: React.FC<ResponseViewerProps> = ({ formId }) => {
  const [responses, setResponses] = useState<Response[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toast = useToast();
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [responseToDelete, setResponseToDelete] = useState<Response | null>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const { selectedEventId } = useEvent();

  useEffect(() => {
    if (!selectedEventId) {
      console.error('ResponseViewer: event_id est manquant');
      toast({
        title: 'Événement non sélectionné.',
        description: 'Veuillez sélectionner un événement.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const fetchResponses = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('responses')
        .select('*')
        .eq('form_id', formId)
        .eq('event_id', selectedEventId) // Filtrer par event_id
        .order('submitted_at', { ascending: false });

      if (error) {
        console.error('ResponseViewer: Erreur lors de la récupération des réponses:', error);
        toast({
          title: 'Erreur de récupération.',
          description: 'Une erreur est survenue lors de la récupération des réponses.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else {
        setResponses(data);
      }
      setIsLoading(false);
    };

    fetchResponses();
  }, [formId, selectedEventId, toast]);

  const handleDelete = (response: Response) => {
    setResponseToDelete(response);
  };

  const confirmDelete = async () => {
    if (!responseToDelete) return;

    setIsDeleting(true);
    const { error } = await supabase
      .from('responses')
      .delete()
      .eq('id', responseToDelete.id)
      .eq('event_id', selectedEventId); // Filtrer par event_id

    if (error) {
      console.error('ResponseViewer: Erreur lors de la suppression de la réponse:', error);
      toast({
        title: 'Erreur de suppression.',
        description: 'Une erreur est survenue lors de la suppression de la réponse.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Succès.',
        description: 'Réponse supprimée avec succès !',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setResponses(responses.filter((r) => r.id !== responseToDelete.id));
    }

    setIsDeleting(false);
    setResponseToDelete(null);
  };

  const cancelDelete = () => {
    setResponseToDelete(null);
  };

  return (
    <Box>
      <Heading as="h3" size="md" mb={4}>
        Réponses
      </Heading>
      {isLoading ? (
        <Spinner size="xl" />
      ) : responses.length === 0 ? (
        <Text>Aucune réponse trouvée pour ce formulaire.</Text>
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Réponse</Th>
              <Th>Date de Soumission</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {responses.map((response) => (
              <Tr key={response.id}>
                <Td>{response.id}</Td>
                <Td>{JSON.stringify(response.response_data)}</Td>
                <Td>{new Date(response.submitted_at).toLocaleString()}</Td>
                <Td>
                  <Button
                    colorScheme="red"
                    size="sm"
                    onClick={() => handleDelete(response)}
                  >
                    Supprimer
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      {/* AlertDialog pour confirmation de suppression */}
      <AlertDialog
        isOpen={responseToDelete !== null}
        leastDestructiveRef={cancelRef}
        onClose={cancelDelete}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Supprimer la réponse
            </AlertDialogHeader>

            <AlertDialogBody>
              Êtes-vous sûr de vouloir supprimer cette réponse ? Cette action est irréversible.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={cancelDelete}>
                Annuler
              </Button>
              <Button
                colorScheme="red"
                onClick={confirmDelete}
                ml={3}
                isLoading={isDeleting}
              >
                Supprimer
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default ResponseViewer;
