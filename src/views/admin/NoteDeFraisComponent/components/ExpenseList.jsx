import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Grid,
  GridItem,
  Image,
  Spinner,
  useToast,
  Button,
  HStack,
  VStack,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure
} from '@chakra-ui/react';
import supabase from './../../../../supabaseClient';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ExpenseSummaryPDF from './ExpenseSummaryPDF';
import { useEvent } from './../../../../EventContext';
import { FaFilePdf, FaDownload, FaExpand } from "react-icons/fa6";

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const toast = useToast();
  const { selectedEventId } = useEvent();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        let query = supabase
          .from('vianney_expenses_reimbursement')
          .select('*');

        if (selectedEventId) {
          query = query.eq('event_id', selectedEventId);
        }

        let { data, error } = await query;

        if (error) {
          throw error;
        }

        setExpenses(data || []);
      } catch (error) {
        toast({
          title: 'Erreur de chargement',
          description: `Erreur: ${error.message}`,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [toast, selectedEventId]);

  const getFileUrl = (filename) => {
    if (!filename) return null;
    return `https://hvjzemvfstwwhhahecwu.supabase.co/storage/v1/object/public/notedefrais/${filename}`;
  };

  const downloadFile = async (filename) => {
    const url = getFileUrl(filename);
    if (!url) return;

    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast({
        title: 'Erreur de téléchargement',
        description: `Impossible de télécharger le fichier: ${error.message}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const openImageModal = (url) => {
    setSelectedImage(url);
    onOpen();
  };

  if (loading) {
    return (
      <Flex justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  const renderFilePreview = (filename, label) => {
    const fileUrl = getFileUrl(filename);
    if (!fileUrl) return null;

    const isImage = filename.match(/\.(jpeg|jpg|gif|png)$/i);
    const isPDF = filename.match(/\.pdf$/i);

    return (
      <GridItem colSpan={2}>
        <Text fontWeight="bold">{label}:</Text>
        <VStack align="start" mt={2}>
          {isImage && (
            <Box position="relative">
              <Image
                src={fileUrl}
                alt={label}
                boxSize="200px"
                objectFit="cover"
                borderRadius="md"
                cursor="pointer"
                onClick={() => openImageModal(fileUrl)}
              />
              <Icon
                as={FaExpand}
                position="absolute"
                top={2}
                right={2}
                color="white"
                bg="rgba(0,0,0,0.5)"
                p={1}
                borderRadius="md"
                cursor="pointer"
                onClick={() => openImageModal(fileUrl)}
              />
            </Box>
          )}
          {isPDF && (
            <Box p={4} borderWidth="1px" borderRadius="md">
              <Text>Fichier PDF: {filename}</Text>
            </Box>
          )}
          <Button
            leftIcon={<FaDownload />}
            size="sm"
            onClick={() => downloadFile(filename)}
            mt={2}
          >
            Télécharger
          </Button>
        </VStack>
      </GridItem>
    );
  };

  const renderExpenseFiles = (expense) => {
    if (!expense.expenses) return null;

    return JSON.parse(expense.expenses).map((exp, index) => {
      if (!exp.file) return null;
      return (
        <Box key={index} mb="4">
          <Text>{exp.name} - {exp.cost ? exp.cost.toFixed(2) : 'N/A'} €</Text>
          {renderFilePreview(exp.file, `Justificatif pour ${exp.name}`)}
        </Box>
      );
    });
  };

  return (
    <Box p="6">
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Prévisualisation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedImage && (
              <Image
                src={selectedImage}
                alt="Prévisualisation"
                maxW="100%"
                maxH="80vh"
                objectFit="contain"
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      <Grid templateColumns="repeat(1, 1fr)" gap="6">
        {expenses.map((expense) => (
          <Box
            key={expense.id}
            p="6"
            boxShadow="lg"
            borderRadius="md"
            borderWidth="1px"
            borderColor="gray.200"
            bg="white"
          >
            <Grid templateColumns="repeat(2, 1fr)" gap="4">
              <GridItem>
                <Text fontWeight="bold">Nom:</Text>
                <Text>{expense.volunteer_last_name}</Text>
              </GridItem>
              <GridItem>
                <Text fontWeight="bold">Prénom:</Text>
                <Text>{expense.volunteer_first_name}</Text>
              </GridItem>
              <GridItem>
                <Text fontWeight="bold">Téléphone:</Text>
                <Text>{expense.phone_number}</Text>
              </GridItem>
              <GridItem>
                <Text fontWeight="bold">Email:</Text>
                <Text>{expense.email}</Text>
              </GridItem>
              <GridItem>
                <Text fontWeight="bold">Pôle:</Text>
                <Text>{expense.pole}</Text>
              </GridItem>
              <GridItem>
                <Text fontWeight="bold">Adresse:</Text>
                <Text>{expense.address}</Text>
              </GridItem>
              <GridItem>
                <Text fontWeight="bold">Option de donation:</Text>
                <Text>{expense.donation_option}</Text>
              </GridItem>

              {/* Pièces jointes principales */}
              {renderFilePreview(expense.rib, "RIB")}
              {renderFilePreview(expense.departure_odometer, "Compteur de kilomètres départ")}
              {renderFilePreview(expense.return_odometer, "Compteur de kilomètres retour")}
              {renderFilePreview(expense.carte_grise, "Photo de la carte grise")}

              <GridItem colSpan={2}>
                <Text fontWeight="bold">Trajets:</Text>
                {expense.trips && JSON.parse(expense.trips).map((trip, index) => (
                  <Box key={index} mb="4">
                    <Text>{trip.name} - {trip.distance} KM</Text>
                  </Box>
                ))}
              </GridItem>

              <GridItem colSpan={2}>
                <Text fontWeight="bold">Dépenses:</Text>
                {renderExpenseFiles(expense)}
              </GridItem>

              <GridItem colSpan={2}>
                <HStack justifyContent="flex-end" spacing={4}>
                  <PDFDownloadLink
                    document={<ExpenseSummaryPDF data={expense} trips={JSON.parse(expense.trips)} expenses={JSON.parse(expense.expenses)} />}
                    fileName={`note_de_frais_${expense.volunteer_last_name}_${expense.volunteer_first_name}.pdf`}
                  >
                    {({ loading }) => (
                      <Button
                        leftIcon={<FaFilePdf />}
                        colorScheme="red"
                        variant="solid"
                        isLoading={loading}
                      >
                        Télécharger le PDF récapitulatif
                      </Button>
                    )}
                  </PDFDownloadLink>
                </HStack>
              </GridItem>
            </Grid>
          </Box>
        ))}
      </Grid>
    </Box>
  );
};

export default ExpenseList;