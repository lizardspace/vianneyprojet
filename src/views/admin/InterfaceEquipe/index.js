import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  useColorModeValue,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Select, // Import the Select component
} from '@chakra-ui/react';
import GpsPosition from './components/GpsPosition';
import Audio from './components/Audio';
import VianneyAlertChat from '../TableauDeBord/components/VianneyAlertChat';
import { supabase } from './../../../supabaseClient';

const InterfaceEquipe = () => {
  const textColor = useColorModeValue("secondaryGray.900", "white"); // Define textColor based on the color mode
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(""); // To store the selected team
  const [teamData, setTeamData] = useState([]); // To store the fetched team data

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleTeamSelection = (event) => {
    setSelectedTeam(event.target.value);
  };

  useEffect(() => {
    // Fetch team data from Supabase and populate the teamData array
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
  }, []);

  return (
    <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
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

      {/* Button to open the modal */}
      <Button onClick={toggleModal}>Select Team</Button>

      {/* Modal for selecting teams */}
      <Modal isOpen={isModalOpen} onClose={toggleModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select Team</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* Dropdown menu to select a team */}
            <Select
              value={selectedTeam}
              onChange={handleTeamSelection}
              placeholder="Select a team"
            >
              {teamData.map((team) => (
                <option key={team.id} value={team.id}>
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
