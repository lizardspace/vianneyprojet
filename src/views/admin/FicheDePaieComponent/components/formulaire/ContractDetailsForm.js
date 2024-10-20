import React, { useState } from 'react';
import { Box, Input, Button, FormControl, FormLabel, useToast } from '@chakra-ui/react';
import { supabase } from './../../../../../supabaseClient';  // Assure-toi que le chemin est correct

const ContractDetailsForm: React.FC = () => {
  const [startPeriod, setStartPeriod] = useState('');
  const [endPeriod, setEndPeriod] = useState('');
  const [startContract, setStartContract] = useState('');
  const [seniorityDate, setSeniorityDate] = useState('');
  const [socialSecurityNumber, setSocialSecurityNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toast for notifications
  const toast = useToast();

  // Handler for form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Insert the new contract details into the Supabase database
    const { data, error } = await supabase
      .from('vianney_fiche_de_paye_employees')
      .insert([
        {
          start_period: startPeriod,
          end_period: endPeriod,
          start_contract: startContract,
          seniority_date: seniorityDate,
          social_security_number: socialSecurityNumber,
        }
      ]);

    if (error) {
      console.error('Error inserting contract data:', error.message);
      toast({
        title: "Échec de l'enregistrement.",
        description: "Une erreur est survenue lors de l'enregistrement des données.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      console.log('Contract data inserted:', data);
      toast({
        title: "Succès.",
        description: "Les données du contrat ont été enregistrées avec succès.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Optionally, reset the form after submission
      setStartPeriod('');
      setEndPeriod('');
      setStartContract('');
      setSeniorityDate('');
      setSocialSecurityNumber('');
    }

    setIsSubmitting(false);
  };

  return (
    <Box p={4} maxWidth="600px" mx="auto">
      <form onSubmit={handleSubmit}>
        <FormControl id="startPeriod" mb={4} isRequired>
          <FormLabel>Début de période</FormLabel>
          <Input 
            type="date" 
            value={startPeriod} 
            onChange={(e) => setStartPeriod(e.target.value)} 
          />
        </FormControl>

        <FormControl id="endPeriod" mb={4} isRequired>
          <FormLabel>Fin de période</FormLabel>
          <Input 
            type="date" 
            value={endPeriod} 
            onChange={(e) => setEndPeriod(e.target.value)} 
          />
        </FormControl>

        <FormControl id="startContract" mb={4} isRequired>
          <FormLabel>Début du contrat</FormLabel>
          <Input 
            type="date" 
            value={startContract} 
            onChange={(e) => setStartContract(e.target.value)} 
          />
        </FormControl>

        <FormControl id="seniorityDate" mb={4} isRequired>
          <FormLabel>Date d'ancienneté</FormLabel>
          <Input 
            type="date" 
            value={seniorityDate} 
            onChange={(e) => setSeniorityDate(e.target.value)} 
          />
        </FormControl>

        <FormControl id="socialSecurityNumber" mb={4} isRequired>
          <FormLabel>N° de sécurité sociale</FormLabel>
          <Input 
            type="text" 
            value={socialSecurityNumber} 
            onChange={(e) => setSocialSecurityNumber(e.target.value)} 
            placeholder="XXXXXXXX" 
          />
        </FormControl>

        <Button colorScheme="teal" type="submit" isDisabled={isSubmitting}>
          {isSubmitting ? 'Envoi en cours...' : 'Soumettre'}
        </Button>
      </form>
    </Box>
  );
};

export default ContractDetailsForm;
