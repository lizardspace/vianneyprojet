import React, { useState, useEffect } from 'react';
import { Box, Text, useToast, Alert, AlertIcon } from '@chakra-ui/react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const GpsPosition = () => {
  const [position, setPosition] = useState({ latitude: null, longitude: null });
  const [showInfoMessage, setShowInfoMessage] = useState(false);
  const toast = useToast();
  const mapRef = React.useRef(null);

  useEffect(() => {
    const watchLocation = () => {
      if (navigator.geolocation) {
        const watchId = navigator.geolocation.watchPosition(
          (newPosition) => {
            showPosition(newPosition);
          },
          showError
        );
        return () => {
          navigator.geolocation.clearWatch(watchId);
        };
      } else {
        setShowInfoMessage(true); // Show info message when geolocation is not supported
      }
    };

    const showPosition = (newPosition) => {
      const { latitude, longitude } = newPosition.coords;
      setPosition({ latitude, longitude });

      // Initialize the map if it hasn't been initialized yet
      if (!mapRef.current) {
        mapRef.current = L.map('map').setView([latitude, longitude], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: ''
        }).addTo(mapRef.current);
      }

      // Update the marker position
      if (mapRef.current) {
        const marker = L.marker([latitude, longitude]).addTo(mapRef.current);
        mapRef.current.setView([latitude, longitude], 13);
      }
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

    watchLocation(); // Start watching for location updates when the component mounts

    // Clean up the watch when the component unmounts
    return () => {
      navigator.geolocation.clearWatch();
    };
  }, [toast]);

  return (
    <Box p={4}>
      {showInfoMessage && (
        <Alert status="info" mt={4}>
          <AlertIcon />
          Merci d'autoriser la géolocalisation
        </Alert>
      )}
      <Text fontSize="xl" fontWeight="bold">
        Votre position:
      </Text>
      <div
        id="map"
        style={{ height: '500px', width: '100%', zIndex: '-1' }}
      ></div>
    </Box>
  );
};

export default GpsPosition;
