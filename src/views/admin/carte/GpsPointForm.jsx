import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, VStack } from '@chakra-ui/react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEvent } from './../../../EventContext';

// Correction icônes Leaflet dans React
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png';

const defaultIcon = L.icon({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
});

const GpsPointForm = () => {
  const { selectedEventId, selectedEventName, setEvent } = useEvent();
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  const handleMapClick = (e) => {
    setLatitude(e.latlng.lat);
    setLongitude(e.latlng.lng);
  };

  const handleSubmit = () => {
    if (selectedEventId) {
      // Sauvegarder l'événement avec les coordonnées GPS
      setEvent(selectedEventId, selectedEventName, latitude, longitude);
      console.log('Event updated:', { selectedEventId, selectedEventName, latitude, longitude });
    }
  };

  const LocationMarker = () => {
    useMapEvents({
      click: handleMapClick,
    });

    return latitude !== 0 && longitude !== 0 ? (
      <Marker position={[latitude, longitude]} icon={defaultIcon} />
    ) : null;
  };

  return (
    <VStack spacing={4} align="stretch">
      <Box height="400px">
        <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <LocationMarker />
        </MapContainer>
      </Box>

      <FormControl>
        <FormLabel>Latitude</FormLabel>
        <Input value={latitude} isReadOnly />
      </FormControl>

      <FormControl>
        <FormLabel>Longitude</FormLabel>
        <Input value={longitude} isReadOnly />
      </FormControl>

      <Button colorScheme="teal" onClick={handleSubmit}>
        Sauvegarder les coordonnées GPS
      </Button>
    </VStack>
  );
};

export default GpsPointForm;
