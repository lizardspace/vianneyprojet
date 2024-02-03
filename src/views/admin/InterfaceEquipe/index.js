import React from 'react';
import { Box, Heading, useColorModeValue } from '@chakra-ui/react';
import GpsPosition from './components/GpsPosition';
import Audio from './components/Audio';

const InterfaceEquipe = () => {
  const textColor = useColorModeValue("secondaryGray.900", "white"); // Define textColor based on the color mode

  return (
    <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
      <Heading
        me="auto"
        color={textColor}
        fontSize="2xl"
        fontWeight="700"
        lineHeight="100%"
        mb="20px"
      >
        Radio CB
      </Heading>
      <Audio />
      <Heading
        me="auto"
        color={textColor}
        fontSize="2xl"
        fontWeight="700"
        lineHeight="100%"
        mb={10}
        mt={10}
      >
        La position que vous communiquez au PC sécurité
      </Heading>
      <GpsPosition />
    </Box>
  );
};

export default InterfaceEquipe;