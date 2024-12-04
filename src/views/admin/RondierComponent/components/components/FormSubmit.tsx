// src/components/FormSubmit.tsx
import React, { useEffect, useState } from 'react';
import { supabase } from './../../../../../supabaseClient';
import {
  Box,
  Heading,
  Text,
  Input,
  Textarea,
  Checkbox,
  RadioGroup,
  Radio,
  Select,
  Slider,
  Button,
  VStack,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
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
    return (
      <Box p={4} borderWidth="1px" borderRadius="md">
        <Text>Chargement...</Text>
      </Box>
    );
  }

  return (
    <Box p={4} borderWidth="1px" borderRadius="md">
      <Heading as="h2" size="lg" mb={4}>
        {form.title}
      </Heading>
      <Text mb={6}>{form.description}</Text>
      <VStack spacing={4} align="stretch">
        {form.questions.map((question: Question) => {
          const handleChange = (value: any) => {
            setResponses({ ...responses, [question.id]: value });
          };

          switch (question.type) {
            case 'text':
              return (
                <FormControl key={question.id} isRequired={question.is_required}>
                  <FormLabel>{question.question_text}</FormLabel>
                  <Input
                    placeholder="Votre réponse"
                    value={responses[question.id] || ''}
                    onChange={(e) => handleChange(e.target.value)}
                  />
                </FormControl>
              );
            case 'textarea':
              return (
                <FormControl key={question.id} isRequired={question.is_required}>
                  <FormLabel>{question.question_text}</FormLabel>
                  <Textarea
                    placeholder="Votre réponse"
                    value={responses[question.id] || ''}
                    onChange={(e) => handleChange(e.target.value)}
                  />
                </FormControl>
              );
            case 'radio':
              return (
                <FormControl key={question.id} isRequired={question.is_required}>
                  <FormLabel>{question.question_text}</FormLabel>
                  <RadioGroup
                    onChange={handleChange}
                    value={responses[question.id] || ''}
                  >
                    {question.options?.map((option) => (
                      <Radio key={option.value} value={option.value}>
                        {option.label}
                      </Radio>
                    ))}
                  </RadioGroup>
                </FormControl>
              );
            case 'checkbox':
              return (
                <FormControl key={question.id}>
                  <FormLabel>{question.question_text}</FormLabel>
                  {question.options?.map((option) => (
                    <Checkbox
                      key={option.value}
                      isChecked={responses[question.id]?.includes(option.value) || false}
                      onChange={(e) => {
                        const prevValues: string[] = responses[question.id] || [];
                        const newValues = e.target.checked
                          ? [...prevValues, option.value]
                          : prevValues.filter((val: string) => val !== option.value);
                        handleChange(newValues);
                      }}
                      mb={2}
                    >
                      {option.label}
                    </Checkbox>
                  ))}
                </FormControl>
              );
            case 'dropdown':
              return (
                <FormControl key={question.id} isRequired={question.is_required}>
                  <FormLabel>{question.question_text}</FormLabel>
                  <Select
                    placeholder="Sélectionnez une option"
                    value={responses[question.id] || ''}
                    onChange={(e) => handleChange(e.target.value)}
                  >
                    {question.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              );
            case 'slider':
              return (
                <FormControl key={question.id}>
                  <FormLabel>{question.question_text}</FormLabel>
                  <Slider
                    defaultValue={0}
                    min={0}
                    max={100}
                    onChange={(val) => handleChange(val)}
                  />
                </FormControl>
              );
            default:
              return null;
          }
        })}
        <Button onClick={handleSubmit} colorScheme="teal" isLoading={isSubmitting}>
          Soumettre
        </Button>
      </VStack>
    </Box>
  );
};

export default FormSubmit;
