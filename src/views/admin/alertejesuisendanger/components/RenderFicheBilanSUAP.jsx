import React from 'react';
import { Box, Heading, Text, SimpleGrid, Divider, Stack, Badge } from "@chakra-ui/react";

const RenderFicheBilanSUAP = ({ data }) => {
  if (!data) {
    return <Text>Aucune donnée disponible</Text>;
  }

  const renderBadgeList = (items) => {
    if (Array.isArray(items) && items.length > 0) {
      return (
        <Stack direction="row" wrap="wrap">
          {items.map((item, index) => (
            <Badge key={index} colorScheme="blue" mr={1} mb={1}>{item}</Badge>
          ))}
        </Stack>
      );
    }
    return <Text>N/A</Text>;
  };

  return (
    <Box width="80%" margin="auto" border="1px" borderColor="gray.300" borderRadius="md" p={5} boxShadow="md">
      <Heading as="h1" size="lg" textAlign="center" mb={5}>FICHE BILAN SUAP - N° INTER</Heading>

      <SimpleGrid columns={2} spacing={5} my={5}>
        <Box>
          <Text fontWeight="bold">Engin A:</Text>
          <Text>{data.engin_a}</Text>
        </Box>
        <Box>
          <Text fontWeight="bold">Engin B:</Text>
          <Text>{data.engin_b}</Text>
        </Box>
      </SimpleGrid>

      <Divider my={5} />

      <SimpleGrid columns={2} spacing={5} my={5}>
        <Box>
          <Text fontWeight="bold">Date:</Text>
          <Text>{data.date}</Text>
        </Box>
        <Box>
          <Text fontWeight="bold">Début événement:</Text>
          <Text>{data.debut_event}</Text>
        </Box>
        <Box>
          <Text fontWeight="bold">Prise en charge:</Text>
          <Text>{data.prise_charge}</Text>
        </Box>
        <Box>
          <Text fontWeight="bold">Convergence:</Text>
          <Text>{data.convergence}</Text>
        </Box>
        <Box>
          <Text fontWeight="bold">Arrivée à l'hôpital:</Text>
          <Text>{data.arrive_hop}</Text>
        </Box>
      </SimpleGrid>

      <Divider my={5} />

      <Heading as="h2" size="md" mb={3}>État Civil Victime</Heading>
      <SimpleGrid columns={2} spacing={5} my={5}>
        <Box>
          <Text fontWeight="bold">Nom:</Text>
          <Text>{data.nom}</Text>
        </Box>
        <Box>
          <Text fontWeight="bold">Prénom:</Text>
          <Text>{data.prenom}</Text>
        </Box>
        <Box>
          <Text fontWeight="bold">Date de Naissance:</Text>
          <Text>{data.date_naissance}</Text>
        </Box>
        <Box>
          <Text fontWeight="bold">Âge:</Text>
          <Text>{data.age}</Text>
        </Box>
        <Box>
          <Text fontWeight="bold">Adresse:</Text>
          <Text>{data.adresse}</Text>
        </Box>
        <Box>
          <Text fontWeight="bold">Téléphone:</Text>
          <Text>{data.tel}</Text>
        </Box>
        <Box>
          <Text fontWeight="bold">Médecin Traitant:</Text>
          <Text>{data.medecin_traitant}</Text>
        </Box>
        <Box>
          <Text fontWeight="bold">Personne à Prévenir:</Text>
          <Text>{data.personne_prevenir}</Text>
        </Box>
        <Box>
          <Text fontWeight="bold">Téléphone Personne à Prévenir:</Text>
          <Text>{data.tel_personne_prevenir}</Text>
        </Box>
      </SimpleGrid>

      <Divider my={5} />

      <Heading as="h2" size="md" mb={3}>Bilan Circonstanciel</Heading>
      <Box my={5}>
        <Text fontWeight="bold">Circonstances:</Text>
        <Text>{data.circonstances}</Text>
      </Box>
      <SimpleGrid columns={2} spacing={5} my={5}>
        <Box>
          <Text fontWeight="bold">Lieu:</Text>
          {renderBadgeList(data.lieu)}
        </Box>
        <Box>
          <Text fontWeight="bold">Accident de Circulation:</Text>
          {renderBadgeList(data.accident_circulation)}
        </Box>
      </SimpleGrid>

      <Divider my={5} />

      <Heading as="h2" size="md" mb={3}>Bilan Primaire</Heading>
      <SimpleGrid columns={3} spacing={5} my={5}>
        <Box>
          <Text fontWeight="bold">Voies Aériennes:</Text>
          {renderBadgeList(data.voies_aeriennes)}
        </Box>
        <Box>
          <Text fontWeight="bold">Respiration:</Text>
          {renderBadgeList(data.respiration)}
        </Box>
        <Box>
          <Text fontWeight="bold">Circulation:</Text>
          {renderBadgeList(data.circulation)}
        </Box>
      </SimpleGrid>

      <Divider my={5} />

      <Heading as="h2" size="md" mb={3}>Bilan Secondaire</Heading>
      <SimpleGrid columns={3} spacing={5} my={5}>
        <Box>
          <Text fontWeight="bold">Causes:</Text>
          {renderBadgeList(data.causes)}
        </Box>
        <Box>
          <Text fontWeight="bold">Fréquence Respiratoire:</Text>
          <Text>{data.frequence_respiratoire}</Text>
        </Box>
        <Box>
          <Text fontWeight="bold">SpO2:</Text>
          <Text>{data.spo2}</Text>
        </Box>
      </SimpleGrid>

      <Divider my={5} />

      <Heading as="h2" size="md" mb={3}>Besoin et Position d'Évacuation</Heading>
      <SimpleGrid columns={2} spacing={5} my={5}>
        <Box>
          <Text fontWeight="bold">Besoin moyen évacuation:</Text>
          <Text>{data.besoin_evacuation}</Text>
        </Box>
        <Box>
          <Text fontWeight="bold">Position d'évacuation:</Text>
          <Text>{data.position_evacuation}</Text>
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default RenderFicheBilanSUAP;
