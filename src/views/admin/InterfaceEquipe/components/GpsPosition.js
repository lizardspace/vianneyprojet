import React, { useState } from 'react';
import { Button, Box, Text, useToast } from '@chakra-ui/react';

const GpsPosition = () => {
  const [position, setPosition] = useState({ latitude: null, longitude: null });
  const toast = useToast();

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
      toast({
        title: 'Geolocation is not supported by this browser.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const showPosition = (position) => {
    setPosition({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
  };

  const showError = (error) => {
    switch(error.code) {
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

  return (
    <Box p={4}>
      <Button onClick={getLocation} colorScheme="teal">
        Get GPS Position
      </Button>
      {position.latitude && position.longitude && (
        <Text mt={4}>
          Latitude: {position.latitude}, Longitude: {position.longitude}
        </Text>
      )}
    </Box>
  );
};

export default GpsPosition;
