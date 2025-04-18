import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Textarea, Image, Tooltip, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Box, Input, Button, VStack, Alert, AlertIcon, Text, Select, Flex, useToast, Badge } from '@chakra-ui/react';
import { FcOk, FcDeleteDatabase, FcInfo } from "react-icons/fc";
import Card from "components/card/Card";
import Menu from "components/menu/MainMenuVianneyAlertChat";
import { useEvent } from '../../../../EventContext';
import { useTeam } from '../../../../TeamContext';

import { supabase, supabaseUrl } from './../../../../supabaseClient';

function VianneyAlertChat() {
  const { selectedTeam } = useTeam();
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const { selectedEventId } = useEvent(); // Accéder au selectedEventId du contexte
  const [alertStatus, setAlertStatus] = useState('info');
  const [alerts, setAlerts] = useState([]);
  const [newAlertText, setNewAlertText] = useState('');
  const toast = useToast();
  const [details, setDetails] = useState('');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingAlert, setEditingAlert] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [alertToDelete, setAlertToDelete] = useState(null);
  const [allowScrolling, setAllowScrolling] = useState(true); 
  const [filter, setFilter] = useState('all'); 
  const [password, setPassword] = useState('');
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
  const [isImageEnlarged, setIsImageEnlarged] = useState(false);
  const [showAddAlertForm, setShowAddAlertForm] = useState(false);

  const toggleAddAlertForm = () => {
    setShowAddAlertForm(!showAddAlertForm);
  };

  const openConfirmModal = (alertId) => {
    setAlertToDelete(alertId);
    setIsConfirmOpen(true);
  };

  const handlePasswordChange = (event) => {
    const inputPassword = event.target.value;
    setPassword(inputPassword);
    setIsPasswordCorrect(inputPassword === "vianney123");
  };

  const handleAllowScrollingToggle = () => {
    setAllowScrolling(!allowScrolling);
  };

  const openEditModal = (alert) => {
    setEditingAlert(alert);
    setIsEditOpen(true);
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
  };

  const handleEditChange = (event) => {
    setEditingAlert({ ...editingAlert, [event.target.name]: event.target.value });
  };

  const handleSubmitEdit = async () => {
    const { error } = await supabase
      .from('vianney_alert')
      .update({
        alert_text: editingAlert.alert_text,
        details: editingAlert.details
      })
      .match({ id: editingAlert.id });

    if (!error) {
      setAlerts(alerts.map(alert => alert.id === editingAlert.id ? editingAlert : alert));
      closeEditModal();
    } else {
      console.error('Error updating alert:', error);
    }
  };

  const handleSolveAlert = async (alertId) => {
    const { error } = await supabase
      .from('vianney_alert')
      .update({ solved_or_not: 'success' })
      .match({ id: alertId });

    if (error) {
      console.error('Error updating alert:', error);
      toast({
        title: "Erreur",
        description: "Nous ne sommes pas arrivés à mettre à jour le statut de l'alerte.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      setAlerts(alerts.map(alert => alert.id === alertId ? { ...alert, solved_or_not: 'success' } : alert));
      toast({
        title: "Succès",
        description: "Statut de l'alerte mis à jour avec succès.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const closeConfirmModal = () => {
    setIsConfirmOpen(false);
  };

  const handleDeleteAlert = async () => {
    const { error } = await supabase
      .from('vianney_alert')
      .delete()
      .match({ id: alertToDelete });

    if (error) {
      console.error('Error deleting alert:', error);
      toast({
        title: "Erreur",
        description: "Nous n'avons pas réussi à supprimer l'alerte.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      setAlerts(alerts.filter(alert => alert.id !== alertToDelete));
      toast({
        title: "Succès",
        description: "Alerte supprimée avec succès.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }
    closeConfirmModal();
    setIsConfirmOpen(false);
  };

  const handleDetailsChange = (event) => {
    setDetails(event.target.value);
  };

  useEffect(() => {
    if (selectedEventId) { // Ne récupérer les alertes que si un événement est sélectionné
      const fetchAlerts = async () => {
        try {
          const { data, error } = await supabase
            .from('vianney_alert')
            .select('*')
            .eq('event_id', selectedEventId)
            .order('timestamp', { ascending: true });

          if (error) {
            console.error('Error fetching alerts:', error);
            return;
          }

          setAlerts(data);
        } catch (error) {
          console.error('Error fetching alerts:', error);
        }
      };

      fetchAlerts();
    }
  }, [selectedEventId]); // Exécuter seulement quand selectedEventId change

  const handleStatusChange = (event) => {
    setAlertStatus(event.target.value);
  };

  const handleInputChange = (event) => {
    setNewAlertText(event.target.value);
  };

  const handleSubmit = async () => {
    if (newAlertText.trim() !== '') {
      const fakeUUID = uuidv4();

      try {
        let imageUrl = '';

        if (selectedFile) {
          const fileExtension = selectedFile.name.split('.').pop();
          const fileName = `${uuidv4()}.${fileExtension}`;
          const filePath = `${fakeUUID}/${fileName}`;

          let { error: uploadError } = await supabase.storage
            .from('alert-images')
            .upload(filePath, selectedFile, {
              cacheControl: '3600',
              upsert: false,
            });

          if (uploadError) {
            throw new Error(`Failed to upload image: ${uploadError.message}`);
          }

          imageUrl = `${supabaseUrl.replace('.co', '.in')}/storage/v1/object/public/alert-images/${filePath}`;
        }

        const { data, error } = await supabase
          .from('vianney_alert')
          .insert([
            {
              alert_text: newAlertText,
              user_id: fakeUUID,
              solved_or_not: alertStatus,
              details: details,
              event_id: selectedEventId, // Ajouter event_id ici
              image_url: imageUrl,
              team_name: selectedTeam,
            },
          ]);

        if (error) {
          throw new Error(`Failed to insert alert: ${error.message}`);
        }

        if (data && data.length > 0) {
          setAlerts([...alerts, { ...data[0], timestamp: new Date().toISOString() }]);
        } else {
          console.error('No data returned from the insert operation.');
        }

        setNewAlertText('');
        setDetails('');
        setImageUrl('');
        setSelectedFile(null);

        toast({
          title: "Alerte ajoutée",
          description: "Votre alerte a été ajoutée avec succès.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } catch (error) {
        console.error(error.message);
        toast({
          title: "Erreur",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } else {
      console.error('Alert text is required.');
    }
  };

  const handleFilterSelect = (selectedFilter) => {
    setFilter(selectedFilter);
  };

  const shouldShowAlert = (alert, index, allAlerts) => {
    if (filter === 'all') return true;
    if (filter === 'success' && alert.solved_or_not === 'success') return true;
    if (filter === 'error' && alert.solved_or_not === 'error') return true;
    if (filter === 'info' && (alert.solved_or_not === 'warning' || alert.solved_or_not === 'error' || alert.solved_or_not === 'info')) return true;
    if (filter === 'warning') {
      const unresolvedAlerts = allAlerts.filter(a => ['warning', 'error', 'info'].includes(a.solved_or_not))
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 12);
      return unresolvedAlerts.some(unresolvedAlert => unresolvedAlert.id === alert.id);
    }
    return false;
  };

  const updateImageUrl = (fileUrl) => {
    const fakeUUID = '123e4567-e89b-12d3-a456-426614174000';
    const publicUrl = fileUrl
      ? `https://hvjzemvfstwwhhahecwu.supabase.co/storage/v1/object/public/alert-images/${fakeUUID}/${fileUrl.split('/').pop()}`
      : '';
    setImageUrl(publicUrl);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const fakeUUID = '123e4567-e89b-12d3-a456-426614174000';
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      const { data: fileData, error: fileError } = await supabase.storage
        .from('alert-images')
        .upload(`/${fakeUUID}/${uuidv4()}.png`, formData, {
          cacheControl: '3600',
          upsert: false,
        });

      if (fileError) {
        console.error('Error uploading image:', fileError);
        return;
      }

      const imageUrl = fileData[0]?.url;

      updateImageUrl(imageUrl);
    }
  };

  const toggleImageSize = () => {
    setIsImageEnlarged(!isImageEnlarged);
  };

  return (
    <Card
      direction='column'
      w='100%'
      overflowX={{ sm: "scroll", lg: "hidden" }}>
      <Box>
        <Flex justify='space-between' mb='sm' align='center'>
          <Badge colorScheme="orange" fontSize="lg">
            Messages et Alertes
          </Badge>
          <Menu
            onFilterSelect={handleFilterSelect}
            onAllowScrollingToggle={handleAllowScrollingToggle}
          />
        </Flex>
        <Button
          size="lg"
          colorScheme="blue"
          onClick={toggleAddAlertForm}
          mt={4}
          mb={4}
        >
          {showAddAlertForm ? 'Cacher le formulaire' : 'Ajouter une alerte'}
        </Button>
        {showAddAlertForm && (
          <Box mt={4}>
            <Select placeholder="Sélectionnez le degrès d'urgence" value={alertStatus} onChange={handleStatusChange}>
              <option value="error">Urgence</option>
              <option value="warning">Avertissement</option>
              <option value="info">Information</option>
            </Select>
            <Input
              placeholder="Tapez votre alerte..."
              value={newAlertText}
              onChange={handleInputChange}
              mt={2}
              fontSize="lg"
            />
            <Textarea
              placeholder="Ajoutez des détails ici..."
              value={details}
              onChange={handleDetailsChange}
              mt={2}
              fontSize="lg"
            />
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                setSelectedFile(e.target.files[0]);
                handleFileChange(e);
              }}
              mt={2}
            />
            <Button
              size="lg"
              colorScheme="blue"
              onClick={handleSubmit}
              mt={4}
              mb={4}
            >
              Ajouter une alerte
            </Button>
          </Box>
        )}

        {/* N'afficher les alertes que si un événement est sélectionné */}
        {selectedEventId && (
          <VStack
            spacing={4}
            overflowY={allowScrolling ? "scroll" : "hidden"}
            maxHeight={allowScrolling ? "1100px" : "none"}>
            {alerts.filter(shouldShowAlert).map((alert, index) => {
              const alertStatus = ['info', 'warning', 'success', 'error'].includes(alert.solved_or_not)
                ? alert.solved_or_not
                : 'info';

              return (
                <Alert key={index} status={alertStatus} fontSize="lg" minHeight="70px">
                  <AlertIcon />
                  <Box flex="1">
                    <Text fontSize="lg">
                      {alert.team_name && (<><Badge colorScheme="orange" fontSize="md">{alert.team_name}</Badge> dit: </>)}
                      {alert.alert_text}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      {new Date(alert.timestamp).toLocaleString()}
                    </Text>
                    {imageUrl && (
                      <img
                        src={imageUrl}
                        alt="essai"
                        style={{ maxHeight: isImageEnlarged ? "auto" : "100px", cursor: "pointer" }}
                        onClick={toggleImageSize}
                      />
                    )}
                    {alert.image_url && (
                      <img src={alert.image_url} alt="essai" style={{ maxHeight: "120px" }} />
                    )}
                  </Box>
                  <Tooltip label="Marqué comme résolue" hasArrow>
                    <Button mr="2px" onClick={() => handleSolveAlert(alert.id)}><FcOk /></Button>
                  </Tooltip>
                  <Tooltip label="Supprimer" hasArrow>
                    <Button mr="2px" onClick={() => openConfirmModal(alert.id)}><FcDeleteDatabase /></Button>
                  </Tooltip>
                  <Tooltip label="Information" hasArrow>
                    <Button onClick={() => openEditModal(alert)}><FcInfo /></Button>
                  </Tooltip>
                </Alert>
              );
            })}
          </VStack>
        )}

        <Modal isOpen={isEditOpen} onClose={closeEditModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Modifier l'alerte</ModalHeader>
            <ModalBody>
              <Input
                name="alert_text"
                value={editingAlert?.alert_text || ''}
                onChange={handleEditChange}
                placeholder="Texte de l'alerte"
                mt={2}
                fontSize="lg"
              />
              <Textarea
                name="details"
                value={editingAlert?.details || ''}
                onChange={handleEditChange}
                placeholder="Détails de l'alerte"
                mt={2}
                fontSize="lg"
              />
              <Image
                src={editingAlert?.image_url || ''}
                alt="Image"
                mt={2}
              />

            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleSubmitEdit}>
                Enregistrer les modifications
              </Button>
              <Button variant="ghost" onClick={closeEditModal}>Annuler</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Modal isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Supprimer l'alerte</ModalHeader>
            <ModalBody>
              Voulez-vous supprimer cette alerte ?
              <Input
                placeholder="Entrez votre mot de passe"
                value={password}
                onChange={handlePasswordChange}
                mt={2}
                type="password"
              />
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="red"
                mr={3}
                onClick={handleDeleteAlert}
                hidden={!isPasswordCorrect}
              >
                Supprimer
              </Button>

              <Button variant="ghost" onClick={() => setIsConfirmOpen(false)}>Annuler</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Card>
  );
}

export default VianneyAlertChat;
