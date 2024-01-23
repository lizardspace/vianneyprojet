import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  Alert, // Import Alert component from Chakra UI
  AlertIcon, // Import AlertIcon component from Chakra UI
} from '@chakra-ui/react';
import { createClient } from '@supabase/supabase-js';
import { FcExpand, FcCollapse } from 'react-icons/fc';
import { useEvent } from './../../../EventContext';

const supabaseUrl = 'https://hvjzemvfstwwhhahecwu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2anplbXZmc3R3d2hoYWhlY3d1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5MTQ4Mjc3MCwiZXhwIjoyMDA3MDU4NzcwfQ.6jThCX2eaUjl2qt4WE3ykPbrh6skE8drYcmk-UCNDSw';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const DropdownMenu = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedEventName, setSelectedEventName] = useState(null);
  const [eventList, setEventList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isEventSelected, setIsEventSelected] = useState(false); // Added state to track if an event is selected

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
    setIsEventSelected(true); // Event is selected, enable clicking
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
    </Box>
  );
};

export default DropdownMenu;
