import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  VStack,
  Heading,
  Icon,
  Alert,
  AlertIcon,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";
import { createClient } from "@supabase/supabase-js";
import { FcUpload } from "react-icons/fc";
import { useEvent } from '../../../../../../EventContext'; 

const supabaseUrl = 'https://hvjzemvfstwwhhahecwu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2anplbXZmc3R3d2hoYWhlY3d1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5MTQ4Mjc3MCwiZXhwIjoyMDA3MDU4NzcwfQ.6jThCX2eaUjl2qt4WE3ykPbrh6skE8drYcmk-UCNDSw';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const PdfUploader = () => {
  const { selectedEventId } = useEvent(); 
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ setSuccessAlert] = useState(false);
  const [errorAlert] = useState(false);
  const [formErrors, setFormErrors] = useState({
    file: false,
    title: false,
    description: false,
  });

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile.name);
  };

  const handleUpload = async () => {
    if (!file) {

      setFormErrors({ ...formErrors, file: true });
      return;
    }

    if (!title) {

      setFormErrors({ ...formErrors, title: true });
      return;
    }

    if (!description) {

      setFormErrors({ ...formErrors, description: true });
      return;
    }

    try {
      const { error } = await supabase.storage
        .from("pdfs")
        .upload(fileName, file);
      if (error) {

        return;
      }

      const publicURL = `${supabaseUrl}/storage/v1/object/public/pdfs/${fileName}`;

      const { error: insertError } = await supabase
        .from("vianney_pdf_documents_salle_de_crise")
        .insert({
          event_id: selectedEventId, 
          file_name: fileName,
          title,
          description,
          file_url: publicURL,
        });

      if (insertError) {
        return;
      }

      setFileUrl(publicURL);
      setSuccessAlert(true);
    } catch (error) {

    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      border="1px solid #ccc"
      borderRadius="md"
      p="4"
      boxShadow="md"
      background="blue.70"
    >
      <Heading as="h2" size="md" mb="4">
        Ajouter un fichier
      </Heading>
      <VStack spacing={4} alignItems="stretch" width="100%">
        <FormControl pb={5} pt={5} isInvalid={formErrors.file}>
          <FormLabel isRequired>Selectionnez un fichier</FormLabel>
          <Input type="file" onChange={handleFileChange} />
          {formErrors.file && (
            <FormErrorMessage>Ce champ est requis</FormErrorMessage>
          )}
        </FormControl>
        <FormControl pb={5} pt={5} isInvalid={formErrors.title}>
          <FormLabel isRequired>Titre du document</FormLabel>
          <Input
            type="text"
            placeholder="Titre du document"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {formErrors.title && (
            <FormErrorMessage>Ce champ est requis</FormErrorMessage>
          )}
        </FormControl>
        <FormControl pb={5} pt={5} isInvalid={formErrors.description}>
          <FormLabel isRequired>Description du document</FormLabel>
          <Input
            type="text"
            placeholder="Description du document"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {formErrors.description && (
            <FormErrorMessage>Ce champ est requis</FormErrorMessage>
          )}
        </FormControl>

        <Button
          onClick={handleUpload}
          leftIcon={<Icon as={FcUpload} boxSize={5} />}
          colorScheme="teal"
          alignItems="center"
          justifyContent="center"
          pb={5}
          pt={5}
        >
          Cliquez pour ajouter le fichier
        </Button>
        {fileUrl && (
          <Alert status="success" width="100%" pb={5} pt={5}>
            <AlertIcon />
            Le fichier a été téléchargé avec succès!
          </Alert>
        )}
        {errorAlert && (
          <Alert status="error" width="100%" pb={5} pt={5}>
            <AlertIcon />
            Erreur lors du téléchargement. Attention! Vous ne pouvez
            télécharger 2 fois le même fichier.
          </Alert>
        )}
      </VStack>
    </Box>
  );
};

export default PdfUploader;