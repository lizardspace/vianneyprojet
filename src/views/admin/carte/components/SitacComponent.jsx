import React from 'react';
import { Box, Input, Image } from '@chakra-ui/react';
import sitacImage from './../../../../assets/img/sitac.png'; // Assurez-vous que le chemin est correct

function SitacComponent() {
  return (
    <Box position="relative" h="768px" w="1020px">
      <Image src={sitacImage} alt="Sitac Background" fit="cover" w="100%" h="100%" />
      <Input position="absolute" top="70%" left="2%" w="15%" h="20%" placeholder="Situation" />
      <Input position="absolute" top="70%" left="22%" w="15%" h="20%" placeholder="Anticipation" />
      <Input position="absolute" top="70%" left="40%" w="15%" h="20%" placeholder="Objectif" />
      <Input position="absolute" top="70%" left="60%" w="15%" h="20%" placeholder="Idée de manoeuvre" />
      <Input position="absolute" top="70%" left="81%" w="15%" h="20%" placeholder="Exécution" />
      <Input position="absolute" top="15%" left="76%" w="20%" h="20%" placeholder="Moyen Logistique" />
      <Input position="absolute" top="42%" left="76%" w="20%" h="20%" placeholder="Commandement" />
    </Box>
  );
}

export default SitacComponent;
