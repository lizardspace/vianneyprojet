import React, { useState, useEffect } from "react";
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
  Select,
} from "@chakra-ui/react";
import { FcUpload } from "react-icons/fc";
import { useEvent } from '../../../../EventContext';
import { supabase, supabaseUrl } from './../../../../supabaseClient';

const PdfUploader = () => {
  const { selectedEventId } = useEvent(); 
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [teams, setTeams] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [errorAlert, setErrorAlert] = useState(false);
  const [formErrors, setFormErrors] = useState({
    file: false,
    title: false,
    description: false,
    teams: false,
  });

  useEffect(() => {
    const fetchTeams = async () => {
      const { data, error } = await supabase.from('vianney_teams').select('id, name_of_the_team');
      if (!error && data) {
        setTeams(data);
      }
    };

    fetchTeams();
  }, []);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile.name);
  };

  const handleTeamsChange = (event) => {
    const selectedOptions = [...event.target.options].filter(o => o.selected).map(o => o.value);
    setSelectedTeams(selectedOptions);
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
      const { error: uploadError } = await supabase.storage
        .from("pdfs")
        .upload(fileName, file);

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const publicURL = `${supabaseUrl}/storage/v1/object/public/pdfs/${fileName}`;

      const teamsDetails = selectedTeams.map(teamId => {
        const team = teams.find(t => t.id === teamId);
        return { uuid: team.id, name: team.name_of_the_team };
      });

      const { error: insertError } = await supabase
        .from("vianney_pdf_documents")
        .insert({
          event_id: selectedEventId, 
          file_name: fileName,
          title,
          description,
          file_url: publicURL,
          teams_that_can_read_the_document: teamsDetails,
        });

      if (insertError) {
        throw new Error(insertError.message);
      }

      setFileUrl(publicURL);
      // Handle success alert
    } catch (error) {
      setErrorAlert(true);
      console.error("Upload error:", error.message);
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
        <FormControl pb={5} pt={5} isInvalid={formErrors.teams}>
          <FormLabel>Équipes pouvant lire le document</FormLabel>
          <Select multiple placeholder="Select teams" onChange={handleTeamsChange} value={selectedTeams}>
            {teams.map(team => (
              <option key={team.id} value={team.id}>{team.name_of_the_team}</option>
            ))}
          </Select>
          {formErrors.teams && (
            <FormErrorMessage>This field is required</FormErrorMessage>
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
            Erreur lors du téléchargement. Veuillez essayer de nouveau.
          </Alert>
        )}
      </VStack>
    </Box>
  );
};

export default PdfUploader;
