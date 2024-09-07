import React, { useEffect, useState } from 'react';
import { Box, Spinner, Text, VStack } from '@chakra-ui/react';
import { supabase } from './../../../../../supabaseClient'; // Ensure correct path
import VideoStream from './VideoStream'; // Ensure correct path

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVideos = async () => {
    const { data, error } = await supabase
      .from('vianney_videos_streaming_tv')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching videos:', error);
    } else {
      setVideos(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <Spinner size="xl" />
      </Box>
    );
  }

  if (videos.length === 0) {
    return (
      <Box textAlign="center" mt={10}>
        <Text>No videos available</Text>
      </Box>
    );
  }

  return (
    <VStack spacing={6} mt={10}>
      {videos.map((video) => (
        <VideoStream key={video.id} title={video.title} url={video.url} />
      ))}
    </VStack>
  );
};

export default VideoList;
