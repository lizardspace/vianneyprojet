import React, { useEffect, useState } from 'react';
import {
  Box,
  VStack,
  Button,
  Heading,
  Text,
  Link,
  Center,
  HStack,
  Tag,
  TagLabel,
  Select,
  TagCloseButton,
  FormLabel,
  FormControl,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useEvent } from '../../../../EventContext';
import { supabase } from '../../../../supabaseClient';

const PdfList = ({ selectedPdf, setSelectedPdf }) => {
  const [pdfDocuments, setPdfDocuments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const { eventId } = useEvent(); // Extract the eventId from the useEvent hook

  // Fetch teams
  useEffect(() => {
    const fetchTeams = async () => {
      const { data, error } = await supabase.from('vianney_teams').select('id, name_of_the_team');
      if (!error && data) {
        setTeams(data);
      }
    };
    fetchTeams();
  }, []);

  // Fetch documents
  const fetchDocuments = async () => {
    try {
      const { data: pdfDocumentsData, error } = await supabase
        .from('vianney_pdf_documents')
        .select('*')
        .eq('event_id', eventId);
      if (error) {
        console.error('Error fetching PDF documents:', error);
        return;
      }
      setPdfDocuments(pdfDocumentsData);
    } catch (error) {
      console.error('Error fetching PDF documents:', error);
    }
  };

  // Call fetchDocuments when the component mounts or eventId changes
  useEffect(() => {
    fetchDocuments();
  }, [eventId]);

  const handleReturnBack = () => {
    setSelectedPdf(null);
  };

  const handleDeletePdf = async (pdfId) => {
    try {
      const { error } = await supabase
        .from("vianney_pdf_documents")
        .delete()
        .eq("id", pdfId);

      if (error) {
        console.error("Error deleting PDF document:", error);
        return;
      }

      setPdfDocuments((prevDocuments) =>
        prevDocuments.filter((document) => document.id !== pdfId)
      );
    } catch (error) {
      console.error("Error deleting PDF document:", error);
    }
  };

  const handleTeamSelectChange = (event) => {
    const value = event.target.value;
    setSelectedTeams(prevSelectedTeams => {
      // Add to array if not already present
      if (!prevSelectedTeams.includes(value)) {
        return [...prevSelectedTeams, value];
      }
      return prevSelectedTeams;
    });
  };

  const handleRemoveTeam = (teamId) => {
    setSelectedTeams(prevSelectedTeams => prevSelectedTeams.filter(id => id !== teamId));
  };

  const handleSaveTeamsForDocument = async (pdfId) => {
    // ... Save teams for the document
  };

  return (
    <VStack spacing={4} alignItems="stretch">
      {selectedPdf ? (
        <Box key={selectedPdf.id} p={4} borderWidth="1px" borderRadius="md">
          <Button
            onClick={handleReturnBack}
            mt={4}
            colorScheme="blue"
            alignSelf="start"
            leftIcon={<ArrowBackIcon />}
          >
            Retour en arrière
          </Button>
          <Center my={4}>
            <Heading as="h3" size="lg">
              {selectedPdf.title}
            </Heading>
          </Center>
          <Center>
            <Text>{selectedPdf.description}</Text>
          </Center>
          <Center mt={4}>
            <iframe
              title={selectedPdf.file_name}
              src={selectedPdf.file_url}
              width="100%"
              height="800"
              style={{ border: "none" }}
            />
          </Center>
          <FormControl mt={4}>
                <FormLabel>Équipes pouvant lire le document</FormLabel>
                <Select placeholder="Sélectionnez une équipe" onChange={handleTeamSelectChange}>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>{team.name_of_the_team}</option>
                  ))}
                </Select>
                <HStack spacing={4} mt={2}>
                  {selectedTeams.map(teamId => {
                    const team = teams.find(t => t.id === teamId);
                    return (
                      <Tag size="lg" key={team.id} borderRadius="full" variant="solid" colorScheme="orange">
                        <TagLabel>{team.name_of_the_team}</TagLabel>
                        <TagCloseButton onClick={() => handleRemoveTeam(team.id)} />
                      </Tag>
                    );
                  })}
                </HStack>
                <Button
                  mt={4}
                  colorScheme="blue"
                  onClick={() => handleSaveTeamsForDocument(pdfDocument.id)}
                >
                  Sauvegarder les équipes
                </Button>
              </FormControl>
        </Box>
      ) : (
        <VStack spacing={4} alignItems="stretch">
          <Heading as="h2" size="lg" mb={4}>Documents</Heading>
          {pdfDocuments.map((pdfDocument) => (
            <Box
              key={pdfDocument.id}
              p={4}
              borderWidth="1px"
              borderRadius="md"
              _hover={{ bg: "gray.50", cursor: "pointer" }}
              onClick={() => setSelectedPdf(pdfDocument)}
            >
              <Heading as="h3" size="md" my={2}>{pdfDocument.title}</Heading>
              <Text>{pdfDocument.description}</Text>
              <Link href={pdfDocument.file_url} isExternal mt={2} color="blue.500">Voir le PDF</Link>
              <Button colorScheme="red" size="sm" mt={2} onClick={() => handleDeletePdf(pdfDocument.id)}>Supprimer</Button>
              
            </Box>
          ))}
        </VStack>
      )}
    </VStack>
  );
};

export default PdfList;
