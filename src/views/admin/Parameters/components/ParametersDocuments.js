// src/views/admin/Parameters/components/ParametersDocuments.js
import React, {useState} from 'react';
import { Box, Text, Button, useColorModeValue, ModalCloseButton, ModalHeader, Modal, ModalBody, ModalOverlay, ModalContent, } from '@chakra-ui/react';
import { FcAdvertising, FcGlobe, FcBusinessman, FcDepartment, FcCalendar } from "react-icons/fc";

const ParametersDocuments = ({ onEventAndCharacteristicsClick }) => {
  const brandColor = useColorModeValue("brand.500", "white");
  const buttonBg = useColorModeValue("white", "gray.800");
  const buttonTextColor = useColorModeValue("secondaryGray.900", "white");

  // State for managing modals
  const [showGeoModal, setShowGeoModal] = useState(false);
  const [showPersonnelModal, setShowPersonnelModal] = useState(false);
  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const openGeoModal = () => setShowGeoModal(true);
  const closeGeoModal = () => setShowGeoModal(false);

  const openPersonnelModal = () => setShowPersonnelModal(true);
  const closePersonnelModal = () => setShowPersonnelModal(false);

  const openCrisisModal = () => setShowCrisisModal(true);
  const closeCrisisModal = () => setShowCrisisModal(false);

  const openScheduleModal = () => setShowScheduleModal(true);
  const closeScheduleModal = () => setShowScheduleModal(false);

  return (
    <Box border='1px' borderColor='gray.200' p={5} m={5}>
      <Text fontSize='xl' m={4}>Evènements</Text>
      <Button
        leftIcon={<FcAdvertising size='32px' color={brandColor} />}
        bg={buttonBg}
        color={buttonTextColor}
        h='100px'
        m={4}
        onClick={onEventAndCharacteristicsClick}
      >
        Evènement et caractéristiques
      </Button>

      <Button
        leftIcon={<FcGlobe size='32px' color={brandColor} />}
        bg={buttonBg}
        color={buttonTextColor}
        h='100px'
        m={4}
        onClick={openGeoModal}
      >
        Géolocalisation
      </Button>

      <Button
        leftIcon={<FcBusinessman size='32px' color={brandColor} />}
        bg={buttonBg}
        color={buttonTextColor}
        h='100px'
        m={4}
        onClick={openPersonnelModal}
      >
        Personnels
      </Button>

      <Button
        leftIcon={<FcDepartment size='32px' color={brandColor} />}
        bg={buttonBg}
        color={buttonTextColor}
        h='100px'
        m={4}
        onClick={openCrisisModal}
      >
        Salle de crise
      </Button>

      <Button
        leftIcon={<FcCalendar size='32px' color={brandColor} />}
        bg={buttonBg}
        color={buttonTextColor}
        h='100px'
        m={4}
        onClick={openScheduleModal}
      >
        Emploi du temps
      </Button>

      {/* Modals */}
      <Modal isOpen={showGeoModal} onClose={closeGeoModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Géolocalisation Modal</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* Add your content for the Géolocalisation modal here */}
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={showPersonnelModal} onClose={closePersonnelModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Personnels Modal</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* Add your content for the Personnels modal here */}
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={showCrisisModal} onClose={closeCrisisModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Salle de crise Modal</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* Add your content for the Salle de crise modal here */}
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={showScheduleModal} onClose={closeScheduleModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Emploi du temps Modal</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* Add your content for the Emploi du temps modal here */}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ParametersDocuments;
