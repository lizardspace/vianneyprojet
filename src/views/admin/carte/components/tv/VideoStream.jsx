import React, { useState, useEffect } from 'react';
import { supabase } from './../../../../../supabaseClient';
import { Box, Grid, Badge, useColorModeValue, useToast } from '@chakra-ui/react';
import VideoInputForm from './VideoInputForm';
import VideoList from './VideoList';
import { useEvent } from './../../../../../EventContext';

const LiveStreamsPage = () => {
  const [videos, setVideos] = useState([]);
  const { selectedEventId } = useEvent();
  const toast = useToast();

  useEffect(() => {
    const fetchVideos = async () => {
      if (!selectedEventId) return;

      const { data, error } = await supabase
        .from('vianney_videos_streaming_tv')
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

  const deleteVideo = async (id) => {
    const { error } = await supabase
      .from('vianney_videos_streaming_tv')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: 'Erreur',
        description: "Erreur lors de la suppression de la vidéo",
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } else {
      setVideos(videos.filter((video) => video.id !== id));
      toast({
        title: 'Vidéo supprimée',
        description: "Vidéo supprimée avec succès !",
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    }
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
        templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(1, 1fr)', lg: 'repeat(2, 1fr)', xl: 'repeat(2, 1fr)' }}
        gap={6}
        px={4}
      >
        <VideoList videos={videos} onDeleteVideo={deleteVideo} />
      </Grid>
    </Box>
  );
};

export default LiveStreamsPage;
