import React, { useRef, useEffect, useState, useCallback } from 'react';
import jsQR from 'jsqr';
import { supabase } from './../../../../supabaseClient';
import {
  ModalCloseButton,
  Box,
  Text,
  VStack,
  Badge,
  Alert,
  AlertIcon,
  IconButton,
  Tooltip,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  useToast,
  HStack,
  Select
} from '@chakra-ui/react';
import QRCode from 'qrcode.react';
import { MdDeleteForever } from "react-icons/md";
import { FcDisclaimer, FcOk } from "react-icons/fc";
import { useEvent } from './../../../../EventContext';

const VideoCaptureBisBis = () => {
  const videoRef = useRef(null);
  const [qrCodeText, setQrCodeText] = useState('');
  const [materiel, setMateriel] = useState(null);
  const [isQRCodeDetected, setIsQRCodeDetected] = useState(false);
  const [noMatchingMaterial, setNoMatchingMaterial] = useState(false);

  const fetchMateriel = useCallback(async (id) => {
    console.log(`Fetching materiel with ID: ${id}`);
    try {
      if (!isValidUUID(id)) {
        console.log("Invalid UUID detected.");
        setNoMatchingMaterial(true);
        return;
      }

      const { data, error } = await supabase
        .from('vianney_inventaire_materiel')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching item details:', error);
        throw error;
      }

      if (!data) {
        console.log("No data found for the given ID.");
        setNoMatchingMaterial(true);
      } else {
        console.log("Materiel data fetched successfully:", data);
        setMateriel(data);
        setNoMatchingMaterial(false);
      }
    } catch (error) {
      console.error('Error fetching item details:', error);
    }
  }, []);

  const isValidUUID = (id) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  };

  const scanQRCode = useCallback((stream) => {
    console.log("Starting QR code scan.");
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error("Cannot obtain canvas context.");
      return;
    }

    const checkQRCode = () => {
      if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        console.log("Video has enough data to scan.");
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 5;
        ctx.strokeRect(canvas.width / 4, canvas.height / 4, canvas.width / 2, canvas.height / 2);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });

        if (code) {
          console.log("QR Code detected:", code.data);
          setQrCodeText(code.data);
          fetchMateriel(code.data);
          stream.getTracks().forEach(track => track.stop());
          setIsQRCodeDetected(true);
          return;
        } else {
          console.log("No QR Code detected in this frame.");
        }
      } else {
        console.log("Video not ready yet.");
      }
      requestAnimationFrame(checkQRCode);
    };

    checkQRCode();
  }, [fetchMateriel]);

  useEffect(() => {
    let stream;

    const enableStream = async () => {
      console.log("Attempting to access the camera...");
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        console.log("Camera stream obtained successfully.");
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          console.log("Video element is playing.");
        } else {
          console.error("videoRef.current is null.");
        }
        scanQRCode(stream);
      } catch (err) {
        console.error("Error accessing camera: ", err);
      }
    };

    enableStream();

    return () => {
      if (stream) {
        console.log("Stopping all video tracks.");
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [scanQRCode]);

  const [materiels, setMateriels] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [events, setEvents] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [selectedEvent, setSelectedEvent] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [loadingEvents, setLoadingEvents] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [loadingMateriels, setLoadingMateriels] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const { isOpen: isAssociationModalOpen, onOpen: onAssociationModalOpen, onClose: onAssociationModalClose } = useDisclosure();
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const { selectedEventId } = useEvent();
  const [selectedEventName, setSelectedEventName] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      console.log("Fetching events...");
      const { data, error } = await supabase
        .from('vianney_event')
        .select('*');
      if (error) {
        console.error('Erreur lors de la récupération des événements', error);
      } else {
        console.log("Events fetched successfully:", data);
        setEvents(data);
        const currentEvent = data.find(event => event.event_id === selectedEventId);
        if (currentEvent) {
          setSelectedEventName(currentEvent.event_name);
          console.log(`Selected Event: ${currentEvent.event_name}`);
        } else {
          console.log("No current event found.");
        }
      }
      setLoadingEvents(false);
    };

    fetchEvents();
  }, [selectedEventId, setLoadingEvents, setEvents]);

  useEffect(() => {
    const fetchTeams = async () => {
      if (!selectedEventId) {
        console.log("No event selected. Skipping team fetch.");
        return;
      }
      console.log(`Fetching teams for event ID: ${selectedEventId}`);
      setLoadingTeams(true);
      const { data, error } = await supabase
        .from('vianney_teams')
        .select('*')
        .eq('event_id', selectedEventId);

      if (error) {
        console.error('Erreur lors de la récupération des équipes', error);
        setTeams([]); // S'assurer que teams est réinitialisé en cas d'erreur
      } else {
        console.log("Teams fetched successfully:", data);
        setTeams(data);
      }
      setLoadingTeams(false);
    };

    fetchTeams();
  }, [selectedEventId]);

  const eventDisplay = selectedEventName ? (
    <Badge colorScheme="blue" p="2">
      {selectedEventName} (Sélectionné)
    </Badge>
  ) : (
    <Text>Chargement de l'événement...</Text>
  );

  useEffect(() => {
    const chargerMateriels = async () => {
      console.log("Loading materiels...");
      const { data: materielsData, error: materielsError } = await supabase.from('vianney_inventaire_materiel').select('*');
      if (materielsError) {
        console.error('Erreur lors de la récupération des matériels', materielsError);
      } else {
        console.log("Materiels fetched successfully:", materielsData);
        const { data: teamsData, error: teamsError } = await supabase.from('vianney_teams').select('*');
        if (teamsError) {
          console.error('Erreur lors de la récupération des équipes', teamsError);
        } else {
          const updatedMateriels = materielsData.map(materiel => {
            const associatedTeam = teamsData.find(team => team.id === materiel.associated_team_id);
            return {
              ...materiel,
              associated_team_name: associatedTeam ? associatedTeam.name_of_the_team : 'No team associated'
            };
          });
          setMateriels(updatedMateriels);
          console.log("Materiels after associating teams:", updatedMateriels);
        }
      }
      setLoading(false);
    };

    const fetchEvents = async () => {
      console.log("Fetching events (redundant fetch)...");
      const { data, error } = await supabase
        .from('vianney_event')
        .select('*');
      if (error) console.error('Error fetching events:', error);
      else {
        console.log("Events fetched successfully (redundant fetch):", data);
        setEvents(data);
      }
      setLoadingEvents(false);
    };

    const fetchMateriels = async () => {
      console.log("Fetching materiels (redundant fetch)...");
      const { data, error } = await supabase.from('vianney_inventaire_materiel').select('*');
      if (error) {
        console.error('Erreur lors de la récupération des matériels', error);
      } else {
        console.log("Materiels fetched successfully (redundant fetch):", data);
        setMateriels(data);
      }
      setLoadingMateriels(false);
    };

    chargerMateriels();
    fetchEvents();
    fetchMateriels();
  }, [selectedEvent, setEvents, setLoadingEvents, setLoadingMateriels]);

  const handleOpenAssociationModal = (materiel) => {
    console.log("Opening association modal for materiel:", materiel);
    setSelectedMaterial(materiel);
    onAssociationModalOpen();
  };

  const handleDeleteConfirmation = (id) => {
    console.log(`Confirming deletion for materiel ID: ${id}`);
    setConfirmDeleteId(id);
    onOpen();
  };

  const handleDelete = async () => {
    if (confirmDeleteId) {
      console.log(`Deleting materiel with ID: ${confirmDeleteId}`);
      const { error } = await supabase.from('vianney_inventaire_materiel').delete().match({ id: confirmDeleteId });
      if (error) {
        console.error('Error deleting materiel:', error);
      } else {
        console.log(`Materiel with ID: ${confirmDeleteId} deleted successfully.`);
        setMateriels(materiels.filter(materiel => materiel.id !== confirmDeleteId));
        onClose();
        setConfirmDeleteId(null);
        toast({
          title: "Matériel supprimé avec succès",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const handleReturnMaterial = async (id) => {
    console.log(`Returning materiel with ID: ${id}`);
    const updatedMateriels = materiels.map(materiel => {
      if (materiel.id === id) {
        return { ...materiel, associated_team_id: null, associated_team_name: 'No team associated' };
      }
      return materiel;
    });
    setMateriels(updatedMateriels);

    const { error } = await supabase.from('vianney_inventaire_materiel').update({ associated_team_id: null }).match({ id });
    if (error) {
      console.error('Error returning materiel:', error);
    } else {
      console.log(`Materiel with ID: ${id} returned successfully.`);
      toast({
        title: "Matériel rendu avec succès",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleTeamChange = (e) => {
    const teamId = e.target.value;
    console.log(`Selected team ID: ${teamId}`);
    const team = teams.find(t => t.id.toString() === teamId);
    setSelectedTeam(team);
    if (team) {
      console.log(`Selected team: ${team.name_of_the_team}`);
    }
  };

  const handleAssociation = async () => {
    if (!selectedMaterial || !selectedTeam) {
      console.warn("Selected material or team is missing.");
      return;
    }

    console.log(`Associating materiel ID: ${selectedMaterial.id} with team ID: ${selectedTeam.id}`);
    // eslint-disable-next-line
    const { data, error } = await supabase
      .from('vianney_inventaire_materiel')
      .update({ associated_team_id: selectedTeam.id })
      .eq('id', selectedMaterial.id);

    if (error) {
      console.error('Erreur lors de l\'association du matériel à l\'équipe', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'association du matériel à l'équipe.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      console.log(`Materiel ID: ${selectedMaterial.id} associated with team ID: ${selectedTeam.id} successfully.`);
      const updatedMateriels = materiels.map(materiel => {
        if (materiel.id === selectedMaterial.id) {
          return { ...materiel, associated_team_id: selectedTeam.id, associated_team_name: selectedTeam.name_of_the_team };
        }
        return materiel;
      });
      setMateriels(updatedMateriels);
      toast({
        title: "Succès",
        description: `Le matériel "${selectedMaterial.nom}" a été associé à l'équipe "${selectedTeam.name_of_the_team}" avec succès.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onAssociationModalClose();
    }
  };

  return (
    <Box pt={{ base: "180px", md: "80px", xl: "80px" }} alignItems="center" justifyContent="center">
      <div>
        {!isQRCodeDetected && (
          <div style={{ position: 'relative', minWidth: '100%', borderRadius: '10px' }}>
            <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%' }} />
            <div style={{ position: 'absolute', top: '25%', left: '25%', width: '50%', height: '50%', border: '2px solid #00ff00', borderRadius: '10px' }}></div>
          </div>
        )}
        {materiel && (
          <Box alignItems="center" display="flex" flexDirection="column" justifyContent="center">
            <Box padding="4" maxW="500px">
              {materiels.filter(m => m.id === qrCodeText).map((materiel) => (
                <Box key={materiel.id} p="4" shadow="md" borderWidth="1px" borderRadius="md" bg="white">
                  <VStack spacing="4">
                    <Badge colorScheme="orange">{materiel.nom}</Badge>
                    <Alert status={materiel.associated_team_id ? "success" : "warning"} variant="left-accent">
                      <AlertIcon />
                      {materiel.associated_team_name
                        ? `Materiel "${materiel.nom}" is associated with team "${materiel.associated_team_name}"`
                        : `No team is associated with materiel "${materiel.nom}". Materiel is available.`}
                    </Alert>
                    <QRCode value={materiel.id} size={128} level="L" includeMargin={true} />
                    {materiel.description && (
                      <Alert status="info" variant="left-accent">
                        <AlertIcon />
                        {materiel.description}
                      </Alert>
                    )}
                    <HStack spacing="4">
                      <Tooltip label="Supprimer" hasArrow>
                        <IconButton
                          aria-label="Supprimer matériel"
                          icon={<MdDeleteForever />}
                          colorScheme="red"
                          onClick={() => handleDeleteConfirmation(materiel.id)}
                        />
                      </Tooltip>
                      <Tooltip label="Associer à une autre équipe" hasArrow>
                        <IconButton
                          aria-label="Associer à une autre équipe"
                          icon={<FcOk />}
                          colorScheme="gray"
                          onClick={() => handleOpenAssociationModal(materiel)}
                        />
                      </Tooltip>
                      <Tooltip label="Rendre le matériel" hasArrow>
                        <IconButton
                          aria-label="Rendre le matériel"
                          icon={<FcDisclaimer />}
                          colorScheme="gray"
                          onClick={() => handleReturnMaterial(materiel.id)}
                        />
                      </Tooltip>
                    </HStack>
                  </VStack>
                </Box>
              ))}
              <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Confirmation</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    Voulez-vous vraiment supprimer ce matériel ?
                  </ModalBody>
                  <ModalFooter>
                    <Button colorScheme="red" onClick={handleDelete}>Yes, Delete</Button>
                    <Button ml="4" onClick={onClose}>Cancel</Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>

              <Modal isOpen={isAssociationModalOpen} onClose={onAssociationModalClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Associer à une équipe</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <VStack spacing={4} align="stretch">
                      {eventDisplay}
                      {loadingTeams ? (
                          <Text>Chargement des équipes...</Text>
                      ) : (
                        <Select placeholder="Select a team" onChange={handleTeamChange}>
                          {teams.map((team) => (
                            <option key={team.id} value={team.id}>
                              {team.name_of_the_team}
                            </option>
                          ))}
                        </Select>
                      )}

                      {/* Displaying selected material */}
                      {selectedMaterial ? (
                        <Badge colorScheme="green" p="2">
                          {selectedMaterial.nom} (Selected)
                        </Badge>
                      ) : (
                        <Select placeholder="Select a materiel" onChange={(e) => {
                          const selected = materiels.find(materiel => materiel.id.toString() === e.target.value);
                          setSelectedMaterial(selected);
                          if (selected) {
                            console.log(`Selected material for association: ${selected.nom}`);
                          }
                        }}>
                          {materiels.map((materiel) => (
                            <option key={materiel.id} value={materiel.id}>
                              {materiel.nom}
                            </option>
                          ))}
                        </Select>
                      )}
                      <Button onClick={handleAssociation}>Associate Materiel to Team</Button>
                    </VStack>
                  </ModalBody>
                </ModalContent>
              </Modal>
            </Box>
          </Box>
        )}
        {noMatchingMaterial && (
          <Box>
            <Alert status="error">
              <AlertIcon />
              No matching materiel found. This QR code does not correspond to any materiel in the database or the current event.
            </Alert>
          </Box>
        )}
      </div>
    </Box>
  );
};

export default VideoCaptureBisBis;
