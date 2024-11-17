import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import L from 'leaflet';
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
  Tooltip,
  InputGroup,
  InputRightElement,
  useToast,
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
  const [currentPassword, setCurrentPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const toast = useToast(); 
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

  const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\s\S])[A-Za-z\d\s\S]{8,}$/;
    return passwordRegex.test(password);
  };

  // Function to fetch updated team data
  const fetchUpdatedTeamData = async () => {
    const { data, error } = await supabase
      .from('vianney_teams')
      .select('*')
      .eq('id', teamData.id)
      .single();
    
    if (data) {
      setNameOfTheTeam(data.name_of_the_team);
      setLat(data.latitude);
      setLng(data.longitude);
      setMission(data.mission);
      setTypeDeVehicule(data.type_de_vehicule);
      setImmatriculation(data.immatriculation);
      setSpecialite(data.specialite);
      setProfilePhotoUrl(data.photo_profile_url);
      setTeamMembers(data.team_members);
      setCurrentPassword(data.password);
    }

    if (error) {
      console.error("Error fetching updated data:", error);
    }
  };

  const handleModifyAndPushData = async () => {
    // Validate password (skip if empty)
    if (currentPassword && !isValidPassword(currentPassword)) {
      toast({
        title: "Mot de passe invalide.",
        description: "Le mot de passe doit comporter au moins 8 caractères, avec des majuscules, des minuscules, des chiffres et des caractères spéciaux.",
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "top",
      });
      return;
    }

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
      password: currentPassword, // Include the modified password
    };

    try {
      const { error } = await supabase
        .from('vianney_teams')
        .update(updatedTeamData)
        .eq('id', teamData.id);

      if (error) {
        console.error('Error updating data:', error);
      } else {
        // Show success toast
        toast({
          title: "Modification réussie",
          description: "L'équipe a été modifiée avec succès.",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top",
        });

        // Fetch updated team data and update the component's state
        await fetchUpdatedTeamData();
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
  
    const customIcon = L.divIcon({
      className: "custom-icon",
      html: `
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="red">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9 13.38 11.5 12 11.5z"/>
          <path d="M0 0h24v24H0z" fill="none"/>
        </svg>
      `,
      iconSize: [24, 24], // Keeping the size small and appropriate
      iconAnchor: [12, 24], // Centering the icon so it points correctly
    });
  
    return lat !== 0 ? (
      <Marker position={[lat, lng]} icon={customIcon}></Marker>
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
      password: currentPassword, // Include the modified password
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
      setCurrentPassword(teamData.password || '');
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
        setShowDeleteModal(false); // Close the modal after successful deletion
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
      {/* Modal content */}
      <ModalContent>
        <ModalHeader>Modifier l'équipe</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
          <Grid
              templateAreas={`"header header"
                        "missions team"
                        "materials timeline"
                        "map map"`}
              gridTemplateRows={'auto'}
              gridTemplateColumns={'1fr 1fr'}
              gap='4'
              color='black'
              fontWeight='bold'
            >
              <GridItem area={'header'}>
                <Flex justifyContent='space-between' alignItems='center' bg='yellow.100' p='2'>
                  <HStack spacing={4}>
                    {profilePhotoUrl && <Avatar size="md" name="Profile Photo" src={profilePhotoUrl} />}
                    <Input
                      id="team-name"
                      type="text"
                      placeholder="Nom de l'équipe"
                      value={nameOfTheTeam}
                      onChange={(e) => setNameOfTheTeam(e.target.value)}
                    />
                    <Text>Nom/Prénom CE: {leaderName.firstname} {leaderName.familyname}</Text>
                    <Tooltip label="Changer la photo" aria-label="Changer la photo">
                      <Button ml={1} colorScheme="blue" onClick={() => setIsEditingProfilePhoto(true)}>
                        <FcCameraAddon size={20} />
                      </Button>
                    </Tooltip>
                  </HStack>
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
                  <FormControl mt={4}>
                    <FormLabel htmlFor='current-password'>Mot de Passe</FormLabel>
                    <InputGroup>
                      <Input
                        id="current-password"
                        type={showPassword ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                      <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? 'Cacher' : 'Voir'}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>
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
                  <Button colorScheme="blue" onClick={handleAddTeamMember}>Ajouter un membre de l'équipe</Button>
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

              <GridItem area={'map'} p='2'>
                <Box id="mapId" w="100%">
                  <MapContainer center={[lat, lng]} zoom={13} scrollWheelZoom={false} style={{ height: '400px', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationMarker />
                  </MapContainer>
                </Box>
              </GridItem>
            </Grid>
            <VStack spacing={4} align="stretch">
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
            </VStack>
            <Flex justifyContent="flex-end" mt={4}>
            <Button mr={2} colorScheme="green" onClick={handleModifyAndPushData}>Modifier</Button>
            <Button
              mr={2}
              colorScheme="red"
              onClick={() => setShowDeleteModal(true)} // Open delete confirmation modal
            >
              Supprimer
            </Button>
            <Button mr={2} colorScheme="blue" onClick={onClose}>
              Fermer
            </Button>
          </Flex>

          {/* Success Alert */}
          {showDeleteSuccessAlert && (
            <Alert status="success" mt={4}>
              <AlertIcon />
              Équipe supprimée avec succès. Rafraîchir manuellement la page.
            </Alert>
          )}

          {/* Delete Confirmation Modal */}
          <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
            <ModalContent>
              <ModalHeader>Confirmer la suppression</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Text>
                  Êtes-vous sûr de vouloir supprimer cette équipe ? Cette action
                  est irréversible. Penser à rafraîchir la page.
                </Text>
              </ModalBody>
              <ModalFooter>
                <Button
                  colorScheme="red"
                  onClick={handleDeleteTeam} // Confirm delete
                  mr={3}
                >
                  Confirmer
                </Button>
                <Button
                  colorScheme="gray"
                  onClick={() => setShowDeleteModal(false)} // Close modal
                >
                  Annuler
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          </form>
          {showDeleteSuccessAlert && (
            <Alert status="success" mt={4}>
              <AlertIcon />
              Equipe supprimée avec succès. Penser à rafraîchir la page.
            </Alert>
          )}
        </ModalBody>
        <ModalFooter>

        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditUserForm;
