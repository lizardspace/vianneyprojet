import React, { useState } from 'react';
import { Box, Heading, IconButton, useDisclosure, Button } from '@chakra-ui/react';
import { MdDeleteForever } from "react-icons/md";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";

const VideoList = ({ videos, onDeleteVideo }) => {
  const { isOpen, onOpen, onClose } = useDisclosure(); // Control the dialog
  const [videoToDelete, setVideoToDelete] = useState(null); // Track which video to delete
  const cancelRef = React.useRef();

  const handleDeleteClick = (videoId) => {
    setVideoToDelete(videoId); // Store the ID of the video to delete
    onOpen(); // Open the confirmation dialog
  };

  const confirmDelete = () => {
    onDeleteVideo(videoToDelete); // Call the delete function with the selected video
    onClose(); // Close the confirmation dialog
  };

  const modifyUrlForAutoplay = (url) => {
    const urlObj = new URL(url);
    urlObj.searchParams.set('autoplay', '1'); // Add the autoplay=1 parameter
    urlObj.searchParams.set('mute', '1'); // Optionally mute the video to prevent user annoyance
    return urlObj.toString();
  };

  return (
    <Box>
      {videos.map((video) => (
        <Box key={video.id} mb={8} position="relative">
          <Heading as="h3" size="md" mb={4}>
            {video.title}
          </Heading>
          <iframe
            width="560"
            height="315"
            src={modifyUrlForAutoplay(video.url)} // Modify the video URL to autoplay
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
          <IconButton
            icon={<MdDeleteForever />}
            colorScheme="red"
            position="absolute"
            top={0}
            right={0}
            onClick={() => handleDeleteClick(video.id)} // Trigger the confirmation dialog
          />
        </Box>
      ))}

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Supprimer la vidéo
            </AlertDialogHeader>

            <AlertDialogBody>
              Êtes-vous sûr de vouloir supprimer cette vidéo ? Cette action est irréversible.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Annuler
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                Supprimer
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default VideoList;
