import React from 'react';
import { Box, Flex, Text, SimpleGrid } from "@chakra-ui/react";
import Camera from './Camera';

const EventVideos = ({ cameras, textColor }) => {
  return (
    <Box mt="10px" borderRadius="lg" overflow="hidden">
      <Flex direction='column'>
        <Flex
          mt='45px'
          mb='20px'
          justifyContent='space-between'
          direction={{ base: "column", md: "row" }}
          align={{ base: "start", md: "center" }}>
          <Text color={textColor} fontSize='2xl' ms='24px' fontWeight='700'>
            Les vidéos en direct de l'évênement
          </Text>
        </Flex>
        <SimpleGrid columns={{ base: 1, md: 3 }} gap='20px'>
          {cameras?.map(camera => (
            <Camera key={camera.id} camera={camera} /> // Use Camera component
          ))}
        </SimpleGrid>
      </Flex>
    </Box>
  );
};

export default EventVideos;
