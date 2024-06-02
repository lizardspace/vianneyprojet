// FluxRssInput.js
import React, { useEffect, useState } from 'react';
import { useEvent } from './../../../../EventContext'; // Assurez-vous que le chemin est correct
import { supabase } from './../../../../supabaseClient'; 
import { v4 as uuidv4 } from 'uuid';

const FluxRssInput = () => {
  const { setEventId, selectedEventId } = useEvent();
  const [eventList, setEventList] = useState([]);
  const [rssUrl, setRssUrl] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase.from('vianney_event').select('*');
        if (error) {
          throw error;
        }
        setEventList(data);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEventId || !rssUrl) {
      alert('Veuillez sélectionner un événement et saisir une URL RSS');
      return;
    }

    try {
      const { error } = await supabase
        .from('vianney_flux_rss')
        .insert([{ id: uuidv4(), event_id: selectedEventId, url_du_flux_rss: rssUrl }]);

      if (error) {
        throw error;
      }

      alert('Flux RSS ajouté avec succès!');
      setRssUrl('');
    } catch (error) {
      console.error('Error inserting data:', error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="event">Sélectionnez un événement :</label>
      <select
        id="event"
        onChange={(e) => setEventId(e.target.value)}
        value={selectedEventId || ''}
      >
        <option value="" disabled>
          Sélectionner un événement
        </option>
        {eventList.map((event) => (
          <option key={event.id} value={event.id}>
            {event.name}
          </option>
        ))}
      </select>

      <label htmlFor="rssUrl">URL du Flux RSS :</label>
      <input
        id="rssUrl"
        type="url"
        value={rssUrl}
        onChange={(e) => setRssUrl(e.target.value)}
      />

      <button type="submit">Ajouter Flux RSS</button>
    </form>
  );
};

export default FluxRssInput;
