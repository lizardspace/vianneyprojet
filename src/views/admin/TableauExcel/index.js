// src/views/admin/Parameters/index.jsx
import React from 'react';
import { Box } from '@chakra-ui/react';
import VianneyTeamsTable from './components/VianneyTeamsTable';

const InterfaceEquipe = () => {

  return (
    <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
      <VianneyTeamsTable/>
    </Box>
  );
};

export default InterfaceEquipe;