import React, { useState } from 'react';
import { supabase } from './../../../../../supabaseClient'; // Assurez-vous que le chemin est correct

const VideoInputForm = () => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase
      .from('vianney_videos_streaming_live')
      .insert([
        { title: title, url: url },
      ]);

    if (error) {
      console.error('Erreur lors de l\'insertion:', error);
      alert('Erreur lors de l\'ajout de la vidéo');
    } else {
      alert('Vidéo ajoutée avec succès !');
      setTitle('');
      setUrl('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Titre:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="url">URL:</label>
        <input
          type="text"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
      </div>
      <button type="submit">Ajouter la vidéo</button>
    </form>
  );
};

export default VideoInputForm;
