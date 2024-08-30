import React, { useEffect, useState } from 'react';
import {
  Table,
  Flex,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useColorModeValue,
  Avatar,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Box,
  Text,
  Stack,
  Heading,
  Image,
  Badge,
  Tooltip,
  Button,
  InputGroup,
  Input,
  InputRightElement,
  useToast,
} from '@chakra-ui/react';
import { FcPhone } from "react-icons/fc";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { MdPlace } from "react-icons/md";
import { renderToString } from "react-dom/server";
import { useEvent } from '../../../../EventContext';

// Initialize Supabase client
import { supabase } from './../../../../supabaseClient';

const EquipiersTable = ({ showAll }) => {
  const [equipiers, setEquipiers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEquipier, setSelectedEquipier] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [newPassword, setNewPassword] = useState(""); // State to hold the new password
  const { selectedEventId } = useEvent();
  const toast = useToast();

  const onRowClick = (equipier) => {
    setSelectedEquipier(equipier);
    setNewPassword(equipier.password); // Initialize with current password
    setIsModalOpen(true);
  };

  const headerStyle = {
    fontSize: '16px',
    fontWeight: 'bold',
    color: useColorModeValue('gray.600', 'gray.200'),
  };
  const headerGradientStyle = {
    background: 'linear-gradient(to right, #ff914d, #ff7730)',
    color: 'white',
    textTransform: 'none',
    fontSize: '16px',
    fontWeight: 'bold',
  };

  const tableRowStyle = {
    borderBottom: '1px solid',
    borderBottomColor: useColorModeValue('gray.200', 'gray.600'),
  };

  const avatarStyle = {
    border: '2px solid',
    borderColor: useColorModeValue('gray.300', 'gray.500'),
  };

  useEffect(() => {
    const mapId = `map-${selectedEquipier?.id}`;

    if (isModalOpen && equipiers.length > 0 && selectedEquipier?.latitude && selectedEquipier?.longitude) {
      requestAnimationFrame(() => {
        const mapContainer = document.getElementById(mapId);

        if (mapContainer && !mapContainer._leaflet_map) {
          const map = L.map(mapId).setView(
            [selectedEquipier.latitude, selectedEquipier.longitude],
            13
          );
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

          mapContainer._leaflet_map = map;

          equipiers.forEach((team) => {
            if (team.latitude && team.longitude) {
              const iconColor = team.id === selectedEquipier.id ? 'blue' : 'red';
              const icon = createCustomIcon(iconColor, team.name_of_the_team);
              const marker = L.marker([team.latitude, team.longitude], { icon }).addTo(map);

              marker.bindTooltip(team.name_of_the_team, { permanent: false, direction: 'top' });
            }
          });
        }
      });
    }

    return () => {
      // Optional cleanup if needed
    };
  }, [selectedEquipier, isModalOpen, equipiers]);

  useEffect(() => {
    const fetchEquipiers = async () => {
      try {
        const now = new Date().toISOString();

        let { data: teams, error: teamsError } = await supabase
          .from('vianney_teams')
          .select(`
            *,
            vianney_actions (
              id,
              action_name,
              starting_date,
              ending_date,
              action_comment,
              last_updated
            )
          `)
          .eq('event_id', selectedEventId) // Filter by the selected event
          .order('name_of_the_team', { ascending: true });

        if (teamsError) {
          console.error('Error fetching equipiers:', teamsError);
          return;
        }

        // Filter actions for each team to only include those happening now
        const teamsWithCurrentActions = teams.map((team) => ({
          ...team,
          vianney_actions: team.vianney_actions.filter((action) => {
            const start = new Date(action.starting_date).getTime();
            const end = new Date(action.ending_date).getTime();
            const currentTime = new Date(now).getTime();
            return currentTime >= start && currentTime <= end;
          }),
        }));

        // Sort teams to move those with current actions to the top
        const sortedTeams = teamsWithCurrentActions.sort((a, b) => {
          return b.vianney_actions.length - a.vianney_actions.length;
        });

        setEquipiers(sortedTeams);
      } catch (error) {
        console.error('Error fetching equipiers:', error);
      }
    };

    fetchEquipiers();
  }, [selectedEventId]);

  const getLeaderNameAndPhone = (teamMembers) => {
    const leader = teamMembers.find((member) => member.isLeader);
    if (!leader) {
      return 'No Leader';
    }
    return (
      <Flex align="center">
        <Text color="blue.500" mr={1}>
          {leader.firstname}
        </Text>
        <Text fontWeight="bold" color="blue.900" mr={2}>
          {leader.familyname}
        </Text>
        {leader.phone && (
          <Flex align="center">
            <FcPhone />
            <Text as="span" fontWeight="bold" ml={1}>
              {leader.phone}
            </Text>
          </Flex>
        )}
      </Flex>
    );
  };

  const createCustomIcon = (color = 'red', teamName) => {
    const iconHtml = renderToString(<MdPlace style={{ fontSize: '24px', color }} />);
    return L.divIcon({
      html: iconHtml,
      className: 'custom-leaflet-icon',
      iconSize: L.point(30, 30),
      iconAnchor: [15, 30],
      popupAnchor: [0, -30],
    });
  };

  // Function to validate the password
  const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSavePassword = async () => {
    if (!selectedEquipier) return;

    if (!isValidPassword(newPassword)) {
      toast({
        title: 'Mot de passe invalide',
        description: "Le mot de passe doit comporter au moins 8 caractères, avec des majuscules, des minuscules, des chiffres et des caractères spéciaux.",
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      // eslint-disable-next-line
      const { data, error } = await supabase
        .from('vianney_teams')
        .update({ password: newPassword })
        .eq('id', selectedEquipier.id);

      if (error) {
        throw error;
      }

      toast({
        title: 'Mot de passe mis à jour.',
        description: "Le mot de passe de l'équipe a été mis à jour avec succès.",
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      setSelectedEquipier({ ...selectedEquipier, password: newPassword });
    } catch (error) {
      console.error('Error updating password:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la mise à jour du mot de passe.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const renderTeamDetails = () => {
    if (!selectedEquipier) return null;

    const {
      name_of_the_team,
      status,
      last_active,
      type_d_equipe,
      numero_d_equipier,
      specialite,
      role_de_l_equipier,
      numero_de_telephone,
      mail,
      type_de_vehicule,
      immatriculation,
      photo_profile_url,
      latitude,
      longitude,
      team_members,
      // eslint-disable-next-line
      password,
    } = selectedEquipier;

    const teamMembersList = team_members?.map((member) => (
      <li key={member.id}>
        <Flex align="center">
          {`${member.firstname} ${member.familyname}`}
          {member.phone && (
            <Flex align="center" ml={2}>
              <FcPhone />
              <Text as="span" fontWeight="bold" ml={1}>
                {member.phone}
              </Text>
            </Flex>
          )}
        </Flex>
      </li>
    ));

    return (
      <Stack spacing={4} p={5} align="start">
        {photo_profile_url && (
          <Image borderRadius="full" boxSize="100px" src={photo_profile_url} alt="l'équipe" />
        )}
        <Heading size="md">{name_of_the_team}</Heading>
        <Text>
          <strong>Statut :</strong>{' '}
          <Badge colorScheme={status ? 'green' : 'red'}>{status ? 'Actif' : 'Inactif'}</Badge>
        </Text>
        <Text>
          <strong>Dernière activité :</strong> {new Date(last_active).toLocaleDateString('fr-FR')}
        </Text>
        <Text>
          <strong>Type d'équipe :</strong> {type_d_equipe}
        </Text>
        <Text>
          <strong>Numéro de membre :</strong> {numero_d_equipier}
        </Text>
        <Text>
          <strong>Spécialité :</strong> {specialite}
        </Text>
        <Text>
          <strong>Rôle :</strong> {role_de_l_equipier}
        </Text>
        <Text>
          <strong>Numéro de téléphone :</strong> {numero_de_telephone}
        </Text>
        <Text>
          <strong>Email :</strong> {mail}
        </Text>
        <Text>
          <strong>Type de véhicule :</strong> {type_de_vehicule}
        </Text>
        <Text>
          <strong>Numéro d'immatriculation :</strong> {immatriculation}
        </Text>
        {latitude && longitude ? (
          <Text>
            <strong>Localisation :</strong> Latitude: {latitude}, Longitude: {longitude}
          </Text>
        ) : (
          <Text>
            <strong>Localisation :</strong> Non disponible
          </Text>
        )}
        <Heading size="sm">Membres de l'équipe :</Heading>
        <ul>{teamMembersList}</ul>
        <Heading size="sm">Modifier le mot de passe :</Heading>
        <InputGroup>
          <Input
            type={showPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)} // Update newPassword state
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? 'Cacher' : 'Voir'}
            </Button>
          </InputRightElement>
        </InputGroup>
        <Button mt={4} colorScheme="blue" onClick={handleSavePassword}>
          Sauvegarder
        </Button>
        <Box id={`map-${selectedEquipier?.id}`} h="500px" w="100%" mt={4} />
      </Stack>
    );
  };

  const hoverStyle = {
    bg: useColorModeValue('gray.100', 'gray.700'),
    cursor: 'pointer',
  };

  const TableRow = ({ equipier, onClick }) => (
    <Tr _hover={hoverStyle} onClick={() => onClick(equipier)} style={tableRowStyle}>
      <Td>
        <Avatar size="md" src={equipier.photo_profile_url} style={avatarStyle} />
      </Td>
      <Td>
        <Text>{equipier.name_of_the_team}</Text>
      </Td>
      <Td>{getLeaderNameAndPhone(equipier.team_members)}</Td>
      <Td>{equipier.mission}</Td>
      <Td>
        {equipier.vianney_actions.length > 0 ? (
          equipier.vianney_actions.map((action) => (
            <Tooltip
              key={action.id}
              label={
                <Box>
                  <Text>
                    <strong>Nom :</strong> {action.action_name}
                  </Text>
                  <Text>
                    <strong>Début :</strong> {new Date(action.starting_date).toLocaleString()}
                  </Text>
                  <Text>
                    <strong>Fin :</strong> {new Date(action.ending_date).toLocaleString()}
                  </Text>
                  <Text>
                    <strong>Commentaire :</strong> {action.action_comment || 'Aucun commentaire'}
                  </Text>
                  <Text>
                    <strong>Dernière mise à jour :</strong>{' '}
                    {new Date(action.last_updated).toLocaleString()}
                  </Text>
                </Box>
              }
              placement="top"
              hasArrow
            >
              <Badge mx={1} colorScheme="green" cursor="pointer">
                {action.action_name}
              </Badge>
            </Tooltip>
          ))
        ) : (
          <Badge colorScheme="red">Inactive</Badge>
        )}
      </Td>
    </Tr>
  );

  return (
    <>
      <TableContainer
        style={{ maxHeight: showAll ? '300px' : 'auto', overflowY: 'auto', overflowX: 'hidden' }}
      >
        <Table variant="simple">
          <Thead style={{ ...headerGradientStyle, position: 'sticky', top: 0, zIndex: 1 }}>
            <Tr>
              <Th>
                <Text style={headerStyle}>photo</Text>
              </Th>
              <Th>
                <Text style={headerStyle}>nom de l'équipe</Text>
              </Th>
              <Th>
                <Text style={headerStyle}>nom du responsable</Text>
              </Th>
              <Th>
                <Text style={headerStyle}>mission</Text>
              </Th>
              <Th>
                <Text style={headerStyle}>Actions</Text>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {equipiers.slice(0, showAll ? undefined : 3).map((equipier, index) => (
              <TableRow key={index} equipier={equipier} onClick={onRowClick} />
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="lg"
            fontWeight="bold"
            color="purple.600"
            bg="purple.100"
            p={3}
            borderRadius="md"
          >
            Détails sur l'équipe
          </ModalHeader>
          <ModalCloseButton size="lg" color="purple.600" />

          <ModalBody>
            {renderTeamDetails()}
            <Box id={`map-${selectedEquipier?.id}`} h="500px" w="100%" mt={4} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EquipiersTable;
