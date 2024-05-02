import React, { useEffect, useState } from 'react';
import {
  Box, Image, Text, Heading, Badge, Stack, HStack, VStack, Container,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
  ModalBody, ModalFooter, useDisclosure, IconButton, Tooltip,
  AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader,
  AlertDialogBody, AlertDialogFooter, Button, FormControl, FormLabel, Input
} from '@chakra-ui/react';
import { FcFullTrash, FcSettings } from "react-icons/fc";
import supabase from './../../../../supabaseClient';
import { useEvent } from './../../../../EventContext';

const ShowSITACbis = () => {
  const [sitacRecords, setSitacRecords] = useState([]);
  const { selectedEventId } = useEvent();
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isEditOpen, setEditOpen] = useState(false);
  const [isDeleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const cancelRef = React.useRef();
  const [deleteRecordId, setDeleteRecordId] = useState(null);

  useEffect(() => {
    const fetchSITAC = async () => {
      if (!selectedEventId) {
        console.log("Aucun événement sélectionné.");
        setSitacRecords([]);
        return;
      }

      let { data: sitacData, error } = await supabase
        .from('vianney_sitac')
        .select('*')
        .eq('event_id', selectedEventId);

      if (error) {
        console.error('Erreur lors de la récupération des données SITAC:', error);
      } else {
        setSitacRecords(sitacData);
      }
    };

    fetchSITAC();
  }, [selectedEventId]);

  const handleBoxClick = (record) => {
    setSelectedRecord(record);
    setEditFormData({
      situation: record.situation,
      moyen_logistique: record.moyen_logistique,
      commandement: record.commandement,
      anticipation: record.anticipation,
      objectif: record.objectif,
      idee_manoeuvre: record.idee_manoeuvre,
      execution: record.execution
    });
    onOpen();
  };

  const handleEditClick = (record) => {
    setSelectedRecord(record);
    setEditFormData({
      situation: record.situation,
      moyen_logistique: record.moyen_logistique,
      commandement: record.commandement,
      anticipation: record.anticipation,
      objectif: record.objectif,
      idee_manoeuvre: record.idee_manoeuvre,
      execution: record.execution
    });
    setEditOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const submitEditForm = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from('vianney_sitac')
      .update(editFormData)
      .eq('id', selectedRecord.id);

    if (error) {
      console.error('Erreur lors de la mise à jour du SITAC:', error);
    } else {
      setSitacRecords(sitacRecords.map(record => record.id === selectedRecord.id ? { ...record, ...editFormData } : record));
      setEditOpen(false);
    }
  };

  const deleteSITAC = async (id) => {
    const { error } = await supabase
      .from('vianney_sitac')
      .delete()
      .eq('id', id);
    if (error) {
      console.error('Erreur lors de la suppression du SITAC:', error);
    } else {
      setSitacRecords(sitacRecords.filter(record => record.id !== id));
      onCloseDeleteAlert();
    }
  };

  const onCloseDeleteAlert = () => {
    setDeleteAlertOpen(false);
    setDeleteRecordId(null);
  };

  const confirmDelete = (id) => {
    setDeleteRecordId(id);
    setDeleteAlertOpen(true);
  };

  return (
    <Container maxW="container.xl" py={5}>
      <Stack spacing={5}>
        {sitacRecords.length > 0 ? sitacRecords.map((record) => (
          <Box key={record.id} p={5} shadow="md" borderWidth="1px" borderRadius="md" bg="gray.50" cursor="pointer">
            <HStack align="start" spacing={4}>
              <Tooltip label="Modifier" fontSize="md" placement="top" hasArrow>
                <IconButton
                  icon={<FcSettings />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditClick(record);
                  }}
                  aria-label="Modifier SITAC"
                />
              </Tooltip>
              <Tooltip label="Supprimer" fontSize="md" placement="top" hasArrow>
                <IconButton
                  icon={<FcFullTrash />}
                  onClick={(e) => {
                    e.stopPropagation();
                    confirmDelete(record.id);
                  }}
                  aria-label="Supprimer SITAC"
                />
              </Tooltip>
              {record.file_url && (
                <Image
                  borderRadius="md"
                  src={record.file_url}
                  alt="Image du fichier SITAC"
                  objectFit="cover"
                  htmlWidth="100px"
                  htmlHeight="100px"
                  onClick={() => handleBoxClick(record)}
                />
              )}
              <VStack align="stretch" spacing={1} onClick={() => handleBoxClick(record)}>
                <Heading fontSize="xl">{record.situation}</Heading>
                <Text>
                  <Badge colorScheme="purple">Moyen Logistique:</Badge> {record.moyen_logistique}
                </Text>
                <Text>
                  <Badge colorScheme="blue">Commandement:</Badge> {record.commandement}
                </Text>
                <Text>
                  <Badge colorScheme="pink">Anticipation:</Badge> {record.anticipation}
                </Text>
                <Text>
                  <Badge colorScheme="green">Objectif:</Badge> {record.objectif}
                </Text>
                <Text>
                  <Badge colorScheme="orange">Idée de Manœuvre:</Badge> {record.idee_manoeuvre}
                </Text>
                <Text>
                  <Badge colorScheme="red">Exécution:</Badge> {record.execution}
                </Text>
              </VStack>
            </HStack>
          </Box>
        )) : (
          <Text>Aucun enregistrement SITAC trouvé pour l'événement sélectionné.</Text>
        )}
      </Stack>

      {/* Edit Modal Here */}
      {selectedRecord && isEditOpen && (
        <Modal isOpen={isEditOpen} onClose={() => setEditOpen(false)} size="xl">
          <ModalOverlay />
          <ModalContent as="form" onSubmit={submitEditForm}>
            <ModalHeader>Modifier le SITAC</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl isRequired>
                <FormLabel htmlFor="situation">Situation</FormLabel>
                <Input id="situation" name="situation" value={editFormData.situation} onChange={handleInputChange} />
              </FormControl>

              <FormControl isRequired mt={4}>
                <FormLabel htmlFor="moyen_logistique">Moyen Logistique</FormLabel>
                <Input id="moyen_logistique" name="moyen_logistique" value={editFormData.moyen_logistique} onChange={handleInputChange} />
              </FormControl>

              <FormControl isRequired mt={4}>
                <FormLabel htmlFor="commandement">Commandement</FormLabel>
                <Input id="commandement" name="commandement" value={editFormData.commandement} onChange={handleInputChange} />
              </FormControl>

              <FormControl isRequired mt={4}>
                <FormLabel htmlFor="anticipation">Anticipation</FormLabel>
                <Input id="anticipation" name="anticipation" value={editFormData.anticipation} onChange={handleInputChange} />
              </FormControl>

              <FormControl isRequired mt={4}>
                <FormLabel htmlFor="objectif">Objectif</FormLabel>
                <Input id="objectif" name="objectif" value={editFormData.objectif} onChange={handleInputChange} />
              </FormControl>

              <FormControl isRequired mt={4}>
                <FormLabel htmlFor="idee_manoeuvre">Idée de Manœuvre</FormLabel>
                <Input id="idee_manoeuvre" name="idee_manoeuvre" value={editFormData.idee_manoeuvre} onChange={handleInputChange} />
              </FormControl>

              <FormControl isRequired mt={4}>
                <FormLabel htmlFor="execution">Exécution</FormLabel>
                <Input id="execution" name="execution" value={editFormData.execution} onChange={handleInputChange} />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button variant="outline" mr={3} onClick={() => setEditOpen(false)}>
                Annuler
              </Button>
              <Button colorScheme="blue" type="submit">
                Sauvegarder
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      <AlertDialog
        isOpen={isDeleteAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onCloseDeleteAlert}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Supprimer l'enregistrement SITAC
            </AlertDialogHeader>
            <AlertDialogBody>
              Êtes-vous sûr ? Vous ne pourrez pas annuler cette action.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onCloseDeleteAlert}>
                Annuler
              </Button>
              <Button colorScheme="red" onClick={() => deleteSITAC(deleteRecordId)} ml={3}>
                Supprimer
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      {/* Modal to display details */}
      {selectedRecord && (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{selectedRecord.situation}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {selectedRecord.file_url && (
                <Image
                  src={selectedRecord.file_url}
                  alt="Image détaillée SITAC"
                  objectFit="cover"
                />
              )}
              <VStack align="start" spacing={4} mt={4}>
                <Text>
                  <Badge colorScheme="purple">Moyen Logistique:</Badge> {selectedRecord.moyen_logistique}
                </Text>
                <Text>
                  <Badge colorScheme="blue">Commandement:</Badge> {selectedRecord.commandement}
                </Text>
                <Text>
                  <Badge colorScheme="pink">Anticipation:</Badge> {selectedRecord.anticipation}
                </Text>
                <Text>
                  <Badge colorScheme="green">Objectif:</Badge> {selectedRecord.objectif}
                </Text>
                <Text>
                  <Badge colorScheme="orange">Idée de Manœuvre:</Badge> {selectedRecord.idee_manoeuvre}
                </Text>
                <Text>
                  <Badge colorScheme="red">Exécution:</Badge> {selectedRecord.execution}
                </Text>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default ShowSITACbis;