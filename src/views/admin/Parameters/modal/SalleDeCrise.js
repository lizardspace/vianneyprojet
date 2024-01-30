import ContactInfoForm from './salledecrise/ContactInfoForm';
import Documents from './salledecrise/Documents';
import FormDataViewer from './salledecrise/FormDataViewer';
import NotepadComponentSalleDeCrise from './salledecrise/NotepadComponentSalleDeCrise';
import {
  Heading,
  useColorModeValue,
} from '@chakra-ui/react';

const SalleDeCrise = () => {
  const textColor = useColorModeValue("secondaryGray.900", "white");
  return (
    <div>
      <ContactInfoForm />
      <FormDataViewer />
      <Heading me='auto' color={textColor} fontSize='2xl' fontWeight='700' lineHeight='100%' mb="20px">Bloc Note</Heading>
      <NotepadComponentSalleDeCrise />
      <Documents />
    </div>
  );
};

export default SalleDeCrise;
