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
  Box,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Alert, // Added Alert
  AlertIcon, // Added AlertIcon
} from '@chakra-ui/react';
import { supabase } from './../../../../../supabaseClient';
import { useEvent } from './../../../../../EventContext';
import { FcFullTrash, FcEditImage } from 'react-icons/fc';

const FormDataViewer = () => {
  const [formData, setFormData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [setError] = useState(null);
  const { selectedEventId } = useEvent();
  const toast = useToast();
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    rowIdToDelete: null,
  });
  const [editModal, setEditModal] = useState({
    isOpen: false,
    rowIdToEdit: null,
  });
  const [editedData, setEditedData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    zip: '',
    city: '',
    message: '',
  });
  const [successAlert, setSuccessAlert] = useState(false); // Added successAlert state
  const [failureAlert, setFailureAlert] = useState(false); // Added failureAlert state

  const handleDeleteRow = async (rowId) => {
    try {
      const { error } = await supabase
        .from('vianney_form_utile_salle_de_crise')
        .delete()
        .eq('id', rowId);

      if (error) {
        console.error('Error deleting row:', error);
        setFailureAlert(true); // Show failure alert
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

        setSuccessAlert(true); // Show success alert
      }
    } catch (error) {
      console.error('Error deleting row:', error);
      setFailureAlert(true); // Show failure alert
    } finally {
      setDeleteConfirmation({ isOpen: false, rowIdToDelete: null });
    }
  };

  const handleEditRow = async () => {
    try {
      const { error } = await supabase
        .from('vianney_form_utile_salle_de_crise')
        .update({
          name: editedData.name,
          email: editedData.email,
          phone: editedData.phone,
          street: editedData.street,
          zip: editedData.zip,
          city: editedData.city,
          message: editedData.message,
        })
        .eq('id', editModal.rowIdToEdit);

      if (error) {
        console.error('Error updating row:', error);
        setFailureAlert(true); // Show failure alert
      } else {
        // Close the edit modal
        setEditModal({ isOpen: false, rowIdToEdit: null });

        // Show a success notification
        toast({
          title: 'Élément modifié',
          status: 'success',
          duration: 3000, // Duration in milliseconds (adjust as needed)
          isClosable: true,
        });

        setSuccessAlert(true); // Show success alert
      }
    } catch (error) {
      console.error('Error updating row:', error);
      setFailureAlert(true); // Show failure alert
    }
  };

  const openEditModal = (rowId) => {
    const rowToEdit = formData.find((entry) => entry.id === rowId);
    if (rowToEdit) {
      setEditedData(rowToEdit);
      setEditModal({ isOpen: true, rowIdToEdit: rowId });
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
          setFailureAlert(true); // Show failure alert
        } else {
          setFormData(data);
        }
      } catch (error) {
        setError('Error fetching data');
        setFailureAlert(true); // Show failure alert
      } finally {
        setIsLoading(false);
      }
    }

    fetchFormData();
  }, [selectedEventId, setError]);

  if (isLoading) {
    return <Spinner size="lg" />;
  }

  return (
    <Box p={4} background="linear-gradient(to bottom, #ffffff, #f0f0f0)">
      {successAlert && ( // Show success alert
        <Alert status="success" variant="subtle" flexDirection="column" alignItems="center" mb={4}>
          <AlertIcon />
          <Text fontSize="xl" m={4}>
            Action réussie!
          </Text>
        </Alert>
      )}
      {failureAlert && ( // Show failure alert
        <Alert status="error" variant="subtle" flexDirection="column" alignItems="center" mb={4}>
          <AlertIcon />
          <Text fontSize="xl" m={4}>
            Action a échoué.
          </Text>
        </Alert>
      )}


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
            <Th background="linear-gradient(to bottom, #007bff, #0056b3)" color="white">
              Actions
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
                  <FcEditImage
                    style={{ cursor: 'pointer', marginLeft: '8px', color: 'blue' }}
                    onClick={() => openEditModal(entry.id)}
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
            <AlertDialogBody>Voulez-vous vraiment supprimer cette ligne ?</AlertDialogBody>
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
      <Modal isOpen={editModal.isOpen} onClose={() => setEditModal({ isOpen: false, rowIdToEdit: null })}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modifier la ligne</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Nom</FormLabel>
              <Input
                type="text"
                value={editedData.name}
                onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={editedData.email}
                onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Téléphone</FormLabel>
              <Input
                type="text"
                value={editedData.phone}
                onChange={(e) => setEditedData({ ...editedData, phone: e.target.value })}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Adresse</FormLabel>
              <Input
                type="text"
                value={editedData.street}
                onChange={(e) => setEditedData({ ...editedData, street: e.target.value })}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Code Postal</FormLabel>
              <Input
                type="text"
                value={editedData.zip}
                onChange={(e) => setEditedData({ ...editedData, zip: e.target.value })}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Ville</FormLabel>
              <Input
                type="text"
                value={editedData.city}
                onChange={(e) => setEditedData({ ...editedData, city: e.target.value })}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Message</FormLabel>
              <Textarea
                value={editedData.message}
                onChange={(e) => setEditedData({ ...editedData, message: e.target.value })}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleEditRow}>
              Enregistrer
            </Button>
            <Button variant="ghost" onClick={() => setEditModal({ isOpen: false, rowIdToEdit: null })}>
              Annuler
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default FormDataViewer;
