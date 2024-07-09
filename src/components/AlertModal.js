import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
} from '@chakra-ui/react';

const AlertModal = ({ isOpen, onClose, alert, onResolve }) => {
  if (!alert) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Unresolved Alert</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text><strong>Team Name:</strong> {alert.team_name}</Text>
          <Text><strong>Latitude:</strong> {alert.latitude}</Text>
          <Text><strong>Longitude:</strong> {alert.longitude}</Text>
          <Text><strong>Time for User:</strong> {alert.time_for_user}</Text>
          <Text><strong>URL:</strong> {alert.url}</Text>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={() => onResolve(alert.id)}>
            Mark as Resolved
          </Button>
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AlertModal;
