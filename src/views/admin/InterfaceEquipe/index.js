import React, { useEffect } from 'react';
import { useTeam } from './TeamContext'; // Import the useTeam hook
import { Box, Badge, Heading, useColorModeValue, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Select } from '@chakra-ui/react';
import GpsPosition from './components/GpsPosition';
import Audio from './components/Audio';
import VianneyAlertChat from '../TableauDeBord/components/VianneyAlertChat';
import { supabase } from './../../../supabaseClient';

const InterfaceEquipe = () => {
  const {
    selectedTeam,
    setSelectedTeam,
    teamData,
    setTeamData,
  } = useTeam();
  const textColor = useColorModeValue("secondaryGray.900", "white");

  useEffect(() => {
    async function fetchTeamData() {
      try {
        const { data, error } = await supabase.from('vianney_teams').select('id, name_of_the_team');
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
  };

  const isModalOpen = !selectedTeam;

  return (
    <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
      {/* Display the selected team in a Badge if selectedTeam is not empty */}
      {selectedTeam && (
        <Badge colorScheme="green" mb="4">
          L'équipe que vous avez sélectionnez est : {selectedTeam}
        </Badge>
      )}
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

      {/* Modal for selecting teams */}
      <Modal isOpen={isModalOpen} onClose={() => {}}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select Team</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
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
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default InterfaceEquipe;
