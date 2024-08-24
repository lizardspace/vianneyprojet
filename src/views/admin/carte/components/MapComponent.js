import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { renderToString } from "react-dom/server";
import { Box, Button, useToast, CloseButton } from '@chakra-ui/react';
import { MdPlace, MdOutlineZoomInMap, MdOutlineZoomOutMap, MdDeleteForever } from "react-icons/md";
import { useEvent } from './../../../../EventContext';
import { supabase } from './../../../../supabaseClient';
import { useHistory, useLocation } from "react-router-dom";
import 'leaflet-draw';

const createTeamIcon = () => {
  const placeIconHtml = renderToString(<MdPlace style={{ fontSize: '24px', color: 'red' }} />);
  return L.divIcon({
    html: placeIconHtml,
    className: 'custom-leaflet-icon',
    iconSize: L.point(30, 30),
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });
};

const MapComponent = () => {
  const mapRef = useRef(null);
  const [mapHeight, setMapHeight] = useState('800px');
  const { selectedEventId } = useEvent();
  const history = useHistory();
  const location = useLocation();
  const toast = useToast();

  const buttonText = location.pathname === "/admin/zoomed-map" ?
    <MdOutlineZoomInMap /> :
    <MdOutlineZoomOutMap />;
  const isButtonVisible = location.pathname !== "/admin/zoomed-map";

  const toggleMapView = () => {
    if (location.pathname === "/admin/zoomed-map") {
      history.push("/admin/map");
    } else {
      history.push("/admin/zoomed-map");
    }
  };

  const closeModal = () => {
    if (location.pathname === "/admin/zoomed-map") {
      history.push("/admin/map");
    }
  };

  useEffect(() => {
    const updateMapHeight = () => {
      const newHeight = `${window.innerHeight - 60}px`;
      setMapHeight(newHeight);
    };
    updateMapHeight();
    window.addEventListener('resize', updateMapHeight);
    return () => window.removeEventListener('resize', updateMapHeight);
  }, []);

  useEffect(() => {
    console.log("selectedEventId:", selectedEventId);
    if (!selectedEventId) {
      toast({
        title: 'Erreur',
        description: "L'ID de l'événement est manquant. Impossible d'ajouter l'objet.",
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    let mapInstance = mapRef.current;
    if (!mapInstance) {
      mapInstance = L.map('map').setView([45, 4.7], 7);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: ''
      }).addTo(mapInstance);

      const drawControl = new L.Control.Draw({
        draw: {
          polygon: true,
          polyline: true,
          marker: true,
          circle: false,
          rectangle: false,
        },
        edit: {
          featureGroup: new L.FeatureGroup().addTo(mapInstance),
        },
      });
      mapInstance.addControl(drawControl);
      mapRef.current = mapInstance;

      mapInstance.on(L.Draw.Event.CREATED, async (event) => {
        const layer = event.layer;
        const type = event.layerType;

        if (!selectedEventId) {
          toast({
            title: 'Erreur',
            description: "L'ID de l'événement est manquant. Impossible d'ajouter l'objet.",
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          return;
        }

        let payload = {
          event_id: selectedEventId,
        };

        try {
          if (type === 'marker') {
            payload = {
              ...payload,
              latitude: layer.getLatLng().lat,
              longitude: layer.getLatLng().lng,
            };
            const { error } = await supabase.from('vianney_drawn_markers').insert(payload);
            if (error) throw error;
          } else if (type === 'polyline') {
            const points = layer.getLatLngs().map(latlng => ({
              latitude: latlng.lat,
              longitude: latlng.lng,
            }));
            payload = {
              ...payload,
              points,
            };
            const { error } = await supabase.from('vianney_drawn_polylines').insert(payload);
            if (error) throw error;
          } else if (type === 'polygon') {
            const points = layer.getLatLngs()[0].map(latlng => ({
              latitude: latlng.lat,
              longitude: latlng.lng,
            }));
            payload = {
              ...payload,
              points,
            };
            const { error } = await supabase.from('vianney_drawn_polygons').insert(payload);
            if (error) throw error;
          }

          mapRef.current.addLayer(layer);
          toast({
            title: 'Objet ajouté',
            description: `L'objet a été ajouté avec succès.`,
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
        } catch (error) {
          console.error('Erreur lors de l\'ajout de l\'objet:', error.message);
          toast({
            title: 'Erreur',
            description: "Impossible d'ajouter l'objet. Veuillez réessayer.",
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      });
    }
  }, [selectedEventId, toast]);

  useEffect(() => {
    if (!selectedEventId) {
      console.error('selectedEventId is not defined.');
      return;
    }

    console.log("Using selectedEventId:", selectedEventId);

    const fetchAndDisplayTeams = async () => {
      if (!selectedEventId) return;

      const { data: teams, error } = await supabase
        .from('vianney_teams')
        .select('*')
        .eq('event_id', selectedEventId);

      if (error) {
        console.error('Erreur lors de la récupération des équipes:', error);
        return;
      }

      mapRef.current.eachLayer(layer => {
        if (layer instanceof L.Marker || (layer.options && layer.options.team)) {
          mapRef.current.removeLayer(layer);
        }
      });

      teams.forEach(team => {
        const teamIcon = createTeamIcon();
        const deleteIconHtml = renderToString(<MdDeleteForever style={{ cursor: 'pointer', fontSize: '24px', color: 'red' }} />);

        const wazeUrl = `https://www.waze.com/ul?ll=${team.latitude},${team.longitude}&navigate=yes`;
        const wazeButtonHtml = `<a href="${wazeUrl}" target="_blank" style="display: inline-block; margin-top: 10px; padding: 5px 10px; background-color: #007aff; color: white; text-align: center; text-decoration: none; border-radius: 5px;">Aller vers Waze</a>`;

        const popupContent = `
          <div>
            <strong>${team.name_of_the_team}</strong>
            ${team.photo_profile_url ? `<br/><img src="${team.photo_profile_url}" alt="${team.name_of_the_team}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 50%; margin-top: 5px;"/>` : ''}
            <div onclick="window.deleteTeam(${team.id})" style="margin-top: 10px;">${deleteIconHtml}</div>
            ${wazeButtonHtml}
          </div>
        `;

        const tooltipContent = `
          <div>
            <strong>${team.name_of_the_team}</strong>
          </div>
        `;

        L.marker([team.latitude, team.longitude], { icon: teamIcon, team: true })
          .addTo(mapRef.current)
          .bindPopup(popupContent, {
            permanent: false,
            direction: 'top',
            offset: L.point(0, 40)
          })
          .bindTooltip(tooltipContent, {
            permanent: false,
            direction: 'top',
            offset: L.point(0, -10)
          });
      });
    };

    const fetchAndDisplayDrawnItems = async () => {
      const { data: markers, error: markerError } = await supabase
        .from('vianney_drawn_markers')
        .select('*')
        .eq('event_id', selectedEventId);

      if (markerError) {
        console.error('Erreur lors de la récupération des marqueurs:', markerError);
        return;
      }

      const { data: polylines, error: polylineError } = await supabase
        .from('vianney_drawn_polylines')
        .select('*')
        .eq('event_id', selectedEventId);

      if (polylineError) {
        console.error('Erreur lors de la récupération des polylignes:', polylineError);
        return;
      }

      const { data: polygons, error: polygonError } = await supabase
        .from('vianney_drawn_polygons')
        .select('*')
        .eq('event_id', selectedEventId);

      if (polygonError) {
        console.error('Erreur lors de la récupération des polygones:', polygonError);
        return;
      }

      markers.forEach(marker => {
        L.marker([marker.latitude, marker.longitude]).addTo(mapRef.current);
      });

      polylines.forEach(polyline => {
        const points = polyline.points.map(point => [point.latitude, point.longitude]);
        L.polyline(points, { color: 'blue' }).addTo(mapRef.current);
      });

      polygons.forEach(polygon => {
        const points = polygon.points.map(point => [point.latitude, point.longitude]);
        L.polygon(points, { color: 'red' }).addTo(mapRef.current);
      });
    };

    fetchAndDisplayTeams();
    fetchAndDisplayDrawnItems();
  }, [selectedEventId, toast]);

  return (
    <Box pt="10px" position="relative">
      {isButtonVisible && (
        <Button
          onClick={toggleMapView}
          bg="red.500"
          color="white"
          _hover={{ bg: "red.600" }}
          _active={{ bg: "red.700" }}
        >
          {buttonText}
        </Button>
      )}
      {location.pathname === "/admin/zoomed-map" && (
        <CloseButton 
          position="absolute" 
          top="10px" 
          right="10px" 
          onClick={closeModal} 
          bg="white" 
          color="black" 
          _hover={{ bg: "gray.300" }}
          zIndex="1000" // Assurez que le bouton est bien au-dessus de la carte
        />
      )}
      <div id="map" style={{ height: mapHeight, width: '100%', zIndex: '0' }}></div>
    </Box>
  );
};

export default MapComponent;
