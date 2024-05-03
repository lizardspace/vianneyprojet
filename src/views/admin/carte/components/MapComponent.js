import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { SlTarget } from "react-icons/sl";
import { MdDeleteForever, MdOutlineZoomInMap, MdOutlineZoomOutMap } from "react-icons/md"; // Import des icônes MdOutlineZoomInMap et MdOutlineZoomOutMap
import { renderToString } from "react-dom/server";
import { Box, Button, IconButton, Tooltip, useToast } from '@chakra-ui/react';
import { MdPlace } from "react-icons/md";
import { FcAutomotive, FcAddRow, FcCollect } from "react-icons/fc";
import CreateItineraryForm from './CreateItineraryForm';
import AddPointOfInterestForm from './AddPointOfInterestForm';
import { useEvent } from './../../../../EventContext';
import { supabase } from './../../../../supabaseClient';
import AreaCreationMap from './AreaCreationMap';
import { useHistory, useLocation } from "react-router-dom";

const createCustomIcon = () => {
  const placeIconHtml = renderToString(<MdPlace style={{ fontSize: '24px', color: 'red' }} />);
  return L.divIcon({
    html: placeIconHtml,
    className: 'custom-leaflet-icon',
    iconSize: L.point(30, 30),
    iconAnchor: [15, 30],
    popupAnchor: [0, -50]
  });
};

const createPoiIcon = () => {
  const poiIconHtml = renderToString(<SlTarget style={{ fontSize: '24px', color: 'blue' }} />);
  return L.divIcon({
    html: poiIconHtml,
    className: 'custom-leaflet-icon',
    iconSize: L.point(30, 30),
    iconAnchor: [15, 30],
    popupAnchor: [0, -30] // Ajustez selon le besoin
  });
};


const MapComponent = () => {
  const [showForm, setShowForm] = useState(false);
  const [showFormBis, setShowFormBis] = useState(false);
  const [showFormBisBis, setShowFormBisBis] = useState(false);
  const mapRef = useRef(null);
  const [itineraries, setItineraries] = useState([]);
  const { selectedEventId } = useEvent();
  const [areas] = useState([]);
  const [mapHeight, setMapHeight] = useState('800px');
  // Suppression des états inutilisés : showForm, showFormBis, showFormBisBis
  const [activeForm, setActiveForm] = useState('');
  // Autres états et hooks restent inchangés...
  const history = useHistory(); // Créez une instance de useHistory
  const location = useLocation();

  const buttonText = location.pathname === "/admin/zoomed-map" ?
    <MdOutlineZoomInMap /> : // Utilisation de l'icône MdOutlineZoomOutMap si l'URL correspond
    <MdOutlineZoomOutMap />; // Utilisation de l'icône MdOutlineZoomInMap sinon

  // Autres parties du code inchangées...

  const toggleMapView = () => {
    if (location.pathname === "/admin/zoomed-map") {
      history.push("/admin/map"); // Si nous sommes sur la carte zoomée, retournez à la carte dézoomée
    } else {
      history.push("/admin/zoomed-map"); // Sinon, allez à la carte zoomée
    }
  };
  // Déterminez le texte du bouton en fonction de l'URL actuelle
  const mapiszoomed = location.pathname === "/admin/zoomed-map";
  const isButtonVisible = !mapiszoomed;
  const toggleFormAndSetVisibility = (formName) => {
    // Basculer le formulaire actif
    toggleForm(formName);

    // Alternativement, ajuster la visibilité basée sur le formulaire actif
    // Cela suppose que vous ne voulez pas gérer indépendamment les états de visibilité
    // mais plutôt lier la visibilité au formulaire actif
    setShowForm(formName === 'itinerary');
    setShowFormBis(formName === 'poi');
    setShowFormBisBis(formName === 'area');
  };

  const toggleForm = (formName) => {
    if (activeForm === formName) {
      setActiveForm(''); // Si le formulaire est déjà ouvert, le fermer.
    } else {
      setActiveForm(formName); // Sinon, ouvrir le formulaire demandé.
    }
  };
  const toast = useToast();

  useEffect(() => {
    // Fonction pour mettre à jour la hauteur
    const updateMapHeight = () => {
      const newHeight = `${window.innerHeight - 60}px`; // Hauteur de l'écran moins 100 pixels
      setMapHeight(newHeight);
    };

    // Mettre à jour la hauteur au montage du composant
    updateMapHeight();

    // Ajouter un écouteur d'événement pour mettre à jour la hauteur lors du redimensionnement de la fenêtre
    window.addEventListener('resize', updateMapHeight);

    // Nettoyer l'écouteur d'événement lors du démontage du composant
    return () => window.removeEventListener('resize', updateMapHeight);
  }, []);


  useEffect(() => {
    const deleteArea = async (areaId) => {
      try {
        const { error } = await supabase
          .from('vianney_areas')
          .delete()
          .match({ id: areaId });

        if (error) throw error;

        // Afficher un toast de succès
        toast({
          title: 'Aire supprimée',
          description: `L'aire avec l'ID ${areaId} a été supprimée avec succès.`,
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'bottom',
        });

      } catch (error) {
        console.error('Erreur lors de la suppression de l\'aire:', error.message);

        // Afficher un toast d'échec
        toast({
          title: 'Échec de la suppression',
          description: "Impossible de supprimer l'aire. Veuillez réessayer.",
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'bottom',
        });
      }
    };
    window.deleteArea = deleteArea; // Expose la fonction pour l'utiliser dans le onClick HTML
    return () => {
      delete window.deleteArea; // Nettoyage pour éviter des fuites de mémoire
    };
  }, [toast]);

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const { data: fetchedItineraries, error } = await supabase
          .from('vianney_itineraries')
          .select('*')
          .eq('event_id', selectedEventId); // Assurez-vous que selectedEventId est correctement défini

        if (error) {
          throw error;
        }

        setItineraries(fetchedItineraries); // Met à jour l'état des itinéraires
      } catch (error) {
        console.error('Erreur lors de la récupération des itinéraires:', error.message);
        // Vous pouvez aussi utiliser un toast pour afficher l'erreur
      }
    };
    const deleteItinerary = async (itineraryId) => {
      try {
        const { error } = await supabase
          .from('vianney_itineraries')
          .delete()
          .match({ id: itineraryId });

        if (error) throw error;

        toast({
          title: 'Itinéraire supprimé',
          description: `L'itinéraire avec l'ID ${itineraryId} a été supprimé avec succès.`,
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'bottom',
        });

        // Re-fetch les itinéraires pour mettre à jour l'affichage
        fetchItineraries();
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'itinéraire:', error.message);

        toast({
          title: 'Échec de la suppression',
          description: "Impossible de supprimer l'itinéraire. Veuillez réessayer.",
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'bottom',
        });
      }
    };

    window.deleteItinerary = deleteItinerary;

    return () => {
      delete window.deleteItinerary;
    };
  }, [toast, selectedEventId]);

  // Utilisez toggleFormAndSetVisibility à la place de toggleForm dans onClick
  useEffect(() => {
    const fetchAndDisplayAreas = async () => {
      if (!selectedEventId) {
        console.log('Aucun event_id sélectionné.');
        return;
      }

      const { data: fetchedAreas, error } = await supabase
        .from('vianney_areas')
        .select('*')
        .eq('event_id', selectedEventId);

      if (error) {
        console.error('Erreur lors de la récupération des aires:', error);
        return;
      }

      let mapInstance = mapRef.current;
      if (!mapInstance) {
        console.log('Instance de carte non initialisée.');
        return;
      }

      // Nettoyage des couches de polygones précédentes
      mapInstance.eachLayer(layer => {
        if (layer instanceof L.Polygon) {
          mapInstance.removeLayer(layer);
        }
      });

      fetchedAreas.forEach(area => {
        const points = [
          [area.point1_lat, area.point1_lon],
          [area.point2_lat, area.point2_lon],
          [area.point3_lat, area.point3_lon],
          [area.point4_lat, area.point4_lon],
        ];

        const centroid = calculateCentroid(points);
        const sortedPoints = sortPointsByAngle(points, centroid);

        const polygon = L.polygon(sortedPoints, { color: 'red' }).addTo(mapInstance);

        // Icône de suppression rendue en tant que string HTML
        const deleteIconHtml = renderToString(<MdDeleteForever style={{ cursor: 'pointer', fontSize: '24px', color: 'red' }} />);

        // Ajouter un attribut onclick pour gérer la suppression, en passant l'ID de l'aire
        const popupContent = `
            <div>
              <strong>${area.name}</strong>
              <p>${area.description}</p>
              <div onclick="deleteArea(${area.id})">${deleteIconHtml}</div>
            </div>
          `;
        const tooltipContent = `
            <div>
              <strong>${area.name}</strong>
              <p>${area.description}</p>
            </div>
          `;

        polygon.bindPopup(popupContent);
        polygon.bindTooltip(tooltipContent, { permanent: false, direction: 'top' });
      });
    };

    fetchAndDisplayAreas();
  }, [selectedEventId]);


  const calculateCentroid = (points) => {
    const centroid = points.reduce((acc, val) => {
      return [acc[0] + val[0] / points.length, acc[1] + val[1] / points.length];
    }, [0, 0]);
    return centroid;
  };

  const sortPointsByAngle = (points, centroid) => {
    return points.sort((a, b) => {
      const angleA = Math.atan2(a[0] - centroid[0], a[1] - centroid[1]);
      const angleB = Math.atan2(b[0] - centroid[0], b[1] - centroid[1]);
      return angleA - angleB;
    });
  };

  useEffect(() => {
    let mapInstance = mapRef.current;

    // Dessin des aires sur la carte
    areas.forEach(area => {
      const points = [
        [area.point1_lat, area.point1_lon],
        [area.point2_lat, area.point2_lon],
        [area.point3_lat, area.point3_lon],
        [area.point4_lat, area.point4_lon],
      ];

      // Calcul du centre géométrique des points
      const centroid = calculateCentroid(points);

      // Tri des points par leur angle par rapport au centre
      const sortedPoints = sortPointsByAngle(points, centroid);

      // Dessin du polygone avec les points triés
      L.polygon(sortedPoints, { color: 'red' }).addTo(mapInstance);
    });
  }, [areas]);


  useEffect(() => {
    const fetchItineraries = async () => {
      const { data: fetchedItineraries, error } = await supabase
        .from('vianney_itineraries')
        .select('*')
        .eq('event_id', selectedEventId); // Filter by event_id

      if (error) {
        console.error('Error fetching itineraries:', error);
      } else {
        setItineraries(fetchedItineraries);
      }
    };

    if (selectedEventId) {
      fetchItineraries();
    }
  }, [selectedEventId]); // Depend on selectedEventId to re-fetch when it changes
  useEffect(() => {
    let mapInstance = mapRef.current;

    if (!mapInstance) {
      mapInstance = L.map('map').setView([45, 4.7], 7);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: ''
      }).addTo(mapInstance);
      mapRef.current = mapInstance;
    }

    itineraries.forEach(itinerary => {
      const points = itinerary.points.map(point => [point.latitude, point.longitude]);
      const polyline = L.polyline(points, { color: 'blue' }).addTo(mapInstance);

      const deleteIconHtml = renderToString(
        <MdDeleteForever style={{ cursor: 'pointer', fontSize: '24px', color: 'red' }} />
      );

      const popupContent = `
        <div>
          <strong>${itinerary.name}</strong>
          <p>${itinerary.description}</p>
          <div onclick="deleteItinerary(${itinerary.id})">${deleteIconHtml}</div>
        </div>
      `;

      polyline.bindPopup(popupContent);
    });


  }, [itineraries]);

  useEffect(() => {
    const deleteTeam = async (teamId) => {
      try {
        const { error } = await supabase
          .from('vianney_teams')
          .delete()
          .match({ id: teamId });

        if (error) throw error;

        toast({
          title: 'Équipe supprimée',
          description: `L'équipe avec l'ID ${teamId} a été supprimée avec succès.`,
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'bottom',
        });

      } catch (error) {
        console.error('Erreur lors de la suppression de l\'équipe:', error.message);

        toast({
          title: 'Échec de la suppression',
          description: "Impossible de supprimer l'équipe. Veuillez réessayer.",
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'bottom',
        });
      }
    };

    window.deleteTeam = deleteTeam;

    return () => {
      delete window.deleteTeam;
    };
  }, [toast]);



  useEffect(() => {
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

      let mapInstance = mapRef.current;
      if (!mapInstance) return;

      // Nettoyage des marqueurs des équipes existants
      mapInstance.eachLayer(layer => {
        if (layer instanceof L.Marker || (layer.options && layer.options.team)) {
          mapInstance.removeLayer(layer);
        }
      });

      teams.forEach(team => {
        const teamIcon = createCustomIcon(); // Assurez-vous que cela génère un icône approprié pour les équipes
        const deleteIconHtml = renderToString(<MdDeleteForever style={{ cursor: 'pointer', fontSize: '24px', color: 'red' }} />);

        const popupContent = `
          <div>
            <strong>${team.name_of_the_team}</strong>
            ${team.photo_profile_url ? `<br/><img src="${team.photo_profile_url}" alt="${team.name_of_the_team}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 50%; margin-top: 5px;"/>` : ''}
            <div onclick="window.deleteTeam(${team.id})" style="margin-top: 10px;">${deleteIconHtml}</div>
          </div>
        `;

        const tooltipContent = `
        <div>
          <strong>${team.name_of_the_team}</strong>
        </div>
      `;

        L.marker([team.latitude, team.longitude], { icon: teamIcon, team: true })
          .addTo(mapInstance)
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

    fetchAndDisplayTeams();
  }, [selectedEventId]); // Inclure les dépendances nécessaires


  useEffect(() => {
    const fetchAndDisplayPointsOfInterest = async () => {
      if (!selectedEventId) {
        console.log('Aucun event_id sélectionné.');
        return;
      }

      const { data: pointsOfInterest, error } = await supabase
        .from('vianney_points_of_interest')
        .select('*')
        .eq('event_id', selectedEventId);

      if (error) {
        console.error('Erreur lors de la récupération des points d\'intérêt:', error);
        return;
      }

      let mapInstance = mapRef.current;
      if (!mapInstance) {
        console.log('Instance de carte non initialisée.');
        return;
      }

      // Nettoyage des marqueurs existants liés aux points d'intérêt
      mapInstance.eachLayer(layer => {
        if (layer.options && layer.options.poi) {
          mapInstance.removeLayer(layer);
        }
      });

      pointsOfInterest.forEach(poi => {
        const poiIcon = createPoiIcon();
        const deleteIconHtml = renderToString(<MdDeleteForever style={{ cursor: 'pointer', fontSize: '24px', color: 'red' }} />);

        const popupContent = `
          <div>
            <strong>${poi.title}</strong>
            <p>${poi.description}</p>
            <div onclick="window.deletePointOfInterest(${poi.id})">${deleteIconHtml}</div>
          </div>
        `;
        const tooltipContent = `<strong>${poi.title}</strong><p>${poi.description}</p>`;

        L.marker([poi.latitude, poi.longitude], { icon: poiIcon, poi: true })
          .addTo(mapInstance)
          .bindPopup(popupContent)
          .bindTooltip(tooltipContent, {
            permanent: false,
            direction: 'top',
            offset: L.point(0, -20)
          });
      });
    };

    fetchAndDisplayPointsOfInterest();
  }, [selectedEventId]);

  useEffect(() => {
    const deletePointOfInterest = async (poiId) => {
      try {
        const { error } = await supabase
          .from('vianney_points_of_interest')
          .delete()
          .match({ id: poiId });

        if (error) throw error;

        toast({
          title: 'Point d\'intérêt supprimé',
          description: `Le point d'intérêt avec l'ID ${poiId} a été supprimé avec succès.`,
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'bottom',
        });

      } catch (error) {
        console.error('Erreur lors de la suppression du point d\'intérêt:', error.message);

        toast({
          title: 'Échec de la suppression',
          description: "Impossible de supprimer le point d'intérêt. Veuillez réessayer.",
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'bottom',
        });
      }
    };

    window.deletePointOfInterest = deletePointOfInterest;

    return () => {
      delete window.deletePointOfInterest;
    };
  }, [toast]);



  return (
    <Box pt="10px">
      <Tooltip label={showForm ? "Masquer le formulaire d'itinéraire" : "Formulaire d'itinéraire"} hasArrow>
        <IconButton
          m={1}
          colorScheme="orange"
          icon={<FcAutomotive />}
          onClick={() => toggleFormAndSetVisibility('itinerary')}
          aria-label="Formulaire d'itinéraire"
        />
      </Tooltip>

      <Tooltip label={showFormBis ? "Masquer le formulaire de point d'intérêt" : "Formulaire de point d'intérêt"} hasArrow>
        <IconButton
          m={1}
          colorScheme="orange"
          icon={<FcCollect />}
          onClick={() => toggleFormAndSetVisibility('poi')}
          aria-label="Formulaire de point d'intérêt"
        />
      </Tooltip>

      <Tooltip label={showFormBisBis ? "Masquer le formulaire de l'aire" : "Formulaire de l'aire"} hasArrow>
        <IconButton
          m={1}
          colorScheme="orange"
          icon={<FcAddRow />}
          onClick={() => toggleFormAndSetVisibility('area')}
          aria-label="Formulaire de l'aire"
        />
      </Tooltip>
      {isButtonVisible && (
        <Button
          onClick={toggleMapView} // Utilisez toggleMapView lors du clic
          bg="red.500"
          color="white"
          _hover={{ bg: "red.600" }}
          _active={{ bg: "red.700" }}
        >
          {buttonText}
        </Button>
      )}

      {activeForm === 'itinerary' && <CreateItineraryForm />}
      {activeForm === 'poi' && <AddPointOfInterestForm />}
      {activeForm === 'area' && <AreaCreationMap />}

      <div id="map" style={{ height: mapHeight, width: '100%', zIndex: '0' }}></div>
    </Box>
  );
};

export default MapComponent;