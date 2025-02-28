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
  Flex,
} from "@chakra-ui/react";
import { FcPlus } from "react-icons/fc";
import { FiTrash2, FiEdit } from "react-icons/fi";
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
  const [teamToDelete, setTeamToDelete] = useState(null);
  const { selectedEventId } = useEvent();
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const [showEvents, setShowEvents] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [password, setPassword] = useState("");
  const toast = useToast();

  // Fonction de tri personnalisée
  const customSort = (a, b) => {
    const regex = /(\D+)(\d+)/;
    const matchA = a.name_of_the_team.match(regex);
    const matchB = b.name_of_the_team.match(regex);

    if (matchA && matchB) {
      const textA = matchA[1].toLowerCase();
      const textB = matchB[1].toLowerCase();
      const numA = parseInt(matchA[2], 10);
      const numB = parseInt(matchB[2], 10);

      if (textA < textB) return -1;
      if (textA > textB) return 1;
      return numA - numB;
    }

    return a.name_of_the_team.localeCompare(b.name_of_the_team);
  };

  const handleSaveTeam = async (updatedTeamData) => {
    try {
      // Mettre à jour l'équipe dans la base de données
      const { error } = await supabase
        .from('vianney_teams')
        .update(updatedTeamData)
        .eq('id', updatedTeamData.id);

      if (error) {
        throw new Error('Erreur lors de la mise à jour de l\'équipe.');
      }

      // Rafraîchir la liste des équipes
      await fetchTeamsForEvent();

      // Fermer le modal
      setEditingTeam(null);
      setShowEditUserFormModal(false);

      // Afficher une notification de succès
      toast({
        title: "Succès",
        description: "L'équipe a été mise à jour avec succès.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'équipe :', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour l'équipe.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
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
        // Trier les équipes avec la fonction personnalisée
        const sortedTeams = teamsForEvent.sort(customSort);
        setTeams(sortedTeams);
      }
    } catch (error) {
      console.error('Error fetching teams for the event:', error);
    }
  }, [selectedEventId]);

  const deleteTeam = async (teamId) => {
    try {
      // Supprimer les dépendances dans vianney_sos_alerts
      const { error: alertsError } = await supabase
        .from('vianney_sos_alerts')
        .delete()
        .eq('team_id', teamId);

      if (alertsError) {
        console.error('Erreur lors de la suppression des alertes associées :', alertsError);
        throw new Error('Impossible de supprimer les alertes associées.');
      }

      // Supprimer les dépendances dans vianney_actions
      const { error: actionsError } = await supabase
        .from('vianney_actions')
        .delete()
        .eq('team_to_which_its_attached', teamId);

      if (actionsError) {
        console.error('Erreur lors de la suppression des actions associées :', actionsError);
        throw new Error('Impossible de supprimer les actions associées. Vérifiez les dépendances.');
      }

      // Supprimer l'équipe dans vianney_teams
      const { error: teamError } = await supabase
        .from('vianney_teams')
        .delete()
        .eq('id', teamId);

      if (teamError) {
        console.error('Erreur lors de la suppression de l\'équipe :', teamError);
        throw new Error('Impossible de supprimer l\'équipe.');
      }

      // Mettre à jour l'état local
      setTeams((prevTeams) => prevTeams.filter((team) => team.id !== teamId));
      setShowDeleteTeamModal(false);
      setTeamToDelete(null);

      // Afficher une notification de succès
      toast({
        title: "Succès",
        description: "L'équipe et ses dépendances ont été supprimées avec succès.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'équipe :', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer l'équipe.",
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
                p={4}
                boxShadow="md"
                borderRadius="md"
                onClick={() => {
                  setEditingTeam(team);
                  setShowEditUserFormModal(true);
                }}
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
                {/* Actions spécifiques (Édition/Suppression) */}
                <Flex mt={4} justifyContent="space-between" onClick={(e) => e.stopPropagation()}>
                  <Button
                    size="sm"
                    colorScheme="blue"
                    leftIcon={<FiEdit />}
                    onClick={() => {
                      setEditingTeam(team);
                      setShowEditUserFormModal(true);
                    }}
                  >
                    
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="red"
                    leftIcon={<FiTrash2 />}
                    onClick={() => {
                      setTeamToDelete(team);
                      setShowDeleteTeamModal(true);
                    }}
                  >
                    
                  </Button>
                </Flex>
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