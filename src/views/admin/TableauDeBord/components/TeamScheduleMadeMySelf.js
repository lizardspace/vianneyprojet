import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import {
  Box, Text, Select, Flex, Card, useColorModeValue, ChakraProvider, useToast, Tooltip, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, Button, Input, Stack, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody,
} from '@chakra-ui/react';
import { FcPlus } from "react-icons/fc";
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import 'moment/locale/fr'; // Import French locale

import './CalendarStyles.css';
import AddActionForm from './AddActionForm';
import { useEvent } from '../../../../EventContext'; // Import useEvent hook

import { supabase } from './../../../../supabaseClient';

// Set moment to French locale
moment.locale('fr');
const localizer = momentLocalizer(moment);

const TeamScheduleByMySelf = () => {
  const [events, setEvents] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState([]);
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
  const [teams, setTeams] = useState([]);
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const { selectedEventId } = useEvent(); // Get selectedEventId from context

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    setIsAlertOpen(true);
    setUpdatedEventName(event.titel);
    setUpdatedEventStart(moment(event.start).format('YYYY-MM-DDTHH:mm'));
    setUpdatedEventEnd(moment(event.end).format('YYYY-MM-DDTHH:mm'));
  };

  const deleteEvent = async () => {
    console.log('Selected event on delete:', selectedEvent); // Log the event when attempting to delete

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
      console.log(messages.errorEventDelete); // Log the error message
      toast({
        title: "Erreur lors de la suppression de l'événement",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      console.log(messages.successEventDelete); // Log the success message
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
        last_updated: new Date(),
      })
      .match({ id: selectedEvent.id });

    if (error) {
      console.log(messages.errorEventUpdate); // Log the error message
      toast({
        title: "Erreur lors de la mise à jour de l'événement",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      console.log(messages.successEventUpdate); // Log the success message
      setEvents(events.map(event =>
        event.id === selectedEvent.id ? { ...event, titel: updatedEventName, start: new Date(updatedEventStart), end: new Date(updatedEventEnd) } : event
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

  const customSort = (a, b) => {
    // Utiliser une expression régulière pour séparer la partie texte et la partie numérique
    const regex = /(\D+)(\d+)/;
    const matchA = a.titel.match(regex);
    const matchB = b.titel.match(regex);
  
    if (matchA && matchB) {
      const textA = matchA[1].toLowerCase(); // Partie texte de A
      const textB = matchB[1].toLowerCase(); // Partie texte de B
      const numA = parseInt(matchA[2], 10);  // Partie numérique de A
      const numB = parseInt(matchB[2], 10);  // Partie numérique de B
  
      // Comparer d'abord les parties texte
      if (textA < textB) return -1;
      if (textA > textB) return 1;
  
      // Si les parties texte sont identiques, comparer les parties numériques
      return numA - numB;
    }
  
    // Si le format n'est pas respecté, utiliser un tri alphabétique standard
    return a.titel.localeCompare(b.titel);
  };

  const fetchTeams = useCallback(async () => {
    const { data, error } = await supabase
      .from('vianney_teams')
      .select('*')
      .eq('event_id', selectedEventId);
  
    if (error) {
      console.error('Error fetching teams:', error);
      return [];
    }
  
    // Trier les équipes avec la fonction personnalisée
    const sortedTeams = data
      .map(team => ({
        id: team.id,
        titel: team.name_of_the_team,
        color: team.color,
      }))
      .sort(customSort); // Utiliser la fonction de tri personnalisée
  
    return sortedTeams;
  }, [selectedEventId]);

  useEffect(() => {
    const fetchData = async () => {
      const teamsData = await fetchTeams();
      setTeams(teamsData); // Les équipes sont déjà triées ici
  
      const { data: eventsData, error } = await supabase
        .from('team_action_view_rendering')
        .select('*');
  
      if (error) {
        console.error('Error fetching events:', error);
      } else {
        const formattedEvents = [];
  
        eventsData.forEach(action => {
          const start = new Date(action.starting_date);
          const end = new Date(action.ending_date);
  
          if (moment(start).isSame(end, 'day')) {
            formattedEvents.push({
              id: action.action_id,
              titel: action.action_name,
              start: start,
              end: end,
              resourceId: action.team_id,
              color: teamsData.find(t => t.id === action.team_id)?.color || 'lightgrey',
            });
          } else {
            const endOfDay = moment(start).endOf('day');
            const startOfNextDay = moment(endOfDay).add(1, 'second');
  
            formattedEvents.push({
              id: action.action_id,
              titel: action.action_name,
              start: start,
              end: endOfDay.toDate(),
              resourceId: action.team_id,
              color: teamsData.find(t => t.id === action.team_id)?.color || 'lightgrey',
            });
  
            formattedEvents.push({
              id: action.action_id,
              titel: action.action_name,
              start: startOfNextDay.toDate(),
              end: end,
              resourceId: action.team_id,
              color: teamsData.find(t => t.id === action.team_id)?.color || 'lightgrey',
            });
          }
        });
  
        setEvents(formattedEvents);
      }
    };
  
    fetchData();
  }, [fetchTeams]);

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
    today: 'Aujourd hui',
    month: 'Mois',
    week: 'Semaine',
    day: 'Jour',
    agenda: 'Agenda',
    date: 'Date',
    time: 'Heure',
    event: 'Événement',
    noEventsInRange: 'Aucun événement pour cette période',
    errorEventSelect: 'Erreur lors de la sélection de l\'événement',
    errorEventUpdate: 'Erreur lors de la mise à jour de l\'événement',
    errorEventDelete: 'Erreur lors de la suppression de l\'événement',
    errorMissingEventId: 'Aucun événement sélectionné ou identifiant de l\'événement manquant',
    successEventDelete: 'Événement supprimé avec succès',
    successEventUpdate: 'Événement mis à jour avec succès',
    selectEventToModify: 'Sélectionnez un événement à modifier ou à supprimer.',
    confirmDelete: 'Êtes-vous sûr de vouloir supprimer cet événement ? Cette action ne peut pas être annulée.',
    updateEvent: 'Mettre à jour l\'événement',
    deleteEvent: 'Supprimer l\'événement',
    successMessage: 'Action réalisée avec succès',

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
      label={`${event.titel} - ${moment(event.start).format('HH:mm')} à ${moment(event.end).format('HH:mm')}`}
      aria-label="Event Tooltip"
      hasArrow
      overflowWrap="anywhere"
      whiteSpace="pre-line"
    >
      <div style={eventStyleGetter(event).style}>
        <div style={{ color: 'black', fontWeight: 'bold', fontSize: '10px' }}>
          {event.titel}
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
                Emploi du temps des équipes
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
              resources={teams}
              resourceIdAccessor="id"
              resourceTitleAccessor="titel"
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
                      <Select value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)}>
                        {teams.map((team) => (
                          <option key={team.id} value={team.id}>
                            {team.titel}
                          </option>
                        ))}
                      </Select>
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

export default TeamScheduleByMySelf;