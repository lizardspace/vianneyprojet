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

const ContactInfoForm = () => {
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    // You can use Supabase or SQL to save the contact information

    // Example toast message on successful submission
    toast({
      title: 'Contact Information Submitted',
      description: 'Your contact information has been successfully submitted.',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <FormControl id="name" isRequired>
          <FormLabel>Name</FormLabel>
          <Input type="text" placeholder="Your Name" />
        </FormControl>
        <FormControl id="email" isRequired>
          <FormLabel>Email Address</FormLabel>
          <Input type="email" placeholder="Your Email Address" />
        </FormControl>
        <FormControl id="message" isRequired>
          <FormLabel>Message</FormLabel>
          <Textarea
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
