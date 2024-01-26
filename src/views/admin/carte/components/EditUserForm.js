import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
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

const EditUserForm = ({ teamData, onSave }) => {
  // Define state variables similar to UserForm for editing
  // Initialize these states with the data from the team you want to edit
  const [nameOfTheTeam, setNameOfTheTeam] = useState(teamData.name_of_the_team);
  const [lat, setLat] = useState(teamData.latitude);
  const [lng, setLng] = useState(teamData.longitude);
  const [mission, setMission] = useState(teamData.mission);
  const [typeDeVehicule, setTypeDeVehicule] = useState(teamData.type_de_vehicule);
  const [immatriculation, setImmatriculation] = useState(teamData.immatriculation);
  const [specialite, setSpecialite] = useState(teamData.specialite);
  const [teamMembers, setTeamMembers] = useState(teamData.team_members);

  // Other state variables and functions...

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Perform the update operation and call onSave with updated data
    const updatedTeamData = {
      name_of_the_team,
      latitude: lat,
      longitude: lng,
      mission,
      type_de_vehicule,
      immatriculation,
      specialite,
      team_members: teamMembers,
    };
    onSave(updatedTeamData);
  };

  return (
    // Your form JSX here...
  );
};

export default EditUserForm;
