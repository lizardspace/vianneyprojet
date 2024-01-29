// src/views/admin/Parameters/components/ParametersDocuments.js
import React, { useState } from 'react';
import { Box, Text, Button, useColorModeValue, ModalCloseButton, ModalHeader, Modal, ModalBody, ModalOverlay, ModalContent, } from '@chakra-ui/react';
import { FcAdvertising, FcGlobe, FcBusinessman, FcDepartment, FcCalendar, FcList } from "react-icons/fc";
import MapComponent from "views/admin/carte/components/MapComponent";
import EquipiersTable from 'views/admin/carte/components/EquipiersTable';
import TeamScheduleByMySelf from '../../TableauDeBord/components/TeamScheduleMadeMySelf'
import SalleDeCrise from '../modal/SalleDeCrise';
import NotepadComponent from '../modal/NotepadComponent';

const ParametersDocuments = ({ onEventAndCharacteristicsClick }) => {
  const brandColor = useColorModeValue("brand.500", "white");
  const buttonBg = useColorModeValue("white", "gray.800");
  const buttonTextColor = useColorModeValue("secondaryGray.900", "white");
  const [showGeoModal, setShowGeoModal] = useState(false);
  const [showPersonnelModal, setShowPersonnelModal] = useState(false);
  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showEventNeedsModal, setShowEventNeedsModal] = useState(false);

  const openGeoModal = () => setShowGeoModal(true);
  const closeGeoModal = () => setShowGeoModal(false);

  const openPersonnelModal = () => setShowPersonnelModal(true);
  const closePersonnelModal = () => setShowPersonnelModal(false);

  const openCrisisModal = () => setShowCrisisModal(true);
  const closeCrisisModal = () => setShowCrisisModal(false);

  const openScheduleModal = () => setShowScheduleModal(true);
  const closeScheduleModal = () => setShowScheduleModal(false);

  const openEventNeedsModal = () => setShowEventNeedsModal(true);
  const closeEventNeedsModal = () => setShowEventNeedsModal(false);


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
      <Button
        leftIcon={<FcList size='32px' color={brandColor} />}
        bg={buttonBg}
        color={buttonTextColor}
        h='100px'
        m={4}
        onClick={openEventNeedsModal}
      >
        Besoins
      </Button>

      {/* Modals */}
      <Modal isOpen={showGeoModal} onClose={closeGeoModal} size="full">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Géolocalisation Modal</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <MapComponent />
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={showPersonnelModal} onClose={closePersonnelModal} size="full">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Personnels Modal</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <EquipiersTable />
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={showCrisisModal} onClose={closeCrisisModal} size="full">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Salle de crise Modal</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SalleDeCrise />
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={showScheduleModal} onClose={closeScheduleModal} size="full">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Emploi du temps Modal</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <TeamScheduleByMySelf />
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal isOpen={showEventNeedsModal} onClose={closeEventNeedsModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Besoins Modal</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <NotepadComponent/>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ParametersDocuments;
