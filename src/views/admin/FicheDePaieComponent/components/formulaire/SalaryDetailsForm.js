import React, { useState } from 'react';
import { Box, Input, Button, FormControl, FormLabel, useToast } from '@chakra-ui/react';
import { supabase } from './../../../../../supabaseClient';  // Assure-toi que le chemin est correct

const SalaryDetailsForm: React.FC = () => {
  const [minimumCoefficient, setMinimumCoefficient] = useState('');
  const [remunerationTotale, setRemunerationTotale] = useState('');
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
          minimum_coefficient: parseFloat(minimumCoefficient),
          remuneration_totale: parseFloat(remunerationTotale),
        }
      ]);

    if (error) {
      console.error('Erreur lors de l\'insertion des données de salaire:', error.message);
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
        description: "Les données salariales ont été enregistrées avec succès.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Réinitialiser le formulaire après soumission
      setMinimumCoefficient('');
      setRemunerationTotale('');
    }

    setIsSubmitting(false);
  };

  return (
    <Box p={4} maxWidth="600px" mx="auto">
      <form onSubmit={handleSubmit}>
        <FormControl id="minimumCoefficient" mb={4} isRequired>
          <FormLabel>Minimum coefficient</FormLabel>
          <Input 
            type="number" 
            step="0.01"
            value={minimumCoefficient} 
            onChange={(e) => setMinimumCoefficient(e.target.value)} 
            placeholder="ex: 2.543" 
          />
        </FormControl>

        <FormControl id="remunerationTotale" mb={4} isRequired>
          <FormLabel>Rémunération totale du mois</FormLabel>
          <Input 
            type="number"
            step="0.01" 
            value={remunerationTotale} 
            onChange={(e) => setRemunerationTotale(e.target.value)} 
            placeholder="ex: 4.600" 
          />
        </FormControl>

        <Button colorScheme="teal" type="submit" isDisabled={isSubmitting}>
          {isSubmitting ? 'Envoi en cours...' : 'Soumettre'}
        </Button>
      </form>
    </Box>
  );
};

export default SalaryDetailsForm;
