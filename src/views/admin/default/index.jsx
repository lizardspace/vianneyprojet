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
  Badge,
} from "@chakra-ui/react";
import EditUserForm from './components/EditUserForm';
//import MiniCalendar from "components/calendar/MiniCalendar";
import { FcPlus } from "react-icons/fc";
import MiniStatistics from "components/card/MiniStatistics";
import TeamStatistics from "components/card/TeamStatistics";
import AddEventForm from "./components/AddEventForm";
import EditEventForm from "./components/EditEventForm";
import DocumentationsComponent from "./DocumentionsComponent/DocumentationsComponent";
import TableTopCreators from "../carte/components/TableTopCreators";
import tableDataTopCreators from "views/admin/carte/variables/tableDataTopCreators.json";
import { tableColumnsTopCreators } from "views/admin/carte/variables/tableColumnsTopCreators";
import { useEvent } from '../../../EventContext'; // Import the useEvent hook

// Import the Userform component
import Userform from '../carte/components/UserForm.js';

import { supabase } from './../../../supabaseClient';

export default function UserReports() {
  const [showAddEventForm, setShowAddEventForm] = useState(false);
  const [showAddEvent] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showUserform] = useState(false); // State for showing Userform component
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const [events, setEvents] = useState([]);
  const [teams, setTeams] = useState([]); // Define teams state
  const [showEditEventModal, setShowEditEventModal] = useState(false);
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [showEditUserFormModal, setShowEditUserFormModal] = useState(false);
  const { selectedEventId } = useEvent(); // Access the selectedEventId from the EventContext

  const handleEditTeam = (team) => {
    setEditingTeam(team);
    setShowEditUserFormModal(true); // Open the edit modal here
  };

  const handleSaveTeam = (updatedTeamData) => {
    // Perform the update operation with updatedTeamData
    // Close the edit modal
    // Refresh teams data, if necessary
    setEditingTeam(null);
  };

  const toggleCreateTeamModal = () => setShowCreateTeamModal(!showCreateTeamModal);

  const fetchEvents = async () => {
    let { data: vianney_event, error } = await supabase
      .from('vianney_event')
      .select('*');

    if (error) console.log('error', error);
    else setEvents(vianney_event);
  };

  const fetchTeams = async () => {
    try {
      const { data: vianney_teams, error } = await supabase
        .from('vianney_teams')
        .select('*');

      if (error) {
        console.log('Error fetching teams:', error);
      } else {
        // Sort teams by name in alphabetical order
        const sortedTeams = vianney_teams.sort((a, b) => a.name_of_the_team.localeCompare(b.name_of_the_team));
        setTeams(sortedTeams);
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  useEffect(() => {
    // Call fetchEvents when the component mounts
    fetchEvents();
    // Call fetchTeams when the component mounts
    fetchTeams();
  }, []);

  useEffect(() => {
    // Fetch teams related to the selected event
    const fetchTeamsForEvent = async () => {
      try {
        const { data: teamsForEvent, error } = await supabase
          .from('vianney_teams')
          .select('*')
          .eq('event_id', selectedEventId); // Filter teams by selected event_id

        if (error) {
          console.error('Error fetching teams for the event:', error);
        } else {
          setTeams(teamsForEvent);
        }
      } catch (error) {
        console.error('Error fetching teams for the event:', error);
      }
    };

    if (selectedEventId) {
      fetchTeamsForEvent();
    }
  }, [selectedEventId]);

  const toggleAddEventForm = () => setShowAddEventForm(!showAddEventForm);

  const handleMiniStatisticsClick = (event) => {
    setSelectedEvent(event);
    setShowEditEventModal(true);
  };

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      {showAddEvent && (
        <Box>
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
        </Box>
      )}
      <Heading me='auto' color={textColor} fontSize='2xl' fontWeight='700' lineHeight='100%' mb="20px">
        Equipes
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3, "2xl": 6 }} gap='20px' mb='20px'>
        {teams.map((team, index) => (
          <Box
            key={index}
            cursor="pointer"
            transition="background-color 0.2s"
            _hover={{ backgroundColor: "gray.100" }}
            onClick={() => handleEditTeam(team)}
          >
            <TeamStatistics
              teamName={team.name_of_the_team}
              teamColor={team.color}
              teamSpeciality={team.specialite}
              teamLeader={
                // Find the leader in the team members array and extract their info
                team.team_members.find((member) => member.isLeader)
                  ? (
                    <Badge
                      colorScheme="green" // You can customize the color scheme
                      variant="outline"
                    >
                      {`${team.team_members.find((member) => member.isLeader).firstname} ${team.team_members.find((member) => member.isLeader).familyname}`}
                    </Badge>
                  )
                  : "N/A"
              }
              teamMembersCount={team.team_members.length}
            />
          </Box>
        ))}
        <Button
          mt="30px"
          onClick={toggleCreateTeamModal}
          leftIcon={<Icon as={FcPlus} />}
          colorScheme='blue'
          variant='solid'
          size='md'
          boxShadow='sm'
          _hover={{ boxShadow: 'md' }}
          _active={{ boxShadow: 'lg' }}>
          Créer une équipe
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
            {/* ... */}
          </ModalContent>
        </Modal>
      )}
      {showUserform && (
        <Userform />
      )}
      {showCreateTeamModal && (
        <Modal isOpen={showCreateTeamModal} onClose={() => setShowCreateTeamModal(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Créer une équipe</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Userform />
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={() => setShowCreateTeamModal(false)}>Fermer</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
      {editingTeam && (
        <Modal isOpen={showEditUserFormModal} onClose={() => setShowEditUserFormModal(false)}>
          <ModalOverlay />
          <EditUserForm teamData={editingTeam} onSave={handleSaveTeam} onClose={() => setShowEditUserFormModal(false)} />
        </Modal>
      )}
      <DocumentationsComponent eventId={selectedEventId} />
      <TableTopCreators
        tableData={tableDataTopCreators}
        columnsData={tableColumnsTopCreators}
      />
    </Box>
  );
}
