import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './../../../../supabaseClient';
import {
  Button,
  Input,
  Textarea,
  VStack,
  HStack,
  IconButton,
  Box,
  useToast
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { MdPlace } from 'react-icons/md';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { renderToString } from 'react-dom/server'; // Importez renderToString
import { SiTarget } from "react-icons/si"; // Importez SiTarget
import { useEvent } from './../../../../EventContext';

function CreateItineraryForm() {
  // Les états et références restent inchangés...
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [points, setPoints] = useState([{ order: 1, latitude: '', longitude: '' }]);
  const toast = useToast();
  const mapRefs = useRef([]);
  const markerRefs = useRef([]);
  const { selectedEventId } = useEvent();

useEffect(() => {
  points.forEach((point, index) => {
    const mapId = `map-${index}`;
    if (!mapRefs.current[index]) {
      // Centrer la carte sur Lyon avec un niveau de zoom de 6
      const map = L.map(mapId).setView([45.7484600, 4.8467100], 6);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Création de l'icône personnalisée avec SiTarget
      const targetIconHtml = renderToString(<SiTarget style={{ fontSize: '24px', color: '#FF5733' }} />);
      const customIcon = L.divIcon({
        html: targetIconHtml,
        className: 'custom-leaflet-icon',
        iconSize: L.point(30, 30),
        iconAnchor: [15, 15]
      });

      const marker = L.marker([45.7484600, 4.8467100], { icon: customIcon, draggable: true }).addTo(map);

      marker.on('dragend', function(event) {
        const { lat, lng } = marker.getLatLng();
          handlePointChange(index, 'latitude', lat);
          handlePointChange(index, 'longitude', lng);
      });

      map.on('click', function(e) {
        marker.setLatLng(e.latlng);
          handlePointChange(index, 'latitude', e.latlng.lat);
          handlePointChange(index, 'longitude', e.latlng.lng);
      });

      mapRefs.current[index] = map;
      markerRefs.current[index] = marker;
    }
  });
}, [points]);

  const handlePointChange = (index, field, value) => {
    setPoints((currentPoints) => currentPoints.map((point, i) => {
      if (i === index) {
        return { ...point, [field]: value };
      }
      return point;
    }));
  };

  useEffect(() => {
    // Ensure markers are updated when points state changes
    points.forEach((point, index) => {
      if (point.marker && (point.latitude || point.longitude)) {
        point.marker.setLatLng([point.latitude, point.longitude]);
        point.map.setView([point.latitude, point.longitude], 13);
      }
    });
  }, [points]);

  const addPoint = () => {
    setPoints([...points, { order: points.length + 1, latitude: '', longitude: '', marker: null }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure we have a selected event to link the itinerary to
    if (!selectedEventId) {
      toast({
        title: 'Erreur',
        description: 'Aucun événement sélectionné.',
        status: 'warning',
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    const { error } = await supabase
      .from('vianney_itineraries')
      .insert([
        {
          name,
          description,
          points: points.map(({ map, marker, ...rest }) => rest),
          event_id: selectedEventId, // Include the selectedEventId here
        },
      ]);
    if (error) {
      toast({
        title: 'Erreur lors de la création de l’itinéraire',
        description: error.message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Itinéraire créé avec succès',
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
      // Reset the form or redirect the user...
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={4} align="stretch">
        <Input
          placeholder="Nom de l'itinéraire"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        {points.map((point, index) => (
          <Box key={index}>
            <HStack mb="4">
              <Input
                type="number"
                placeholder="Latitude"
                value={point.latitude}
                onChange={(e) => handlePointChange(index, 'latitude', parseFloat(e.target.value))}
                required
              />
              <Input
                type="number"
                placeholder="Longitude"
                value={point.longitude}
                onChange={(e) => handlePointChange(index, 'longitude', parseFloat(e.target.value))}
                required
              />
            </HStack>
            <Box id={`map-${index}`} height="400px" mb="4" />
          </Box>
        ))}
        <IconButton
          aria-label="Ajouter un point"
          icon={<AddIcon />}
          onClick={addPoint}
        />
        <Button type="submit" leftIcon={<MdPlace />} colorScheme="orange">
          Créer l'itinéraire
        </Button>
      </VStack>
    </form>
  );
}

export default CreateItineraryForm;