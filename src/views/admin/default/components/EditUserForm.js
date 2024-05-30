import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { FaTrash } from 'react-icons/fa';
import { FcCameraAddon } from "react-icons/fc";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Box,
  VStack,
  HStack,
  Checkbox,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  Avatar,
  Modal,
  ModalOverlay,
  ModalFooter,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalCloseButton,
  Flex,
  Center,
  Text,
  StackDivider,
  Badge,
  Grid,
  GridItem,
  Tooltip
} from '@chakra-ui/react';
import { PhoneIcon, EmailIcon } from '@chakra-ui/icons';
import { supabase } from './../../../../supabaseClient';
import TeamScheduleByMySelfUnique from 'views/admin/TableauDeBord/components/TeamScheduleByMySelfUnique';
import AfficherMaterielsUnique from './AfficherMaterielsUnique';

const EditUserForm = ({ teamData, onSave, onDelete, onClose }) => {
  const [nameOfTheTeam, setNameOfTheTeam] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [lat, setLat] = useState(45.75799485263588);
  const [lng, setLng] = useState(4.825754111294844);
  const [mission, setMission] = useState('');
  const [typeDeVehicule, setTypeDeVehicule] = useState('');
  const [immatriculation, setImmatriculation] = useState('');
  const [specialite, setSpecialite] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState('');
  const [isEditingProfilePhoto, setIsEditingProfilePhoto] = useState(false);
  const [showDeleteSuccessAlert, setShowDeleteSuccessAlert] = useState(false);
  const [showDeleteWarningAlert, setShowDeleteWarningAlert] = useState(false);
  const [teamMembers, setTeamMembers] = useState([{
    id: uuidv4(),
    familyname: '',
    firstname: '',
    mail: '',
    phone: '',
    isLeader: false,
  }]);
  const [leaderName, setLeaderName] = useState({ firstname: '', familyname: '', phone: '', mail: '' });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setProfilePhoto(selectedFile);
    }
  };

  const handleTeamMemberChange = (index, event) => {
    let values = [...teamMembers];

    if (event.target.name === 'isLeader') {
      values = values.map((member) => ({ ...member, isLeader: false }));
      values[index][event.target.name] = event.target.checked;
    } else {
      values[index][event.target.name] = event.target.value;
    }

    setTeamMembers(values);
    updateLeaderName(values);
  };

  const updateLeaderName = (members) => {
    const leader = members.find(member => member.isLeader);
    if (leader) {
      setLeaderName({ firstname: leader.firstname, familyname: leader.familyname, phone: leader.phone, mail: leader.mail });
    } else {
      setLeaderName({ firstname: '', familyname: '', phone: '', mail: '' });
    }
  };

  const handleModifyAndPushData = async () => {
    const updatedTeamData = {
      name_of_the_team: nameOfTheTeam,
      latitude: lat,
      longitude: lng,
      mission: mission,
      type_de_vehicule: typeDeVehicule,
      immatriculation: immatriculation,
      specialite: specialite,
      team_members: teamMembers,
      photo_profile_url: profilePhotoUrl,
    };

    try {
      const { error } = await supabase
        .from('vianney_teams')
        .update(updatedTeamData)
        .eq('id', teamData.id);

      if (error) {
        console.error('Error updating data:', error);
      } else {
        setShowSuccessAlert(true);
      }
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const handleAddTeamMember = () => {
    setTeamMembers([...teamMembers, {
      id: uuidv4(),
      familyname: '',
      firstname: '',
      mail: '',
      phone: '',
      isLeader: false,
    }]);
  };

  const LocationMarker = () => {
    const map = useMapEvents({
      click(e) {
        setLat(e.latlng.lat);
        setLng(e.latlng.lng);
        map.flyTo(e.latlng, map.getZoom());
      },
    });

    return lat !== 0 ? (
      <Marker position={[lat, lng]}></Marker>
    ) : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedTeamData = {
      name_of_the_team: nameOfTheTeam,
      latitude: lat,
      longitude: lng,
      mission: mission,
      type_de_vehicule: typeDeVehicule,
      immatriculation: immatriculation,
      specialite: specialite,
      team_members: teamMembers,
    };

    onSave(updatedTeamData);
  };

  const handleSaveProfilePhoto = async () => {
    try {
      if (profilePhoto) {
        const formData = new FormData();
        formData.append('file', profilePhoto);
        const fileName = `${teamData.id}-${profilePhoto.name}`;
        const { error: uploadError } = await supabase.storage
          .from('users_on_the_ground')
          .upload(fileName, profilePhoto);

        if (uploadError) {
          console.error('Error uploading file:', uploadError);
        }

        const publicURL = `https://hvjzemvfstwwhhahecwu.supabase.co/storage/v1/object/public/users_on_the_ground/${fileName}`;

        const { error: updateError } = await supabase
          .from('vianney_teams')
          .update({ photo_profile_url: publicURL })
          .eq('id', teamData.id);

        if (updateError) {
          console.error('Error updating profile photo URL in the database:', updateError);
        }

        setProfilePhotoUrl(publicURL);
        setIsEditingProfilePhoto(false);
        setShowSuccessAlert(true);
      }
    } catch (error) {
      console.error('Error handling profile photo:', error);
    }
  };

  useEffect(() => {
    if (teamData) {
      setNameOfTheTeam(teamData.name_of_the_team || '');
      setLat(teamData.latitude || 0);
      setLng(teamData.longitude || 0);
      setMission(teamData.mission || '');
      setTypeDeVehicule(teamData.type_de_vehicule || '');
      setImmatriculation(teamData.immatriculation || '');
      setSpecialite(teamData.specialite || '');
      setProfilePhotoUrl(teamData.photo_profile_url || '');
      setTeamMembers(teamData.team_members || []);
      updateLeaderName(teamData.team_members || []);
    }
  }, [teamData]);

  const handleDeleteTeam = async () => {
    try {
      const { error } = await supabase
        .from('vianney_teams')
        .delete()
        .eq('id', teamData.id);

      if (error) {
        console.error('Error deleting team:', error);
      } else {
        setShowDeleteSuccessAlert(true);
        onDelete();
      }
    } catch (error) {
      console.error('Error deleting team:', error);
    }
  };

  const handleDeleteTeamMember = (index) => {
    const updatedTeamMembers = [...teamMembers];
    updatedTeamMembers.splice(index, 1);
    setTeamMembers(updatedTeamMembers);
    updateLeaderName(updatedTeamMembers);

    setShowDeleteWarningAlert(true);
  };

  return (
    <Modal isOpen onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Modifier l'équipe</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <Grid
              templateAreas={`"header header"
                        "missions team"
                        "materials timeline"`}
              gridTemplateRows={isEditingProfilePhoto ? '200px 1fr 1fr' : '50px 1fr 1fr'}
              gridTemplateColumns={'1fr 1fr'}
              h='600px'
              gap='4'
              color='black'
              fontWeight='bold'
            >
              <GridItem area={'header'}>
                <Flex justifyContent='space-between' alignItems='center' bg='yellow.100' p='2'>
                  <HStack>
                    {profilePhotoUrl && <Avatar size="md" name="Profile Photo" src={profilePhotoUrl} />}
                    <Text>Nom/Prénom CE: {leaderName.firstname} {leaderName.familyname}</Text>
                  </HStack>
                  <Tooltip label="Changer la photo" aria-label="Changer la photo">
                    <Button ml={1} colorScheme="blue" onClick={() => setIsEditingProfilePhoto(true)}>
                      <FcCameraAddon size={20} />
                    </Button>
                  </Tooltip>
                  <Badge>{specialite}</Badge>
                  <HStack>
                    <PhoneIcon />
                    <Text>{leaderName.phone}</Text>
                  </HStack>
                  <HStack>
                    <EmailIcon />
                    <Text>{leaderName.mail}</Text>
                  </HStack>
                </Flex>
                {isEditingProfilePhoto && (
                  <FormControl mt={4}>
                    <FormLabel htmlFor='new-profile-photo'>Nouvelle Photo de Profil</FormLabel>
                    <Input id='new-profile-photo' type="file" onChange={handleFileChange} />
                    <Button colorScheme="blue" onClick={handleSaveProfilePhoto}>Enregistrer la nouvelle photo</Button>
                  </FormControl>
                )}
              </GridItem>

              <GridItem area={'missions'} bg='orange.100' p='2'>
                <VStack alignItems='flex-start' spacing='4' divider={<StackDivider borderColor='gray.200' />}>
                  <Text>Missions:</Text>
                  <Input 
                    value={mission} 
                    onChange={(e) => setMission(e.target.value)} 
                    placeholder="Missions de l'équipe" 
                  />
                </VStack>
              </GridItem>

              <GridItem area={'team'} bg='teal.100' p='2'>
                <VStack alignItems='flex-start' spacing='4'>
                  <Text>Membres équipe:</Text>
                  {teamMembers.map((teamMember, index) => (
                    <HStack key={teamMember.id} spacing={2}>
                      <Input
                        type="text"
                        name="familyname"
                        placeholder="Nom de famille"
                        value={teamMember.familyname}
                        onChange={(e) => handleTeamMemberChange(index, e)}
                      />
                      <Input
                        type="text"
                        name="firstname"
                        placeholder="Prénom"
                        value={teamMember.firstname}
                        onChange={(e) => handleTeamMemberChange(index, e)}
                      />
                      <Input
                        type="text"
                        name="mail"
                        placeholder="Email"
                        value={teamMember.mail}
                        onChange={(e) => handleTeamMemberChange(index, e)}
                      />
                      <Input
                        type="text"
                        name="phone"
                        placeholder="Téléphone"
                        value={teamMember.phone}
                        onChange={(e) => handleTeamMemberChange(index, e)}
                      />
                      <Checkbox
                        name="isLeader"
                        isChecked={teamMember.isLeader}
                        onChange={(e) => handleTeamMemberChange(index, e)}
                      >
                        Leader ?
                      </Checkbox>
                      <Flex align="center" justify="center">
                        <Button
                          size="sm"
                          colorScheme="red"
                          onClick={() => handleDeleteTeamMember(index)}
                        >
                          <Center>
                            <FaTrash />
                          </Center>
                        </Button>
                      </Flex>
                    </HStack>
                  ))}
                </VStack>
              </GridItem>

              <GridItem area={'materials'} bg='blue.100' p='2'>
                <VStack alignItems='flex-start' spacing='4'>
                  <Text>Matériel:</Text>
                  <AfficherMaterielsUnique selectedTeamId={teamData?.id} />
                </VStack>
              </GridItem>

              <GridItem area={'timeline'} bg='purple.100' p='2'>
                <VStack alignItems='flex-start' spacing='4'>
                  <Text>Emploi du temps équipe:</Text>
                  <TeamScheduleByMySelfUnique selectedTeamId={teamData?.id} />
                </VStack>
              </GridItem>
            </Grid>
            <Box id="mapId" h="400px" w="100%">
              <MapContainer center={[lat, lng]} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationMarker />
              </MapContainer>
            </Box>

            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel htmlFor="team-name">Nom de l'équipe</FormLabel>
                <Input id="team-name" type="text" placeholder="Nom de l'équipe" value={nameOfTheTeam} onChange={(e) => setNameOfTheTeam(e.target.value)} />
              </FormControl>

              <FormControl>
                <FormLabel htmlFor="photo-profile-url">Photo Profile URL</FormLabel>
                <Input id="photo-profile-url" type="text" placeholder="Photo Profile URL" value={profilePhotoUrl} onChange={(e) => setProfilePhotoUrl(e.target.value)} />
              </FormControl>
              {profilePhotoUrl && (
                <Box>
                  <Avatar size="md" name="Profile Photo" src={profilePhotoUrl} />
                  <Tooltip label="Changer la photo" aria-label="Changer la photo">
                    <Button ml={1} colorScheme="blue" onClick={() => setIsEditingProfilePhoto(true)}>
                      <FcCameraAddon size={20} />
                    </Button>
                  </Tooltip>
                </Box>
              )}

              {isEditingProfilePhoto && (
                <FormControl>
                  <FormLabel htmlFor='new-profile-photo'>Nouvelle Photo de Profil</FormLabel>
                  <Input id='new-profile-photo' type="file" onChange={handleFileChange} />
                  <Button colorScheme="blue" onClick={handleSaveProfilePhoto}>Enregistrer la nouvelle photo</Button>
                </FormControl>
              )}

              <FormControl>
                <FormLabel htmlFor='mission'>Mission</FormLabel>
                <Input
                  id='mission'
                  type="text"
                  value={mission}
                  onChange={(e) => setMission(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor='typeDeVehicule'>Type de Véhicule</FormLabel>
                <Input
                  id='typeDeVehicule'
                  type="text"
                  value={typeDeVehicule}
                  onChange={(e) => setTypeDeVehicule(e.target.value)}
                />
              </FormControl>

              <FormControl>
                <FormLabel htmlFor='immatriculation'>Immatriculation</FormLabel>
                <Input
                  id='immatriculation'
                  type="text"
                  value={immatriculation}
                  onChange={(e) => setImmatriculation(e.target.value)}
                />
              </FormControl>

              <FormControl>
                <FormLabel htmlFor='specialite'>Spécialité</FormLabel>
                <Input
                  id='specialite'
                  type="text"
                  value={specialite}
                  onChange={(e) => setSpecialite(e.target.value)}
                />
              </FormControl>

              {teamMembers.map((teamMember, index) => (
                <HStack key={teamMember.id} spacing={2}>
                  <Input
                    type="text"
                    name="familyname"
                    placeholder="Nom de famille"
                    value={teamMember.familyname}
                    onChange={(e) => handleTeamMemberChange(index, e)}
                  />
                  <Input
                    type="text"
                    name="firstname"
                    placeholder="Prénom"
                    value={teamMember.firstname}
                    onChange={(e) => handleTeamMemberChange(index, e)}
                  />
                  <Input
                    type="text"
                    name="mail"
                    placeholder="Email"
                    value={teamMember.mail}
                    onChange={(e) => handleTeamMemberChange(index, e)}
                  />
                  <Input
                    type="text"
                    name="phone"
                    placeholder="Téléphone"
                    value={teamMember.phone}
                    onChange={(e) => handleTeamMemberChange(index, e)}
                  />
                  <Checkbox
                    name="isLeader"
                    isChecked={teamMember.isLeader}
                    onChange={(e) => handleTeamMemberChange(index, e)}
                  >
                    Leader ?
                  </Checkbox>
                  <Flex align="center" justify="center">
                    <Button
                      size="sm"
                      colorScheme="red"
                      onClick={() => handleDeleteTeamMember(index)}
                    >
                      <Center>
                        <FaTrash />
                      </Center>
                    </Button>
                  </Flex>
                </HStack>
              ))}
              {showDeleteWarningAlert && (
                <Alert status="warning" mt={4}>
                  <AlertIcon />
                  Attention de bien cliquer sur "Modifier" pour enregistrer vos changements.
                </Alert>
              )}
              {showSuccessAlert && (
                <Alert status="success" variant="subtle" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" mt={4}>
                  <AlertIcon boxSize="40px" mr={0} />
                  <AlertTitle mt={4} mb={1} fontSize="lg">
                    Equipe modifiée avec succès.
                  </AlertTitle>
                  <AlertDescription maxWidth="sm">
                    ⚠️ Penser à recharger la page
                  </AlertDescription>
                  <CloseButton position="absolute" right="8px" top="8px" onClick={() => setShowSuccessAlert(false)} />
                </Alert>
              )}
              <Button colorScheme="blue" onClick={handleAddTeamMember}>Ajouter un membre de l'équipe</Button>
            </VStack>
          </form>
          {showDeleteSuccessAlert && (
            <Alert status="success" mt={4}>
              <AlertIcon />
              Equipe supprimée avec succès
            </Alert>
          )}
          <Box mt={4}>
            <TeamScheduleByMySelfUnique selectedTeamId={teamData?.id} />
          </Box>
          <Box mt={4}>
            <AfficherMaterielsUnique selectedTeamId={teamData?.id} />
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button mr={1} colorScheme="red" onClick={handleDeleteTeam}>Supprimer</Button>
          <Button mr={1} colorScheme="blue" onClick={onClose}>Fermer</Button>
          <Button mr={1} colorScheme="green" onClick={handleModifyAndPushData}>Modifier</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditUserForm;
