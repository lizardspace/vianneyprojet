import React from 'react';
import { Box, Heading } from '@chakra-ui/react';

const VideoStream = ({ title, url }) => {
  return (
    <Box maxWidth="800px" mx="auto" mt={10} p={4} borderWidth={1} borderRadius="lg" boxShadow="lg" bg="white">
      <Heading as="h2" size="md" mb={4} textAlign="center">
        {title}
      </Heading>
      <iframe
        width="100%"
        height="400"
        src={url}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </Box>
  );
};

export default VideoStream;
