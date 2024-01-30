import { supabase } from './../../../../../supabaseClient';
import React from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Textarea,
  useToast,
  ChakraProvider,
  Flex, // Import Flex component
} from '@chakra-ui/react';
import {
  useEvent,
} from './../../../../../EventContext';

const ContactInfoForm = () => {
  const toast = useToast();
  const { selectedEventId } = useEvent();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const street = formData.get('street');
    const zip = formData.get('zip');
    const city = formData.get('city');
    const message = formData.get('message');

    console.log('Form Data:', {
      event_id: selectedEventId,
      name,
      email,
      phone,
      street,
      zip,
      city,
      message,
    });

    try {
      const { error } = await supabase
        .from('vianney_form_utile_salle_de_crise')
        .upsert([
          {
            event_id: selectedEventId,
            name,
            email,
            phone,
            street,
            zip,
            city,
            message,
          },
        ]);

      if (error) {
        console.error('Error submitting form data:', error);
        throw new Error('Error submitting form data');
      }

      // Example toast message on successful submission
      toast({
        title: 'Informations de contact soumises',
        description: 'Vos informations de contact ont été soumises avec succès.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Clear the form after successful submission
      e.target.reset();
    } catch (error) {
      // Handle error submission
      console.error('Error:', error);
      toast({
        title: 'Erreur',
        description: "Une erreur s'est produite lors de la soumission du formulaire.",
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };  

  return (
    <ChakraProvider>
      <Box>
        <form onSubmit={handleSubmit}>
        <FormControl id="name" isRequired>
            <FormLabel>Nom</FormLabel>
            <Input type="text" name="name" placeholder="Votre nom" />
          </FormControl>
          <FormControl id="email" isRequired>
            <FormLabel>Adresse e-mail</FormLabel>
            <Input type="email" name="email" placeholder="Votre adresse e-mail" />
          </FormControl>
          <FormControl id="phone" isRequired>
            <FormLabel>Numéro de téléphone</FormLabel>
            <Input type="tel" name="phone" placeholder="Votre numéro de téléphone" />
          </FormControl>
          <FormControl id="street" isRequired>
            <FormLabel>Rue</FormLabel>
            <Input type="text" name="street" placeholder="Adresse de rue" />
          </FormControl>
          <FormControl id="zip" isRequired>
            <FormLabel>Code postal</FormLabel>
            <Input type="text" name="zip" placeholder="Code postal" />
          </FormControl>
          <FormControl id="city" isRequired>
            <FormLabel>Ville</FormLabel>
            <Input type="text" name="city" placeholder="Ville" />
          </FormControl>
          <FormControl id="message" isRequired>
            <FormLabel>Message</FormLabel>
            <Textarea
              name="message"
              placeholder="Écrivez votre message ici..."
              resize="vertical"
              minH="120px"
            />
          </FormControl>
          <Flex justifyContent="flex-end"> 
            <Button
              type="submit"
              colorScheme="teal"
              mt={4}
              minWidth={`${toast('Soumettre').length * 10}px`}
              isLoading={false}
            >
              Soumettre
            </Button>
          </Flex>
        </form>
      </Box>
    </ChakraProvider>
  );
};

export default ContactInfoForm;
