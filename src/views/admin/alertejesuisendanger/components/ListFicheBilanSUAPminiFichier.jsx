import React, { useEffect, useState } from 'react';
import { Box, Heading, Stack, Flex, Text, IconButton } from "@chakra-ui/react";
import { FiFile, FiArrowLeft } from 'react-icons/fi';
import { supabase } from './../../../../supabaseClient';
import { useEvent } from '../../../../EventContext'; // Importer le contexte d'événement
import RenderFicheBilanSUAP from './RenderFicheBilanSUAP';

const ListFicheBilanSUAPminiFichier = () => {
  const { selectedEventId } = useEvent(); // Accéder au selectedEventId depuis le contexte
  const [fiches, setFiches] = useState([]);
    // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(true);
    // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState('');
  const [selectedFiche, setSelectedFiche] = useState(null);

  useEffect(() => {
    if (selectedEventId) {
      setLoading(true); // Commence à charger uniquement si un event_id est sélectionné
      const fetchFiches = async () => {
        try {
          const { data, error } = await supabase
            .from('vianney_fiche_bilan_suap')
            .select('*')
            .eq('event_id', selectedEventId); // Filtrer par l'event_id

          if (error) {
            throw error;
          }

          setFiches(data);
        } catch (error) {
          setError('Erreur lors de la récupération des fiches.');
          console.error('Error fetching fiches:', error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchFiches();
    } else {
      setFiches([]); // Réinitialiser si aucun event_id
    }
  }, [selectedEventId]);

  if (!selectedEventId) {
    // Ne rien afficher si aucun event_id n'est sélectionné
    return null;
  }

  return (
    <Box width="80%" margin="auto">
      <Heading as="h1" size="lg" textAlign="center" mb={5}>
        {selectedFiche ? (
          <Flex alignItems="center">
            <IconButton
              icon={<FiArrowLeft />}
              onClick={() => setSelectedFiche(null)}
              mr={2}
            />
            Détails de la fiche
          </Flex>
        ) : (
          'Liste des Fiches Bilan SUAP'
        )}
      </Heading>

      {selectedFiche ? (
        <RenderFicheBilanSUAP data={selectedFiche} />
      ) : (
        <Stack spacing={10}>
          {fiches.map((fiche, index) => (
            <Flex
              key={index}
              align="center"
              p={2}
              borderRadius="lg"
              bg="yellow.100"
              boxShadow="md"
              cursor="pointer"
              onClick={() => setSelectedFiche(fiche)}
            >
              <IconButton
                aria-label="Open file"
                icon={<FiFile />}
                isRound
                size="lg"
                bg="yellow.500"
                color="white"
                marginRight={2}
              />
              <Text fontSize="sm">
                fiche_bilan_{fiche.nom}_{fiche.prenom}_N°INTER_{fiche.inter_number}.pdf
              </Text>
            </Flex>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default ListFicheBilanSUAPminiFichier;
