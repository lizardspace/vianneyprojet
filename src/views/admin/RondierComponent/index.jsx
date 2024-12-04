import React from 'react';
import { Box} from '@chakra-ui/react';
import App from './components/App.tsx';

const Index = () => {
  return (
    <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
      <App/>
    </Box>
  );
};

export default Index;