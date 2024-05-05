import React from 'react';
import { Box, Input, Image } from '@chakra-ui/react';

function SitacComponent() {
  return (
    <Box position="relative" h="768px" w="1020px">
      <Image src="/path_to_your_image/sitac.png" alt="Sitac Background" fit="cover" w="100%" h="100%" />
      <Input position="absolute" top="10%" left="5%" w="18%" h="10%" placeholder="Situation" />
      <Input position="absolute" top="10%" left="25%" w="18%" h="10%" placeholder="Anticipation" />
      <Input position="absolute" top="10%" left="45%" w="18%" h="10%" placeholder="Objectif" />
      <Input position="absolute" top="10%" left="65%" w="18%" h="10%" placeholder="Idée de manoeuvre" />
      <Input position="absolute" top="10%" left="85%" w="10%" h="10%" placeholder="Exécution" />
      <Input position="absolute" top="25%" left="85%" w="10%" h="15%" placeholder="Moyen Logistique" />
      <Input position="absolute" top="55%" left="85%" w="10%" h="40%" placeholder="Commandement" />
    </Box>
  );
}

export default SitacComponent;
