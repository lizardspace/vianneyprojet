import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  SimpleGrid,
  Icon,
  Heading,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import MiniCalendar from "components/calendar/MiniCalendar";
import { FcPlus } from "react-icons/fc";
import MiniStatistics from "components/card/MiniStatistics";
import { createClient } from '@supabase/supabase-js'
import AddEventForm from "./components/AddEventForm";
import EditEventForm from "./components/EditEventForm";
import DocumentationsComponent from "./DocumentionsComponent/DocumentationsComponent";

const supabaseUrl = 'https://hvjzemvfstwwhhahecwu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2anplbXZmc3R3d2hoYWhlY3d1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5MTQ4Mjc3MCwiZXhwIjoyMDA3MDU4NzcwfQ.6jThCX2eaUjl2qt4WE3ykPbrh6skE8drYcmk-UCNDSw';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function UserReports() {
  const [showAddEventForm, setShowAddEventForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null); // State to store selected event
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const [events, setEvents] = useState([]);
  const [showEditEventModal, setShowEditEventModal] = useState(false);

  useEffect(() => {
    async function fetchEvents() {
      let { data: vianney_event, error } = await supabase
        .from('vianney_event')
        .select('*');

      if (error) console.log('error', error);
      else setEvents(vianney_event);
    }

    fetchEvents();
  }, []);

  const toggleAddEventForm = () => setShowAddEventForm(!showAddEventForm);
  const handleMiniStatisticsClick = (event) => {
    console.log('Event selected:', event); // Debugging line
    setSelectedEvent(event);
    setShowEditEventModal(true);
    console.log('Show Edit Modal:', showEditEventModal); // Debugging line
  };


  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Heading me='auto'
        color={textColor}
        fontSize='2xl'
        fontWeight='700'
        lineHeight='100%'
        mb="20px">
        Evènements
      </Heading>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3, "2xl": 6 }}
        gap='20px'
        mb='20px'>
        {events.map((event, index) => (
          <MiniStatistics
            key={index}
            event_name={event.event_name}
            date={event.event_date}
            onClick={() => handleMiniStatisticsClick(event)} // Add click handler
          />
        ))}
        <Button
          mt="30px"
          onClick={toggleAddEventForm}
          leftIcon={<Icon as={FcPlus} />}
          colorScheme='blue'
          variant='solid'
          size='md'
          boxShadow='sm'
          _hover={{ boxShadow: 'md' }}
          _active={{ boxShadow: 'lg' }}>
          Ajouter un évènement
        </Button>
      </SimpleGrid>
      {showAddEventForm && (
        <Modal isOpen={showAddEventForm} onClose={() => setShowAddEventForm(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Ajouter un événement</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <AddEventForm preFilledEvent={selectedEvent} />
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={() => setShowAddEventForm(false)}>Fermer</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
      {showEditEventModal && (
        <Modal isOpen={showEditEventModal} onClose={() => setShowEditEventModal(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Modifier ou supprimer un événement</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <EditEventForm event={selectedEvent} refreshEvents={() => fetchEvents()} />
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={() => setShowEditEventModal(false)}>Fermer</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
      <DocumentationsComponent />
      <Heading me='auto'
        color={textColor}
        fontSize='2xl'
        fontWeight='700'
        lineHeight='100%'
        mb="20px">
        Le calendrier des évènements
      </Heading>
      <MiniCalendar />
    </Box>
  );
}
