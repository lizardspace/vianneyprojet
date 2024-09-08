import React, { useState, useEffect } from 'react';
import { supabase } from './../../../../../supabaseClient';
import { Box, Grid, Badge, Heading, IconButton, useColorModeValue, useToast, Button, useDisclosure } from '@chakra-ui/react';
import { MdDeleteForever } from "react-icons/md";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import VideoInputForm from './VideoInputForm'; // Assuming you still want to use the input form component
import { useEvent } from './../../../../../EventContext';

const LiveStreamsPage = () => {
  const [videos, setVideos] = useState([]);
  const { selectedEventId } = useEvent();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure(); // Control the dialog
  const [videoToDelete, setVideoToDelete] = useState(null); // Track which video to delete
  const cancelRef = React.useRef();

  // Fetch videos when the selected event changes
  useEffect(() => {
    const fetchVideos = async () => {
      if (!selectedEventId) return;

      const { data, error } = await supabase
        .from('vianney_videos_streaming_live')
        .select('*')
        .eq('event_id', selectedEventId);

      if (error) {
        console.error('Error fetching videos:', error.message);
      } else {
        setVideos(data);
      }
    };

    fetchVideos();
  }, [selectedEventId]);

  const addVideo = (video) => {
    setVideos([...videos, video]);
  };

  const handleDeleteClick = (videoId) => {
    setVideoToDelete(videoId); // Store the ID of the video to delete
    onOpen(); // Open the confirmation dialog
  };

  const confirmDelete = async () => {
    const { error } = await supabase
      .from('vianney_videos_streaming_live')
      .delete()
      .eq('id', videoToDelete);

    if (error) {
      toast({
        title: 'Erreur',
        description: "Erreur lors de la suppression de la vidéo",
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } else {
      setVideos(videos.filter((video) => video.id !== videoToDelete));
      toast({
        title: 'Vidéo supprimée',
        description: "Vidéo supprimée avec succès !",
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      onClose(); // Close the confirmation dialog
    }
  };

  const modifyUrlForAutoplay = (url) => {
    const urlObj = new URL(url);
    urlObj.searchParams.set('autoplay', '1'); // Add the autoplay=1 parameter
    urlObj.searchParams.set('mute', '1'); // Optionally mute the video to prevent user annoyance
    return urlObj.toString();
  };

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const color = useColorModeValue('gray.800', 'white');
  const badgeColor = useColorModeValue('blue.500', 'blue.300');

  return (
    <Box p={8} bg={bgColor} color={color} minHeight="100vh">
      <Box display="flex" justifyContent="center" mb={12}>
        <Badge colorScheme="blue" px={4} py={1} fontSize="1.25em" borderRadius="full" color={badgeColor}>
          Centre de surveillance vidéo
        </Badge>
      </Box>

      <VideoInputForm onAddVideo={addVideo} />

      <Grid
        templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(2, 1fr)', xl: 'repeat(2, 1fr)' }}
        gap={6}
        px={4}
        width="100%"
      >
        {videos.map((video) => (
          <Box key={video.id} mb={8} position="relative" width="100%">
            <Heading as="h3" size="md" mb={4}>
              {video.title}
            </Heading>
            <Box position="relative" width="100%">
              <iframe
                width="100%"
                height="315"
                src={modifyUrlForAutoplay(video.url)}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
              <IconButton
                icon={<MdDeleteForever />}
                colorScheme="red"
                position="absolute"
                top="5px"
                right="5px"
                onClick={() => handleDeleteClick(video.id)}
              />
            </Box>
          </Box>
        ))}
      </Grid>

      {/* AlertDialog for deletion confirmation */}
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

export default LiveStreamsPage;
