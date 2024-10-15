import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Textarea, VStack } from '@chakra-ui/react';
import { createClient } from '@supabase/supabase-js';

// Supabase client setup
const supabaseUrl = 'https://your-supabase-url';
const supabaseKey = 'your-supabase-key';
const supabase = createClient(supabaseUrl, supabaseKey);

const EmployerForm: React.FC = () => {
  const [formData, setFormData] = useState({
    logo: '',
    employerName: '',
    employerAddress: '',
    postalCode: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { data, error } = await supabase
      .from('employers') // Your table name in Supabase
      .insert([
        {
          logo: formData.logo,
          name: formData.employerName,
          address: formData.employerAddress,
          postal_code: formData.postalCode,
        }
      ]);

    if (error) {
      console.error('Error inserting data:', error);
    } else {
      console.log('Employer data inserted successfully:', data);
    }
  };

  return (
    <Box maxWidth="600px" mx="auto" mt={8} p={4} border="1px solid black" borderRadius="md" boxShadow="md">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          {/* Employer Logo Input */}
          <FormControl id="logo" isRequired>
            <FormLabel>Logo de l'entreprise</FormLabel>
            <Input
              type="text"
              name="logo"
              placeholder="Entrez l'URL du logo"
              value={formData.logo}
              onChange={handleChange}
            />
          </FormControl>

          {/* Employer Name Input */}
          <FormControl id="employerName" isRequired>
            <FormLabel>Nom de l'employeur</FormLabel>
            <Input
              type="text"
              name="employerName"
              placeholder="Nom de l'employeur"
              value={formData.employerName}
              onChange={handleChange}
            />
          </FormControl>

          {/* Employer Address Input */}
          <FormControl id="employerAddress" isRequired>
            <FormLabel>Adresse de l'employeur</FormLabel>
            <Textarea
              name="employerAddress"
              placeholder="Adresse de l'employeur"
              value={formData.employerAddress}
              onChange={handleChange}
            />
          </FormControl>

          {/* Postal Code Input */}
          <FormControl id="postalCode" isRequired>
            <FormLabel>Code postal de l'employeur</FormLabel>
            <Input
              type="text"
              name="postalCode"
              placeholder="Code postal"
              value={formData.postalCode}
              onChange={handleChange}
            />
          </FormControl>

          {/* Submit Button */}
          <Button colorScheme="blue" type="submit" width="full">
            Enregistrer
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default EmployerForm;
