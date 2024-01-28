import ContactInfoForm from './salledecrise/ContactInfoForm';
import NotepadComponentSalleDeCrise from './salledecrise/NotepadComponentSalleDeCrise';
import {
    Heading
  } from '@chakra-ui/react';

const SalleDeCrise = () => {
  return (
    <div>
      <ContactInfoForm />
      <Heading>Bloc Note</Heading>
      <NotepadComponentSalleDeCrise/>
    </div>
  );
};

export default SalleDeCrise;
