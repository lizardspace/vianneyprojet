import React from "react";
import {
  Box,
  VStack,
  Button,
  Heading,
  Text,
  Link,
  Center,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useEvent } from './../../../../../../EventContext'; 

import { supabase } from './../../../../../../supabaseClient';

const PdfList = ({ selectedPdf, setSelectedPdf }) => {
  const [pdfDocuments, setPdfDocuments] = React.useState([]);
  const { selectedEventId } = useEvent();


  React.useEffect(() => {
    const fetchPdfDocuments = async () => {
      try {
        const { data: pdfDocumentsData, error } = await supabase
          .from("vianney_pdf_documents_salle_de_crise")
          .select("*")
          .eq("event_id", selectedEventId); // Filter by selected event_id
  
        if (error) {
          console.error("Error fetching PDF documents:", error);
          return;
        }
  
        setPdfDocuments(pdfDocumentsData);
      } catch (error) {
        console.error("Error fetching PDF documents:", error);
      }
    };
  
    fetchPdfDocuments();
  }, [selectedEventId]); // include dependencies of fetchPdfDocuments here
  
  
  const handleReturnBack = () => {
    setSelectedPdf(null);
  };
  const handleDeletePdf = async (pdfId) => {
    try {
      const { error } = await supabase
        .from("vianney_pdf_documents_salle_de_crise")
        .delete()
        .eq("id", pdfId);

      if (error) {
        console.error("Error deleting PDF document:", error);
        return;
      }

      // Remove the deleted document from the local state
      setPdfDocuments((prevDocuments) =>
        prevDocuments.filter((document) => document.id !== pdfId)
      );
    } catch (error) {
      console.error("Error deleting PDF document:", error);
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
        </Box>
      ) : (
        <VStack spacing={4} alignItems="stretch">
          <Heading as="h2" size="lg" mb={4}>
            Document PDF
          </Heading>
          {pdfDocuments.map((pdfDocument) => (
            <Box
              key={pdfDocument.id}
              p={4}
              borderWidth="1px"
              borderRadius="md"
              _hover={{ bg: "gray.50", cursor: "pointer" }}
              onClick={() => setSelectedPdf(pdfDocument)}
            >
              <Heading as="h3" size="md" my={2}>
                {pdfDocument.title}
              </Heading>
              <Text>{pdfDocument.description}</Text>
              <Link
                href={pdfDocument.file_url}
                target="_blank"
                mt={2}
                color="blue.500"
              >
                Voir le PDF
              </Link>
              <Button
                colorScheme="red" // Set the color scheme to red for delete button
                size="sm" // Adjust the size of the button as needed
                mt={2}
                onClick={() => handleDeletePdf(pdfDocument.id)} // Add delete handler
              >
                Supprimer
              </Button>
            </Box>
          ))}

        </VStack>
      )}
    </VStack>
  );
};

export default PdfList;