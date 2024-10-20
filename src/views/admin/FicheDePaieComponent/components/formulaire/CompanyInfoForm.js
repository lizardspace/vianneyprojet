import React, { useState } from 'react';
import { Box, Input, Button, FormControl, FormLabel, Textarea, useToast } from '@chakra-ui/react';
import { supabase } from './../../../../../supabaseClient'; // Assure-toi que le chemin est correct

const CompanyInfoForm: React.FC = () => {
  const [siret, setSiret] = useState('');
  const [apeCode, setApeCode] = useState('');
  const [collectiveAgreement, setCollectiveAgreement] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toast pour les notifications
  const toast = useToast();

  // Handler pour la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Insertion des données dans la table "vianney_employers" de Supabase
    const { data, error } = await supabase
      .from('vianney_employers')  // Utiliser la table "vianney_employers"
      .insert([
        {
          siret: siret,
          ape_code: apeCode,
          collective_agreement: collectiveAgreement,
        }
      ]);

    if (error) {
      console.error('Error inserting company data:', error.message);
      toast({
        title: "Échec de l'enregistrement.",
        description: "Une erreur est survenue lors de l'enregistrement des données.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      console.log('Company data inserted:', data);
      toast({
        title: "Succès.",
        description: "Les données de la société ont été enregistrées avec succès.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Réinitialiser le formulaire après la soumission
      setSiret('');
      setApeCode('');
      setCollectiveAgreement('');
    }

    setIsSubmitting(false);
  };

  return (
    <Box p={4} maxWidth="600px" mx="auto">
      <form onSubmit={handleSubmit}>
        <FormControl id="siret" mb={4} isRequired>
          <FormLabel>N° de SIRET</FormLabel>
          <Input 
            type="text" 
            value={siret} 
            onChange={(e) => setSiret(e.target.value)} 
            placeholder="ex: 054312354323" 
          />
        </FormControl>

        <FormControl id="apeCode" mb={4} isRequired>
          <FormLabel>Code APE</FormLabel>
          <Input 
            type="text" 
            value={apeCode} 
            onChange={(e) => setApeCode(e.target.value)} 
            placeholder="ex: 6534Z" 
          />
        </FormControl>

        <FormControl id="collectiveAgreement" mb={4} isRequired>
          <FormLabel>Convention collective</FormLabel>
          <Textarea 
            value={collectiveAgreement} 
            onChange={(e) => setCollectiveAgreement(e.target.value)} 
            placeholder="ex: bureaux d'études techniques, cabinets d'ingénieurs-conseils et sociétés de conseil (syntec)" 
          />
        </FormControl>

        <Button colorScheme="teal" type="submit" isDisabled={isSubmitting}>
          {isSubmitting ? 'Envoi en cours...' : 'Soumettre'}
        </Button>
      </form>
    </Box>
  );
};

export default CompanyInfoForm;
