import React, { useRef, useEffect, useState } from 'react';
import { Box, Button, Text, UnorderedList, ListItem } from '@chakra-ui/react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';

const VideoStream = () => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [error, setError] = useState(null);
  const [model, setModel] = useState(null);
  const [stablePredictions, setStablePredictions] = useState([]);
  const predictionAccumulator = useRef({});

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

          // Accumulate predictions
          predictions.forEach(prediction => {
            const { class: objectClass } = prediction;
            if (!predictionAccumulator.current[objectClass]) {
              predictionAccumulator.current[objectClass] = {
                count: 0,
                lastDetected: new Date(),
              };
            }
            predictionAccumulator.current[objectClass].count += 1;
            predictionAccumulator.current[objectClass].lastDetected = new Date();
          });

          // Filter stable predictions
          const now = new Date();
          const stable = Object.entries(predictionAccumulator.current)
            .filter(([_, value]) => {
              // Keep only objects detected multiple times and recently
              return value.count > 2 && (now - value.lastDetected) < 1000;
            })
            .map(([key]) => key);

          setStablePredictions(stable);
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
          <Box mt={4} width="100%" textAlign="left">
            <Text fontWeight="bold">Objects detected:</Text>
            <UnorderedList>
              {stablePredictions.length > 0 ? (
                stablePredictions.map((prediction, index) => (
                  <ListItem key={index}>{prediction}</ListItem>
                ))
              ) : (
                <Text>No objects detected.</Text>
              )}
            </UnorderedList>
          </Box>
        </>
      )}
    </Box>
  );
};

export default VideoStream;
