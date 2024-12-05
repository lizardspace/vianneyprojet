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
  FormErrorMessage,
  Tooltip,
} from '@chakra-ui/react';
import { useEvent } from '../../../../EventContext'; // Import du contexte d'événement

const SellerInfoForm = () => {
  const toast = useToast();
  const { selectedEventId } = useEvent(); // Récupère l'ID de l'événement sélectionné
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
    codeAPE: '',
    sellerVatIntracommunityNumber: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Récupérer les informations du vendeur si elles existent
    const fetchSellerInfo = async () => {
      const { data, error } = await supabase
        .from('vianney_seller_info')
        .select('*')
        .eq('event_id', selectedEventId)
        .single();

      if (data) {
        setSellerData({
          sellerName: data.seller_name || '',
          sellerAddress: data.seller_address || '',
          sellerSiren: data.seller_siren || '',
          sellerSiret: data.seller_siret || '',
          sellerLegalForm: data.seller_legal_form || '',
          sellerCapital: data.seller_capital || '',
          sellerRCS: data.seller_rcs || '',
          sellerGreffe: data.seller_greffe || '',
          sellerRM: data.seller_rm || '',
          sellerVATNumber: data.seller_vat_number || '',
          codeAPE: data.code_ape || '',
          sellerVatIntracommunityNumber: data.seller_vat_intracommunity_number || '',
        });
      } else if (error && error.code !== 'PGRST116') {
        // Ignorer l'erreur 'No rows found'
        console.error('Erreur lors de la récupération des informations du vendeur:', error);
      }
    };

    if (selectedEventId) {
      fetchSellerInfo();
    }
  }, [selectedEventId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validation pour les champs numériques
    const numericFields = [
      'sellerSiren',
      'sellerSiret',
      'sellerCapital',
      'sellerRCS',
      'sellerRM',
      'sellerVATNumber',
      'sellerVatIntracommunityNumber',
    ];

    if (numericFields.includes(name)) {
      if (value && !/^\d*\.?\d*$/.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: 'Ce champ doit contenir uniquement des chiffres.',
        }));

        toast({
          title: 'Erreur de saisie',
          description: 'Ce champ doit contenir uniquement des chiffres.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: null,
        }));
      }
    }

    setSellerData({ ...sellerData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Préparer les données à insérer ou à mettre à jour
    const dataToSave = {
      seller_name: sellerData.sellerName,
      seller_address: sellerData.sellerAddress,
      seller_siren: sellerData.sellerSiren,
      seller_siret: sellerData.sellerSiret,
      seller_legal_form: sellerData.sellerLegalForm,
      seller_capital: sellerData.sellerCapital ? parseFloat(sellerData.sellerCapital) : null,
      seller_rcs: sellerData.sellerRCS,
      seller_greffe: sellerData.sellerGreffe,
      seller_rm: sellerData.sellerRM,
      seller_vat_number: sellerData.sellerVATNumber,
      code_ape: sellerData.codeAPE,
      seller_vat_intracommunity_number: sellerData.sellerVatIntracommunityNumber,
      event_id: selectedEventId,
    };

    // eslint-disable-next-line
    const { data: existingData, error: fetchError } = await supabase
      .from('vianney_seller_info')
      .select('*')
      .eq('event_id', selectedEventId)
      .single();

    let responseError;

    if (existingData) {
      // Mettre à jour les informations existantes
      const { error } = await supabase
        .from('vianney_seller_info')
        .update(dataToSave)
        .eq('event_id', selectedEventId);
      responseError = error;
    } else {
      // Insérer de nouvelles informations
      const { error } = await supabase
        .from('vianney_seller_info')
        .insert(dataToSave);
      responseError = error;
    }

    if (responseError) {
      console.error('Erreur lors de la sauvegarde des informations du vendeur:', responseError);
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

          {/* Adresse du vendeur */}
          <FormControl id="sellerAddress" isRequired>
            <FormLabel>Adresse du vendeur</FormLabel>
            <Input
              type="text"
              name="sellerAddress"
              value={sellerData.sellerAddress}
              onChange={handleChange}
            />
          </FormControl>

          {/* SIREN */}
          <FormControl id="sellerSiren" isInvalid={errors.sellerSiren}>
            <Tooltip label="SIREN: Système d'Identification du Répertoire des Entreprises" placement="top">
              <FormLabel>SIREN</FormLabel>
            </Tooltip>
            <Input
              type="text"
              name="sellerSiren"
              value={sellerData.sellerSiren}
              onChange={handleChange}
            />
            {errors.sellerSiren && <FormErrorMessage>{errors.sellerSiren}</FormErrorMessage>}
          </FormControl>

          {/* SIRET */}
          <FormControl id="sellerSiret" isInvalid={errors.sellerSiret}>
            <Tooltip label="SIRET: Système d'Identification du Répertoire des Etablissements" placement="top">
              <FormLabel>SIRET</FormLabel>
            </Tooltip>
            <Input
              type="text"
              name="sellerSiret"
              value={sellerData.sellerSiret}
              onChange={handleChange}
            />
            {errors.sellerSiret && <FormErrorMessage>{errors.sellerSiret}</FormErrorMessage>}
          </FormControl>

          {/* Forme juridique */}
          <FormControl id="sellerLegalForm">
            <FormLabel>Forme juridique</FormLabel>
            <Input
              type="text"
              name="sellerLegalForm"
              value={sellerData.sellerLegalForm}
              onChange={handleChange}
            />
          </FormControl>

          {/* Capital */}
          <FormControl id="sellerCapital" isInvalid={errors.sellerCapital}>
            <Tooltip label="Capital social de l'entreprise" placement="top">
              <FormLabel>Capital</FormLabel>
            </Tooltip>
            <Input
              type="number"
              name="sellerCapital"
              value={sellerData.sellerCapital}
              onChange={handleChange}
              min="0"
              step="0.01"
            />
            {errors.sellerCapital && <FormErrorMessage>{errors.sellerCapital}</FormErrorMessage>}
          </FormControl>

          {/* Numéro RCS */}
          <FormControl id="sellerRCS" isInvalid={errors.sellerRCS}>
            <Tooltip label="RCS: Registre du Commerce et des Sociétés" placement="top">
              <FormLabel>Numéro RCS</FormLabel>
            </Tooltip>
            <Input
              type="text"
              name="sellerRCS"
              value={sellerData.sellerRCS}
              onChange={handleChange}
            />
            {errors.sellerRCS && <FormErrorMessage>{errors.sellerRCS}</FormErrorMessage>}
          </FormControl>

          {/* Greffe */}
          <FormControl id="sellerGreffe">
            <Tooltip label="Greffe: Bureau où sont déposés les actes juridiques" placement="top">
              <FormLabel>Greffe</FormLabel>
            </Tooltip>
            <Input
              type="text"
              name="sellerGreffe"
              value={sellerData.sellerGreffe}
              onChange={handleChange}
            />
          </FormControl>

          {/* Numéro RM */}
          <FormControl id="sellerRM" isInvalid={errors.sellerRM}>
            <Tooltip label="RM: Répertoire des Métiers" placement="top">
              <FormLabel>Numéro RM</FormLabel>
            </Tooltip>
            <Input
              type="text"
              name="sellerRM"
              value={sellerData.sellerRM}
              onChange={handleChange}
            />
            {errors.sellerRM && <FormErrorMessage>{errors.sellerRM}</FormErrorMessage>}
          </FormControl>

          {/* Numéro de TVA du vendeur */}
          <FormControl id="sellerVATNumber" isInvalid={errors.sellerVATNumber}>
            <FormLabel>Numéro de TVA Intracommunautaire</FormLabel>
            <Input
              type="text"
              name="sellerVatIntracommunityNumber"
              value={sellerData.sellerVatIntracommunityNumber}
              onChange={handleChange}
            />
            {errors.sellerVATNumber && <FormErrorMessage>{errors.sellerVATNumber}</FormErrorMessage>}
          </FormControl>

          {/* Code APE */}
          <FormControl id="codeAPE">
            <FormLabel>Code APE</FormLabel>
            <Input
              type="text"
              name="codeAPE"
              value={sellerData.codeAPE}
              onChange={handleChange}
            />
          </FormControl>

          {/* Bouton de soumission */}
          <Button type="submit" colorScheme="teal" size="lg" mt={6}>
            Sauvegarder les Informations du Vendeur
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default SellerInfoForm;
