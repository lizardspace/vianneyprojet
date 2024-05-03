import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Input, Textarea, Button, Box, VStack, useToast } from '@chakra-ui/react';
import { MdSave } from 'react-icons/md';
import { renderToString } from 'react-dom/server';
import { SiTarget } from 'react-icons/si';
import { useEvent } from '../../../../EventContext';
import { supabase } from '../../../../supabaseClient';

const AreaCreationMap = () => {
    const mapRef = useRef(null);
    const markersRef = useRef([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const toast = useToast();
    const { selectedEventId } = useEvent();

    useEffect(() => {
        // Initialisation de la carte
        const map = L.map(mapRef.current).setView([45.764043, 4.835659], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        mapRef.current = map;

        return () => map.remove();
    }, []);

    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;

        // Mise à jour du gestionnaire de clic pour la carte
        const targetIcon = L.divIcon({
            html: renderToString(<SiTarget style={{ fontSize: '24px', color: '#FF5733' }} />),
            className: 'custom-leaflet-icon',
            iconSize: L.point(30, 30),
            iconAnchor: [15, 15]
        });

        const clickHandler = (e) => {
            if (markersRef.current.length < 4) {
                const newMarker = L.marker(e.latlng, { icon: targetIcon }).addTo(map);
                markersRef.current.push(newMarker);
            } else {
                toast({
                    title: "Attention",
                    description: "Maximum de 4 points atteint. Veuillez sauvegarder ou réinitialiser la zone.",
                    status: "warning",
                    duration: 5000,
                    isClosable: true,
                });
            }
        };

        map.on('click', clickHandler);

        return () => {
            map.off('click', clickHandler);
        };
    }, [toast]);

    const saveArea = async () => {
        // Utilisation de markersRef.current pour accéder aux marqueurs actuels
        if (markersRef.current.length === 4 && name && description && selectedEventId) {
            // Construire l'objet area avec les positions des marqueurs de markersRef.current
            const area = {
                name,
                description,
                event_id: selectedEventId, // Including the event_id in the saved area details
                point1_lat: markersRef.current[0].getLatLng().lat,
                point1_lon: markersRef.current[0].getLatLng().lng,
                point2_lat: markersRef.current[1].getLatLng().lat,
                point2_lon: markersRef.current[1].getLatLng().lng,
                point3_lat: markersRef.current[2].getLatLng().lat,
                point3_lon: markersRef.current[2].getLatLng().lng,
                point4_lat: markersRef.current[3].getLatLng().lat,
                point4_lon: markersRef.current[3].getLatLng().lng,
            };
    
            const { error } = await supabase.from('vianney_areas').insert([area]);
    
            if (error) {
                toast({
                    title: "Erreur",
                    description: `Erreur lors de la sauvegarde : ${error.message}`,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: "Succès",
                    description: "Aire sauvegardée avec succès !",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
                resetMarkers(); // Assurez-vous que cette fonction utilise également markersRef.current pour réinitialiser les marqueurs
            }
        } else {
            toast({
                title: "Information manquante",
                description: "Veuillez placer exactement 4 points et remplir tous les champs.",
                status: "info",
                duration: 5000,
                isClosable: true,
            });
        }
    };    

    const resetMarkers = () => {
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = []; // Réinitialiser le tableau de référence des marqueurs
    };    

    return (
        <Box p={4}>
            <VStack spacing={4} mb={4}>
                <Input 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="Nom de l'aire" 
                    focusBorderColor="teal.500"
                />
                <Textarea 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    placeholder="Description" 
                    focusBorderColor="teal.500"
                />
            </VStack>
            <div id="areaCreationMap" style={{ height: '400px', width: '100%' }} ref={mapRef}></div>
            <Button leftIcon={<MdSave />} colorScheme="orange" onClick={saveArea} m={2}>
                Sauvegarder l'aire
            </Button>
            <Button leftIcon={<SiTarget />} colorScheme="gray" onClick={resetMarkers} m={2}>
                Réinitialiser les marqueurs
            </Button>
        </Box>
    );
};

export default AreaCreationMap;