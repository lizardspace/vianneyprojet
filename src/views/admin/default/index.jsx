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
  Input,
  useToast,
  Text,
} from "@chakra-ui/react";
import { FcPlus } from "react-icons/fc";
import { FiTrash2 } from "react-icons/fi"; // Import Trash Icon
import EditUserForm from './components/EditUserForm';
import MiniStatistics from "components/card/MiniStatistics";
import TeamStatistics from "components/card/TeamStatistics";
import AddEventForm from "./components/AddEventForm";
import EditEventForm from "./components/EditEventForm";
import TableTopCreators from "../carte/components/TableTopCreators";
import tableDataTopCreators from "views/admin/carte/variables/tableDataTopCreators.json";
import { tableColumnsTopCreators } from "views/admin/carte/variables/tableColumnsTopCreators";
import { useEvent } from '../../../EventContext';
import Userform from '../carte/components/UserForm.js';
import { supabase } from './../../../supabaseClient';

export default function UserReports() {
  const [showAddEventForm, setShowAddEventForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showUserform] = useState(false);
  const [showEditEventModal, setShowEditEventModal] = useState(false);
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [showEditUserFormModal, setShowEditUserFormModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [teams, setTeams] = useState([]);
  const [showDeleteTeamModal, setShowDeleteTeamModal] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState(null); // State to track the team being deleted
  const { selectedEventId } = useEvent();
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const [showEvents, setShowEvents] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [password, setPassword] = useState("");
  const toast = useToast();

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

  const deleteTeam = async (teamId) => {
    try {
      const { error } = await supabase
        .from('vianney_teams')
        .delete()
        .eq('id', teamId);
      if (error) throw error;
      setTeams((prevTeams) => prevTeams.filter((team) => team.id !== teamId));
      setShowDeleteTeamModal(false);
      setTeamToDelete(null);
      toast({
        title: "Equipe supprimée",
        description: "L'équipe a été supprimée avec succès.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting team:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'équipe.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

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

  // Handle password input
  const handlePasswordSubmit = () => {
    if (password === "123") {
      setShowEvents(true);
      toast({
        title: "Accès autorisé",
        description: "Vous avez maintenant accès aux événements.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Mot de passe incorrect",
        description: "Veuillez réessayer.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      {/* If events are not shown yet, show password prompt */}
      {!showEvents && (
        <>
          {/* Button to reveal the password form */}
          {!showPasswordForm && (
            <Button onClick={() => setShowPasswordForm(true)} colorScheme="white">      
            </Button>
          )}

          {/* Password form shown after clicking the button */}
          {showPasswordForm && (
            <Box maxW="400px" mx="auto" p={6} boxShadow="md" borderRadius="md">
              <Input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                mb={4}
              />
              <Button colorScheme="blue" onClick={handlePasswordSubmit}>
                Valider
              </Button>
            </Box>
          )}
        </>
      )}

      {showEvents && (
        <>
          {/* Button to hide events */}
          <Button onClick={() => setShowEvents(false)} mb="20px">
            Cacher les évènements
          </Button>

          {/* Event section */}
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
        </>
      )}

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
                <Button
                  size="sm"
                  colorScheme="red"
                  leftIcon={<FiTrash2 />}
                  onClick={() => {
                    setTeamToDelete(team);
                    setShowDeleteTeamModal(true);
                  }}
                  mt={2}
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

      {/* Delete team modal */}
      {showDeleteTeamModal && teamToDelete && (
        <Modal isOpen={showDeleteTeamModal} onClose={() => setShowDeleteTeamModal(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Confirmer la suppression</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>Voulez-vous vraiment supprimer l'équipe "{teamToDelete.name_of_the_team}" ?</Text>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="red" onClick={() => deleteTeam(teamToDelete.id)}>Supprimer</Button>
              <Button variant="ghost" onClick={() => setShowDeleteTeamModal(false)}>Annuler</Button>
              </ModalFooter>
          </ModalContent>
        </Modal>
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
