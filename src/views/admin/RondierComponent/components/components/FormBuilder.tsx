// src/components/FormBuilder.tsx
import React, { useState } from 'react';
import { supabase } from './../../../../../supabaseClient'; // Chemin simplifié
import { Button, TextInput, Textarea } from '@mantine/core';
import { v4 as uuidv4 } from 'uuid';
import QuestionEditor from './QuestionEditor.tsx'; // Supprimer l'extension .tsx
import { Form, Question } from '../Types';

const FormBuilder: React.FC = () => {
  const [form, setForm] = useState<Form>({
    title: '',
    description: '',
    questions: [],
  });

  const addQuestion = () => {
    const newQuestion: Question = {
      id: uuidv4(),
      type: 'text',
      questionText: '',
      isRequired: false,
    };
    setForm({ ...form, questions: [...form.questions, newQuestion] });
  };

  const saveForm = async () => {
    // Vérifiez que le titre n'est pas vide
    if (form.title.trim() === '') {
      alert('Le titre du formulaire est requis.');
      return;
    }

    // Insérer le formulaire
    const { data: formData, error: formError } = await supabase
      .from('forms')
      .insert([
        {
          title: form.title,
          description: form.description,
          // created_by est omis si nullable
        },
      ])
      .select('*') // Assurez-vous de sélectionner toutes les colonnes
      .single();

    if (formError) {
      console.error('Erreur lors de l\'insertion du formulaire:', formError);
      alert('Une erreur est survenue lors de la sauvegarde du formulaire.');
      return;
    }

    console.log('formData:', formData); // Ajout de log

    if (!formData || !formData.id) {
      console.error('formData est nul ou ne contient pas d\'id');
      alert('Une erreur est survenue lors de la sauvegarde du formulaire.');
      return;
    }

    // Préparer les données des questions
    const questionsData = form.questions.map((q) => ({
      ...q,
      form_id: formData.id,
      is_required: q.isRequired, // Mapper explicitement
    }));

    console.log('questionsData:', questionsData); // Ajout de log

    // Insérer les questions
    const { error: questionsError } = await supabase.from('questions').insert(questionsData);

    if (questionsError) {
      console.error('Erreur lors de l\'insertion des questions:', questionsError);
      alert('Une erreur est survenue lors de la sauvegarde des questions.');
    } else {
      alert('Formulaire sauvegardé avec succès !');
      // Réinitialiser le formulaire
      setForm({
        title: '',
        description: '',
        questions: [],
      });
    }
  };

  return (
    <div>
      <h1>Créer un nouveau formulaire</h1>
      <TextInput
        label="Titre du formulaire"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.currentTarget.value })}
        required
      />
      <Textarea
        label="Description du formulaire"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.currentTarget.value })}
      />
      <Button onClick={addQuestion} style={{ marginTop: '1em' }}>
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
      <Button onClick={saveForm} style={{ marginTop: '1em' }}>
        Sauvegarder le formulaire
      </Button>
    </div>
  );
};

export default FormBuilder;
