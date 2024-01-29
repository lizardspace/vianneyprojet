import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@supabase/supabase-js';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { FaTrash } from 'react-icons/fa';
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
  ModalFooter,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalCloseButton,
} from '@chakra-ui/react';
const supabaseUrl = 'https://hvjzemvfstwwhhahecwu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2anplbXZmc3R3d2hoYWhlY3d1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5MTQ4Mjc3MCwiZXhwIjoyMDA3MDU4NzcwfQ.6jThCX2eaUjl2qt4WE3ykPbrh6skE8drYcmk-UCNDSw';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
  const [teamMembers, setTeamMembers] = useState([{
    id: uuidv4(), // Generate unique ID for the first team member
    familyname: '',
    firstname: '',
    mail: '',
    phone: '',
    isLeader: false, // Added isLeader property
  }]);
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    console.log('Selected File:', selectedFile);

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
      photo_profile_url: profilePhotoUrl, // Include the profile photo URL here
    };

    try {
      const { data, error } = await supabase
        .from('vianney_teams')
        .update(updatedTeamData)
        .eq('id', teamData.id);

      if (error) {
        console.error('Error updating data:', error);
      } else {
        console.log('Data updated successfully:', data);
        setShowSuccessAlert(true);
      }
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };
  const handleAddTeamMember = () => {
    setTeamMembers([...teamMembers, {
      id: uuidv4(), // Generate unique ID for new team member
      familyname: '',
      firstname: '',
      mail: '',
      phone: ''
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
      name_of_the_team: nameOfTheTeam, // Use state variable
      latitude: lat,
      longitude: lng,
      mission: mission,
      type_de_vehicule: typeDeVehicule, // Use state variable
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
          .upload(fileName, profilePhoto); // Remove 'profile-photos/' from the path

        if (uploadError) {
          console.error('Error uploading file:', uploadError);
          // Handle the error appropriately (e.g., show an error message to the user)
        }

        const publicURL = `https://hvjzemvfstwwhhahecwu.supabase.co/storage/v1/object/public/users_on_the_ground/${fileName}`;

        // Update the profile photo URL in the database
        const { error: updateError } = await supabase
          .from('vianney_teams')
          .update({ photo_profile_url: publicURL })
          .eq('id', teamData.id);

        if (updateError) {
          console.error('Error updating profile photo URL in the database:', updateError);
          // Handle the error appropriately (e.g., show an error message to the user)
        }

        // Update the profile photo URL in the state
        setProfilePhotoUrl(publicURL);
        setIsEditingProfilePhoto(false);
        // Optionally, show a success message to the user
        setShowSuccessAlert(true);
      }
    } catch (error) {
      console.error('Error handling profile photo:', error);
      // Handle the error appropriately (e.g., show an error message to the user)
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
    }
  }, [teamData]);
  const handleDeleteTeam = async () => {
    try {
      const { data, error } = await supabase
        .from('vianney_teams')
        .delete()
        .eq('id', teamData.id);

      if (error) {
        console.error('Error deleting team:', error);
      } else {
        console.log('Team deleted successfully:', data);
        setShowDeleteSuccessAlert(true); // Show the success alert
        onDelete(); // Trigger the onDelete callback to handle closing the modal and other actions
      }
    } catch (error) {
      console.error('Error deleting team:', error);
    }
  };
  const handleDeleteTeamMember = (index) => {
    // Create a copy of the teamMembers array
    const updatedTeamMembers = [...teamMembers];
    // Remove the team member at the specified index
    updatedTeamMembers.splice(index, 1);
    // Update the state with the updated team members
    setTeamMembers(updatedTeamMembers);
  };


  return (
    <ModalContent>
      <ModalHeader>Modifier l'équipe</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <form onSubmit={handleSubmit}>
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
                <Button ml={1} colorScheme="blue" onClick={() => setIsEditingProfilePhoto(true)}>Changer la photo</Button>
              </Box>
            )}

            {/* Input for selecting a new profile photo */}
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
              <VStack key={teamMember.id} spacing={2}>
                <HStack key={index} spacing={2}>
                  <Input
                    type="text"
                    name="familyname" // Add this line
                    placeholder="Nom de famille"
                    value={teamMember.familyname}
                    onChange={(e) => handleTeamMemberChange(index, e)}
                  />
                  <Input
                    type="text"
                    name="firstname" // Add this line
                    placeholder="Prénom"
                    value={teamMember.firstname}
                    onChange={(e) => handleTeamMemberChange(index, e)}
                  />
                  <Input
                    type="text"
                    name="mail" // Add this line
                    placeholder="Email"
                    value={teamMember.mail}
                    onChange={(e) => handleTeamMemberChange(index, e)}
                  />
                  <Input
                    type="text"
                    name="phone" // Add this line
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
                </HStack>
                <Button colorScheme="red" onClick={() => handleDeleteTeamMember(index)} leftIcon={<FaTrash />}></Button>
              </VStack>
            ))}


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
      </ModalBody>
      <ModalFooter>
        <Button mr={1} colorScheme="red" onClick={handleDeleteTeam}>Supprimer</Button>
        <Button mr={1} colorScheme="blue" onClick={onClose}>Fermer</Button>
        <Button mr={1} colorScheme="green" onClick={handleModifyAndPushData}>Modifier</Button>
      </ModalFooter>
    </ModalContent>
  );
};

export default EditUserForm;