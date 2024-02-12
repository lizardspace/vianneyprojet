import React, { useState, useEffect } from 'react';
import { Box, Alert, AlertIcon } from '@chakra-ui/react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MdPlace } from 'react-icons/md';
import ReactDOMServer from 'react-dom/server';
import { useGPSPosition } from './../../../../GPSPositionContext'; // Import the custom hook
import { useTeam } from './../TeamContext'; // Import the useTeam hook

const GpsPosition = () => {
  const mapRef = React.useRef(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const { selectedTeam } = useTeam(); // Access the selected team using the hook

  const gpsPosition = useGPSPosition(); // Access the GPS position using the hook

  // Create a custom icon using the MdPlace icon
  const createCustomIcon = () => {
    const placeIconHtml = ReactDOMServer.renderToString(
      <MdPlace style={{ fontSize: '24px', color: 'red' }} />
    );
    return L.divIcon({
      html: placeIconHtml,
      className: 'custom-leaflet-icon',
      iconSize: L.point(30, 30),
      iconAnchor: [15, 30],
      popupAnchor: [0, -50],
    });
  };

  useEffect(() => {
    if (!gpsPosition) {
      // GPS position is not available, show an info message
      return;
    }

    const { latitude, longitude } = gpsPosition;

    // Check if mapRef.current exists and is not destroyed
    if (mapRef.current && !mapRef.current._leaflet_id) {
      // Re-create the map if it's destroyed
      mapRef.current = L.map('map', {
        zoomControl: false, // Disable the default zoom control
      });
      setMapInitialized(false);
    } else if (!mapRef.current) {
      // Create the map if it hasn't been initialized yet
      mapRef.current = L.map('map', {
        zoomControl: false, // Disable the default zoom control
      });
      setMapInitialized(false);
    }

    // Set the view if the map exists
    if (mapRef.current) {
      if (!mapInitialized) {
        // Initialize the map if it hasn't been initialized yet
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '',
        }).addTo(mapRef.current);

        // Add a custom zoom control
        L.control.zoom({ position: 'bottomright' }).addTo(mapRef.current);
        setMapInitialized(true);
      }

      // Create a custom icon using the MdPlace icon
      const customIcon = createCustomIcon();

      // Update the marker position with the custom icon
      L.marker([latitude, longitude], {
        icon: customIcon,
      }).addTo(mapRef.current);

      mapRef.current.setView([latitude, longitude], 13);
    }
  }, [gpsPosition, mapInitialized]);

  return (
    <Box p={4}>
      {gpsPosition ? null : (
        <Alert status="info" mt={4}>
          <AlertIcon />
          Merci d'autoriser la géolocalisation
        </Alert>
      )}

      <Box mb={4}>
        <Alert status="success">
          <AlertIcon />
          Équipe sélectionnée : {selectedTeam}
        </Alert>
      </Box>

      <div
        id="map"
        style={{ height: '500px', width: '100%', zIndex: '0' }}
      ></div>
    </Box>
  );
};

export default GpsPosition;
