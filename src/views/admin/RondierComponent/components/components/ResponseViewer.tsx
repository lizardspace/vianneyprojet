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
  Flex,
  Button,
  useToast,
} from '@chakra-ui/react';
import { CSVLink } from 'react-csv';

interface ResponseData {
  id: string;
  form_id: string;
  response_data: Record<string, any>;
  created_at: string;
}

interface ResponseViewerProps {
  formId: string;
}

const ResponseViewer: React.FC<ResponseViewerProps> = ({ formId }) => {
  const [responses, setResponses] = useState<ResponseData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toast = useToast();

  useEffect(() => {
    if (!formId) {
      console.error('ResponseViewer: formId est manquant');
      toast({
        title: 'Formulaire non trouvé.',
        description: 'L\'ID du formulaire est manquant.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const fetchResponses = async () => {
      setIsLoading(true);
      console.log('ResponseViewer: Récupération des réponses pour formId:', formId);

      const { data, error } = await supabase
        .from('responses')
        .select('*')
        .eq('form_id', formId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('ResponseViewer: Erreur lors de la récupération des réponses:', error);
        toast({
          title: 'Erreur de récupération.',
          description: 'Une erreur est survenue lors de la récupération des réponses.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else {
        console.log('ResponseViewer: Réponses récupérées:', data);
        setResponses(data);
      }

      setIsLoading(false);
    };

    fetchResponses();
  }, [formId, toast]);

  // Extraire les clés des réponses pour générer les en-têtes de la table
  const getTableHeaders = (): string[] => {
    if (responses.length === 0) return [];
    // Récupérer toutes les clés présentes dans les réponses
    const keys = new Set<string>();
    responses.forEach((response) => {
      Object.keys(response.response_data).forEach((key) => keys.add(key));
    });
    return Array.from(keys);
  };

  const headers = getTableHeaders();

  // Préparer les données pour le téléchargement CSV
  const csvData = responses.map((resp) => resp.response_data);

  return (
    <Box p={6} borderWidth="1px" borderRadius="md" boxShadow="md">
      <Flex justify="space-between" align="center" mb={4}>
        <Heading as="h2" size="lg">
          Réponses du Formulaire
        </Heading>
        {responses.length > 0 && (
          <Button colorScheme="teal">
            <CSVLink
              data={csvData}
              filename={`responses_form_${formId}.csv`}
              style={{ color: 'white', textDecoration: 'none' }}
            >
              Télécharger CSV
            </CSVLink>
          </Button>
        )}
      </Flex>
      {isLoading ? (
        <Flex justify="center" align="center">
          <Spinner size="xl" />
          <Text ml={4}>Chargement des réponses...</Text>
        </Flex>
      ) : responses.length === 0 ? (
        <Text>Aucune réponse trouvée pour ce formulaire.</Text>
      ) : (
        <Table variant="striped" colorScheme="gray" size="sm">
          <Thead>
            <Tr>
              <Th>ID</Th>
              {headers.map((header) => (
                <Th key={header}>{header}</Th>
              ))}
              <Th>Date de Soumission</Th>
            </Tr>
          </Thead>
          <Tbody>
            {responses.map((response) => (
              <Tr key={response.id}>
                <Td>{response.id}</Td>
                {headers.map((header) => (
                  <Td key={header}>
                    {typeof response.response_data[header] === 'object'
                      ? JSON.stringify(response.response_data[header])
                      : response.response_data[header]}
                  </Td>
                ))}
                <Td>{new Date(response.created_at).toLocaleString()}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};

export default ResponseViewer;
