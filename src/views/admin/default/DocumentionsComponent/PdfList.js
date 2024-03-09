import React, { useCallback, useEffect, useState } from 'react';
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
  Checkbox,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useEvent } from '../../../../EventContext';
import { supabase } from '../../../../supabaseClient';

const PdfList = ({ selectedPdf, setSelectedPdf }) => {
  const [pdfDocuments, setPdfDocuments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertStatus, setAlertStatus] = useState('');
  const [selectAllTeams, setSelectAllTeams] = useState(false); // State for selecting all teams
  const { eventId } = useEvent();

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
  const fetchDocuments = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('vianney_pdf_documents')
        .select('*')
        .eq('event_id', eventId);
      if (error) {
        console.error('Error fetching PDF documents:', error);
        return;
      }
      setPdfDocuments(data);
    } catch (error) {
      console.error('Error fetching PDF documents:', error);
    }
  }, [eventId]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments, eventId]);

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
    try {
      const teamsDetails = selectedTeams.map((teamId) => {
        const team = teams.find((t) => t.id === teamId);
        return { uuid: team.id, name: team.name_of_the_team };
      });

      const { error } = await supabase
        .from('vianney_pdf_documents')
        .update({
          teams_that_can_read_the_document: teamsDetails,
        })
        .eq('id', pdfId);

      if (error) throw error;

      // Re-fetch documents to update the UI
      await fetchDocuments();
      // After saving, clear the selected teams
      setSelectedTeams([]);

      // Show success alert
      setAlertMessage('Équipes sauvegardées avec succès');
      setAlertStatus('success');
      setShowAlert(true);
    } catch (error) {
      console.error('Error saving teams for document:', error);
      // Show error alert
      setAlertMessage('Une erreur s\'est produite lors de la sauvegarde des équipes');
      setAlertStatus('error');
      setShowAlert(true);
    }
  };

  // Handler for selecting all teams at once
  const handleSelectAllTeamsChange = (event) => {
    setSelectAllTeams(event.target.checked);
    if (event.target.checked) {
      setSelectedTeams(teams.map(team => team.id));
    } else {
      setSelectedTeams([]);
    }
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
          {showAlert && (
            <Alert status={alertStatus} variant="subtle" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" mb={4}>
              <AlertIcon boxSize="40px" mr={0} />
              {alertMessage}
            </Alert>
          )}
          <FormControl mt={4}>
            <FormLabel>Équipes pouvant lire le document</FormLabel>
            <Checkbox isChecked={selectAllTeams} onChange={handleSelectAllTeamsChange}>
              Sélectionner toutes les équipes
            </Checkbox>
            <Select placeholder="Selectionnez une équipe" onChange={handleTeamSelectChange}
              value={selectedTeams}>
              {teams.map(team => (
                <option key={team.id} value={team.id}>{team.name_of_the_team}</option>
              ))}
            </Select>
            <HStack spacing={4} mt={2}>
              {selectedTeams.map(teamId => {
                const team = teams.find(t => t.id === teamId);
                return (
                  <Tag size="lg" key={team.id} borderRadius="full" variant="solid" colorScheme="orange">
                    <TagLabel>{team.name_of_the_team || 'Team Name Not Available'}</TagLabel>
                    <TagCloseButton onClick={() => handleRemoveTeam(team.id)} />
                  </Tag>
                );
              })}
            </HStack>
            <Button
              mt={4}
              colorScheme="blue"
              onClick={() => handleSaveTeamsForDocument(selectedPdf.id)}
            >
              Sauvegarder les équipes
            </Button>
          </FormControl>
        </Box>
      ) : (
        <VStack spacing={4} alignItems="stretch">
          <Heading as="h2" size="lg" mb={4}>Documents PDF</Heading>
          {pdfDocuments.map((pdfDocument) => (
            <Box
              key={pdfDocument.id}
              p={4}
              borderWidth="1px"
              borderRadius="md"
              _hover={{ bg: "gray.50" }}
            >
              <Heading as="h3" size="md" my={2}>{pdfDocument.title}</Heading>
              <Text>{pdfDocument.description}</Text>
              <Link href={pdfDocument.file_url} isExternal mt={2} color="blue.500">Voir le PDF</Link>
              <Button colorScheme="red" size="sm" mt={2} onClick={() => handleDeletePdf(pdfDocument.id)}>
                Supprimer
              </Button>
              <Button
                mt={4}
                colorScheme="blue"
                onClick={() => setSelectedPdf(pdfDocument)}
              >
                Modifier
              </Button>
            </Box>
          ))}
        </VStack>
      )}
    </VStack>
  );
};

export default PdfList;
