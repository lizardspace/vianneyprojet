import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Textarea, Image, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Box, Input, Button, VStack, Text, Select, Flex, useToast, Badge, Alert, AlertIcon, AlertTitle, AlertDescription, CloseButton } from '@chakra-ui/react';
import { FcOk, FcDeleteDatabase, FcInfo } from "react-icons/fc";
import Card from "components/card/Card";
import { useEvent } from '../../../../EventContext';
import { useTeam } from './../../InterfaceEquipe/TeamContext';

import { supabase, supabaseUrl } from './../../../../supabaseClient';

function MessagerieWhatsappChat() {
  const { selectedTeam, setSelectedTeam, teamData, setTeamData } = useTeam(); 
  const { selectedEventId } = useEvent();
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [alerts, setAlerts] = useState([]);
  const [newAlertText, setNewAlertText] = useState('');
  const toast = useToast();
  const [details, setDetails] = useState('');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingAlert, setEditingAlert] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [alertToDelete, setAlertToDelete] = useState(null);
  const [password, setPassword] = useState('');
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
  const [isImageEnlarged, setIsImageEnlarged] = useState(false);
  const [showAlert, setShowAlert] = useState(true);

  const messagesEndRef = useRef(null);

  const openConfirmModal = (alertId) => {
    setAlertToDelete(alertId);
    setIsConfirmOpen(true);
  };

  const handlePasswordChange = (event) => {
    const inputPassword = event.target.value;
    setPassword(inputPassword);
    setIsPasswordCorrect(inputPassword === "vianney123");
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
      .from('vianney_chat_messages')
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
      .from('vianney_chat_messages')
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
      .from('vianney_chat_messages')
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

  useEffect(() => {
    async function fetchTeamData() {
      try {
        let query = supabase.from('vianney_teams').select('id, name_of_the_team');
  
        if (selectedEventId) {
          query = query.eq('event_id', selectedEventId);
        }
  
        const { data, error } = await query;
  
        if (error) {
          throw error;
        }
        setTeamData(data);
      } catch (error) {
        console.error('Error fetching team data:', error);
      }
    }
  
    fetchTeamData();
  }, [selectedEventId, setTeamData]);

  useEffect(() => {
    if (!selectedTeam) {
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }
  }, [selectedTeam]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const { data, error } = await supabase
          .from('vianney_chat_messages')
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
  }, [selectedEventId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [alerts]);

  const handleInputChange = (event) => {
    setNewAlertText(event.target.value);
  };

  const handleTeamSelection = (event) => {
    setSelectedTeam(event.target.value);
    setShowAlert(false);
  };

  const handleSubmit = async () => {
    if (!selectedTeam) {
      toast({
        title: "Erreur",
        description: "Vous devez sélectionner une équipe avant d'envoyer un message.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setShowAlert(true);
      return;
    }

    if (newAlertText.trim() !== '') {
      const fakeUUID = uuidv4(); // Use UUID v4 to generate a unique user_id for the demo
  
      try {
        let imageUrl = ''; // Initialize imageUrl variable
  
        if (selectedFile) {
          const fileExtension = selectedFile.name.split('.').pop();
          const fileName = `${uuidv4()}.${fileExtension}`;
          const filePath = `${fakeUUID}/${fileName}`;
  
          let { error: uploadError } = await supabase.storage
            .from('chat-images')
            .upload(filePath, selectedFile, {
              cacheControl: '3600',
              upsert: false,
            });
  
          if (uploadError) {
            throw new Error(`Failed to upload image: ${uploadError.message}`);
          }
  
          imageUrl = `${supabaseUrl.replace('.co', '.in')}/storage/v1/object/public/chat-images/${filePath}`;
        }
  
        const { data, error } = await supabase
          .from('vianney_chat_messages')
          .insert([
            {
              alert_text: newAlertText,
              user_id: fakeUUID,
              solved_or_not: 'info',
              details: details,
              event_id: selectedEventId,
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

  const updateImageUrl = (fileUrl) => {
    const fakeUUID = '123e4567-e89b-12d3-a456-426614174000';
    const publicUrl = fileUrl
      ? `https://hvjzemvfstwwhhahecwu.supabase.co/storage/v1/object/public/chat-images/${fakeUUID}/${fileUrl.split('/').pop()}`
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
        .from('chat-images')
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
    <Card direction='column' w='100%' h='100vh' overflow='hidden'>
      <Flex direction='column' h='100%'>

        <Box flex='1' overflowY='auto' p={4} bg='#f5f5f5'>          
          <VStack spacing={4} align='stretch'>
            {alerts.map((alert, index) => {
              const isOwnMessage = alert.user_id === 'your-user-id'; 

              return (
                <Flex
                  key={index}
                  alignSelf={isOwnMessage ? 'flex-end' : 'flex-start'}
                  bg={isOwnMessage ? 'green.100' : 'white'}
                  p={3}
                  borderRadius='lg'
                  boxShadow='md'
                  maxW='80%'
                >
                  <Box flex='1'>
                    <Text fontWeight='bold'>
                      {alert.team_name && (<><Badge colorScheme="orange">{alert.team_name}</Badge> </> )}
                      {alert.alert_text}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      {new Date(alert.timestamp).toLocaleString()}
                    </Text>
                    {alert.image_url && (
                      <img alt={alert.details} src={alert.image_url} style={{ maxHeight: isImageEnlarged ? "auto" : "100px", cursor: "pointer" }} onClick={toggleImageSize} />
                    )}
                    <Text mt={2}>{alert.details}</Text>
                  </Box>
                  <Flex direction='column' ml={2}>
                    <Button size="xs" onClick={() => handleSolveAlert(alert.id)}><FcOk /></Button>
                    <Button size="xs" onClick={() => openConfirmModal(alert.id)}><FcDeleteDatabase /></Button>
                    <Button size="xs" onClick={() => openEditModal(alert)}><FcInfo /></Button>
                  </Flex>
                </Flex>
              );
            })}
            <div ref={messagesEndRef} />
          </VStack>
        </Box>
        {showAlert && (
            <Alert status="error" mb="4" minHeight="100px">
              <AlertIcon />
              <AlertTitle>Attention!</AlertTitle>
              <AlertDescription>
                Sélectionnez une équipe est obligatoire
              </AlertDescription>
              <CloseButton onClick={() => setShowAlert(false)} position="absolute" right="8px" top="8px" />
            </Alert>
          )}
          {showAlert && !selectedTeam && (
            <Select
              value={selectedTeam}
              onChange={handleTeamSelection}
              placeholder="Selectionnez une équipe"
              mb={4}
            >
              {teamData.map((team) => (
                <option key={team.id} value={team.name_of_the_team}>
                  {team.name_of_the_team}
                </option>
              ))}
            </Select>
          )}

        <Box p={4} borderTop='1px solid #e0e0e0' bg='white' width='100%' position="sticky" bottom="0">
          <Flex width='100%' alignItems='center'>
            <Input
              placeholder="Tapez votre message..."
              value={newAlertText}
              onChange={handleInputChange}
              mr={2}
              flex='3'
            />
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                setSelectedFile(e.target.files[0]);
                handleFileChange(e);
              }}
              mr={2}
              flex='1'
            />
            <Button colorScheme="blue" onClick={handleSubmit} flex='1'>
              Envoyer
            </Button>
          </Flex>
        </Box>
      </Flex>
      
      <Modal isOpen={isEditOpen} onClose={closeEditModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modifier le message</ModalHeader>
          <ModalBody>
            <Input
              name="alert_text"
              value={editingAlert?.alert_text || ''}
              onChange={handleEditChange}
              placeholder="Texte du message"
              mt={2}
            />
            <Textarea
              name="details"
              value={editingAlert?.details || ''}
              onChange={handleEditChange}
              placeholder="Détails du message"
              mt={2}
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
          <ModalHeader>Supprimer le message</ModalHeader>
          <ModalBody>
            Voulez-vous supprimer ce message ?
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
    </Card>
  );
}

export default MessagerieWhatsappChat;
