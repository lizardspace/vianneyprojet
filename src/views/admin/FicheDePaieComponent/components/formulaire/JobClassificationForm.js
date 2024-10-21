import React, { useState } from 'react';
import { Box, Input, Button, FormControl, FormLabel, useToast } from '@chakra-ui/react';
import { supabase } from './../../../../../supabaseClient';  // Assure-toi que le chemin est correct

const JobClassificationForm: React.FC = () => {
  const [classification, setClassification] = useState('');
  const [categorie, setCategorie] = useState('');
  const [emploi, setEmploi] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toast pour les notifications
  const toast = useToast();

  // Handler pour la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Insertion des données dans Supabase
    const { data, error } = await supabase
      .from('vianney_fiche_de_paye_employees')
      .insert([
        {
          classification: classification,
          categorie: categorie,
          emploi: emploi,
        }
      ]);

    if (error) {
      console.error('Erreur lors de l\'insertion des données de classification:', error.message);
      toast({
        title: "Échec de l'enregistrement.",
        description: "Une erreur est survenue lors de l'enregistrement des données.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Succès.",
        description: "Les données de classification ont été enregistrées avec succès.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Réinitialiser le formulaire après soumission
      setClassification('');
      setCategorie('');
      setEmploi('');
    }

    setIsSubmitting(false);
  };

  return (
    <Box p={4} maxWidth="600px" mx="auto">
      <form onSubmit={handleSubmit}>
        <FormControl id="classification" mb={4} isRequired>
          <FormLabel>Classification</FormLabel>
          <Input 
            type="text" 
            value={classification} 
            onChange={(e) => setClassification(e.target.value)} 
            placeholder="ex: salarié-cadre" 
          />
        </FormControl>

        <FormControl id="categorie" mb={4} isRequired>
          <FormLabel>Catégorie</FormLabel>
          <Input 
            type="text" 
            value={categorie} 
            onChange={(e) => setCategorie(e.target.value)} 
            placeholder="ex: ingénieurs et cadres - 130 - 2.2" 
          />
        </FormControl>

        <FormControl id="emploi" mb={4} isRequired>
          <FormLabel>Emploi</FormLabel>
          <Input 
            type="text" 
            value={emploi} 
            onChange={(e) => setEmploi(e.target.value)} 
            placeholder="ex: juriste" 
          />
        </FormControl>

        <Button colorScheme="teal" type="submit" isDisabled={isSubmitting}>
          {isSubmitting ? 'Envoi en cours...' : 'Soumettre'}
        </Button>
      </form>
    </Box>
  );
};

export default JobClassificationForm;
