import React, { useState, useEffect } from 'react';
import { supabase } from './../../../../../supabaseClient';
import { Box, Grid, Badge, useColorModeValue } from '@chakra-ui/react';
import VideoInputForm from './VideoInputForm';
import VideoList from './VideoList';
import PorteDuValvertLive from './PorteDuValvertLive';
import PorteSaintClairLive from './PorteSaintClairLive';
import PorteDeVaiseLive from './PorteDeVaiseLive';
import IenaVueTourEiffelLive from './IenaVueTourEiffelLive';
import PlageDuSillonThermesMarinsLive from './PlageDuSillonThermesMarinsLive';
import SaintMaloLesMursLive from './SaintMaloLesMursLive';
import TunnelDeFourviereLive from './TunnelDeFourviereLive';
import TunnelDeFourviereBisLive from './TunnelDeFourviereBisLive';

const LiveStreamsPage = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const { data, error } = await supabase
        .from('vianney_videos_streaming_live.videos')
        .select('*');

      if (error) {
        console.error('Error fetching videos:', error.message);
      } else {
        setVideos(data);
      }
    };

    fetchVideos();
  }, []);

  const addVideo = (video) => {
    setVideos([...videos, video]);
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
        <PorteDuValvertLive />
        <PorteSaintClairLive />
        <PorteDeVaiseLive />
        <IenaVueTourEiffelLive />
        <PlageDuSillonThermesMarinsLive />
        <SaintMaloLesMursLive />
        <TunnelDeFourviereLive/>
        <TunnelDeFourviereBisLive/>
        <VideoList videos={videos} />
      </Grid>
    </Box>
  );
};

export default LiveStreamsPage;
