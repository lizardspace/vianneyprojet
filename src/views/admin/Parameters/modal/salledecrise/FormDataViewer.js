import React, { useEffect, useState } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Text,
  Alert,
  AlertIcon,
  Box,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react';
import { supabase } from './../../../../../supabaseClient';
import { useEvent } from './../../../../../EventContext';
import { FcFullTrash } from 'react-icons/fc';

const FormDataViewer = () => {
  const [formData, setFormData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { selectedEventId } = useEvent();
  const toast = useToast();
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    rowIdToDelete: null,
  });

  const handleDeleteRow = async (rowId) => {
    try {
      const { error } = await supabase
        .from('vianney_form_utile_salle_de_crise')
        .delete()
        .eq('id', rowId);

      if (error) {
        console.error('Error deleting row:', error);
      } else {
        // Remove the deleted row from the local state (formData)
        setFormData((prevData) => prevData.filter((entry) => entry.id !== rowId));

        // Show a success notification
        toast({
          title: 'Élément supprimé',
          status: 'success',
          duration: 3000, // Duration in milliseconds (adjust as needed)
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error deleting row:', error);
    } finally {
      setDeleteConfirmation({ isOpen: false, rowIdToDelete: null });
    }
  };

  useEffect(() => {
    async function fetchFormData() {
      try {
        const { data, error } = await supabase
          .from('vianney_form_utile_salle_de_crise')
          .select('*')
          .eq('event_id', selectedEventId);

        if (error) {
          setError('Error fetching data');
        } else {
          setFormData(data);
        }
      } catch (error) {
        setError('Error fetching data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchFormData();
  }, [selectedEventId]);

  if (isLoading) {
    return <Spinner size="lg" />;
  }

  if (error) {
    return (
      <Alert status="error" variant="subtle" flexDirection="column" alignItems="center">
        <AlertIcon />
        <Text fontSize="xl" m={4}>
          {error}
        </Text>
      </Alert>
    );
  }

  if (formData.length === 0) {
    return (
      <Alert status="info" variant="subtle" flexDirection="column" alignItems="center">
        <AlertIcon />
        <Text fontSize="xl" m={4}>
          No data available.
        </Text>
      </Alert>
    );
  }

  return (
    <Box p={4} background="linear-gradient(to bottom, #ffffff, #f0f0f0)">
      <Table variant="simple" boxShadow="md" borderRadius="md">
        <Thead>
          <Tr>
            <Th background="linear-gradient(to bottom, #007bff, #0056b3)" color="white">
              Name
            </Th>
            <Th background="linear-gradient(to bottom, #007bff, #0056b3)" color="white">
              Email
            </Th>
            <Th background="linear-gradient(to bottom, #007bff, #0056b3)" color="white">
              Phone
            </Th>
            <Th background="linear-gradient(to bottom, #007bff, #0056b3)" color="white">
              Street
            </Th>
            <Th background="linear-gradient(to bottom, #007bff, #0056b3)" color="white">
              Zip
            </Th>
            <Th background="linear-gradient(to bottom, #007bff, #0056b3)" color="white">
              City
            </Th>
            <Th background="linear-gradient(to bottom, #007bff, #0056b3)" color="white">
              Message
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {formData.map((entry) => (
            <Tr key={entry.id}>
              <Td>{entry.name}</Td>
              <Td>{entry.email}</Td>
              <Td>{entry.phone}</Td>
              <Td>{entry.street}</Td>
              <Td>{entry.zip}</Td>
              <Td>{entry.city}</Td>
              <Td>{entry.message}</Td>
              <Td>
                <Box position="relative">
                    <FcFullTrash
                      style={{ cursor: 'pointer', color: 'red' }}
                      onClick={() =>
                        setDeleteConfirmation({ isOpen: true, rowIdToDelete: entry.id })
                      }
                    />
                </Box>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <AlertDialog
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false, rowIdToDelete: null })}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirmation
            </AlertDialogHeader>

            <AlertDialogBody>
              Voulez-vous vraiment supprimer cette ligne ?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                onClick={() => setDeleteConfirmation({ isOpen: false, rowIdToDelete: null })}
              >
                Annuler
              </Button>
              <Button
                colorScheme="red"
                onClick={() => handleDeleteRow(deleteConfirmation.rowIdToDelete)}
                ml={3}
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

export default FormDataViewer;
