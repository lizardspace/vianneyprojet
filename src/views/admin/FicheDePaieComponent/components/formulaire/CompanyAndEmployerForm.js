import React, { useState } from 'react';
import { Box, Input, Button, FormControl, FormLabel, Textarea, useToast } from '@chakra-ui/react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from './../../../../../supabaseClient'; // Assure-toi que le chemin est correct
import { useEvent } from './../../../../../EventContext';  // Import the useEvent hook

const CompanyAndEmployerForm: React.FC = () => {
  const [siret, setSiret] = useState('');
  const [apeCode, setApeCode] = useState('');
  const [collectiveAgreement, setCollectiveAgreement] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toast pour les notifications
  const toast = useToast();

  // Get event information from context
  const { selectedEventId } = useEvent();

  // Function to upload the logo image to Supabase bucket and return the public URL
  const uploadLogo = async (file) => {
    if (!file) return 'https://via.placeholder.com/150'; // Fallback URL si aucun logo n'est fourni

    const fileName = `${uuidv4()}-${file.name}`;
    const { data, error } = await supabase
      .storage
      .from('vianney-employer-logos')
      .upload(fileName, file);

    if (error) {
      console.error('Error uploading logo:', error.message);
      return 'https://via.placeholder.com/150';  // Return fallback URL en cas d'erreur
    }

    const publicURL = `https://hvjzemvfstwwhhahecwu.supabase.co/storage/v1/object/public/vianney-employer-logos/${fileName}`;
    return publicURL;
  };

  // Handler pour la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
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
        toast({
          title: "Échec de l'upload du logo.",
          description: "Une erreur est survenue lors du téléchargement du logo.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }
    }

    // Insert the new company and employer data into the Supabase database
    const { data, error } = await supabase
      .from('vianney_employers')
      .insert([
        {
          id: uuidv4(),
          siret: siret,
          ape_code: apeCode,
          collective_agreement: collectiveAgreement,
          name: name,
          address: address,
          postal_code: postalCode,
          logo_url: uploadedLogoUrl || '',
          event_id: selectedEventId || null,  // Store the event_id from context
          created_at: new Date().toISOString(),
        }
      ]);

    if (error) {
      console.error('Error inserting company and employer data:', error.message);
      toast({
        title: "Échec de l'enregistrement.",
        description: "Une erreur est survenue lors de l'enregistrement des données.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      console.log('Company and employer data inserted:', data);
      toast({
        title: "Succès.",
        description: "Les données de la société et de l'employeur ont été enregistrées avec succès.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Réinitialiser le formulaire après la soumission
      setSiret('');
      setApeCode('');
      setCollectiveAgreement('');
      setName('');
      setAddress('');
      setPostalCode('');
      setLogoUrl('');
      setLogoFile(null);
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
        {/* N° de SIRET */}
        <FormControl id="siret" mb={4} isRequired>
          <FormLabel>N° de SIRET</FormLabel>
          <Input 
            type="text" 
            value={siret} 
            onChange={(e) => setSiret(e.target.value)} 
            placeholder="ex: 054312354323" 
          />
        </FormControl>

        {/* Code APE */}
        <FormControl id="apeCode" mb={4} isRequired>
          <FormLabel>Code APE</FormLabel>
          <Input 
            type="text" 
            value={apeCode} 
            onChange={(e) => setApeCode(e.target.value)} 
            placeholder="ex: 6534Z" 
          />
        </FormControl>

        {/* Convention collective */}
        <FormControl id="collectiveAgreement" mb={4} isRequired>
          <FormLabel>Convention collective</FormLabel>
          <Textarea 
            value={collectiveAgreement} 
            onChange={(e) => setCollectiveAgreement(e.target.value)} 
            placeholder="ex: bureaux d'études techniques, cabinets d'ingénieurs-conseils et sociétés de conseil (syntec)" 
          />
        </FormControl>

        {/* Nom de l'employeur */}
        <FormControl id="name" mb={4} isRequired>
          <FormLabel>Nom de l'employeur</FormLabel>
          <Input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Nom de l'employeur" 
          />
        </FormControl>

        {/* Adresse de l'employeur */}
        <FormControl id="address" mb={4} isRequired>
          <FormLabel>Adresse de l'employeur</FormLabel>
          <Textarea 
            value={address} 
            onChange={(e) => setAddress(e.target.value)} 
            placeholder="Adresse de l'employeur" 
          />
        </FormControl>

        {/* Code postal de l'employeur */}
        <FormControl id="postalCode" mb={4} isRequired>
          <FormLabel>Code postal de l'employeur</FormLabel>
          <Input 
            type="text" 
            value={postalCode} 
            onChange={(e) => setPostalCode(e.target.value)} 
            placeholder="Code postal de l'employeur" 
          />
        </FormControl>

        {/* Logo de l'employeur (fichier) */}
        <FormControl id="logoFile" mb={4}>
          <FormLabel>Logo de l'employeur (fichier)</FormLabel>
          <Input 
            type="file" 
            onChange={handleFileChange} 
            accept="image/*"
          />
        </FormControl>

        <FormControl id="logoUrl" mb={4}>
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

export default CompanyAndEmployerForm;
