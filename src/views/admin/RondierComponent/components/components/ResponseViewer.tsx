// src/components/ResponseViewer.tsx
import React, { useEffect, useState } from 'react';
import { supabase } from './../../../../../supabaseClient';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

const ResponseViewer: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const [responses, setResponses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!formId) {
      console.error('ResponseViewer: formId est manquant');
      return;
    }

    const fetchResponses = async () => {
      setIsLoading(true);
      console.log('ResponseViewer: Récupération des réponses pour formId:', formId);

      const { data, error } = await supabase.from('responses').select('*').eq('form_id', formId);

      if (error) {
        console.error('ResponseViewer: Erreur lors de la récupération des réponses:', error);
        alert('Une erreur est survenue lors de la récupération des réponses.');
      } else {
        console.log('ResponseViewer: Réponses récupérées:', data);
        setResponses(data);
      }

      setIsLoading(false);
    };

    fetchResponses();
  }, [formId]);

  if (isLoading) {
    return (
      <Box textAlign="center">
        <Spinner size="xl" />
        <Text mt={4}>Chargement des réponses...</Text>
      </Box>
    );
  }

  if (!responses || responses.length === 0) {
    return <Text>Aucune réponse trouvée pour ce formulaire.</Text>;
  }

  return (
    <Box p={4} borderWidth="1px" borderRadius="md">
      <Heading as="h2" size="lg" mb={4}>
        Réponses du formulaire
      </Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Données de réponse</Th>
            <Th>Date de soumission</Th>
          </Tr>
        </Thead>
        <Tbody>
          {responses.map((response) => (
            <Tr key={response.id}>
              <Td>{response.id}</Td>
              <Td>{JSON.stringify(response.response_data)}</Td>
              <Td>{new Date(response.created_at).toLocaleString()}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default ResponseViewer;
