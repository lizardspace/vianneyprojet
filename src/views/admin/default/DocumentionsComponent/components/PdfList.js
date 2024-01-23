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
import { createClient } from "@supabase/supabase-js";
import { ArrowBackIcon } from "@chakra-ui/icons";

const supabaseUrl = 'https://hvjzemvfstwwhhahecwu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2anplbXZmc3R3d2hoYWhlY3d1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5MTQ4Mjc3MCwiZXhwIjoyMDA3MDU4NzcwfQ.6jThCX2eaUjl2qt4WE3ykPbrh6skE8drYcmk-UCNDSw';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const PdfList = ({ selectedPdf, setSelectedPdf }) => {
  const [pdfDocuments, setPdfDocuments] = React.useState([]);
  React.useEffect(() => {
    fetchPdfDocuments();
  }, []);

  const fetchPdfDocuments = async () => {
    try {
      const { data: pdfDocumentsData, error } = await supabase
        .from("vianney_pdf_documents")
        .select("*");

      if (error) {
        console.error("Error fetching PDF documents:", error);
        return;
      }

      setPdfDocuments(pdfDocumentsData);
    } catch (error) {
      console.error("Error fetching PDF documents:", error);
    }
  };

  const handleReturnBack = () => {
    setSelectedPdf(null);
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
            </Box>
          ))}
        </VStack>
      )}
    </VStack>
  );
};

export default PdfList;