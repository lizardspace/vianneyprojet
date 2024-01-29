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
        title: 'Contact Information Submitted',
        description: 'Your contact information has been successfully submitted.',
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
        title: 'Error',
        description: 'There was an error submitting the form.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };  

  return (
    <Box>
      <form onSubmit={handleSubmit}>
      <FormControl id="name" isRequired>
  <FormLabel>Name</FormLabel>
  <Input type="text" name="name" placeholder="Your Name" />
</FormControl>
<FormControl id="email" isRequired>
  <FormLabel>Email Address</FormLabel>
  <Input type="email" name="email" placeholder="Your Email Address" />
</FormControl>
<FormControl id="phone" isRequired>
  <FormLabel>Phone Number</FormLabel>
  <Input type="tel" name="phone" placeholder="Your Phone Number" />
</FormControl>
<FormControl id="street" isRequired>
  <FormLabel>Street</FormLabel>
  <Input type="text" name="street" placeholder="Street Address" />
</FormControl>
<FormControl id="zip" isRequired>
  <FormLabel>Zip Code</FormLabel>
  <Input type="text" name="zip" placeholder="Zip Code" />
</FormControl>
<FormControl id="city" isRequired>
  <FormLabel>City</FormLabel>
  <Input type="text" name="city" placeholder="City" />
</FormControl>
<FormControl id="message" isRequired>
  <FormLabel>Message</FormLabel>
  <Textarea
    name="message"
    placeholder="Write your message here..."
    resize="vertical"
    minH="120px"
  />
</FormControl>
        <Button
          type="submit"
          colorScheme="teal"
          mt={4}
          width="100%"
          isLoading={false} // Set to true when form is submitting
        >
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default ContactInfoForm;