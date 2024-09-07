import React from 'react';
import { Box, Heading, IconButton } from '@chakra-ui/react';
import { MdDeleteForever } from "react-icons/md";

const VideoList = ({ videos, onDeleteVideo }) => {
  return (
    <Box>
      {videos.map((video) => (
        <Box key={video.id} mb={8} position="relative">
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
          <IconButton
            icon={<MdDeleteForever />}
            colorScheme="red"
            position="absolute"
            top={0}
            right={0}
            onClick={() => onDeleteVideo(video.id)} // Trigger delete
          />
        </Box>
      ))}
    </Box>
  );
};

export default VideoList;
