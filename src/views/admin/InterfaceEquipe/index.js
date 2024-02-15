import React, { useEffect, useState } from 'react';
import { useTeam } from './TeamContext';
import { useEvent } from '../../../EventContext'; // Import useEvent context
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
  Button, 
  CloseButton,
  Spacer,
} from '@chakra-ui/react';
import GpsPosition from './components/GpsPosition';
import VianneyAlertChat from '../TableauDeBord/components/VianneyAlertChat';
import { supabase } from './../../../supabaseClient';
import TeamMembersDisplay from './components/TeamMembersDisplay';
import App from '../videoChatRoom/App';

const InterfaceEquipe = () => {
  const { selectedTeam, setSelectedTeam, teamData, setTeamData } = useTeam();
  const { selectedEventId } = useEvent(); // Get selected event ID from useEvent context
  const textColor = useColorModeValue('secondaryGray.900', 'white');

  const [showAlert, setShowAlert] = useState(!selectedTeam);
  const [showDropdown, setShowDropdown] = useState(true);

  useEffect(() => {
    async function fetchTeamData() {
      try {
        let query = supabase.from('vianney_teams').select('id, name_of_the_team');

        // If selectedEventId is available, filter teams by event_id
        if (selectedEventId) {
          query = query.eq('event_id', selectedEventId);
        }

        const { data, error } = await query;

        if (error) {
          throw error;
        }
        setTeamData(data);
      } catch (error) {
        console.error('Error fetching team data:', error);
      }
    }

    fetchTeamData();
  }, [selectedEventId, setTeamData]);

  const handleTeamSelection = (event) => {
    setSelectedTeam(event.target.value);
    setShowAlert(false);
    setShowDropdown(false);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <Box pt={{ base: '180px', md: '80px', xl: '80px' }}>
      {showAlert && (
        <Alert status="error" mb="4" minHeight="200px">
          <AlertIcon />
          <AlertTitle>Attention!</AlertTitle>
          <AlertDescription>
            Sélectionnez une équipe est obligatoire
          </AlertDescription>
          <CloseButton onClick={() => setShowAlert(false)} position="absolute" right="8px" top="8px" />
        </Alert>
      )}
      {showDropdown ? (
        <>
          <Select
            value={selectedTeam}
            onChange={handleTeamSelection}
            placeholder="Selectionnez une équipe"
          >
            {teamData.map((team) => (
              <option key={team.id} value={team.name_of_the_team}>
                {team.name_of_the_team}
              </option>
            ))}
          </Select>
        </>
      ) : (
        <Button onClick={toggleDropdown} size="sm" fontSize="sm">
          Afficher le menu déroulant
        </Button>
      )}
      <Spacer/>
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
        mb={1}
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
        Messages et alertes
      </Heading>
      <VianneyAlertChat />
      <Heading
        me="auto"
        color={textColor}
        fontSize="2xl"
        fontWeight="700"
        lineHeight="100%"
        mb={4}
        mt={4}
      >
        Radio CB
      </Heading>
      <Box >
      <App/>
      </Box>
    </Box>
  );
};

export default InterfaceEquipe;
