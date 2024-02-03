import React, { useState } from 'react';
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

const InterfaceEquipe = () => {
  const textColor = useColorModeValue("secondaryGray.900", "white"); // Define textColor based on the color mode
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(""); // To store the selected team

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleTeamSelection = (event) => {
    setSelectedTeam(event.target.value);
  };

  // Replace this with actual team data from your database
  const teamData = [
    { id: '1', name: 'Team 1' },
    { id: '2', name: 'Team 2' },
    { id: '3', name: 'Team 3' },
    // Add more teams as needed
  ];

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
                <option key={team.id} value={team.name}>
                  {team.name}
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
