import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Heading, useToast } from '@chakra-ui/react';
import { supabase } from './../../../../../supabaseClient'; // Ensure correct path
import { useEvent } from './../../../../../EventContext'; // Ensure correct path

const VideoInputForm = () => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const { selectedEventId } = useEvent(); // Get the selected event ID from context
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from('vianney_videos_streaming_tv')
      .insert([{ title, url, event_id: selectedEventId }]); // Add the event_id field

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to add video',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Success',
        description: 'Video added successfully!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setTitle('');
      setUrl('');
    }
  };

  return (
    <Box maxWidth="500px" mx="auto" mt={10} p={6} borderWidth={1} borderRadius="lg" boxShadow="lg" bg="white">
      <Heading as="h2" size="lg" mb={6} textAlign="center">
        Add a TV Stream Video
      </Heading>
      <form onSubmit={handleSubmit}>
        <FormControl id="title" mb={4} isRequired>
          <FormLabel>Video Title</FormLabel>
          <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter video title" />
        </FormControl>
        <FormControl id="url" mb={4} isRequired>
          <FormLabel>Video URL</FormLabel>
          <Input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Enter video URL" />
        </FormControl>
        <Button colorScheme="blue" type="submit" width="full" mt={4} disabled={!selectedEventId}>
          Add Video
        </Button>
      </form>
    </Box>
  );
};

export default VideoInputForm;
