import React, { useEffect, useState } from 'react';
import { Box, Flex, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, useDisclosure } from '@chakra-ui/react';
import { FcDocument } from 'react-icons/fc';
import { supabase } from './../../../../../supabaseClient';

const OperationnelFichiersFichierIconList = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchFiles = async () => {
      const { data, error } = await supabase
        .from('vianney_operationnel_fichiers')
        .select('*');
      
      if (error) {
        console.error('Error fetching files:', error);
      } else {
        setFiles(data);
      }
    };

    fetchFiles();
  }, []);

  const handleFileClick = (file) => {
    setSelectedFile(file);
    onOpen();
  };

  return (
    <Box p={4}>
      <Flex wrap="wrap" justifyContent="center">
        {files.map(file => (
          <Box
            key={file.id}
            m={4}
            textAlign="center"
            cursor="pointer"
            _hover={{ transform: 'scale(1.05)', transition: 'transform 0.2s' }}
            onClick={() => handleFileClick(file)}
          >
            <FcDocument size={50} />
            <Text mt={2} fontSize="sm">
              {file.file_name}
            </Text>
          </Box>
        ))}
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW="80%" maxH="80%" h="80%">
          <ModalHeader>{selectedFile?.file_name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedFile && (
              <iframe
                src={selectedFile.url}
                width="100%"
                height="100%"
                title={selectedFile.file_name}
              />
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Fermer
            </Button>
            {selectedFile && (
              <Button as="a" href={selectedFile.url} colorScheme="teal" download>
                Télécharger
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default OperationnelFichiersFichierIconList;
