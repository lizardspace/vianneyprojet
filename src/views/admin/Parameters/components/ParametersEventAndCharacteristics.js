import React, {useState} from 'react';
import { Box, Text, Button, useColorModeValue, ModalCloseButton, ModalHeader, ModalBody, ModalOverlay, Modal, ModalContent,} from '@chakra-ui/react';
import { FcBusiness, FcCalendar, FcHome, FcList, FcVoicePresentation } from "react-icons/fc";

const ParametersEventAndCharacteristics = () => {
  const brandColor = useColorModeValue("brand.500", "white");
  const buttonBg = useColorModeValue("white", "gray.800");
  const buttonTextColor = useColorModeValue("secondaryGray.900", "white");

  // State for managing modals
  const [showEventNameModal, setShowEventNameModal] = useState(false);
  const [showEventDateModal, setShowEventDateModal] = useState(false);
  const [showEventLocationModal, setShowEventLocationModal] = useState(false);
  const [showEventNeedsModal, setShowEventNeedsModal] = useState(false);
  const [showEventMailingModal, setShowEventMailingModal] = useState(false);

  const openEventNameModal = () => setShowEventNameModal(true);
  const closeEventNameModal = () => setShowEventNameModal(false);

  const openEventDateModal = () => setShowEventDateModal(true);
  const closeEventDateModal = () => setShowEventDateModal(false);

  const openEventLocationModal = () => setShowEventLocationModal(true);
  const closeEventLocationModal = () => setShowEventLocationModal(false);

  const openEventNeedsModal = () => setShowEventNeedsModal(true);
  const closeEventNeedsModal = () => setShowEventNeedsModal(false);

  const openEventMailingModal = () => setShowEventMailingModal(true);
  const closeEventMailingModal = () => setShowEventMailingModal(false);

  return (
    <Box border='1px' borderColor='gray.200' p={5} m={5}>
      <Text fontSize='xl' m={4}>Caractéristiques de l'Événement</Text>
      
      <Button
        leftIcon={<FcBusiness size='32px' color={brandColor} />}
        bg={buttonBg}
        color={buttonTextColor}
        h='100px'
        m={4}
        onClick={openEventNameModal}
      >
        Nom de l'événement
      </Button>
      
      <Button
        leftIcon={<FcCalendar size='32px' color={brandColor} />}
        bg={buttonBg}
        color={buttonTextColor}
        h='100px'
        m={4}
        onClick={openEventDateModal}
      >
        Date de l'événement
      </Button>

      <Button
        leftIcon={<FcHome size='32px' color={brandColor} />}
        bg={buttonBg}
        color={buttonTextColor}
        h='100px'
        m={4}
        onClick={openEventLocationModal}
      >
        Lieu de l'événement
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

      <Button
        leftIcon={<FcVoicePresentation size='32px' color={brandColor} />}
        bg={buttonBg}
        color={buttonTextColor}
        h='100px'
        m={4}
        onClick={openEventMailingModal}
      >
        Mailing
      </Button>

      {/* Modals */}
      <Modal isOpen={showEventNameModal} onClose={closeEventNameModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Nom de l'événement Modal</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* Add your content for the Nom de l'événement modal here */}
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={showEventDateModal} onClose={closeEventDateModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Date de l'événement Modal</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* Add your content for the Date de l'événement modal here */}
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={showEventLocationModal} onClose={closeEventLocationModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Lieu de l'événement Modal</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* Add your content for the Lieu de l'événement modal here */}
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={showEventNeedsModal} onClose={closeEventNeedsModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Besoins Modal</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* Add your content for the Besoins modal here */}
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={showEventMailingModal} onClose={closeEventMailingModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Mailing Modal</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* Add your content for the Mailing modal here */}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ParametersEventAndCharacteristics;
