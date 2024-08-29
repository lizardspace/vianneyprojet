import React, { useRef, useEffect, useState } from 'react';
import { Box, Button, Text } from '@chakra-ui/react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';

const VideoStream = () => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [error, setError] = useState(null);
  const [model, setModel] = useState(null);
  const [predictions, setPredictions] = useState([]);

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

    const loadModel = async () => {
      try {
        const loadedModel = await cocoSsd.load();
        setModel(loadedModel);
      } catch (error) {
        console.error('Error loading TensorFlow model: ', error);
        setError('Error loading model. Please try again later.');
      }
    };

    startVideoStream();
    loadModel();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (model && videoRef.current) {
      const detectObjects = async () => {
        if (videoRef.current.readyState === 4) {
          const predictions = await model.detect(videoRef.current);
          setPredictions(predictions);
        }
        requestAnimationFrame(detectObjects);
      };
      detectObjects();
    }
  }, [model]);

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
          <Box>
            {predictions.map((prediction, index) => (
              <Text key={index}>
                {`${prediction.class}: ${Math.round(prediction.score * 100)}%`}
              </Text>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};

export default VideoStream;
