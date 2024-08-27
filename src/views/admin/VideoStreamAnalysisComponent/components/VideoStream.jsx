import React, { useRef, useEffect } from 'react';
import { Box, Button } from '@chakra-ui/react';

const VideoStream = () => {
  const videoRef = useRef(null);
  const streamRef = useRef(null); // New ref to store the stream

  useEffect(() => {
    const startVideoStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream; // Store the stream in the ref
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing webcam: ', error);
      }
    };

    startVideoStream();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
      <Box 
        as="video" 
        ref={videoRef} 
        autoPlay 
        width="100%" 
        height="auto" 
        borderRadius="md" 
        boxShadow="md" 
        mb={4}
      />
      <Button onClick={() => { if (videoRef.current) videoRef.current.srcObject = null }} colorScheme="red">
        Stop Video
      </Button>
    </Box>
  );
};

export default VideoStream;
