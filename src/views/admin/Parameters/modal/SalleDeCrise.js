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
import { FcDataConfiguration } from "react-icons/fc";

const SalleDeCrise = () => {
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const [showContactInfoForm, setShowContactInfoForm] = useState(false); // Initialisation à false

  const toggleContactInfoForm = () => {
    setShowContactInfoForm(!showContactInfoForm); // Inversion de l'état
  };

  return (
    <div>
      <Button
        onClick={toggleContactInfoForm}
        leftIcon={<FcDataConfiguration />} // Icône pour afficher/masquer le formulaire
        colorScheme="teal"
      >
        {showContactInfoForm ? "Masquer le formulaire de contact" : "Afficher le formulaire de contact"}
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
