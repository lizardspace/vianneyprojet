import React, { useState } from 'react';
import { Box, Button, Input, FormControl, FormLabel, Badge, Text, VStack, HStack, Icon, Collapse, useToast } from '@chakra-ui/react';
import { supabase } from '../../../../../../supabaseClient';
import { FiUploadCloud, FiFileText, FiEdit2 } from 'react-icons/fi';
import { useEvent } from '../../../../../../EventContext'; // Assurez-vous que le chemin est correct

const MoyensEffectifsFichiersFileUploadForm = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [newFileName, setNewFileName] = useState('');
  const [showComponent, setShowComponent] = useState(false);
  const toast = useToast();
  const { selectedEventId } = useEvent();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile.name);
    setNewFileName(selectedFile.name);
  };

  const handleUpload = async () => {
    if (!file) return;

    const fileExt = file.name.split('.').pop();
    const filePath = `${Math.random()}.${fileExt}`;

    let { error: uploadError } = await supabase.storage
      .from('vianney-moyens-effectifs-fichiers')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Erreur de téléchargement du fichier:', uploadError);
      return;
    }

    const { data: urlData, error: urlError } = supabase
      .storage
      .from('vianney-moyens-effectifs-fichiers')
      .getPublicUrl(filePath);

    if (urlError) {
      console.error('Erreur lors de l\'obtention de l\'URL publique:', urlError);
      return;
    }

    const publicURL = urlData.publicUrl;

    if (!publicURL) {
      console.error('L\'URL publique est null');
      return;
    }

    const { error: dbError } = await supabase
      .from('vianney_moyens_effectifs_fichiers')
      .insert([{ file_name: newFileName, url: publicURL, event_id: selectedEventId }]);

    if (dbError) {
      console.error('Erreur lors de l\'insertion dans la base de données:', dbError);
      return;
    }

    toast({
      title: "Fichier téléchargé avec succès!",
      description: "Votre fichier a été téléchargé et enregistré avec succès.",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "bottom"
    });
  };

  return (
    <Box>
      <Button
        onClick={() => setShowComponent(!showComponent)}
        colorScheme="teal"
        mb={4}
      >
        {showComponent ? "Cacher le module d'ajout d'un fichier" : 'Ajouter un fichier'}
      </Button>

      <Collapse in={showComponent}>
        <Box
          p={6}
          borderWidth={1}
          borderRadius="lg"
          boxShadow="lg"
          bgGradient="linear(to-r, teal.500, green.500)"
          color="white"
          maxW="md"
          mx="auto"
        >
          <VStack spacing={4}>
            <HStack spacing={2}>
              <Icon as={FiUploadCloud} w={6} h={6} />
              <FormLabel fontSize="xl" fontWeight="bold">Télécharger un fichier</FormLabel>
            </HStack>
            <FormControl>
              <Input type="file" id="file" onChange={handleFileChange} variant="filled" bg="white" color="black"/>
            </FormControl>
            {file && (
              <FormControl>
                <HStack spacing={2}>
                  <Icon as={FiEdit2} w={5} h={5} />
                  <FormLabel htmlFor="newFileName">Nouveau nom du fichier</FormLabel>
                </HStack>
                <Input
                  type="text"
                  id="newFileName"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  variant="filled"
                  bg="white"
                  color="black"
                />
              </FormControl>
            )}
            <Button
              mt={4}
              colorScheme="blue"
              onClick={handleUpload}
              leftIcon={<FiFileText />}
            >
              Télécharger le fichier
            </Button>
            {fileName && (
              <Box mt={4} textAlign="center">
                <Badge colorScheme="green">Nom original du fichier :</Badge>
                <Text fontSize="md" mt={2}>{fileName}</Text>
              </Box>
            )}
          </VStack>
        </Box>
      </Collapse>
    </Box>
  );
};

export default MoyensEffectifsFichiersFileUploadForm;
