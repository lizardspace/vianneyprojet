import React, { useState } from 'react';
import {
  Heading,
  useColorModeValue,
  Button,
} from '@chakra-ui/react';
import ContactInfoForm from './salledecrise/ContactInfoForm';
import FormDataViewer from './salledecrise/FormDataViewer';
import NotepadComponentSalleDeCrise from './salledecrise/NotepadComponentSalleDeCrise';
import Documents from './salledecrise/Documents';

const SalleDeCrise = () => {
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const [showContactInfoForm, setShowContactInfoForm] = useState(false); // Initially set to true

  const toggleContactInfoForm = () => {
    setShowContactInfoForm(!showContactInfoForm); // Toggle the state
  };

  return (
    <div>
      <Button onClick={toggleContactInfoForm}>
        {showContactInfoForm ? "Hide Contact Info Form" : "Show Contact Info Form"}
      </Button>
      {showContactInfoForm && <ContactInfoForm />}      
      <FormDataViewer />
      <Heading me='auto' color={textColor} fontSize='2xl' fontWeight='700' lineHeight='100%' mb="20px">Bloc Note</Heading>
      <NotepadComponentSalleDeCrise />
      <Documents />
    </div>
  );
};

export default SalleDeCrise;
