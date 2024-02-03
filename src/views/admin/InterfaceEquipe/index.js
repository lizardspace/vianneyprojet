// src/views/admin/Parameters/index.jsx
import React from 'react';
import { Box } from '@chakra-ui/react';
import GpsPosition from './components/GpsPosition';
import Audio from './components/Audio';

const InterfaceEquipe = () => {

  return (
    <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
      <Audio/>
      <GpsPosition/>
    </Box>
  );
};

export default InterfaceEquipe;