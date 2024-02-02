import React, { useState, useEffect } from 'react';
import { Box, Text, useToast, Alert, AlertIcon } from '@chakra-ui/react';

const GpsPosition = () => {
  const [position, setPosition] = useState({ latitude: null, longitude: null });
  const [showInfoMessage, setShowInfoMessage] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
      } else {
        setShowInfoMessage(true); // Show info message when geolocation is not supported
      }
    };

    const showPosition = (position) => {
      setPosition({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    };

    const showError = (error) => {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          toast({
            title: 'User denied the request for Geolocation.',
            status: 'warning',
            duration: 9000,
            isClosable: true,
          });
          break;
        case error.POSITION_UNAVAILABLE:
          toast({
            title: 'Location information is unavailable.',
            status: 'error',
            duration: 9000,
            isClosable: true,
          });
          break;
        case error.TIMEOUT:
          toast({
            title: 'The request to get user location timed out.',
            status: 'error',
            duration: 9000,
            isClosable: true,
          });
          break;
        case error.UNKNOWN_ERROR:
          toast({
            title: 'An unknown error occurred.',
            status: 'error',
            duration: 9000,
            isClosable: true,
          });
          break;
        default:
          toast({
            title: 'An unexpected error occurred.',
            status: 'error',
            duration: 9000,
            isClosable: true,
          });
          break;
      }
    };

    getLocation(); // Get location when the component mounts
  }, [toast]);

  return (
    <Box p={4}>
      {showInfoMessage && (
        <Alert status="info" mt={4}>
          <AlertIcon />
          Merci d'autoriser la géolocalisation
        </Alert>
      )}
      {position.latitude && position.longitude && (
        <Text mt={4}>
          Latitude: {position.latitude}, Longitude: {position.longitude}
        </Text>
      )}
    </Box>
  );
};

export default GpsPosition;
