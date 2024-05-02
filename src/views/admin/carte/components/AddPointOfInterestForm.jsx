import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Input, Textarea, Button, VStack, Box, useToast } from '@chakra-ui/react';
import { MdAddLocation } from 'react-icons/md';
import { SiTarget } from "react-icons/si";
import { renderToString } from 'react-dom/server';
import { supabase } from './../../../../supabaseClient';
import { useEvent } from './../../../../EventContext';

const AddPointOfInterestForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const mapRef = useRef(null);
  const marker = useRef(null);
  const toast = useToast();
  const { selectedEventId } = useEvent(); // Extract the selectedEventId

  useEffect(() => {
    const map = L.map(mapRef.current).setView([45, 4.7], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    const targetIcon = L.divIcon({
      html: renderToString(<SiTarget style={{ fontSize: '24px', color: '#FF5733' }} />),
      className: 'custom-leaflet-icon',
      iconSize: L.point(30, 30),
      iconAnchor: [15, 15]
    });

    const onClickMap = (e) => {
      setLatitude(e.latlng.lat.toFixed(6));
      setLongitude(e.latlng.lng.toFixed(6));

      if (marker.current) {
        marker.current.setLatLng(e.latlng);
      } else {
        marker.current = L.marker(e.latlng, { icon: targetIcon }).addTo(map);
      }
    };

    map.on('click', onClickMap);

    return () => {
      map.off('click', onClickMap);
      map.remove();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedEventId) {
      toast({
        title: 'Aucun événement sélectionné',
        description: 'Veuillez sélectionner un événement avant d\'ajouter un point d\'intérêt.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (title.trim() === '' || latitude.trim() === '' || longitude.trim() === '') {
      toast({
        title: 'Veuillez remplir tous les champs obligatoires',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const { error } = await supabase
      .from('vianney_points_of_interest')
      .insert([{
        title,
        description,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        event_id: selectedEventId, // Include the event_id here
      }]);

    if (error) {
      toast({
        title: 'Erreur lors de l\'ajout du point d\'intérêt',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } else {
      setTitle('');
      setDescription('');
      setLatitude('');
      setLongitude('');
      marker.current.remove(); // Remove the marker from the map
      marker.current = null; // Reset the marker reference

      toast({
        title: 'Point d\'intérêt ajouté avec succès',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Box ref={mapRef} height="400px" mb="20px" />
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <Input
            placeholder="Titre du point d'intérêt"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <Textarea
            placeholder="Description du point d'intérêt"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Latitude"
            value={latitude}
            onChange={e => setLatitude(e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="Longitude"
            value={longitude}
            onChange={e => setLongitude(e.target.value)}
            required
          />
          <Button
            type="submit"
            leftIcon={<MdAddLocation />}
            colorScheme="orange"
          >
            Ajouter le point d'intérêt
          </Button>
        </VStack>
      </form>
    </>
  );
};

export default AddPointOfInterestForm;