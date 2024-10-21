import React, { useState } from 'react';
import { Box, Input, Button, FormControl, FormLabel, useToast } from '@chakra-ui/react';
import { supabase } from './../../../../../supabaseClient';  // Assure-toi que le chemin est correct

const ContractDetailsForm: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [startPeriodTravail, setStartPeriodTravail] = useState('');  // Updated
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

    // Insert the new contract details and employee information into the Supabase database
    const { data, error } = await supabase
      .from('vianney_fiche_de_paye_employees')
      .insert([
        {
          first_name: firstName,
          last_name: lastName,
          address: address,
          start_period_travail: startPeriodTravail,  // Updated
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
      console.log('Contract and employee data inserted:', data);
      toast({
        title: "Succès.",
        description: "Les données du contrat et de l'employé ont été enregistrées avec succès.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Optionally, reset the form after submission
      setFirstName('');
      setLastName('');
      setAddress('');
      setStartPeriodTravail('');
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
        <FormControl id="firstName" mb={4} isRequired>
          <FormLabel>Prénom</FormLabel>
          <Input 
            type="text" 
            value={firstName} 
            onChange={(e) => setFirstName(e.target.value)} 
            placeholder="Prénom" 
          />
        </FormControl>

        <FormControl id="lastName" mb={4} isRequired>
          <FormLabel>Nom</FormLabel>
          <Input 
            type="text" 
            value={lastName} 
            onChange={(e) => setLastName(e.target.value)} 
            placeholder="Nom" 
          />
        </FormControl>

        <FormControl id="address" mb={4} isRequired>
          <FormLabel>Adresse</FormLabel>
          <Input 
            value={address} 
            onChange={(e) => setAddress(e.target.value)} 
            placeholder="Adresse" 
          />
        </FormControl>

        <FormControl id="startPeriodTravail" mb={4} isRequired>
          <FormLabel>Début de période de travail</FormLabel>  {/* Updated */}
          <Input 
            type="date" 
            value={startPeriodTravail} 
            onChange={(e) => setStartPeriodTravail(e.target.value)}  // Updated
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
