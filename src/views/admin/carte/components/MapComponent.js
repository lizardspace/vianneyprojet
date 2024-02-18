import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MdPlace } from "react-icons/md";
import { renderToString } from "react-dom/server";

import { useEvent } from './../../../../EventContext'; // Update the path to your EventContext file

// Initialize Supabase client
import { supabase } from './../../../../supabaseClient';

const createCustomIcon = () => {
  const placeIconHtml = renderToString(<MdPlace style={{ fontSize: '24px', color: 'red' }} />);
  // Only include the MdPlace icon
  return L.divIcon({
    html: placeIconHtml,
    className: 'custom-leaflet-icon',
    iconSize: L.point(30, 30),
    iconAnchor: [15, 30],
    popupAnchor: [0, -50]
  });
};

const MapComponent = () => {
  const mapRef = useRef(null);
  const [users, setUsers] = useState([]);
  const { selectedEventId } = useEvent(); // Get selectedEventId from context

  useEffect(() => {
    const interval = setInterval(() => {
      // Fetch users from the database
      const fetchUsers = async () => {
        let { data: usersOnGround, error } = await supabase
          .from('vianney_teams')
          .select('*')
          .eq('event_id', selectedEventId); // Filter by selected event_id
  
        if (error) {
          console.error('Error fetching users:', error);
        } else {
          setUsers(usersOnGround);
        }
      };
  
      fetchUsers();
    }, 2000); // Fetch data every 2 seconds
  
    return () => clearInterval(interval); // Clear interval on component unmount
  }, [selectedEventId]);
  

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map('map').setView([0, 0], 13); // Initial map setup
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: ''
      }).addTo(mapRef.current);
    }

    if (users.length > 0) {
      mapRef.current.setView([users[0].latitude, users[0].longitude], 13);

      users.forEach(user => {
        if (user) {
          // Updated HTML content for the popup
          const popupContent = `
            <div>
              <strong>${user.name_of_the_team}</strong>
              ${user.photo_profile_url ? `<br/><img src="${user.photo_profile_url}" alt="${user.name_of_the_team}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 50%; margin-top: 5px;"/>` : ''}
            </div>
          `;

          const customIcon = createCustomIcon(); // Custom icon without user photo

          L.marker([user.latitude, user.longitude], { icon: customIcon })
            .addTo(mapRef.current)
            .bindPopup(popupContent);
        }
      });
    }
  }, [users]);

  return (
    <div id="map" style={{ height: '800px', width: '100%', zIndex: '0' }}></div>
  );
};

export default MapComponent;
