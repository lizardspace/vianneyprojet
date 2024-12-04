// src/App.tsx
import React, { useState, useEffect } from 'react';
import {
  ChakraProvider,
  Button,
  Box,
  List,
  ListItem,
  Text,
  Flex,
  Spinner,
  Heading,
  VStack,
  HStack,
  useToast,
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
                <List spacing={3}>
                  {forms.map((form) => (
                    <ListItem key={form.id} p={4} borderWidth="1px" borderRadius="md" mb={2}>
                      <Flex justify="space-between" align="center">
                        <Box>
                          <Text fontWeight="bold" fontSize="lg">
                            {form.title}
                          </Text>
                          <Text fontSize="sm" color="gray.500">
                            {form.description}
                          </Text>
                        </Box>
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
                        </HStack>
                      </Flex>
                    </ListItem>
                  ))}
                </List>
              )}
            </>
          )}
        </VStack>
      </Box>
    </ChakraProvider>
  );
};

export default App;
