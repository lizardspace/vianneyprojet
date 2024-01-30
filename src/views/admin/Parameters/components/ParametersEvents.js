import React, {useState} from 'react';
import { Box, Text, Button, useColorModeValue, ModalOverlay, Modal, ModalCloseButton, ModalHeader, ModalBody, ModalContent,} from '@chakra-ui/react';
import { FcDocument } from "react-icons/fc";
import DocumentationsComponent from "./../../default/DocumentionsComponent/DocumentationsComponent";

const ParametersEvents = () => {
  const brandColor = useColorModeValue("brand.500", "white");
  const buttonBg = useColorModeValue("white", "gray.800");
  const buttonTextColor = useColorModeValue("secondaryGray.900", "white");

  // State for managing the modal
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);

  const openDocumentsModal = () => setShowDocumentsModal(true);
  const closeDocumentsModal = () => setShowDocumentsModal(false);

  return (
    <Box border='1px' borderColor='gray.200' p={5} m={5}>
      <Text fontSize='xl' m={4}>Documents</Text>  
      <Button
        leftIcon={<FcDocument size='32px' color={brandColor} />}
        bg={buttonBg}
        color={buttonTextColor}
        h='100px'
        m={4}
        onClick={openDocumentsModal}
      >
        Documents missions
      </Button>

      <Modal isOpen={showDocumentsModal} onClose={closeDocumentsModal} size="full">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Documents missions Modal</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <DocumentationsComponent />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ParametersEvents;
