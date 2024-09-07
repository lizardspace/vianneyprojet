import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Heading, useToast } from '@chakra-ui/react';
import { supabase } from './../../../../../supabaseClient'; 
import { useEvent } from './../../../../../EventContext'; 

const VideoInputForm = () => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const { selectedEventId } = useEvent();
  const toast = useToast();

  const convertToEmbedUrl = (url) => {
    const youtubeWatchPattern = /https:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/;
    const match = youtubeWatchPattern.exec(url);
    if (match) {
      const videoId = match[1];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url; // If the URL is already in embed format or unrecognized, return as is
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const embedUrl = convertToEmbedUrl(url); // Convert the URL to embed format
// eslint-disable-next-line
    const { data, error } = await supabase
      .from('vianney_videos_streaming_live')
      .insert([
        { title: title, url: embedUrl, event_id: selectedEventId },
      ]);

    if (error) {
      toast({
        title: 'Erreur',
        description: "Erreur lors de l'ajout de la vidéo",
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Succès',
        description: "Vidéo ajoutée avec succès !",
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setTitle('');
      setUrl('');
    }
  };

  return (
    <Box
      maxWidth="500px"
      mx="auto"
      mt={10}
      p={6}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="lg"
      bg="white"
      _dark={{ bg: 'gray.700' }}
    >
      <Heading as="h2" size="lg" mb={6} textAlign="center">
        Ajouter un flux vidéo
      </Heading>
      <form onSubmit={handleSubmit}>
        <FormControl id="title" mb={4} isRequired>
          <FormLabel>Titre de la vidéo</FormLabel>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Entrez le titre de la vidéo"
          />
        </FormControl>
        <FormControl id="url" mb={4} isRequired>
          <FormLabel>URL de la vidéo</FormLabel>
          <Input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Entrez l'URL de la vidéo"
          />
        </FormControl>
        <Button colorScheme="blue" type="submit" width="full" mt={4} disabled={!selectedEventId}>
          Ajouter la vidéo
        </Button>
      </form>
    </Box>
  );
};

export default VideoInputForm;
