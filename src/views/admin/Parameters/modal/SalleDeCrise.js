import ContactInfoForm from './salledecrise/ContactInfoForm';
import Documents from './salledecrise/Documents';
import FormDataViewer from './salledecrise/FormDataViewer';
import NotepadComponentSalleDeCrise from './salledecrise/NotepadComponentSalleDeCrise';
import {
    Heading
  } from '@chakra-ui/react';

const SalleDeCrise = () => {
  return (
    <div>
      <ContactInfoForm />
      <FormDataViewer/>
      <Heading>Bloc Note</Heading>
      <NotepadComponentSalleDeCrise/>
      <Heading>Documents</Heading>
      <Documents/>
    </div>
  );
};

export default SalleDeCrise;
