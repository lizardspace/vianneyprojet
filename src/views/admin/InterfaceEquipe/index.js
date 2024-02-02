// src/views/admin/Parameters/index.jsx
import React from 'react';
import { Box } from '@chakra-ui/react';
import TogglingSpeaker from './components/TogglingSpeaker';
import GpsPosition from './components/GpsPosition';

const InterfaceEquipe = () => {

  return (
    <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
      <TogglingSpeaker/>
      <GpsPosition/>
    </Box>
  );
};

export default InterfaceEquipe;