import React, { useState, useEffect } from 'react';
import { Box, ModalFooter, Icon, Text, Button, useColorModeValue, ModalCloseButton, ModalHeader, ModalBody, ModalOverlay, Modal, ModalContent, Heading, SimpleGrid } from '@chakra-ui/react';
import { FcBusiness, FcCalendar, FcHome, FcVoicePresentation } from "react-icons/fc";
import EventDateComponent from '../modal/EventDateComponent';
import EventLocationComponent from '../modal/EventLocationComponent';
import EventNameComponent from '../modal/EventNameComponent';
import TeamTable from '../modal/TeamTable';
import MiniStatistics from "./../../../../components/card/MiniStatistics";
import { FcPlus } from "react-icons/fc";
import { supabase } from './../../../../supabaseClient';
import AddEventForm from "./../../default/components/AddEventForm";
import EditEventForm from "./../../default/components/EditEventForm";

const ParametersEventAndCharacteristics = () => {
  const [events, setEvents] = useState([]);
  const [showEditEventModal, setShowEditEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showAddEventForm, setShowAddEventForm] = useState(false);
  const brandColor = useColorModeValue("brand.500", "white");
  const buttonBg = useColorModeValue("white", "gray.800");
  const buttonTextColor = useColorModeValue("secondaryGray.900", "white");
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const [showEventNameModal, setShowEventNameModal] = useState(false);
  const [showEventDateModal, setShowEventDateModal] = useState(false);
  const [showEventLocationModal, setShowEventLocationModal] = useState(false);
  const [showEventMailingModal, setShowEventMailingModal] = useState(false);

  const fetchEvents = async () => {
    let { data: vianney_event, error } = await supabase
      .from('vianney_event')
      .select('*');

    if (error) console.log('error', error);
    else setEvents(vianney_event);
  };

  useEffect(() => {
    // Call fetchEvents when the component mounts
    fetchEvents();
  }, []);


  const openEventNameModal = () => setShowEventNameModal(true);
  const closeEventNameModal = () => setShowEventNameModal(false);

  const openEventDateModal = () => setShowEventDateModal(true);
  const closeEventDateModal = () => setShowEventDateModal(false);

  const openEventLocationModal = () => setShowEventLocationModal(true);
  const closeEventLocationModal = () => setShowEventLocationModal(false);

  const openEventMailingModal = () => setShowEventMailingModal(true);
  const closeEventMailingModal = () => setShowEventMailingModal(false);
  const toggleAddEventForm = () => setShowAddEventForm(!showAddEventForm);

  const handleMiniStatisticsClick = (event) => {
    setSelectedEvent(event);
    setShowEditEventModal(true);
  };

  return (
    <Box>
      <Box border='1px' borderColor='gray.200' p={5} m={5}>
        <Text fontSize='xl' m={4}>Caractéristiques de l'Événement</Text>

        <Button
          leftIcon={<FcBusiness size='32px' color={brandColor} />}
          bg={buttonBg}
          color={buttonTextColor}
          h='100px'
          m={4}
          onClick={openEventNameModal}
        >
          Nom de l'événement
        </Button>

        <Button
          leftIcon={<FcCalendar size='32px' color={brandColor} />}
          bg={buttonBg}
          color={buttonTextColor}
          h='100px'
          m={4}
          onClick={openEventDateModal}
        >
          Date de l'événement
        </Button>

        <Button
          leftIcon={<FcHome size='32px' color={brandColor} />}
          bg={buttonBg}
          color={buttonTextColor}
          h='100px'
          m={4}
          onClick={openEventLocationModal}
        >
          Lieu de l'événement
        </Button>



        <Button
          leftIcon={<FcVoicePresentation size='32px' color={brandColor} />}
          bg={buttonBg}
          color={buttonTextColor}
          h='100px'
          m={4}
          onClick={openEventMailingModal}
        >
          Mailing
        </Button>

        {/* Modals */}
        <Modal isOpen={showEventNameModal} onClose={closeEventNameModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Nom de l'événement Modal</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <EventNameComponent />
            </ModalBody>
          </ModalContent>
        </Modal>

        <Modal isOpen={showEventDateModal} onClose={closeEventDateModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Date de l'événement Modal</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <EventDateComponent />
            </ModalBody>
          </ModalContent>
        </Modal>

        <Modal isOpen={showEventLocationModal} onClose={closeEventLocationModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Lieu de l'événement Modal</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <EventLocationComponent />
            </ModalBody>
          </ModalContent>
        </Modal>


        <Modal isOpen={showEventMailingModal} onClose={closeEventMailingModal} size="full">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Mailing Modal</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <TeamTable />
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
      <Box border='1px' borderColor='gray.200' p={5} m={5}>
        <Heading me='auto' color={textColor} fontSize='2xl' fontWeight='700' lineHeight='100%' mb="20px">
          Evènements
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3, "2xl": 6 }} gap='20px' mb='20px'>
          {events.map((event, index) => (
            <Box
              key={index}
              cursor="pointer" // Add cursor pointer style
              transition="background-color 0.2s" // Add transition for hover effect
              _hover={{ backgroundColor: "gray.100" }} // Define hover effect style
              onClick={() => handleMiniStatisticsClick(event)} // Add click handler
            >
              <MiniStatistics
                event_name={event.event_name}
                date={event.event_date}
              />
            </Box>
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
              <ModalHeader>Modifier l'évênement</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <EditEventForm event={selectedEvent} refreshEvents={fetchEvents} />
              </ModalBody>
            </ModalContent>
          </Modal>
        )}
      </Box>
    </Box>
  );
};

export default ParametersEventAndCharacteristics;
