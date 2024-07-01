import React, { useEffect, useState } from 'react';
import { Box, Flex, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, useDisclosure, IconButton } from '@chakra-ui/react';
import { FcDocument } from 'react-icons/fc';
import { RiDeleteBin2Line } from 'react-icons/ri';
import { supabase } from './../../../../../supabaseClient';

const OperationnelFichiersFichierIconList = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileToDelete, setFileToDelete] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose
  } = useDisclosure();

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

  const handleDeleteClick = (file) => {
    setFileToDelete(file);
    onDeleteOpen();
  };

  const handleDeleteConfirm = async () => {
    const { error } = await supabase
      .from('vianney_operationnel_fichiers')
      .delete()
      .eq('id', fileToDelete.id);

    if (error) {
      console.error('Error deleting file:', error);
    } else {
      setFiles(files.filter(f => f.id !== fileToDelete.id));
      onDeleteClose();
    }
  };

  return (
    <Box p={4}>
      <Flex wrap="wrap" justifyContent="center">
        {files.map(file => (
          <Box
            key={file.id}
            m={4}
            textAlign="center"
            position="relative"
            cursor="pointer"
            _hover={{ transform: 'scale(1.05)', transition: 'transform 0.2s' }}
            onClick={() => handleFileClick(file)}
          >
            <FcDocument size={50} />
            <Text mt={2} fontSize="sm">
              {file.file_name}
            </Text>
            <IconButton
              icon={<RiDeleteBin2Line />}
              colorScheme="red"
              position="absolute"
              bottom={1}
              right={1}
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteClick(file);
              }}
            />
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

      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmez-vous la suppression de votre fichier ?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Êtes-vous sûr de vouloir supprimer le fichier <strong>{fileToDelete?.file_name}</strong> ?
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={handleDeleteConfirm}>
              Supprimer
            </Button>
            <Button onClick={onDeleteClose}>Annuler</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default OperationnelFichiersFichierIconList;