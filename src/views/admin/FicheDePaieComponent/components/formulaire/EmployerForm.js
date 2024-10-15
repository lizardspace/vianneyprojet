import React, { useState } from 'react';
import { Box, Input, Button, FormControl, FormLabel, Textarea } from '@chakra-ui/react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from './../../../../../supabaseClient';

const EmployerForm = () => {
  // State for form fields
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  
  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Insert the new employer data into the Supabase database
    const { data, error } = await supabase
      .from('vianney_employers')
      .insert([
        {
          id: uuidv4(),  // Generate a UUID for the new entry
          name: name,
          address: address,
          postal_code: postalCode,
          logo_url: logoUrl,
          created_at: new Date().toISOString(),  // Add the current timestamp
        }
      ]);

    if (error) {
      console.error('Error inserting employer data:', error.message);
    } else {
      console.log('Employer data inserted:', data);
      // Optionally, reset the form or notify the user
    }
  };

  return (
    <Box p={4} maxWidth="600px" mx="auto">
      <form onSubmit={handleSubmit}>
        <FormControl id="name" mb={4} isRequired>
          <FormLabel>Nom de l'employeur</FormLabel>
          <Input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Nom de l'employeur" 
          />
        </FormControl>

        <FormControl id="address" mb={4} isRequired>
          <FormLabel>Adresse de l'employeur</FormLabel>
          <Textarea 
            value={address} 
            onChange={(e) => setAddress(e.target.value)} 
            placeholder="Adresse de l'employeur" 
          />
        </FormControl>

        <FormControl id="postalCode" mb={4} isRequired>
          <FormLabel>Code postal de l'employeur</FormLabel>
          <Input 
            type="text" 
            value={postalCode} 
            onChange={(e) => setPostalCode(e.target.value)} 
            placeholder="Code postal de l'employeur" 
          />
        </FormControl>

        <FormControl id="logoUrl" mb={4}>
          <FormLabel>URL du logo</FormLabel>
          <Input 
            type="text" 
            value={logoUrl} 
            onChange={(e) => setLogoUrl(e.target.value)} 
            placeholder="URL du logo de l'employeur" 
          />
        </FormControl>

        <Button colorScheme="teal" type="submit">
          Soumettre
        </Button>
      </form>
    </Box>
  );
};

export default EmployerForm;
