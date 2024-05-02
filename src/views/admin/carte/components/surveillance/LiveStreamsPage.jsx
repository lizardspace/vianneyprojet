import React from 'react';
import { Box, Grid, Badge, useColorModeValue } from '@chakra-ui/react';
import PorteDuValvertLive from './PorteDuValvertLive';
import PorteSaintClairLive from './PorteSaintClairLive';
import PorteDeVaiseLive from './PorteDeVaiseLive';
import IenaVueTourEiffelLive from './IenaVueTourEiffelLive';
import PlageDuSillonThermesMarinsLive from './PlageDuSillonThermesMarinsLive';
import SaintMaloLesMursLive from './SaintMaloLesMursLive';
import TunnelDeFourviereLive from './TunnelDeFourviereLive';
import TunnelDeFourviereBisLive from './TunnelDeFourviereBisLive';

const LiveStreamsPage = () => {
  // Use a color mode value to switch colors based on the theme
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const color = useColorModeValue('gray.800', 'white');
  const badgeColor = useColorModeValue('blue.500', 'blue.300'); // Change as needed
  
  return (
    <Box p={8} bg={bgColor} color={color} minHeight="100vh">
      <Box display="flex" justifyContent="center" mb={12}>
        <Badge colorScheme="blue" px={4} py={1} fontSize="1.25em" borderRadius="full" color={badgeColor}>
          Centre de surveillance vidéo
        </Badge>
      </Box>
      <Grid
        templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(1, 1fr)', lg: 'repeat(2, 1fr)', xl: 'repeat(2, 1fr)' }}
        gap={6}
        px={4}
      >
        <PorteDuValvertLive />
        <PorteSaintClairLive />
        <PorteDeVaiseLive />
        <IenaVueTourEiffelLive />
        <PlageDuSillonThermesMarinsLive />
        <SaintMaloLesMursLive />
        <TunnelDeFourviereLive/>
        <TunnelDeFourviereBisLive/>
      </Grid>
    </Box>
  );
};

export default LiveStreamsPage;