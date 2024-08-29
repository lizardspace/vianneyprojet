import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Box,
  VStack,
  HStack,
  Checkbox,
  Alert, AlertIcon, AlertTitle, AlertDescription, CloseButton,
} from '@chakra-ui/react';
import { useEvent } from '../../../../EventContext';
import { supabase } from './../../../../supabaseClient';

const UserForm = () => {
  const { selectedEventId } = useEvent();
  const [nameOfTheTeam, setNameOfTheTeam] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [lat, setLat] = useState(45.75799485263588);
  const [lng, setLng] = useState(4.825754111294844);
  const [mission, setMission] = useState('');
  const [typeDeVehicule, setTypeDeVehicule] = useState('');
  const [immatriculation, setImmatriculation] = useState('');
  const [specialite, setSpecialite] = useState('');
  const [password, setPassword] = useState(''); // État pour le mot de passe
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [teamMembers, setTeamMembers] = useState([{
    id: uuidv4(), 
    familyname: '',
    firstname: '',
    mail: '',
    phone: '',
    isLeader: false, 
  }]);

  // Fonction pour générer un mot de passe sécurisé
  const generatePassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    let password = '';
    while (true) {
      password = Array.from({ length }, () => charset.charAt(Math.floor(Math.random() * charset.length))).join('');
      if (
        /[a-z]/.test(password) && // au moins une minuscule
        /[A-Z]/.test(password) && // au moins une majuscule
        /\d/.test(password) &&    // au moins un chiffre
        /[!@#$%^&*()_+~`|}{[\]:;?><,./-=]/.test(password) // au moins un caractère spécial
      ) break;
    }
    return password;
  };

  const validatePassword = (password) => {
    return (
      /[a-z]/.test(password) &&  // au moins une minuscule
      /[A-Z]/.test(password) &&  // au moins une majuscule
      /\d/.test(password) &&     // au moins un chiffre
      /[!@#$%^&*()_+~`|}{[\]:;?><,./-=]/.test(password) // au moins un caractère spécial
    );
  };

  useEffect(() => {
    // Générer un mot de passe au montage du composant
    setPassword(generatePassword());
  }, []);

  const generateRandomColor = () => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return `#${randomColor}`;
  };

  const handleFileChange = (e) => {
    setProfilePhoto(e.target.files[0]);
  };

  const handleTeamMemberChange = (index, event) => {
    let values = [...teamMembers];

    if (event.target.name === 'isLeader') {
      values = values.map(member => ({ ...member, isLeader: false }));
      values[index][event.target.name] = event.target.checked;
    } else {
      values[index][event.target.name] = event.target.value;
    }

    setTeamMembers(values);
  };

  const handleAddTeamMember = () => {
    setTeamMembers([...teamMembers, {
      id: uuidv4(), 
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

    if (!validatePassword(password)) {
      setShowErrorAlert(true);
      return;
    }

    const teamColor = generateRandomColor();
    const timestamp = new Date().toISOString();

    if (!profilePhoto) {
      console.error('No profile photo selected');
      return;
    }

    const fileExt = profilePhoto.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    let uploadResponse = await supabase.storage
      .from('users_on_the_ground')
      .upload(fileName, profilePhoto);

    if (uploadResponse.error) {
      console.error('Error uploading file:', uploadResponse.error);
      return;
    }

    const publicURL = `https://hvjzemvfstwwhhahecwu.supabase.co/storage/v1/object/public/users_on_the_ground/${fileName}`;

    const { error: insertError } = await supabase
      .from('vianney_teams')
      .insert([
        {
          id: uuidv4(),
          name_of_the_team: nameOfTheTeam,
          latitude: lat,
          longitude: lng,
          photo_profile_url: publicURL,
          last_active: new Date().toISOString(),
          team_members: teamMembers,
          color: teamColor,
          creation_timestamp: timestamp,
          mission: mission,
          type_de_vehicule: typeDeVehicule,
          immatriculation: immatriculation,
          specialite: specialite,
          event_id: selectedEventId,
          password: password, // Ajouter le mot de passe généré ou modifié
        },
      ]);

    if (insertError) {
      console.error('Error inserting data:', insertError);
      return;
    }

    // Hide error alert if successful
    setShowErrorAlert(false);

    // Show the success alert
    setShowSuccessAlert(true);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box id="mapId" h="400px" w="100%">
        <MapContainer center={[lat, lng]} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker />
        </MapContainer>
      </Box>

      <VStack spacing={4} align="stretch">
        <FormControl>
          <FormLabel htmlFor='team-name'>Nom de l'équipe</FormLabel>
          <Input id='team-name' type="text" placeholder="Nom de l'équipe" value={nameOfTheTeam} onChange={(e) => setNameOfTheTeam(e.target.value)} />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor='profile-photo'>Photo de profil</FormLabel>
          <Input id='profile-photo' type="file" onChange={handleFileChange} />
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

        <FormControl isRequired>
          <FormLabel htmlFor='password'>Mot de passe (modifiable)</FormLabel>
          <Input
            id='password'
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Permettre la modification du mot de passe
          />
        </FormControl>

        {showErrorAlert && (
          <Alert status="error" variant="subtle" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" mt={4}>
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              Mot de passe invalide
            </AlertTitle>
            <AlertDescription maxWidth="sm">
              Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial.
            </AlertDescription>
            <CloseButton position="absolute" right="8px" top="8px" onClick={() => setShowErrorAlert(false)} />
          </Alert>
        )}

        {teamMembers.map((teamMember, index) => (
          <HStack key={index} spacing={2}>
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
          </HStack>
        ))}
        {showSuccessAlert && (
          <Alert status="success" variant="subtle" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" mt={4}>
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              Equipe créée avec succès
            </AlertTitle>
            <AlertDescription maxWidth="sm">
              Les données ont été ajoutées avec succès.
            </AlertDescription>
            <CloseButton position="absolute" right="8px" top="8px" onClick={() => setShowSuccessAlert(false)} />
          </Alert>
        )}
        <Button colorScheme="blue" onClick={handleAddTeamMember}>Ajouter un membre de l'équipe</Button>
      </VStack>
      <Button mt={4} colorScheme="green" type="submit">Ajouter l'utilisateur</Button>
    </form>
  );
};

export default UserForm;
