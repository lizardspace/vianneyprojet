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
} from '@chakra-ui/react';
import { FcPhone } from "react-icons/fc";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { MdPlace } from "react-icons/md";
import { renderToString } from "react-dom/server";
import { useEvent } from '../../../../EventContext';

// Initialize Supabase client
import { supabase } from './../../../../supabaseClient';

const EquipiersTable = ({ showAll}) => {
  const [equipiers, setEquipiers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEquipier, setSelectedEquipier] = useState(null);
  const { selectedEventId } = useEvent();

  const onRowClick = (equipier) => {
    setSelectedEquipier(equipier);
    setIsModalOpen(true);
  };

  const headerStyle = {
    fontSize: '16px',
    fontWeight: 'normal',
    color: useColorModeValue('gray.600', 'gray.200'),
  };
  const headerGradientStyle = {
    background: 'linear-gradient(to right, #6e8efb, #a777e3)',
    color: 'white',
    textTransform: 'none',
    fontSize: '18px',
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
    if (selectedEquipier && isModalOpen) {
      const mapId = `map-${selectedEquipier.id}`;

      requestAnimationFrame(() => {
        const mapContainer = document.getElementById(mapId);
        if (mapContainer && !mapContainer._leaflet) {
          const map = L.map(mapId).setView([selectedEquipier.latitude, selectedEquipier.longitude], 13);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

          equipiers.forEach(team => {
            // Use a different color for the selected team
            const icon = team.id === selectedEquipier.id ? createCustomIcon('blue') : createCustomIcon();
            L.marker([team.latitude, team.longitude], { icon }).addTo(map);
          });
        }
      });

      return () => {
        // Cleanup code
      };
    }
  }, [selectedEquipier, isModalOpen, equipiers]);

  useEffect(() => {
    const fetchEquipiers = async () => {
      try {
        let query = supabase.from('vianney_teams').select('*').order('name_of_the_team', { ascending: true }); // Order by team name in ascending order

        if (selectedEventId) {
          query = query.eq('event_id', selectedEventId);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching equipiers:', error);
          return;
        }

        setEquipiers(data);
      } catch (error) {
        console.error('Error fetching equipiers:', error);
      }
    };

    fetchEquipiers();
  }, [selectedEventId]);

  const getLeaderNameAndPhone = (teamMembers) => {
    const leader = teamMembers.find(member => member.isLeader);
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

  const createCustomIcon = (color = 'red') => {
    const iconHtml = renderToString(<MdPlace style={{ fontSize: '24px', color }} />);
    return L.divIcon({
      html: iconHtml,
      className: 'custom-leaflet-icon',
      iconSize: L.point(30, 30),
      iconAnchor: [15, 30],
      popupAnchor: [0, -30]
    });
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
    } = selectedEquipier;

    const teamMembersList = team_members?.map(member => (
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
          <Image
            borderRadius="full"
            boxSize="100px"
            src={photo_profile_url}
            alt="l'équipe"
          />
        )}
        <Heading size="md">{name_of_the_team}</Heading>
        <Text><strong>Statut :</strong> <Badge colorScheme={status ? 'green' : 'red'}>{status ? 'Actif' : 'Inactif'}</Badge></Text>
        <Text><strong>Dernière activité :</strong> {new Date(last_active).toLocaleDateString('fr-FR')}</Text>
        <Text><strong>Type d'équipe :</strong> {type_d_equipe}</Text>
        <Text><strong>Numéro de membre :</strong> {numero_d_equipier}</Text>
        <Text><strong>Spécialité :</strong> {specialite}</Text>
        <Text><strong>Rôle :</strong> {role_de_l_equipier}</Text>
        <Text><strong>Numéro de téléphone :</strong> {numero_de_telephone}</Text>
        <Text><strong>Email :</strong> {mail}</Text>
        <Text><strong>Type de véhicule :</strong> {type_de_vehicule}</Text>
        <Text><strong>Numéro d'immatriculation :</strong> {immatriculation}</Text>
        <Text><strong>Localisation :</strong> Latitude: {latitude}, Longitude: {longitude}</Text>
        <Heading size="sm">Membres de l'équipe :</Heading>
        <ul>{teamMembersList}</ul>
      </Stack>
    );
  };

  const hoverStyle = {
    bg: useColorModeValue('gray.100', 'gray.700'),
    cursor: 'pointer',
  };

  const TableRow = ({ equipier, onClick }) => (
    <Tr _hover={hoverStyle} onClick={() => onClick(equipier)} style={tableRowStyle}>
      <Td><Avatar size="md" src={equipier.photo_profile_url} style={avatarStyle} /></Td>
      <Td>{equipier.name_of_the_team}</Td>
      {/* Display leader's name and phone number */}
      <Td>
        {/* Use getLeaderNameAndPhone function */}
        <Text>
          {getLeaderNameAndPhone(equipier.team_members)}
        </Text>
      </Td>
      <Td>{equipier.mission}</Td>
    </Tr>
  );

  return (
    <>
      <TableContainer style={{ maxHeight: showAll ? '300px' : 'auto', overflowY: 'auto', overflowX: 'hidden' }}>
        <Table variant='simple'>
          <Thead style={{ ...headerGradientStyle, position: 'sticky', top: 0, zIndex: 1 }}>
            <Tr>
              <Th><Text style={headerStyle}>photo</Text></Th>
              <Th><Text style={headerStyle}>nom de l'équipe</Text></Th>
              <Th><Text style={headerStyle}>nom du responsable</Text></Th>
              <Th><Text style={headerStyle}>mission</Text></Th>
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
          <ModalCloseButton
            size="lg"
            color="purple.600"
          />

          <ModalBody>
            {renderTeamDetails()}
            <Box id={`map-${selectedEquipier?.id}`} h='500px' w='100%' mt={4} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EquipiersTable;
