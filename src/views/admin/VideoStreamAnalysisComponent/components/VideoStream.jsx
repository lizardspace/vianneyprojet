import React, { useRef, useEffect, useState } from 'react';
import { Box, Button, Text } from '@chakra-ui/react';

const VideoStream = () => {
  const videoRef = useRef(null);
  const streamRef = useRef(null); 
  const [error, setError] = useState(null);

  useEffect(() => {
    const startVideoStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing webcam: ', error);
        setError('Error accessing webcam. Please check your device and browser settings.');
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
      {error ? (
        <Text color="red">{error}</Text>
      ) : (
        <>
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
        </>
      )}
    </Box>
  );
};

export default VideoStream;
