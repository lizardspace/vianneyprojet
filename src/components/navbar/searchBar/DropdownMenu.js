import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  Alert,
  AlertIcon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useToast,
} from '@chakra-ui/react';
import { createClient } from '@supabase/supabase-js';
import { FcExpand, FcCollapse, FcAdvance } from 'react-icons/fc';
import { useEvent } from './../../../EventContext';
import AlertModal from 'components/AlertModal';

const supabaseUrl = 'https://hvjzemvfstwwhhahecwu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2anplbXZmc3R3d2hoYWhlY3d1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5MTQ4Mjc3MCwiZXhwIjoyMDA3MDU4NzcwfQ.6jThCX2eaUjl2qt4WE3ykPbrh6skE8drYcmk-UCNDSw';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const DropdownMenu = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [eventList, setEventList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isEventSelected, setIsEventSelected] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(true);
  const [unresolvedAlert, setUnresolvedAlert] = useState(null);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [teams, setTeams] = useState([]);

  const { setEventId, selectedEventId } = useEvent();
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase.from('vianney_event').select('*');
        if (error) {
          throw error;
        }
        setEventList(data);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const { data, error } = await supabase
          .from('vianney_sos_alerts')
          .select('*')
          .or('resolved.is.false,resolved.is.null');
        if (error) {
          throw error;
        }
        if (data.length > 0) {
          setUnresolvedAlert(data[0]); // Show the first unresolved alert
          setIsAlertModalOpen(true);
        }
      } catch (error) {
        console.error('Error fetching alerts:', error.message);
      }
    };

    fetchAlerts(); // Initial fetch

    // Check for unresolved alerts every 60 seconds
    const intervalId = setInterval(fetchAlerts, 60000); // 60 seconds in milliseconds

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const handleSelect = async (event) => {
    setSelectedItem(event.event_name);
    setEventId(event.event_id);
    setIsEventSelected(true);
    setIsEventModalOpen(false);
  
    try {
      const { data, error } = await supabase.from('vianney_teams').select('*').eq('event_id', event.event_id);
      if (error) {
        throw error;
      }
      setTeams(data);
  
      // Update the unresolved alert with the list of team IDs
      if (unresolvedAlert) {
        const teamIds = data.map(team => team.id);
        await supabase
          .from('vianney_sos_alerts')
          .update({ teams_to_which_send_a_notification: teamIds })
          .eq('id', unresolvedAlert.id);
      }
    } catch (error) {
      console.error('Error fetching teams:', error.message);
    }
  };  

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const resolveAlert = async (id) => {
    const { error } = await supabase
      .from('vianney_sos_alerts')
      .update({ resolved: true })
      .eq('id', id);

    if (!error) {
      setUnresolvedAlert(null);
      setIsAlertModalOpen(false);
      toast({
        title: "Alerte résolue.",
        description: "L'alerte a été marquée comme résolue avec succès.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } else {
      console.error('Error resolving alert:', error);
    }
  };

  useEffect(() => {
    // Check if an event is selected every 30 seconds
    const intervalId = setInterval(() => {
      if (!isEventSelected) {
        // Reload the page if no event is selected
        window.location.reload();
      }
    }, 30000); // 30 seconds in milliseconds

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [isEventSelected]);

  return (
    <Box>
      <Menu>
        <MenuButton
          as={Button}
          rightIcon={isOpen ? <FcCollapse /> : <FcExpand />}
          onClick={toggleMenu}
        >
          {selectedItem || 'Choisissez l\'événement'}
          {selectedEventId && <Text ml={2}> </Text>}
        </MenuButton>
        <MenuList>
          {eventList.map((event) => (
            <MenuItem
              key={event.event_id}
              onClick={() => handleSelect(event)}
            >
              {event.event_name}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
      {!isEventSelected && (
        <Alert status="warning" mt={2}>
          <AlertIcon />
          Merci de sélectionner un événement.
        </Alert>
      )}

      <Modal isOpen={isEventModalOpen && !isEventSelected} onClose={() => setIsEventModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Sélectionnez un événement</ModalHeader>
          <ModalBody>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              Veuillez sélectionner un événement pour continuer.&nbsp;   <FcAdvance />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={() => setIsEventModalOpen(false)}>
              Fermer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <AlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        alert={unresolvedAlert}
        onResolve={resolveAlert}
        teams={teams} // Pass teams to AlertModal
      />
    </Box>
  );
};

export default DropdownMenu;
