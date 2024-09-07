import React, { useState, useEffect, useCallback } from 'react';
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
import { FcPlus } from "react-icons/fc";
import MiniStatistics from "components/card/MiniStatistics";
import TeamStatistics from "components/card/TeamStatistics";
import AddEventForm from "./components/AddEventForm";
import EditEventForm from "./components/EditEventForm";
import TableTopCreators from "../carte/components/TableTopCreators";
import tableDataTopCreators from "views/admin/carte/variables/tableDataTopCreators.json";
import { tableColumnsTopCreators } from "views/admin/carte/variables/tableColumnsTopCreators";
import { useEvent } from '../../../EventContext'; // Import the useEvent hook
import Userform from '../carte/components/UserForm.js';
import { supabase } from './../../../supabaseClient';

export default function UserReports() {
  const [showAddEventForm, setShowAddEventForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showUserform] = useState(false); // State for showing Userform component
  const [showEditEventModal, setShowEditEventModal] = useState(false);
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [showEditUserFormModal, setShowEditUserFormModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [teams, setTeams] = useState([]); // Define teams state
  const { selectedEventId } = useEvent(); // Access the selectedEventId from the EventContext
  const textColor = useColorModeValue("secondaryGray.900", "white");

  const handleSaveTeam = (updatedTeamData) => {
    setEditingTeam(null);
  };

  const fetchEvents = async () => {
    let { data: vianney_event, error } = await supabase
      .from('vianney_event')
      .select('*');

    if (error) console.log('error', error);
    else setEvents(vianney_event);
  };

  const fetchTeamsForEvent = useCallback(async () => {
    try {
      const { data: teamsForEvent, error } = await supabase
        .from('vianney_teams')
        .select('*')
        .eq('event_id', selectedEventId);

      if (error) {
        console.error('Error fetching teams for the event:', error);
      } else {
        setTeams(teamsForEvent);
      }
    } catch (error) {
      console.error('Error fetching teams for the event:', error);
    }
  }, [selectedEventId]);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      fetchTeamsForEvent();
    }
  }, [selectedEventId, fetchTeamsForEvent]);

  const toggleAddEventForm = () => setShowAddEventForm(!showAddEventForm);

  const handleMiniStatisticsClick = (event) => {
    setSelectedEvent(event);
    setShowEditEventModal(true);
  };

  const handleEditTeam = (team) => {
    setEditingTeam(team);
    setShowEditUserFormModal(true);
  };

  const toggleCreateTeamModal = () => setShowCreateTeamModal(!showCreateTeamModal);

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Heading me='auto' color={textColor} fontSize='2xl' fontWeight='700' lineHeight='100%' mb="20px">
        Evènements
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3, "2xl": 6 }} gap='20px' mb='20px'>
        {events.map((event, index) => (
          <Box
            key={index}
            cursor="pointer"
            transition="background-color 0.2s"
            _hover={{ backgroundColor: "gray.100" }}
            onClick={() => handleMiniStatisticsClick(event)}
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

      {/* Display teams only if an event is selected */}
      {selectedEventId && (
        <>
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
                    team.team_members.find((member) => member.isLeader)
                      ? (
                        <Badge colorScheme="green" variant="outline">
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
        </>
      )}

      {/* Add event modal */}
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

      {/* Edit event modal */}
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

      {/* Edit team modal */}
      {editingTeam && (
        <Modal isOpen={showEditUserFormModal} onClose={() => setShowEditUserFormModal(false)}>
          <ModalOverlay />
          <EditUserForm teamData={editingTeam} onSave={handleSaveTeam} onClose={() => setShowEditUserFormModal(false)} />
        </Modal>
      )}
      <TableTopCreators
        tableData={tableDataTopCreators}
        columnsData={tableColumnsTopCreators}
      />
    </Box>
  );
}
