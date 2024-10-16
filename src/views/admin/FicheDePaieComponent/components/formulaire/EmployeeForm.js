import React, { useState } from 'react';
import { Box, Input, Button, FormControl, FormLabel, Textarea, useToast } from '@chakra-ui/react';
import { supabase } from './../../../../../supabaseClient'; // Assure-toi que le chemin est correct

const EmployeeForm: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toast for notifications
  const toast = useToast();

  // Handler for form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Insert the new employee data into the Supabase database
    const { data, error } = await supabase
      .from('vianney_fiche_de_paye_employees')
      .insert([
        {
          first_name: firstName,
          last_name: lastName,
          address: address,
        }
      ]);

    if (error) {
      console.error('Error inserting employee data:', error.message);
      toast({
        title: "Échec de l'enregistrement.",
        description: "Une erreur est survenue lors de l'enregistrement des données.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      console.log('Employee data inserted:', data);
      toast({
        title: "Succès.",
        description: "Les données de l'employé ont été enregistrées avec succès.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Optionally, reset the form after submission
      setFirstName('');
      setLastName('');
      setAddress('');
    }

    setIsSubmitting(false);
  };

  return (
    <Box p={4} maxWidth="600px" mx="auto">
      <form onSubmit={handleSubmit}>
        <FormControl id="firstName" mb={4} isRequired>
          <FormLabel>Prénom du salarié</FormLabel>
          <Input 
            type="text" 
            value={firstName} 
            onChange={(e) => setFirstName(e.target.value)} 
            placeholder="Prénom" 
          />
        </FormControl>

        <FormControl id="lastName" mb={4} isRequired>
          <FormLabel>Nom du salarié</FormLabel>
          <Input 
            type="text" 
            value={lastName} 
            onChange={(e) => setLastName(e.target.value)} 
            placeholder="Nom" 
          />
        </FormControl>

        <FormControl id="address" mb={4} isRequired>
          <FormLabel>Adresse du salarié</FormLabel>
          <Textarea 
            value={address} 
            onChange={(e) => setAddress(e.target.value)} 
            placeholder="Adresse" 
          />
        </FormControl>

        <Button colorScheme="teal" type="submit" isDisabled={isSubmitting}>
          {isSubmitting ? 'Envoi en cours...' : 'Soumettre'}
        </Button>
      </form>
    </Box>
  );
};

export default EmployeeForm;
