import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Box,
  Badge,
  HStack,
  Checkbox,
  VStack,
} from '@chakra-ui/react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { RiMapPinUserFill } from "react-icons/ri";
import { MdOutlineAccessTime, MdSos } from 'react-icons/md';
import { FaUserShield } from 'react-icons/fa';
import ReactDOMServer from 'react-dom/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hvjzemvfstwwhhahecwu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2anplbXZmc3R3d2hoYWhlY3d1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5MTQ4Mjc3MCwiZXhwIjoyMDA3MDU4NzcwfQ.6jThCX2eaUjl2qt4WE3ykPbrh6skE8drYcmk-UCNDSw';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const AlertModal = ({ isOpen, onClose, alert, onResolve, teams }) => {
  const [selectedTeams, setSelectedTeams] = useState([]);

  if (!alert) return null;

  const createCustomIcon = () => {
    return L.divIcon({
      html: ReactDOMServer.renderToString(<RiMapPinUserFill style={{ color: 'red', fontSize: '24px' }} />),
      className: 'custom-icon',
      iconSize: [24, 24],
      iconAnchor: [12, 24],
      popupAnchor: [0, -24],
    });
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const handleTeamSelect = (teamId) => {
    setSelectedTeams(prevSelected =>
      prevSelected.includes(teamId)
        ? prevSelected.filter(id => id !== teamId)
        : [...prevSelected, teamId]
    );
  };

  const sendNotification = async () => {
    try {
      const { error } = await supabase
        .from('vianney_sos_alerts')
        .update({ teams_to_which_send_a_notification: selectedTeams })
        .eq('id', alert.id);

      if (error) {
        throw error;
      }

      // Optionally, you could add some feedback to the user here
    } catch (error) {
      console.error('Error sending notification:', error.message);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Badge colorScheme="red" px={4} py={2} borderRadius="md">
            <HStack spacing={2}>
              <MdSos />
              <Text>Alerte non résolue</Text>
            </HStack>
          </Badge>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <HStack spacing={4}>
            <FaUserShield />
            <Badge colorScheme="blue">{alert.team_name}</Badge>
          </HStack>
          <HStack spacing={4} mt={4}>
            <MdOutlineAccessTime />
            <Badge colorScheme="green">{formatDateTime(alert.time_for_user)}</Badge>
          </HStack>
          {alert.url && (
            <Box mt={4}>
              <video controls width="100%">
                <source src={alert.url} type="video/webm" />
                Votre navigateur ne supporte pas la balise vidéo.
              </video>
            </Box>
          )}
          {alert.latitude && alert.longitude && (
            <Box mt={4}>
              <MapContainer
                center={[alert.latitude, alert.longitude]}
                zoom={13}
                style={{ height: '300px', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributeurs'
                />
                <Marker
                  position={[alert.latitude, alert.longitude]}
                  icon={createCustomIcon()}
                >
                  <Popup>
                    Localisation de l'alerte
                  </Popup>
                </Marker>
              </MapContainer>
            </Box>
          )}
          {teams.length > 0 && (
            <Box mt={4}>
              <Text fontSize="lg" mb={2}>Équipes de l'événement:</Text>
              <VStack align="start">
                {teams.map(team => (
                  <Checkbox
                    key={team.id}
                    isChecked={selectedTeams.includes(team.id)}
                    onChange={() => handleTeamSelect(team.id)}
                  >
                    {team.name_of_the_team} - {team.specialite}
                  </Checkbox>
                ))}
              </VStack>
            </Box>
          )}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={sendNotification}>
            Envoyer la notification
          </Button>
          <Button colorScheme="blue" mr={3} onClick={() => onResolve(alert.id)}>
            Marquer comme résolue
          </Button>
          <Button variant="ghost" onClick={onClose}>Fermer</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AlertModal;
