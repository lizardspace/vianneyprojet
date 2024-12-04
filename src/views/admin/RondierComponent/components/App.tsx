// src/App.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  ChakraProvider,
  Button,
  Box,
  Text,
  Flex,
  Spinner,
  Heading,
  VStack,
  HStack,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from '@chakra-ui/react';
import FormBuilder from './components/FormBuilder.tsx';
import FormSubmit from './components/FormSubmit.tsx';
import ResponseViewer from './components/ResponseViewer.tsx';
import { supabase } from './../../../../supabaseClient';
import { Form } from './Types';

type ViewMode = 'list' | 'create' | 'submit' | 'viewResponses';

const App: React.FC = () => {
  const [currentFormId, setCurrentFormId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<ViewMode>('list');
  const [forms, setForms] = useState<Form[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toast = useToast();

  // Pour gérer la suppression des formulaires
  const [isDeletingForm, setIsDeletingForm] = useState<boolean>(false);
  const [formToDelete, setFormToDelete] = useState<Form | null>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  console.log('App: Current Form ID au démarrage:', currentFormId);
  console.log('App: Current View au démarrage:', currentView);

  // Fonction pour récupérer tous les formulaires depuis Supabase
  const fetchForms = async () => {
    setIsLoading(true);
    console.log('App: Récupération des formulaires depuis Supabase...');
    const { data, error } = await supabase
      .from('forms')
      .select('*')
      .order('created_at', { ascending: false }); // Assurez-vous que 'created_at' existe

    if (error) {
      console.error('App: Erreur lors de la récupération des formulaires:', error);
      toast({
        title: 'Erreur de récupération.',
        description: 'Une erreur est survenue lors de la récupération des formulaires.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } else {
      console.log('App: Formulaires récupérés:', data);
      setForms(data);
    }
    setIsLoading(false);
  };

  // Utiliser useEffect pour récupérer les formulaires au montage du composant
  useEffect(() => {
    fetchForms();
    // eslint-disable-next-line
  }, []);

  // Fonction de rappel lorsque le formulaire est sauvegardé
  const handleFormSaved = (formId: string) => {
    console.log('App: Formulaire sauvegardé avec ID:', formId);
    setCurrentFormId(formId);
    setCurrentView('submit');
    toast({
      title: 'Succès.',
      description: 'Formulaire sauvegardé avec succès !',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
    fetchForms(); // Rafraîchir la liste des formulaires
  };

  // Fonction pour créer un nouveau formulaire
  const handleCreateNewForm = () => {
    console.log('App: Ouverture du FormBuilder pour créer un nouveau formulaire.');
    setCurrentView('create');
    setCurrentFormId(null);
  };

  // Fonction pour revenir à la liste des formulaires
  const handleBackToList = () => {
    console.log('App: Retour à la liste des formulaires.');
    setCurrentView('list');
    setCurrentFormId(null);
  };

  // Fonction pour soumettre des réponses
  const handleSubmitResponses = (formId: string) => {
    console.log('App: Soumettre des réponses pour formId:', formId);
    setCurrentFormId(formId);
    setCurrentView('submit');
  };

  // Fonction pour voir les réponses
  const handleViewResponses = (formId: string) => {
    console.log('App: Voir les réponses pour formId:', formId);
    setCurrentFormId(formId);
    setCurrentView('viewResponses');
  };

  // Fonction pour initier la suppression d'un formulaire
  const initiateDeleteForm = (form: Form) => {
    setFormToDelete(form);
  };

  // Fonction pour confirmer la suppression d'un formulaire
  const confirmDeleteForm = async () => {
    if (!formToDelete) return;

    setIsDeletingForm(true);
    try {
      // Supprimer toutes les réponses associées
      const { error: deleteResponsesError } = await supabase
        .from('responses')
        .delete()
        .eq('form_id', formToDelete.id);

      if (deleteResponsesError) {
        throw deleteResponsesError;
      }

      // Supprimer le formulaire
      const { error: deleteFormError } = await supabase
        .from('forms')
        .delete()
        .eq('id', formToDelete.id);

      if (deleteFormError) {
        throw deleteFormError;
      }

      console.log('App: Formulaire et réponses supprimés avec succès.');
      toast({
        title: 'Succès.',
        description: 'Formulaire et réponses supprimés avec succès !',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Mettre à jour l'état local des formulaires
      setForms(forms.filter((f) => f.id !== formToDelete.id));

      // Si le formulaire supprimé était en cours d'affichage, revenir à la liste
      if (currentFormId === formToDelete.id) {
        setCurrentView('list');
        setCurrentFormId(null);
      }
    } catch (error) {
      console.error('App: Erreur lors de la suppression du formulaire:', error);
      toast({
        title: 'Erreur de suppression.',
        description: 'Une erreur est survenue lors de la suppression du formulaire.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
    setIsDeletingForm(false);
    setFormToDelete(null);
  };

  const cancelDeleteForm = () => {
    setFormToDelete(null);
  };

  return (
    <ChakraProvider>
      <Box p={8}>
        <VStack spacing={4} align="stretch">
          <Heading as="h1" size="xl" textAlign="center">
            Application de Formulaires
          </Heading>
          {currentView === 'create' && (
            <>
              <FormBuilder onFormSaved={handleFormSaved} />
              <Button onClick={handleBackToList} colorScheme="teal" mt={4}>
                Retour à la liste des formulaires
              </Button>
            </>
          )}
          {currentView === 'submit' && currentFormId && (
            <>
              <Heading as="h2" size="lg" mb={4}>
                Soumettre des Réponses
              </Heading>
              <FormSubmit formId={currentFormId} />
              <Button onClick={handleBackToList} colorScheme="teal" mt={4}>
                Retour à la liste des formulaires
              </Button>
            </>
          )}
          {currentView === 'viewResponses' && currentFormId && (
            <>
              <Heading as="h2" size="lg" mb={4}>
                Réponses du Formulaire
              </Heading>
              <ResponseViewer formId={currentFormId} />
              <Button onClick={handleBackToList} colorScheme="teal" mt={4}>
                Retour à la liste des formulaires
              </Button>
            </>
          )}
          {currentView === 'list' && (
            <>
              <Flex justify="space-between" align="center" mb={4}>
                <Heading as="h2" size="lg">
                  Liste des Formulaires
                </Heading>
                <Button onClick={handleCreateNewForm} colorScheme="teal">
                  Créer un Nouveau Formulaire
                </Button>
              </Flex>
              {isLoading ? (
                <Flex justify="center" align="center">
                  <Spinner size="xl" />
                </Flex>
              ) : forms.length === 0 ? (
                <Text>Aucun formulaire trouvé. Créez-en un nouveau!</Text>
              ) : (
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Titre</Th>
                      <Th>Description</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {forms.map((form) => (
                      <Tr key={form.id}>
                        <Td>{form.title}</Td>
                        <Td>{form.description}</Td>
                        <Td>
                          <HStack spacing={2}>
                            <Button
                              onClick={() => handleSubmitResponses(form.id)}
                              colorScheme="teal"
                              size="sm"
                            >
                              Soumettre
                            </Button>
                            <Button
                              onClick={() => handleViewResponses(form.id)}
                              colorScheme="blue"
                              size="sm"
                            >
                              Voir Réponses
                            </Button>
                            <Button
                              onClick={() => initiateDeleteForm(form)}
                              colorScheme="red"
                              size="sm"
                            >
                              Supprimer
                            </Button>
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </>
          )}
        </VStack>
      </Box>

      {/* AlertDialog pour confirmation de suppression de formulaire */}
      <AlertDialog
        isOpen={formToDelete !== null}
        leastDestructiveRef={cancelRef}
        onClose={cancelDeleteForm}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Supprimer le Formulaire
            </AlertDialogHeader>

            <AlertDialogBody>
              Êtes-vous sûr de vouloir supprimer ce formulaire et toutes les réponses associées ? Cette action est irréversible.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={cancelDeleteForm}>
                Annuler
              </Button>
              <Button
                colorScheme="red"
                onClick={confirmDeleteForm}
                ml={3}
                isLoading={isDeletingForm}
              >
                Supprimer
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </ChakraProvider>
  );
};

export default App;
