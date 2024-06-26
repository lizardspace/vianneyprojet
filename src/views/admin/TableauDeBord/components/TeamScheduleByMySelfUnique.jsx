import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import {
  Box, Text, Flex, Card, useColorModeValue, ChakraProvider, useToast, Tooltip, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, Button, Input, Stack, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody,
} from '@chakra-ui/react';
import { FcPlus } from "react-icons/fc";
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import 'moment/locale/fr'; // Import French locale

import './CalendarStyles.css';
import AddActionForm from './AddActionForm';

import { supabase } from './../../../../supabaseClient';

// Set moment to French locale
moment.locale('fr');
const localizer = momentLocalizer(moment);

const TeamScheduleByMySelfUnique = ({ selectedTeamId }) => {
  const [events, setEvents] = useState([]);
  const [inputDate] = useState(moment().format('YYYY-MM-DD')); // Default to today's date
  const [currentDate, setCurrentDate] = useState(new Date());
  const handleDateChange = (e) => {
    const newDate = new Date(e.target.value);
    if (!isNaN(newDate.getTime())) {
      setCurrentDate(newDate);
    }
  };

  const { defaultDate } = useMemo(() => ({
    defaultDate: inputDate ? new Date(inputDate) : new Date(),
  }), [inputDate]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const onClose = () => setIsAlertOpen(false);
  const cancelRef = React.useRef();
  const toast = useToast();
  const [updatedEventName, setUpdatedEventName] = useState('');
  const [updatedEventStart, setUpdatedEventStart] = useState('');
  const [updatedEventEnd, setUpdatedEventEnd] = useState('');
  const textColor = useColorModeValue("secondaryGray.900", "white");

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    setIsAlertOpen(true);
    setUpdatedEventName(event.title);
    setUpdatedEventStart(moment(event.start).format('YYYY-MM-DDTHH:mm'));
    setUpdatedEventEnd(moment(event.end).format('YYYY-MM-DDTHH:mm'));
  };

  const deleteEvent = async () => {
    if (!selectedEvent || typeof selectedEvent.id === 'undefined') {
      toast({
        title: "Error",
        description: "No event selected or event ID is missing.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const { error } = await supabase
      .from('vianney_actions')
      .delete()
      .match({ id: selectedEvent.id });

    if (error) {
      toast({
        title: "Erreur lors de la suppression de l'événement",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      setEvents(events.filter(event => event.id !== selectedEvent.id));
      toast({
        title: "Événement supprimé",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }
    onClose();
  };

  const updateEvent = async () => {
    const { error } = await supabase
      .from('vianney_actions')
      .update({
        action_name: updatedEventName,
        starting_date: updatedEventStart,
        ending_date: updatedEventEnd,
        last_updated: new Date()
      })
      .match({ id: selectedEvent.id });

    if (error) {
      toast({
        title: "Erreur lors de la mise à jour de l'événement",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      setEvents(events.map(event =>
        event.id === selectedEvent.id ? { ...event, title: updatedEventName, start: new Date(updatedEventStart), end: new Date(updatedEventEnd) } : event
      ));
      toast({
        title: "Événement mis à jour",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }
    onClose();
  };

  const fetchEvents = useCallback(async () => {
    const { data: eventsData, error } = await supabase
      .from('team_action_view_rendering')
      .select('*')
      .eq('team_id', selectedTeamId);

    if (error) {
      console.error('Error fetching events:', error);
      return;
    }

    const formattedEvents = eventsData.map(action => ({
      id: action.action_id,
      title: action.action_name,
      start: new Date(action.starting_date),
      end: new Date(action.ending_date),
      resourceId: action.team_id,
      color: action.color || 'lightgrey',
    }));

    setEvents(formattedEvents);
  }, [selectedTeamId]);

  useEffect(() => {
    if (selectedTeamId) {
      fetchEvents();
    }
  }, [fetchEvents, selectedTeamId]);

  function adjustBrightness(col, amount) {
    let usePound = false;

    if (col[0] === "#") {
      col = col.slice(1);
      usePound = true;
    }

    const num = parseInt(col, 16);
    let r = (num >> 16) + amount;

    if (r > 255) r = 255;
    else if (r < 0) r = 0;

    let b = ((num >> 8) & 0x00FF) + amount;

    if (b > 255) b = 255;
    else if (b < 0) b = 0;

    let g = (num & 0x0000FF) + amount;

    if (g > 255) g = 255;
    else if (g < 0) g = 0;

    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
  }

  const eventStyleGetter = (event) => {
    const baseColor = event.color || 'lightgrey';
    const gradientColor = adjustBrightness(baseColor, -35);
    return {
      style: {
        backgroundImage: `linear-gradient(to right, ${baseColor}, ${gradientColor})`,
        color: 'black',
        textAlign: 'left',
        display: 'flex',
        alignItems: 'left',
        justifyContent: 'flex-start', 
        fontSize: '14px',
        fontWeight: 'bold',
      },
    };
  };

  const messages = {
    allDay: 'Toute la journée',
    previous: 'Précédent',
    next: 'Suivant',
    today: 'Aujourd\'hui',
    month: 'Mois',
    week: 'Semaine',
    day: 'Jour',
    agenda: 'Agenda',
    date: 'Date',
    time: 'Heure',
    event: 'Événement',
    noEventsInRange: 'Aucun événement pour cette période',
  };

  const formats = {
    dayFormat: 'DD/MM',
    weekdayFormat: 'dddd',
    monthHeaderFormat: 'MMMM YYYY',
    dayHeaderFormat: 'dddd, MMMM DD',
    agendaDateFormat: 'dddd, MMMM DD',
    agendaTimeFormat: 'HH:mm',
  };

  const CustomEvent = ({ event }) => (
    <Tooltip
      label={`${event.title} - ${moment(event.start).format('HH:mm')} à ${moment(event.end).format('HH:mm')}`}
      aria-label="Event Tooltip"
      hasArrow
      overflowWrap="anywhere"
      whiteSpace="pre-line"
    >
      <div style={eventStyleGetter(event).style}>
        <div style={{ color: 'black', fontWeight: 'bold', fontSize: '10px' }}>
          {event.title}
        </div>
      </div>
    </Tooltip>
  );

  const [isAddActionModalOpen, setIsAddActionModalOpen] = useState(false);
  const onOpenAddActionModal = () => setIsAddActionModalOpen(true);
  const onCloseAddActionModal = () => setIsAddActionModalOpen(false);

  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <Card
      direction='column'
      w='100%'
      px='0px'
      overflowX={{ sm: "scroll", lg: "hidden" }}>
      <Box p={4}>
        <ChakraProvider>
          <Box p={4}>
            <Flex px='25px' justify='space-between' mb='20px' align='center'>
              <Text
                color={textColor}
                fontSize='22px'
                fontWeight='700'
                lineHeight='100%'>
                Emploi du temps de l'équipe
              </Text>
              <Flex align="center">
                <Input
                  type="date"
                  value={moment(currentDate).format('YYYY-MM-DD')}
                  onChange={handleDateChange}
                  placeholder="Select date"
                  mb={4}
                  maxW="150px"
                />
                <Button onClick={handlePrevious} variant="ghost" size="sm" mr="2">
                  <FaChevronLeft />
                </Button>
                <Button onClick={handleToday} variant="ghost" size="sm">
                  Aujourd'hui
                </Button>
                <Button onClick={handleNext} variant="ghost" size="sm" ml="2">
                  <FaChevronRight />
                </Button>
              </Flex>
              <Tooltip label="Cliquer pour ajouter une action" hasArrow>
                <Box position='absolute' top='15px' right='15px' cursor='pointer'>
                  <FcPlus size="24px" onClick={onOpenAddActionModal} />
                </Box>
              </Tooltip>
            </Flex>
            <Calendar
              localizer={localizer}
              events={events}
              defaultDate={defaultDate}
              date={currentDate}
              formats={formats}
              defaultView={Views.DAY}
              views={['day', 'week', 'month', 'agenda']}
              startAccessor="start"
              endAccessor="end"
              eventPropGetter={eventStyleGetter}
              messages={messages}
              style={{ color: 'black' }}
              onSelectEvent={handleEventSelect}
              components={{
                event: CustomEvent,
              }}
              toolbar={false}
            />
          </Box>
          <Modal isOpen={isAddActionModalOpen} onClose={onCloseAddActionModal}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Ajouter une action</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <AddActionForm />
              </ModalBody>
            </ModalContent>
          </Modal>
          <AlertDialog
            isOpen={isAlertOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Options de l'événement
                </AlertDialogHeader>
                <AlertDialogBody>
                  {selectedEvent ? (
                    <Stack spacing={3}>
                      <Input
                        value={updatedEventName}
                        onChange={(e) => setUpdatedEventName(e.target.value)}
                        placeholder="Nom de l'événement"
                      />
                      <Input
                        type="datetime-local"
                        value={updatedEventStart}
                        onChange={(e) => setUpdatedEventStart(e.target.value)}
                      />
                      <Input
                        type="datetime-local"
                        value={updatedEventEnd}
                        onChange={(e) => setUpdatedEventEnd(e.target.value)}
                      />
                    </Stack>
                  ) : (
                    'Sélectionnez un événement à modifier ou à supprimer.'
                  )}
                </AlertDialogBody>
                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={onClose}>
                    Annuler
                  </Button>
                  <Button colorScheme="blue" onClick={updateEvent} ml={3}>
                    Mettre à jour
                  </Button>
                  <Button colorScheme="red" onClick={deleteEvent} ml={3}>
                    Supprimer
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </ChakraProvider>
      </Box>
    </Card>
  );
}

export default TeamScheduleByMySelfUnique;
