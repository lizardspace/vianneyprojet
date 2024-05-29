import React from 'react';
import {
  Flex,
  Text,
  VStack,
  StackDivider,
  Badge,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { PhoneIcon, EmailIcon } from '@chakra-ui/icons';
// Remplacez par les icônes appropriées de `react-icons` si nécessaire

// Composant de l'information de l'équipe Charlie
const TeamCharlieInfo = () => {
  return (
    <Grid
      templateAreas={`"header header"
                      "missions team"
                      "materials timeline"`}
      gridTemplateRows={'50px 1fr 1fr'}
      gridTemplateColumns={'1fr 1fr'}
      h='600px'
      gap='4'
      color='black'
      fontWeight='bold'
    >
      <GridItem area={'header'}>
        <Flex justifyContent='space-between' alignItems='center' bg='yellow.100' p='2'>
          <Text>Nom/Prénom CE</Text>
          <Badge>Spécialité</Badge>
          <Text>Âge</Text>
          <PhoneIcon />
          <EmailIcon />
          {/* ... Autres informations ... */}
        </Flex>
      </GridItem>

      <GridItem area={'missions'} bg='orange.100' p='2'>
        <VStack alignItems='flex-start' spacing='4' divider={<StackDivider borderColor='gray.200' />}>
          <Text>Missions:</Text>
          {/* ... Détails des missions ... */}
        </VStack>
      </GridItem>

      <GridItem area={'team'} bg='teal.100' p='2'>
        <VStack alignItems='flex-start' spacing='4'>
          <Text>Membres équipe:</Text>
          {/* ... Membres de l'équipe ... */}
        </VStack>
      </GridItem>

      <GridItem area={'materials'} bg='blue.100' p='2'>
        <VStack alignItems='flex-start' spacing='4'>
          <Text>Matériel:</Text>
          {/* ... Détails du matériel ... */}
        </VStack>
      </GridItem>

      <GridItem area={'timeline'} bg='purple.100' p='2'>
        <VStack alignItems='flex-start' spacing='4'>
          <Text>Emploi du temps équipe:</Text>
          {/* ... Détails de l'emploi du temps ... */}
        </VStack>
      </GridItem>
    </Grid>
  );
};

export default TeamCharlieInfo;