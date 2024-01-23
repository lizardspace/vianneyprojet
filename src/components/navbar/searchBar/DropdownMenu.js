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
  Modal, // Import Modal component from Chakra UI
  ModalOverlay, // Import ModalOverlay component from Chakra UI
  ModalContent, // Import ModalContent component from Chakra UI
  ModalHeader, // Import ModalHeader component from Chakra UI
  ModalBody, // Import ModalBody component from Chakra UI
  ModalFooter, // Import ModalFooter component from Chakra UI
} from '@chakra-ui/react';
import { createClient } from '@supabase/supabase-js';
import { FcExpand, FcCollapse } from 'react-icons/fc';
import { useEvent } from './../../../EventContext';

const supabaseUrl = 'https://hvjzemvfstwwhhahecwu.supabase.co';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'; // Replace with your Supabase anonymous key
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const DropdownMenu = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedEventName, setSelectedEventName] = useState(null);
  const [eventList, setEventList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isEventSelected, setIsEventSelected] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true); // State to control the modal

  const { setEventId, selectedEventId } = useEvent();

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

  const handleSelect = (event) => {
    setSelectedItem(event.event_name);
    setSelectedEventName(event.event_name);
    setEventId(event.event_id);
    setIsEventSelected(true);
    setIsModalOpen(false); // Close the modal when an event is selected
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Box>
      <Menu>
        <MenuButton
          as={Button}
          rightIcon={isOpen ? <FcCollapse /> : <FcExpand />}
          onClick={toggleMenu}
        >
          {selectedItem || 'Choisissez l\'évênement'} {selectedEventId && <Text ml={2}>ID: {selectedEventId} {selectedEventName && `Nom: ${selectedEventName}`}</Text>}
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
          Merci de sélectionner un évênement.
        </Alert>
      )}

      {/* Modal for event selection */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Sélectionnez un évênement</ModalHeader>
          <ModalBody>
            Veuillez sélectionner un évênement pour continuer.
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={() => setIsModalOpen(false)}>
              Fermer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default DropdownMenu;
