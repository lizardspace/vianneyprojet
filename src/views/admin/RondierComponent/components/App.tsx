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
} from '@chakra-ui/react';
import FormBuilder from './components/FormBuilder.tsx';
import FormSubmit from './components/FormSubmit.tsx';
import { supabase } from './../../../../supabaseClient';
import { Form } from './Types';

const App: React.FC = () => {
  const [currentFormId, setCurrentFormId] = useState<string | null>(null);
  const [forms, setForms] = useState<Form[]>([]);
  const [isCreatingForm, setIsCreatingForm] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  console.log('App: Current Form ID au démarrage:', currentFormId);

  // Fonction pour récupérer tous les formulaires depuis Supabase
  const fetchForms = async () => {
    setIsLoading(true);
    console.log('App: Récupération des formulaires depuis Supabase...');
    const { data, error } = await supabase
      .from('forms')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('App: Erreur lors de la récupération des formulaires:', error);
      alert('Une erreur est survenue lors de la récupération des formulaires.');
    } else {
      console.log('App: Formulaires récupérés:', data);
      setForms(data);
    }
    setIsLoading(false);
  };

  // Utiliser useEffect pour récupérer les formulaires au montage du composant
  useEffect(() => {
    fetchForms();
  }, []);

  // Fonction de rappel lorsque le formulaire est sauvegardé
  const handleFormSaved = (formId: string) => {
    console.log('App: Formulaire sauvegardé avec ID:', formId);
    setCurrentFormId(formId);
    console.log('App: currentFormId mis à jour:', formId);
    fetchForms(); // Rafraîchir la liste des formulaires
  };

  // Fonction pour créer un nouveau formulaire
  const handleCreateNewForm = () => {
    console.log('App: Ouverture du FormBuilder pour créer un nouveau formulaire.');
    setIsCreatingForm(true);
    setCurrentFormId(null);
  };

  // Fonction pour revenir à la liste des formulaires
  const handleBackToForms = () => {
    console.log('App: Retour à la liste des formulaires.');
    setIsCreatingForm(false);
    setCurrentFormId(null);
  };

  return (
    <ChakraProvider>
      <Box p={8}>
        {isCreatingForm ? (
          <>
            <FormBuilder onFormSaved={handleFormSaved} />
            <Button mt={4} onClick={handleBackToForms} colorScheme="teal">
              Retour à la liste des formulaires
            </Button>
          </>
        ) : currentFormId ? (
          <>
            <Heading as="h2" size="lg" mb={4}>
              Soumettre des Réponses
            </Heading>
            <FormSubmit formId={currentFormId} />
            <Button mt={4} onClick={handleBackToForms} colorScheme="teal">
              Retour à la liste des formulaires
            </Button>
          </>
        ) : (
          <>
            <Flex justify="space-between" align="center" mb={4}>
              <Heading as="h1" size="xl">
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
                      <Button onClick={() => setCurrentFormId(form.id)} colorScheme="teal">
                        Soumettre
                      </Button>
                    </Flex>
                  </ListItem>
                ))}
              </List>
            )}
          </>
        )}
      </Box>
    </ChakraProvider>
  );
};

export default App;
