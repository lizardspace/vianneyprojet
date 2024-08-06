import React from 'react';
import { Box, Heading } from '@chakra-ui/react';

const VideoList = ({ videos }) => {
  return (
    <Box>
      {videos.map((video) => (
        <Box key={video.id} mb={8}>
          <Heading as="h3" size="md" mb={4}>
            {video.title}
          </Heading>
          <iframe
            width="560"
            height="315"
            src={video.url}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </Box>
      ))}
    </Box>
  );
};

export default VideoList;
