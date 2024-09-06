import React, { useEffect, useState } from 'react';
import { Box, Heading, Stack, Spinner, Alert, AlertIcon, AlertTitle } from "@chakra-ui/react";
import { supabase } from './../../../../supabaseClient';
import { useEvent } from '../../../../EventContext'; // Importer le contexte d'événement
import RenderFicheBilanSUAP from './RenderFicheBilanSUAP';

const ListFicheBilanSUAP = () => {
  const { selectedEventId } = useEvent(); // Accéder au selectedEventId depuis le contexte
  const [fiches, setFiches] = useState([]);
  const [loading, setLoading] = useState(false); // Par défaut pas en chargement
  const [error, setError] = useState('');

  useEffect(() => {
    if (selectedEventId) { 
      setLoading(true); // Début du chargement seulement si l'événement est sélectionné
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
          setLoading(false); // Fin du chargement après la récupération
        }
      };

      fetchFiches();
    } else {
      setFiches([]); // Réinitialiser les fiches si aucun événement n'est sélectionné
    }
  }, [selectedEventId]); // Récupérer les fiches lorsque selectedEventId change

  if (!selectedEventId) {
    // Ne rien afficher si aucun événement n'est sélectionné
    return null;
  }

  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" mt={10}>
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>{error}</AlertTitle>
        </Alert>
      </Box>
    );
  }

  if (fiches.length === 0) {
    return (
      <Box textAlign="center" mt={10}>
        <Alert status="info">
          <AlertIcon />
          <AlertTitle>Aucune fiche SUAP trouvée pour cet événement.</AlertTitle>
        </Alert>
      </Box>
    );
  }

  return (
    <Box width="80%" margin="auto">
      <Heading as="h1" size="lg" textAlign="center" mb={5}>Liste des Fiches Bilan SUAP</Heading>
      <Stack spacing={10}>
        {fiches.map((fiche, index) => (
          <RenderFicheBilanSUAP key={index} data={fiche} />
        ))}
      </Stack>
    </Box>
  );
};

export default ListFicheBilanSUAP;
