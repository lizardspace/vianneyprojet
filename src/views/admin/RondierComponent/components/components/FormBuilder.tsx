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
  FormErrorMessage,
} from '@chakra-ui/react';
import { v4 as uuidv4 } from 'uuid';
import QuestionEditor from './QuestionEditor.tsx';
import { Form, Question } from '../Types';

interface FormBuilderProps {
  onFormSaved: (formId: string) => void;
}

const FormBuilder: React.FC<FormBuilderProps> = ({ onFormSaved }) => {
  const [form, setForm] = useState<Form>({
    title: '',
    description: '',
    questions: [],
  });

  const addQuestion = () => {
    const newQuestion: Question = {
      id: uuidv4(),
      type: 'text',
      question_text: '',
      is_required: false,
    };
    setForm({ ...form, questions: [...form.questions, newQuestion] });
  };

  const saveForm = async () => {
    console.log('--- FormBuilder: Sauvegarde du formulaire ---');
    console.log('État actuel du formulaire avant sauvegarde:', form);

    // Vérifiez que le titre n'est pas vide
    if (form.title.trim() === '') {
      alert('Le titre du formulaire est requis.');
      return;
    }

    try {
      // Générer un ID unique
      const formId = uuidv4();
      console.log('FormBuilder: Form ID généré:', formId);

      // Insérer le formulaire avec l'ID généré
      const { data: formData, error: formError } = await supabase
        .from('forms')
        .insert([
          {
            id: formId, // Assurez-vous que l'ID est fourni
            title: form.title,
            description: form.description,
            // created_by est omis si nullable
          },
        ])
        .select('*')
        .single();

      if (formError) {
        console.error('FormBuilder: Erreur lors de l\'insertion du formulaire:', formError);
        alert('Une erreur est survenue lors de la sauvegarde du formulaire.');
        return;
      }

      console.log('FormBuilder: Données du formulaire insérées:', formData);

      if (!formData || !formData.id) {
        console.error('FormBuilder: formData est nul ou ne contient pas d\'id');
        alert('Une erreur est survenue lors de la sauvegarde du formulaire.');
        return;
      }

      // Préparer les données des questions
      const questionsData = form.questions.map((q) => ({
        id: q.id,
        form_id: formData.id, // Utiliser l'ID du formulaire inséré
        type: q.type,
        question_text: q.question_text,
        options: q.options,
        is_required: q.is_required,
      }));

      console.log('FormBuilder: Données des questions préparées:', questionsData);

      // Insérer les questions
      const { error: questionsError } = await supabase.from('questions').insert(questionsData);

      if (questionsError) {
        console.error('FormBuilder: Erreur lors de l\'insertion des questions:', questionsError);
        alert('Une erreur est survenue lors de la sauvegarde des questions.');
      } else {
        console.log('FormBuilder: Questions insérées avec succès.');
        alert('Formulaire sauvegardé avec succès !');
        onFormSaved(formData.id); // Passer le formId au parent
        // Réinitialiser le formulaire
        setForm({
          title: '',
          description: '',
          questions: [],
        });
      }
    } catch (error) {
      console.error('FormBuilder: Erreur inattendue lors de la sauvegarde du formulaire:', error);
      alert('Une erreur inattendue est survenue.');
    }
  };

  return (
    <Box p={4} borderWidth="1px" borderRadius="md">
      <Heading as="h2" size="lg" mb={4}>
        Créer un nouveau formulaire
      </Heading>
      <VStack spacing={4} align="stretch">
        <FormControl isRequired>
          <FormLabel>Titre du formulaire</FormLabel>
          <Input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Titre du formulaire"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Description du formulaire</FormLabel>
          <Textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Description du formulaire"
          />
        </FormControl>
        <Button onClick={addQuestion} colorScheme="teal">
          Ajouter une question
        </Button>
        {form.questions.map((question, index) => (
          <QuestionEditor
            key={question.id}
            question={question}
            onUpdate={(updatedQuestion) => {
              const updatedQuestions = [...form.questions];
              updatedQuestions[index] = updatedQuestion;
              setForm({ ...form, questions: updatedQuestions });
            }}
          />
        ))}
        <Button onClick={saveForm} colorScheme="teal" mt={4}>
          Sauvegarder le formulaire
        </Button>
      </VStack>
    </Box>
  );
};

export default FormBuilder;
