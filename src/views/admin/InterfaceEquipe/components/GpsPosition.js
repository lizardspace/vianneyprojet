import React, { useState, useEffect } from 'react';
import { Box, Alert, AlertIcon } from '@chakra-ui/react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MdPlace } from 'react-icons/md';
import ReactDOMServer from 'react-dom/server';
import { useGPSPosition } from './../../../../GPSPositionContext'; // Import the custom hook
import { useTeam } from './../TeamContext'; // Import the useTeam hook
import { supabase } from './../../../../supabaseClient'; // Import Supabase client

const GpsPosition = () => {
  const mapRef = React.useRef(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const { selectedTeam } = useTeam(); // Access the selected team using the hook
  const gpsPosition = useGPSPosition(); // Access the GPS position using the hook
  const [lastUpdateTime, setLastUpdateTime] = useState(null); // Store the last update time
  const [showTeamAlert, setShowTeamAlert] = useState(true); // State to control the visibility of the team alert
  const [mapHeight, setMapHeight] = useState('250px'); // State to control the height of the map container

  // Function to update latitude and longitude coordinates in the database
  const updateCoordinates = async (teamName, latitude, longitude) => {
    try {
      const { data, error } = await supabase
        .from('vianney_teams')
        .update({ latitude, longitude })
        .eq('name_of_the_team', teamName);
      if (error) {
        throw error;
      }
      console.log('Coordinates updated successfully:', data);
    } catch (error) {
      console.error('Error updating coordinates:', error.message);
    }
  };

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

    // Update coordinates in the database if a team is selected and 30 seconds have passed since the last update
    if (selectedTeam && (!lastUpdateTime || (Date.now() - lastUpdateTime) >= 2000)) {
      updateCoordinates(selectedTeam, latitude, longitude);
      setLastUpdateTime(Date.now());
    }

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

      mapRef.current.setView([latitude, longitude], 16);
    }

    // Hide the team alert after 5 seconds
    const timeout = setTimeout(() => {
      setShowTeamAlert(false);
    }, 5000);

    // Toggle map height after 5 seconds
    const heightTimeout = setTimeout(() => {
      setMapHeight('130px');
    }, 5000);

    // Cleanup timeouts
    return () => {
      clearTimeout(timeout);
      clearTimeout(heightTimeout);
    };
  }, [gpsPosition, mapInitialized, selectedTeam, lastUpdateTime]);

  return (
    <Box p={4}>
      {gpsPosition ? null : (
        <Alert status="info" mt={4}>
          <AlertIcon />
          Merci d'autoriser la géolocalisation
        </Alert>
      )}

      {/* Display team alert only if showTeamAlert is true */}
      {showTeamAlert && (
        <Box mb={4}>
          <Alert status="success">
            <AlertIcon />
            Équipe sélectionnée : {selectedTeam}
          </Alert>
        </Box>
      )}

      <div
        id="map"
        style={{ height: mapHeight, width: '100%', zIndex: '0' }}
      ></div>
    </Box>
  );
};

export default GpsPosition;
