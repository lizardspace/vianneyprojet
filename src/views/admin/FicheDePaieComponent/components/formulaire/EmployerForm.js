import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Textarea, VStack } from '@chakra-ui/react';
import supabase from './../../../../../supabaseClient'; // Import the Supabase client

const EmployerForm: React.FC = () => {
  const [formData, setFormData] = useState({
    employerName: '',
    employerAddress: '',
    postalCode: '',
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);  // To store the file selected

  // Handle text input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle file input change safely
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setLogoFile(file);
    } else {
      setLogoFile(null); // Handle cases where no file is selected
    }
  };

  const uploadLogo = async () => {
    if (!logoFile) return null;

    const { data, error } = await supabase.storage
      .from('vianney-employer-logos')  // Updated bucket name
      .upload(`logos/${logoFile.name}`, logoFile);

    if (error) {
      console.error('Error uploading logo:', error);
      return null;
    }

    return data?.Key ? `${supabase.storage.from('vianney-employer-logos').getPublicUrl(data.Key)}` : null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const logoUrl = await uploadLogo();  // Upload the logo and get the URL

    const { data, error } = await supabase
      .from('vianney_employers')  // Updated table name
      .insert([
        {
          name: formData.employerName,
          address: formData.employerAddress,
          postal_code: formData.postalCode,
          logo_url: logoUrl || null,  // Store the logo URL
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
          {/* Employer Logo File Input */}
          <FormControl id="logo" isRequired>
            <FormLabel>Logo de l'entreprise</FormLabel>
            <Input type="file" accept="image/*" onChange={handleFileChange} />
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
