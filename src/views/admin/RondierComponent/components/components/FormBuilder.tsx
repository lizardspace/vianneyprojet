// src/components/FormBuilder.tsx
import React, { useState } from 'react';
import { supabase } from './../../../../../supabaseClient';
import {
  Button,
  Input,
  Textarea,
  Box,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  useToast,
} from '@chakra-ui/react';
import { v4 as uuidv4 } from 'uuid';
import QuestionEditor from './QuestionEditor.tsx';
import { Form, Question } from '../Types';
import { useEvent } from './../../../../../EventContext'; // Mettez le bon chemin

interface FormBuilderProps {
  onFormSaved: (formId: string) => void;
}

const FormBuilder: React.FC<FormBuilderProps> = ({ onFormSaved }) => {
  const [form, setForm] = useState<Form>({
    id: '',
    title: '',
    description: '',
    questions: [],
    created_at: '',
    event_id: '',
  });
  const toast = useToast();
  const { selectedEventId } = useEvent();

  const addQuestion = () => {
    const newQuestion: Question = {
      id: uuidv4(),
      form_id: '',
      type: 'text',
      question_text: '',
      is_required: false,
      event_id: '',
    };
    setForm({ ...form, questions: [...(form.questions || []), newQuestion] });
  };

  const saveForm = async () => {
    // Vérifiez que l'événement est sélectionné
    if (!selectedEventId) {
      toast({
        title: 'Événement non sélectionné.',
        description: 'Veuillez sélectionner un événement avant de créer un formulaire.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    // Vérifiez que le titre n'est pas vide
    if (form.title.trim() === '') {
      toast({
        title: 'Titre manquant.',
        description: 'Le titre du formulaire est requis.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    // Vérifier que toutes les options des questions de type radio, checkbox, dropdown ont des 'value's non vides
    for (const question of form.questions || []) {
      if (
        ['radio', 'checkbox', 'dropdown'].includes(question.type) &&
        (!question.options || question.options.length === 0)
      ) {
        toast({
          title: 'Options manquantes.',
          description: `La question "${question.question_text}" doit avoir au moins une option.`,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      if (
        ['radio', 'checkbox', 'dropdown'].includes(question.type) &&
        question.options &&
        question.options.some((option) => !option.value.trim())
      ) {
        toast({
          title: 'Valeurs d\'options manquantes.',
          description: `Toutes les options de la question "${question.question_text}" doivent avoir une valeur.`,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }
    }

    try {
      // Générer un ID unique
      const formId = uuidv4();

      // Insérer le formulaire avec l'ID généré et l'event_id
      const { data: formData, error: formError } = await supabase
        .from('forms')
        .insert([
          {
            id: formId,
            title: form.title,
            description: form.description,
            event_id: selectedEventId, // Ajouter event_id
          },
        ])
        .select('*')
        .single();

      if (formError) {
        console.error('FormBuilder: Erreur lors de l\'insertion du formulaire:', formError);
        toast({
          title: 'Erreur de sauvegarde.',
          description: 'Une erreur est survenue lors de la sauvegarde du formulaire.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      console.log('FormBuilder: Données du formulaire insérées:', formData);

      if (!formData || !formData.id) {
        console.error('FormBuilder: formData est nul ou ne contient pas d\'id');
        toast({
          title: 'Erreur de sauvegarde.',
          description: 'Une erreur est survenue lors de la sauvegarde du formulaire.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      // Préparer les données des questions
      const questionsData = (form.questions || []).map((q) => ({
        id: q.id,
        form_id: formData.id,
        type: q.type,
        question_text: q.question_text,
        options: q.options,
        is_required: q.is_required,
        event_id: selectedEventId, // Ajouter event_id
      }));

      // Insérer les questions
      const { error: questionsError } = await supabase.from('questions').insert(questionsData);

      if (questionsError) {
        console.error('FormBuilder: Erreur lors de l\'insertion des questions:', questionsError);
        toast({
          title: 'Erreur de sauvegarde.',
          description: 'Une erreur est survenue lors de la sauvegarde des questions.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Succès.',
          description: 'Formulaire sauvegardé avec succès !',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        onFormSaved(formData.id); // Passer le formId au parent
        // Réinitialiser le formulaire
        setForm({
          id: '',
          title: '',
          description: '',
          questions: [],
          created_at: '',
          event_id: '',
        });
      }
    } catch (error) {
      console.error('FormBuilder: Erreur inattendue lors de la sauvegarde du formulaire:', error);
      toast({
        title: 'Erreur inattendue.',
        description: 'Une erreur inattendue est survenue.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={6} borderWidth="1px" borderRadius="md" boxShadow="md">
      <Heading as="h2" size="lg" mb={4}>
        Créer un Nouveau Formulaire
      </Heading>
      <VStack spacing={4} align="stretch">
        <FormControl isRequired>
          <FormLabel>Titre du Formulaire</FormLabel>
          <Input
            placeholder="Titre du formulaire"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Description du Formulaire</FormLabel>
          <Textarea
            placeholder="Description du formulaire"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </FormControl>
        <Button onClick={addQuestion} colorScheme="teal" variant="outline">
          Ajouter une Question
        </Button>
        {(form.questions || []).map((question, index) => (
          <QuestionEditor
            key={question.id}
            question={question}
            onUpdate={(updatedQuestion) => {
              const updatedQuestions = [...(form.questions || [])];
              updatedQuestions[index] = updatedQuestion;
              setForm({ ...form, questions: updatedQuestions });
            }}
          />
        ))}
        <Button onClick={saveForm} colorScheme="teal" mt={4}>
          Sauvegarder le Formulaire
        </Button>
      </VStack>
    </Box>
  );
};

export default FormBuilder;
