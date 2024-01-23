import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { createClient } from '@supabase/supabase-js';
import { FcExpand, FcCollapse } from 'react-icons/fc';

const supabaseUrl = 'https://hvjzemvfstwwhhahecwu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2anplbXZmc3R3d2hoYWhlY3d1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5MTQ4Mjc3MCwiZXhwIjoyMDA3MDU4NzcwfQ.6jThCX2eaUjl2qt4WE3ykPbrh6skE8drYcmk-UCNDSw';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const DropdownMenu = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [eventList, setEventList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Fetch data from the vianney_event table
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

  const handleSelect = (item) => {
    setSelectedItem(item);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Box>
      <Menu>
        <MenuButton as={Button} rightIcon={isOpen ? <FcCollapse /> : <FcExpand />}>
          Choisissez l'évênement
        </MenuButton>
        <MenuList>
          {eventList.map((event) => (
            <MenuItem
              key={event.event_id}
              onClick={() => handleSelect(event.event_name)}
            >
              {event.event_name}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Box>
  );
};

export default DropdownMenu;
