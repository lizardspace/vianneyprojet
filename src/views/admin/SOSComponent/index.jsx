import React, { useState } from "react";
import { Box, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure } from "@chakra-ui/react";
import AccidentDetected from "./components/AccidentDetected";
import SOSAlertsView from "./components/SOSAlertsView";

export default function Settings() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SOSAlertsView />
      <Button onClick={onOpen} mt={4}>
        Déclencher un SOS
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <AccidentDetected />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Fermer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
