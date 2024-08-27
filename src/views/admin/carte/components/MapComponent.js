import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { renderToString } from "react-dom/server";
import {
  Box, Button, useToast, CloseButton, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader,
  AlertDialogContent, AlertDialogOverlay, Input, VStack, HStack, FormControl, FormLabel, Textarea
} from '@chakra-ui/react';
import { MdPlace, MdOutlineZoomInMap, MdOutlineZoomOutMap, MdDeleteForever } from "react-icons/md";
import { useEvent } from './../../../../EventContext';
import { supabase } from './../../../../supabaseClient';
import { useHistory, useLocation } from "react-router-dom";
import 'leaflet-draw';
import 'leaflet-routing-machine';

const createTeamIcon = () => {
  const placeIconHtml = renderToString(<MdPlace style={{ fontSize: '24px', color: 'red' }} />);
  return L.divIcon({
    html: placeIconHtml,
    className: 'custom-leaflet-icon',
    iconSize: L.point(30, 30),
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
};

const createCustomIcon = () => {
  const placeIconHtml = renderToString(<MdPlace style={{ fontSize: '24px', color: '#34A853' }} />);
  return L.divIcon({
    html: placeIconHtml,
    className: 'custom-leaflet-icon',
    iconSize: L.point(30, 30),
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
};

const MapComponent = () => {
  const mapRef = useRef(null);
  const routingControlRef = useRef(null);
  const [mapHeight, setMapHeight] = useState('800px');
  const { selectedEventId } = useEvent();
  const history = useHistory();
  const location = useLocation();
  const toast = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [elementToDelete, setElementToDelete] = useState(null);
  const cancelRef = useRef();

  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [newElementName, setNewElementName] = useState('');
  const [pendingLayer, setPendingLayer] = useState(null);
  const [pendingType, setPendingType] = useState(null);

  const [startLat, setStartLat] = useState('');
  const [startLng, setStartLng] = useState('');
  const [endLat, setEndLat] = useState('');
  const [endLng, setEndLng] = useState('');
  const [itineraryText, setItineraryText] = useState('');
  const [latestItineraryText, setLatestItineraryText] = useState('');
  const [selectingStart, setSelectingStart] = useState(false);
  const [selectingEnd, setSelectingEnd] = useState(false);
  const [showRouteDetails, setShowRouteDetails] = useState(false);

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

  const openDeleteDialog = (layer, type, id) => {
    setElementToDelete({ layer, type, id });
    setIsDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDialogOpen(false);
    setElementToDelete(null);
  };

  const confirmDelete = async () => {
    const { layer, type, id } = elementToDelete;
    try {
      let tableName = '';
      if (type === 'marker') tableName = 'vianney_drawn_markers';
      if (type === 'polyline') tableName = 'vianney_drawn_polylines';
      if (type === 'polygon') tableName = 'vianney_drawn_polygons';
      if (type === 'circlemarker') tableName = 'vianney_drawn_circle_markers';

      const { error } = await supabase
        .from(tableName)
        .delete()
        .match({ id, event_id: selectedEventId });

      if (error) throw error;

      mapRef.current.removeLayer(layer);
      toast({
        title: 'Élément supprimé',
        description: 'L\'élément a été supprimé avec succès.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'élément:', error.message);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer l\'élément. Veuillez réessayer.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      closeDeleteDialog();
    }
  };

  const openNameModal = (layer, type) => {
    setPendingLayer(layer);
    setPendingType(type);
    setIsNameModalOpen(true);
  };

  const handleAddElement = async (layer, type, nameElement) => {
    let payload = {
      event_id: selectedEventId,
      name_element: nameElement || null,
    };

    try {
      let insertedItem;
      if (type === 'marker') {
        payload = {
          ...payload,
          latitude: layer.getLatLng().lat,
          longitude: layer.getLatLng().lng,
        };
        const { data, error } = await supabase.from('vianney_drawn_markers').insert(payload).select().single();
        if (error) throw error;
        insertedItem = data;

        layer.setIcon(createCustomIcon());

        const wazeUrl = `https://www.waze.com/ul?ll=${layer.getLatLng().lat},${layer.getLatLng().lng}&navigate=yes`;
        const wazeButtonHtml = `<a href="${wazeUrl}" target="_blank" style="display: inline-block; margin-top: 10px; padding: 5px 10px; background-color: #007aff; color: white; text-align: center; text-decoration: none; border-radius: 5px;">Se rendre sur place</a>`;
        const deleteButtonHtml = renderToString(<MdDeleteForever style={{ cursor: 'pointer', fontSize: '24px', color: 'red' }} />);

        const popupContent = `
          <div>
            <strong>${nameElement || 'Élément'}</strong>
            <div onclick="window.deleteItem('${type}', '${insertedItem.id}')">${deleteButtonHtml}</div>
            ${wazeButtonHtml}
          </div>
        `;

        layer.bindPopup(popupContent).bindTooltip(nameElement || 'Élément');
      } else if (type === 'polyline') {
        const points = layer.getLatLngs().map(latlng => ({
          latitude: latlng.lat,
          longitude: latlng.lng,
        }));
        payload = {
          ...payload,
          points,
        };
        const { data, error } = await supabase.from('vianney_drawn_polylines').insert(payload).select().single();
        if (error) throw error;
        insertedItem = data;

        layer.bindTooltip(nameElement || 'Ligne').on('click', () => openDeleteDialog(layer, type, insertedItem.id));
      } else if (type === 'polygon') {
        const points = layer.getLatLngs()[0].map(latlng => ({
          latitude: latlng.lat,
          longitude: latlng.lng,
        }));
        payload = {
          ...payload,
          points,
        };
        const { data, error } = await supabase.from('vianney_drawn_polygons').insert(payload).select().single();
        if (error) throw error;
        insertedItem = data;

        const firstPoint = points[0];
        const wazeUrl = `https://www.waze.com/ul?ll=${firstPoint.latitude},${firstPoint.longitude}&navigate=yes`;
        const wazeButtonHtml = `<a href="${wazeUrl}" target="_blank" style="display: inline-block; margin-top: 10px; padding: 5px 10px; background-color: #007aff; color: white; text-align: center; text-decoration: none; border-radius: 5px;">Se rendre sur place</a>`;
        const deleteButtonHtml = renderToString(<MdDeleteForever style={{ cursor: 'pointer', fontSize: '24px', color: 'red' }} />);

        const popupContent = `
          <div>
            <strong>${nameElement || 'Polygone'}</strong>
            <div onclick="window.deleteItem('${type}', '${insertedItem.id}')">${deleteButtonHtml}</div>
            ${wazeButtonHtml}
          </div>
        `;

        layer.bindPopup(popupContent).bindTooltip(nameElement || 'Polygone').on('click', () => openDeleteDialog(layer, type, insertedItem.id));
      } else if (type === 'circlemarker') {
        payload = {
          ...payload,
          latitude: layer.getLatLng().lat,
          longitude: layer.getLatLng().lng,
          radius: layer.getRadius(),
        };
        const { data, error } = await supabase.from('vianney_drawn_circle_markers').insert(payload).select().single();
        if (error) throw error;
        insertedItem = data;

        const wazeUrl = `https://www.waze.com/ul?ll=${layer.getLatLng().lat},${layer.getLatLng().lng}&navigate=yes`;
        const wazeButtonHtml = `<a href="${wazeUrl}" target="_blank" style="display: inline-block; margin-top: 10px; padding: 5px 10px; background-color: #007aff; color: white; text-align: center; text-decoration: none; border-radius: 5px;">Se rendre sur place</a>`;
        const deleteButtonHtml = renderToString(<MdDeleteForever style={{ cursor: 'pointer', fontSize: '24px', color: 'red' }} />);

        const popupContent = `
          <div>
            <strong>${nameElement || 'Cercle'}</strong>
            <div onclick="window.deleteItem('${type}', '${insertedItem.id}')">${deleteButtonHtml}</div>
            ${wazeButtonHtml}
          </div>
        `;

        layer.bindPopup(popupContent).bindTooltip(nameElement || 'Cercle');
      }

      window.deleteItem = (type, id) => openDeleteDialog(layer, type, id);

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
  };

  const formatItineraryText = (itineraryText) => {
    if (!itineraryText) return '';

    const instructions = itineraryText.split('Instructions: ')[1];

    if (!instructions) return itineraryText;

    const steps = instructions.split(' -> ');

    const formattedSteps = steps.map((step, index) => {
      return `${index + 1}. ${step}`;
    }).join('\n');

    const [distanceDuration] = itineraryText.split('. Instructions:');
    return `${distanceDuration}.\n\n${formattedSteps}`;
  };

  const displayRoute = useCallback((route) => {
    return new Promise((resolve) => {
      if (routingControlRef.current) {
        mapRef.current.removeControl(routingControlRef.current);
      }

      const startPoint = L.latLng(route.start_latitude, route.start_longitude);
      const endPoint = L.latLng(route.end_latitude, route.end_longitude);

      routingControlRef.current = L.Routing.control({
        waypoints: [startPoint, endPoint],
        routeWhileDragging: false,
        show: showRouteDetails,
        createMarker: function () { return null; },
        lineOptions: {
          styles: [{ color: '#34A853', weight: 4 }]
        },
        language: 'fr',
        router: new L.Routing.OSRMv1({
          language: 'fr',
          profile: 'car',
        }),
        formatter: new L.Routing.Formatter({
          language: 'fr'
        })
      }).addTo(mapRef.current);

      routingControlRef.current.on('routesfound', function (e) {
        const routes = e.routes;
        const summary = routes[0].summary;
        const instructions = routes[0].instructions.map(instr => instr.text).join(' -> ');

        const fullItineraryText = `Distance: ${summary.totalDistance} m, Durée: ${summary.totalTime} s. Instructions: ${instructions}`;
        console.log(fullItineraryText);

        resolve();
      });
    });
  }, [showRouteDetails]);

  const loadAndDisplaySavedRoutes = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('vianney_itineraire_carte')
        .select('*')
        .eq('event_id', selectedEventId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        throw error;
      }

      if (data.length === 0) {
        console.log("Aucun itinéraire trouvé pour cet événement.");
        return;
      }

      const lastRoute = data[0];
      setLatestItineraryText(lastRoute.itinerary_text);
      await displayRoute(lastRoute);

    } catch (error) {
      console.error('Erreur lors du chargement des itinéraires depuis la base de données:', error.message);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les itinéraires depuis la base de données. Veuillez réessayer.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [displayRoute, selectedEventId, toast]);

  const handleRouteCalculation = () => {
    if (!mapRef.current) return;

    if (routingControlRef.current) {
      mapRef.current.removeControl(routingControlRef.current);
    }

    const startPoint = L.latLng(parseFloat(startLat), parseFloat(startLng));
    const endPoint = L.latLng(parseFloat(endLat), parseFloat(endLng));

    routingControlRef.current = L.Routing.control({
      waypoints: [startPoint, endPoint],
      routeWhileDragging: true,
      show: showRouteDetails,
      createMarker: function () { return null; },
      lineOptions: {
        styles: [{ color: '#6FA1EC', weight: 4 }]
      },
      language: 'fr',
      router: new L.Routing.OSRMv1({
        language: 'fr',
        profile: 'car',
      }),
      formatter: new L.Routing.Formatter({
        language: 'fr'
      })
    }).addTo(mapRef.current);

    routingControlRef.current.on('routesfound', async function (e) {
      const routes = e.routes;
      const summary = routes[0].summary;
      const instructions = routes[0].instructions.map(instr => instr.text).join(' -> ');

      const fullItineraryText = `Distance: ${summary.totalDistance} m, Durée: ${summary.totalTime} s. Instructions: ${instructions}`;
      const formattedItinerary = formatItineraryText(fullItineraryText);

      setItineraryText(formattedItinerary);

      await saveItinerary(startLat, startLng, endLat, endLng, formattedItinerary);

      loadAndDisplaySavedRoutes();
    });
  };

  const saveItinerary = async (startLat, startLng, endLat, endLng, itineraryText) => {
    console.log("Saving itinerary...");
    try {
      const { data, error } = await supabase
        .from('vianney_itineraire_carte')
        .insert([
          {
            event_id: selectedEventId,
            start_latitude: startLat,
            start_longitude: startLng,
            end_latitude: endLat,
            end_longitude: endLng,
            itinerary_text: itineraryText
          }
        ])
        .single();

      if (error) throw error;

      console.log("Itinerary saved:", data);

      toast({
        title: 'Itinéraire enregistré',
        description: 'L\'itinéraire a été enregistré avec succès dans la base de données.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de l\'itinéraire:', error.message);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'enregistrer l\'itinéraire. Veuillez réessayer.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
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
          circlemarker: true,
        },
        edit: {
          featureGroup: new L.FeatureGroup().addTo(mapInstance),
        },
      });
      mapInstance.addControl(drawControl);
      mapRef.current = mapInstance;

      mapInstance.on(L.Draw.Event.CREATED, (event) => {
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

        openNameModal(layer, type);
      });
    }

    loadAndDisplaySavedRoutes();

  }, [selectedEventId, toast, loadAndDisplaySavedRoutes]);

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

        const tooltipContent = team.name_of_the_team;

        const marker = L.marker([team.latitude, team.longitude], { icon: teamIcon, team: true });

        marker.addTo(mapRef.current)
          .bindPopup(popupContent, {
            offset: L.point(0, -30),
            direction: 'top'
          })
          .bindTooltip(tooltipContent, {
            permanent: false,
            direction: 'top',
            offset: L.point(0, -30)
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

      const { data: circleMarkers, error: circleMarkerError } = await supabase
        .from('vianney_drawn_circle_markers')
        .select('*')
        .eq('event_id', selectedEventId);

      if (circleMarkerError) {
        console.error('Erreur lors de la récupération des cercles:', circleMarkerError);
        return;
      }

      markers.forEach(marker => {
        const layer = L.marker([marker.latitude, marker.longitude], { icon: createCustomIcon() });

        const wazeUrl = `https://www.waze.com/ul?ll=${marker.latitude},${marker.longitude}&navigate=yes`;
        const wazeButtonHtml = `<a href="${wazeUrl}" target="_blank" style="display: inline-block; margin-top: 10px; padding: 5px 10px; background-color: #007aff; color: white; text-align: center; text-decoration: none; border-radius: 5px;">Se rendre sur place</a>`;
        const deleteButtonHtml = renderToString(<MdDeleteForever style={{ cursor: 'pointer', fontSize: '24px', color: 'red' }} />);

        const popupContent = `
          <div>
            <strong>${marker.name_element || 'Marker'}</strong>
            <div onclick="window.deleteItem('marker', '${marker.id}')">${deleteButtonHtml}</div>
            ${wazeButtonHtml}
          </div>
        `;

        layer.bindPopup(popupContent).bindTooltip(marker.name_element || 'Marker');
        window.deleteItem = (type, id) => openDeleteDialog(layer, type, id);

        layer.addTo(mapRef.current);
      });

      polylines.forEach(polyline => {
        const points = polyline.points.map(point => [point.latitude, point.longitude]);
        const layer = L.polyline(points, { color: 'blue' });
        const nameElement = polyline.name_element || 'Polyline';
        layer.bindTooltip(nameElement).on('click', () => openDeleteDialog(layer, 'polyline', polyline.id));
        layer.addTo(mapRef.current);
      });

      polygons.forEach(polygon => {
        const points = polygon.points.map(point => [point.latitude, point.longitude]);
        const layer = L.polygon(points, { color: 'red' });
        const nameElement = polygon.name_element || 'Polygon';

        const firstPoint = points[0];
        const wazeUrl = `https://www.waze.com/ul?ll=${firstPoint[0]},${firstPoint[1]}&navigate=yes`;
        const wazeButtonHtml = `<a href="${wazeUrl}" target="_blank" style="display: inline-block; margin-top: 10px; padding: 5px 10px; background-color: #007aff; color: white; text-align: center; text-decoration: none; border-radius: 5px;">Se rendre sur place</a>`;
        const deleteButtonHtml = renderToString(<MdDeleteForever style={{ cursor: 'pointer', fontSize: '24px', color: 'red' }} />);

        const popupContent = `
          <div>
            <strong>${nameElement}</strong>
            <div onclick="window.deleteItem('polygon', '${polygon.id}')">${deleteButtonHtml}</div>
            ${wazeButtonHtml}
          </div>
        `;

        layer.bindPopup(popupContent).bindTooltip(nameElement).on('click', () => openDeleteDialog(layer, 'polygon', polygon.id));
        layer.addTo(mapRef.current);
      });

      circleMarkers.forEach(circleMarker => {
        const layer = L.circleMarker([circleMarker.latitude, circleMarker.longitude], {
          radius: circleMarker.radius,
          color: '#34A853',
        });

        const wazeUrl = `https://www.waze.com/ul?ll=${circleMarker.latitude},${circleMarker.longitude}&navigate=yes`;
        const wazeButtonHtml = `<a href="${wazeUrl}" target="_blank" style="display: inline-block; margin-top: 10px; padding: 5px 10px; background-color: #007aff; color: white; text-align: center; text-decoration: none; border-radius: 5px;">Se rendre sur place</a>`;
        const deleteButtonHtml = renderToString(<MdDeleteForever style={{ cursor: 'pointer', fontSize: '24px', color: 'red' }} />);

        const popupContent = `
          <div>
            <strong>${circleMarker.name_element || 'CircleMarker'}</strong>
            <div onclick="window.deleteItem('circlemarker', '${circleMarker.id}')">${deleteButtonHtml}</div>
            ${wazeButtonHtml}
          </div>
        `;

        layer.bindPopup(popupContent).bindTooltip(circleMarker.name_element || 'CircleMarker');
        window.deleteItem = (type, id) => openDeleteDialog(layer, type, id);

        layer.addTo(mapRef.current);
      });
    };

    fetchAndDisplayTeams();
    fetchAndDisplayDrawnItems();
  }, [selectedEventId, toast]);

  const createBlueIcon = () => {
    const placeIconHtml = renderToString(<MdPlace style={{ fontSize: '24px', color: 'blue' }} />);
    return L.divIcon({
      html: placeIconHtml,
      className: 'custom-leaflet-icon',
      iconSize: L.point(30, 30),
      iconAnchor: [15, 30],
      popupAnchor: [0, -30],
    });
  };

  const [startMarker, setStartMarker] = useState(null);
  const [endMarker, setEndMarker] = useState(null);

  useEffect(() => {
    if (mapRef.current) {
      const handleStartSelection = (e) => {
        if (selectingStart) {
          setStartLat(e.latlng.lat);
          setStartLng(e.latlng.lng);

          if (startMarker) {
            mapRef.current.removeLayer(startMarker);
          }

          const marker = L.marker([e.latlng.lat, e.latlng.lng], { icon: createBlueIcon() }).addTo(mapRef.current);
          setStartMarker(marker);

          setSelectingStart(false);
        }
      };

      mapRef.current.on('click', handleStartSelection);

      return () => {
        mapRef.current.off('click', handleStartSelection);
      };
    }
  }, [selectingStart, startMarker]);

  useEffect(() => {
    if (mapRef.current) {
      const handleEndSelection = (e) => {
        if (selectingEnd) {
          setEndLat(e.latlng.lat);
          setEndLng(e.latlng.lng);

          if (endMarker) {
            mapRef.current.removeLayer(endMarker);
          }

          const marker = L.marker([e.latlng.lat, e.latlng.lng], { icon: createBlueIcon() }).addTo(mapRef.current);
          setEndMarker(marker);

          setSelectingEnd(false);
        }
      };

      mapRef.current.on('click', handleEndSelection);

      return () => {
        mapRef.current.off('click', handleEndSelection);
      };
    }
  }, [selectingEnd, endMarker]);

  const handleNameSubmit = () => {
    if (pendingLayer && pendingType) {
      handleAddElement(pendingLayer, pendingType, newElementName);
    }
    setIsNameModalOpen(false);
    setNewElementName('');
    setPendingLayer(null);
    setPendingType(null);
  };

  return (
    <Box pt="10px" position="relative">
      <VStack spacing={4} p={4} bg="gray.100" borderRadius="md" boxShadow="md">
        <HStack spacing={4}>
          <FormControl>
            <FormLabel>Latitude de départ</FormLabel>
            <Input
              placeholder="Latitude de départ"
              value={startLat}
              onChange={(e) => setStartLat(e.target.value)}
              type="number"
              step="any"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Longitude de départ</FormLabel>
            <Input
              placeholder="Longitude de départ"
              value={startLng}
              onChange={(e) => setStartLng(e.target.value)}
              type="number"
              step="any"
            />
          </FormControl>
        </HStack>
        <HStack spacing={4}>
          <FormControl>
            <FormLabel>Latitude d'arrivée</FormLabel>
            <Input
              placeholder="Latitude d'arrivée"
              value={endLat}
              onChange={(e) => setEndLat(e.target.value)}
              type="number"
              step="any"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Longitude d'arrivée</FormLabel>
            <Input
              placeholder="Longitude d'arrivée"
              value={endLng}
              onChange={(e) => setEndLng(e.target.value)}
              type="number"
              step="any"
            />
          </FormControl>
        </HStack>
        <Button colorScheme="blue" onClick={handleRouteCalculation}>
          Calculer l'itinéraire
        </Button>
        <Textarea
          placeholder="Détails de l'itinéraire"
          value={itineraryText}
          onChange={(e) => setItineraryText(e.target.value)}
          readOnly
        />
        <Textarea
          placeholder="Itinéraire le plus récent"
          value={formatItineraryText(latestItineraryText)}
          readOnly
        />
      </VStack>
      <HStack spacing={4}>
        <Button
          colorScheme={selectingStart ? "green" : "blue"}
          onClick={() => {
            setSelectingStart(true);
            setSelectingEnd(false);
          }}
        >
          Sélectionner le point de départ sur la carte
        </Button>
        <Button
          colorScheme={selectingEnd ? "green" : "blue"}
          onClick={() => {
            setSelectingStart(false);
            setSelectingEnd(true);
          }}
        >
          Sélectionner le point d'arrivée sur la carte
        </Button>
      </HStack>
      <Button
        colorScheme={showRouteDetails ? "red" : "green"}
        onClick={() => setShowRouteDetails(prev => !prev)}
      >
        {showRouteDetails ? "Masquer les détails" : "Afficher les détails"}
      </Button>

      {isButtonVisible && (
        <Button
          onClick={toggleMapView}
          bg="red.500"
          color="white"
          _hover={{ bg: "red.600" }}
          _active={{ bg: "red.700" }}
          mt={4}
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
          zIndex="1000"
        />
      )}

      <div id="map" style={{ height: mapHeight, width: '100%', zIndex: '0' }}></div>

      <AlertDialog
        isOpen={isDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={closeDeleteDialog}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Supprimer l'élément
            </AlertDialogHeader>

            <AlertDialogBody>
              Voulez-vous vraiment supprimer cet élément ?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={closeDeleteDialog}>
                Annuler
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                Supprimer
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <AlertDialog
        isOpen={isNameModalOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsNameModalOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Entrez le nom de l'élément
            </AlertDialogHeader>

            <AlertDialogBody>
              <Input
                placeholder="Nom de l'élément"
                value={newElementName}
                onChange={(e) => setNewElementName(e.target.value)}
              />
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={() => setIsNameModalOpen(false)}>
                Annuler
              </Button>
              <Button colorScheme="green" onClick={handleNameSubmit} ml={3}>
                Enregistrer
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default MapComponent;
