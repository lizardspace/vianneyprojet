// src/components/FormSubmit.tsx
import React, { useEffect, useState } from 'react';
import { supabase } from './../../../../../supabaseClient';
import { TextInput, Textarea, Checkbox, RadioGroup, Radio, Select, Slider, Button, Box } from '@mantine/core';
import { Form, Question } from '../Types';

interface FormSubmitProps {
  formId: string;
}

const FormSubmit: React.FC<FormSubmitProps> = ({ formId }) => {
  const [form, setForm] = useState<Form | null>(null);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  console.log('FormSubmit: Received formId:', formId); // Log pour vérifier formId

  useEffect(() => {
    if (!formId) {
      console.error('FormSubmit: formId est manquant');
      return;
    }

    const fetchForm = async () => {
      console.log('FormSubmit: Fetching form with id:', formId); // Log avant la requête

      const { data: formData, error } = await supabase
        .from('forms')
        .select('*')
        .eq('id', formId)
        .single();

      if (error) {
        console.error('FormSubmit: Erreur lors de la récupération du formulaire:', error);
        alert('Une erreur est survenue lors de la récupération du formulaire.');
        return;
      }

      console.log('FormSubmit: formData:', formData); // Log pour vérifier les données du formulaire

      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .eq('form_id', formId);

      if (questionsError) {
        console.error('FormSubmit: Erreur lors de la récupération des questions:', questionsError);
        alert('Une erreur est survenue lors de la récupération des questions.');
        return;
      }

      console.log('FormSubmit: questionsData:', questionsData); // Log pour vérifier les données des questions

      setForm({ ...formData, questions: questionsData });
    };

    fetchForm();
  }, [formId]);

  const handleSubmit = async () => {
    console.log('FormSubmit: Submitting responses:', responses); // Log pour vérifier les réponses

    setIsSubmitting(true);

    const { error } = await supabase.from('responses').insert([
      {
        form_id: formId,
        response_data: responses,
      },
    ]);

    if (error) {
      console.error('FormSubmit: Erreur lors de la soumission des réponses:', error);
      alert('Une erreur est survenue lors de la soumission des réponses.');
    } else {
      console.log('FormSubmit: Réponses soumises avec succès.');
      alert('Réponses soumises avec succès !');
      setResponses({});
    }

    setIsSubmitting(false);
  };

  if (!form) {
    return <div>Chargement...</div>;
  }

  return (
    <Box>
      <h1>{form.title}</h1>
      <p>{form.description}</p>
      {form.questions.map((question: Question) => {
        const handleChange = (value: any) => {
          setResponses({ ...responses, [question.id]: value });
        };

        switch (question.type) {
          case 'text':
            return (
              <TextInput
                key={question.id}
                label={question.question_text}
                required={question.is_required}
                onChange={(e) => handleChange(e.currentTarget.value)}
                mb="sm"
              />
            );
          case 'textarea':
            return (
              <Textarea
                key={question.id}
                label={question.question_text}
                required={question.is_required}
                onChange={(e) => handleChange(e.currentTarget.value)}
                mb="sm"
              />
            );
          case 'radio':
            return (
              <RadioGroup
                key={question.id}
                label={question.question_text}
                required={question.is_required}
                onChange={handleChange}
                mb="sm"
              >
                {question.options?.map((option) => (
                  <Radio key={option.value} value={option.value} label={option.label} />
                ))}
              </RadioGroup>
            );
          case 'checkbox':
            return (
              <div key={question.id} style={{ marginBottom: '1em' }}>
                <p>{question.question_text}</p>
                {question.options?.map((option) => (
                  <Checkbox
                    key={option.value}
                    label={option.label}
                    onChange={(e) => {
                      const prevValues: string[] = responses[question.id] || [];
                      const newValues = e.currentTarget.checked
                        ? [...prevValues, option.value]
                        : prevValues.filter((val: string) => val !== option.value);
                      handleChange(newValues);
                    }}
                    mb="sm"
                  />
                ))}
              </div>
            );
          case 'dropdown':
            return (
              <Select
                key={question.id}
                label={question.question_text}
                required={question.is_required}
                data={question.options?.map((option) => ({ value: option.value, label: option.label })) || []}
                onChange={handleChange}
                mb="sm"
              />
            );
          case 'slider':
            return (
              <div key={question.id} style={{ marginBottom: '1em' }}>
                <p>{question.question_text}</p>
                <Slider onChange={handleChange} />
              </div>
            );
          default:
            return null;
        }
      })}
      <Button onClick={handleSubmit} mt="md" loading={isSubmitting}>
        Soumettre
      </Button>
    </Box>
  );
};

export default FormSubmit;
