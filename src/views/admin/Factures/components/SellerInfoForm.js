// SellerInfoForm.js
import React, { useState, useEffect } from 'react';
import { supabase } from './../../../../supabaseClient';
import {
  Box,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Heading,
  useToast,
} from '@chakra-ui/react';
import { useEvent } from '../../../../EventContext';

const SellerInfoForm = () => {
  const toast = useToast();
  const { selectedEventId } = useEvent();
  const [sellerData, setSellerData] = useState({
    sellerName: '',
    sellerAddress: '',
    sellerSiren: '',
    sellerSiret: '',
    sellerLegalForm: '',
    sellerCapital: '',
    sellerRCS: '',
    sellerGreffe: '',
    sellerRM: '',
    sellerVATNumber: '',
  });

  useEffect(() => {
    // Récupérer les informations du vendeur si elles existent
    const fetchSellerInfo = async () => {
      const { data, error } = await supabase
        .from('seller_info')
        .select('*')
        .eq('event_id', selectedEventId)
        .single();

      if (data) {
        setSellerData(data);
      } else if (error && error.code !== 'PGRST116') {
        // Ignorer l'erreur 'PGRST116' qui signifie 'No rows found'
        console.error('Error fetching seller info:', error);
      }
    };

    fetchSellerInfo();
  }, [selectedEventId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSellerData({ ...sellerData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérifier si les informations du vendeur existent déjà
    const { data: existingData, error: fetchError } = await supabase
      .from('seller_info')
      .select('*')
      .eq('event_id', selectedEventId)
      .single();

    let response;

    if (existingData) {
      // Mettre à jour les informations existantes
      const { error } = await supabase
        .from('seller_info')
        .update(sellerData)
        .eq('event_id', selectedEventId);
      response = error;
    } else {
      // Insérer de nouvelles informations
      const { error } = await supabase
        .from('seller_info')
        .insert({ ...sellerData, event_id: selectedEventId });
      response = error;
    }

    if (response) {
      console.error('Error saving seller info:', response);
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la sauvegarde des informations du vendeur.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Succès',
        description: 'Informations du vendeur sauvegardées avec succès.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="800px" mx="auto" p={6} borderWidth={1} borderRadius={8} boxShadow="lg">
      <Heading as="h2" size="lg" mb={6}>
        Informations sur le Vendeur
      </Heading>
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          {/* Nom du vendeur */}
          <FormControl id="sellerName" isRequired>
            <FormLabel>Nom du vendeur</FormLabel>
            <Input
              type="text"
              name="sellerName"
              value={sellerData.sellerName}
              onChange={handleChange}
            />
          </FormControl>

          {/* Autres champs similaires pour les informations du vendeur */}
          {/* ... */}

          <Button type="submit" colorScheme="teal" size="lg" mt={6}>
            Sauvegarder les Informations du Vendeur
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default SellerInfoForm;
