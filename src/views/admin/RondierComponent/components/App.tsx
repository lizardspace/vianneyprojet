// src/App.tsx
import React, { useState, useEffect } from 'react';
import { MantineProvider, Button, Box, List, Text, Group } from '@mantine/core';
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
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Box style={{ padding: '2em' }}>
        {isCreatingForm ? (
          <>
            <FormBuilder onFormSaved={handleFormSaved} />
            <Button mt="md" onClick={handleBackToForms}>
              Retour à la liste des formulaires
            </Button>
          </>
        ) : currentFormId ? (
          <>
            <h2>Soumettre des Réponses</h2>
            <FormSubmit formId={currentFormId} />
            <Button mt="md" onClick={() => setCurrentFormId(null)}>
              Retour à la liste des formulaires
            </Button>
          </>
        ) : (
          <>
            <Group position="apart" mb="md">
              <Text size="xl" weight={700}>
                Liste des Formulaires
              </Text>
              <Button onClick={handleCreateNewForm}>Créer un Nouveau Formulaire</Button>
            </Group>
            {isLoading ? (
              <Text>Chargement des formulaires...</Text>
            ) : forms.length === 0 ? (
              <Text>Aucun formulaire trouvé. Créez-en un nouveau!</Text>
            ) : (
              <List spacing="sm" size="sm" center>
                {forms.map((form) => (
                  <List.Item key={form.id}>
                    <Group position="apart">
                      <Box>
                        <Text weight={500}>{form.title}</Text>
                        <Text size="sm" color="dimmed">
                          {form.description}
                        </Text>
                      </Box>
                      <Button onClick={() => setCurrentFormId(form.id)}>Soumettre</Button>
                    </Group>
                  </List.Item>
                ))}
              </List>
            )}
          </>
        )}
      </Box>
    </MantineProvider>
  );
};

export default App;
