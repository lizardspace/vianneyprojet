import { useState } from 'react';
import { Box, Input, Button, FormControl, FormLabel } from '@chakra-ui/react';
import { supabase } from './../../../../../supabaseClient';

const VideoInputForm = ({ onAddVideo }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title && url) {
      const { data, error } = await supabase
        .from('vianney_videos_streaming_live.videos')
        .insert([{ title, url }]);

      if (error) {
        console.error('Error adding video:', error.message);
      } else {
        // Notifie le parent pour mettre à jour la liste des vidéos
        onAddVideo(data[0]); // Ajoute la nouvelle vidéo à l'état
        setTitle('');
        setUrl('');
      }
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit} mb={8}>
      <FormControl id="title" mb={4}>
        <FormLabel>Titre de la vidéo</FormLabel>
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Entrez le titre de la vidéo"
        />
      </FormControl>
      <FormControl id="url" mb={4}>
        <FormLabel>URL de la vidéo</FormLabel>
        <Input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Entrez l'URL de la vidéo"
        />
      </FormControl>
      <Button type="submit" colorScheme="blue">
        Ajouter la vidéo
      </Button>
    </Box>
  );
};

export default VideoInputForm;
