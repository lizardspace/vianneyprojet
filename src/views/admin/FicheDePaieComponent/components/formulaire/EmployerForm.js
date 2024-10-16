import React, { useState } from 'react';
import { Box, Input, Button, FormControl, FormLabel, Textarea } from '@chakra-ui/react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from './../../../../../supabaseClient';
import { useEvent } from './../../../../../EventContext';  // Import the useEvent hook

const EmployerForm = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get event information from context
  const { selectedEventId } = useEvent();

  // Function to upload the logo image to Supabase bucket and return the public URL
  const uploadLogo = async (file) => {
    if (!file) return null;

    const fileName = `${uuidv4()}-${file.name}`;
    // eslint-disable-next-line
    const { data, error } = await supabase
      .storage
      .from('vianney-employer-logos')
      .upload(fileName, file);

    if (error) {
      console.error('Error uploading logo:', error.message);
      return null;
    }

    const publicURL = `https://hvjzemvfstwwhhahecwu.supabase.co/storage/v1/object/public/vianney-employer-logos/${fileName}`;
    return publicURL;
  };

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    let uploadedLogoUrl = logoUrl;

    if (logoFile) {
      uploadedLogoUrl = await uploadLogo(logoFile);
      if (uploadedLogoUrl) {
        setLogoUrl(uploadedLogoUrl);
      } else {
        console.error('Failed to upload logo');
        setIsSubmitting(false);
        return;
      }
    }

    // Insert the new employer data into the Supabase database
    const { data, error } = await supabase
      .from('vianney_employers')
      .insert([
        {
          id: uuidv4(),
          name: name,
          address: address,
          postal_code: postalCode,
          logo_url: uploadedLogoUrl || '',
          event_id: selectedEventId || null,  // Store the event_id from context
          created_at: new Date().toISOString(),
        }
      ]);

    if (error) {
      console.error('Error inserting employer data:', error.message);
    } else {
      console.log('Employer data inserted:', data);
    }

    setIsSubmitting(false);
  };

  // Handler for image file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
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
            readOnly
            display="none"
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
