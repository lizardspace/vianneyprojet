import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Initialize Supabase client
const supabaseUrl = 'https://hvjzemvfstwwhhahecwu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2anplbXZmc3R3d2hoYWhlY3d1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5MTQ4Mjc3MCwiZXhwIjoyMDA3MDU4NzcwfQ.6jThCX2eaUjl2qt4WE3ykPbrh6skE8drYcmk-UCNDSw';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const UserForm = () => {
  const [nameOfTheTeam, setNameOfTheTeam] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [lat, setLat] = useState(45.75799485263588);
  const [lng, setLng] = useState(4.825754111294844);

  const handleFileChange = (e) => {
    setProfilePhoto(e.target.files[0]);
  };

  const LocationMarker = () => {
    const map = useMapEvents({
      click(e) {
        setLat(e.latlng.lat);
        setLng(e.latlng.lng);
        map.flyTo(e.latlng, map.getZoom());
      },
    });

    return lat !== 0 ? (
      <Marker position={[lat, lng]}></Marker>
    ) : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Upload image to Supabase Storage
    const fileExt = profilePhoto.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    let uploadResponse = await supabase.storage
      .from('users_on_the_ground')
      .upload(fileName, profilePhoto);

    if (uploadResponse.error) {
      console.error('Error uploading file:', uploadResponse.error);
      return;
    }

    const publicURL = `https://hvjzemvfstwwhhahecwu.supabase.co/storage/v1/object/public/users_on_the_ground/${fileName}`;

    // Insert user data into the database
    const { error: insertError } = await supabase
      .from('vianney_users_on_the_ground')
      .insert([{
        name_of_the_team: nameOfTheTeam,
        latitude: lat,
        longitude: lng,
        photo_profile_url: publicURL,
        last_active: new Date().toISOString()
      }]);

    if (insertError) {
      console.error('Error inserting data:', insertError);
      return;
    }

    alert('User data added successfully');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div id="mapId" style={{ height: '400px', width: '100%' }}>
        <MapContainer center={[lat, lng]} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker />
        </MapContainer>
      </div>
      <input
        type="text"
        placeholder="Name of the Team"
        value={nameOfTheTeam}
        onChange={(e) => setNameOfTheTeam(e.target.value)}
      />
      <input type="file" onChange={handleFileChange} />
      <button type="submit">Add User</button>
    </form>
  );
};

export default UserForm
