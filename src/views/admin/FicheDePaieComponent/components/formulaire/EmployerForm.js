import React, { useState } from 'react';
import { Box, Input, Button, FormControl, FormLabel, Textarea } from '@chakra-ui/react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from './../../../../../supabaseClient';

const EmployerForm = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to upload the logo image to Supabase bucket and return the public URL
  const uploadLogo = async (file) => {
    if (!file) {
      console.log('No file selected for upload');
      return null;
    }

    console.log('Uploading logo file:', file);

    const fileName = `${uuidv4()}-${file.name}`;
    console.log('Generated file name:', fileName);

    const { data, error } = await supabase
      .storage
      .from('vianney-employer-logos')
      .upload(fileName, file);
    
    if (error) {
      console.error('Error uploading logo:', error.message);
      return null;
    }

    console.log('File uploaded successfully, data:', data);

    // Construct the public URL manually
    const baseUrl = 'https://hvjzemvfstwwhhahecwu.supabase.co/storage/v1/object/public/vianney-employer-logos';
    const publicURL = `${baseUrl}/${fileName}`;

    console.log('Public URL constructed manually:', publicURL);
    return publicURL;
  };

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Disable the button while submitting
    console.log('Form submission started');

    let uploadedLogoUrl = logoUrl;

    // First, upload the logo if a file is selected
    if (logoFile) {
      console.log('Uploading logo file...');
      uploadedLogoUrl = await uploadLogo(logoFile);
      if (uploadedLogoUrl) {
        console.log('Logo uploaded successfully, URL:', uploadedLogoUrl);
        setLogoUrl(uploadedLogoUrl);  // Set the URL in the input field
      } else {
        console.error('Failed to upload logo or retrieve its URL');
        setIsSubmitting(false);
        return; // Stop submission if there's an issue with the logo
      }
    }

    console.log('Proceeding with database insert...');

    // Insert the new employer data into the Supabase database
    const { data, error } = await supabase
      .from('vianney_employers')
      .insert([
        {
          id: uuidv4(),  // Generate a UUID for the new entry
          name: name,
          address: address,
          postal_code: postalCode,
          logo_url: uploadedLogoUrl || '',  // Use uploaded URL or fallback to empty string
          created_at: new Date().toISOString(),  // Add the current timestamp
        }
      ]);

    if (error) {
      console.error('Error inserting employer data:', error.message);
    } else {
      console.log('Employer data inserted successfully:', data);
      // Optionally, reset the form or notify the user
    }

    setIsSubmitting(false); // Re-enable the button
    console.log('Form submission complete');
  };

  // Handler for image file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('File selected:', file);
      setLogoFile(file);
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

        <FormControl id="logoFile" mb={4}>
          <FormLabel>Logo de l'employeur (fichier)</FormLabel>
          <Input 
            type="file" 
            onChange={handleFileChange} 
            accept="image/*"
          />
        </FormControl>

        <FormControl id="logoUrl" mb={4}>
          <FormLabel>URL du logo</FormLabel>
          <Input 
            type="text" 
            value={logoUrl} 
            placeholder="URL du logo de l'employeur" 
            readOnly  // This field is read-only and auto-filled
          />
        </FormControl>

        <Button colorScheme="teal" type="submit" isDisabled={isSubmitting}>
          {isSubmitting ? 'Envoi en cours...' : 'Soumettre'}
        </Button>
      </form>
    </Box>
  );
};

export default EmployerForm;
