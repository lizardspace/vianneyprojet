import React, { useEffect, useState } from 'react';
import { useTeam } from './TeamContext';
import {
  Box,
  Badge,
  Heading,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Select,
  CloseButton,
} from '@chakra-ui/react';
import GpsPosition from './components/GpsPosition';
import Audio from './components/Audio';
import VianneyAlertChat from '../TableauDeBord/components/VianneyAlertChat';
import { supabase } from './../../../supabaseClient';
import TeamMembersDisplay from './components/TeamMembersDisplay';

const InterfaceEquipe = () => {
  const {
    selectedTeam,
    setSelectedTeam,
    teamData,
    setTeamData,
  } = useTeam();
  const textColor = useColorModeValue('secondaryGray.900', 'white');

  const [showAlert, setShowAlert] = useState(!selectedTeam);

  useEffect(() => {
    async function fetchTeamData() {
      try {
        const { data, error } = await supabase
          .from('vianney_teams')
          .select('id, name_of_the_team');
        if (error) {
          throw error;
        }
        setTeamData(data);
      } catch (error) {
        console.error('Error fetching team data:', error);
      }
    }

    fetchTeamData();
  }, [setTeamData]);

  const handleTeamSelection = (event) => {
    setSelectedTeam(event.target.value);
    setShowAlert(false);
  };

  return (
    <Box pt={{ base: '180px', md: '80px', xl: '80px' }}>
      {showAlert && (
        <Alert status="error" mb="4">
          <AlertIcon />
          <AlertTitle>Attention!</AlertTitle>
          <AlertDescription>
            You must select a team from the dropdown menu.
          </AlertDescription>
          <CloseButton onClick={() => setShowAlert(false)} position="absolute" right="8px" top="8px" />
        </Alert>
      )}
      <Select
        value={selectedTeam}
        onChange={handleTeamSelection}
        placeholder="Select a team"
      >
        {teamData.map((team) => (
          <option key={team.id} value={team.name_of_the_team}>
            {team.name_of_the_team}
          </option>
        ))}
      </Select>
      {selectedTeam && (
        <Badge colorScheme="green" mb="4">
          L'équipe que vous avez sélectionnée est : {selectedTeam}
        </Badge>
      )}
      <TeamMembersDisplay />
      <Heading
        me="auto"
        color={textColor}
        fontSize="2xl"
        fontWeight="700"
        lineHeight="100%"
        mb="20px"
      >
        Radio CB
      </Heading>
      <Audio />
      <Heading
        me="auto"
        color={textColor}
        fontSize="2xl"
        fontWeight="700"
        lineHeight="100%"
        mb={10}
        mt={10}
      >
        La position que vous communiquez au PC sécurité
      </Heading>
      <GpsPosition />
      <Heading
        me="auto"
        color={textColor}
        fontSize="2xl"
        fontWeight="700"
        lineHeight="100%"
        mb={10}
        mt={10}
      >
        Message
      </Heading>
      <VianneyAlertChat />
      
    </Box>
  );
};

export default InterfaceEquipe;
