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
  useToast,
} from '@chakra-ui/react';
import { Form, Question } from '../Types';
import { useEvent } from './../../../../../EventContext'; // Mettez le bon chemin
import { useTeam } from './../../../../../TeamContext'; // Mettez le bon chemin

interface FormSubmitProps {
  formId: string;
}

const FormSubmit: React.FC<FormSubmitProps> = ({ formId }) => {
  const [form, setForm] = useState<Form | null>(null);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const toast = useToast();
  const { selectedEventId } = useEvent();
  const { teamUUID } = useTeam();

  useEffect(() => {
    if (!selectedEventId) {
      console.error('FormSubmit: event_id est manquant');
      toast({
        title: 'Événement non sélectionné.',
        description: 'Veuillez sélectionner un événement.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (!formId) {
      console.error('FormSubmit: formId est manquant');
      toast({
        title: 'Formulaire non trouvé.',
        description: 'L\'ID du formulaire est manquant.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const fetchForm = async () => {
      // Récupérer le formulaire
      const { data: formData, error } = await supabase
        .from('forms')
        .select('*')
        .eq('id', formId)
        .eq('event_id', selectedEventId)
        .single();

      if (error || !formData) {
        console.error('FormSubmit: Erreur lors de la récupération du formulaire:', error);
        toast({
          title: 'Erreur de récupération.',
          description: 'Une erreur est survenue lors de la récupération du formulaire.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      // Récupérer les questions
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .eq('form_id', formId)
        .eq('event_id', selectedEventId);

      if (questionsError) {
        console.error('FormSubmit: Erreur lors de la récupération des questions:', questionsError);
        toast({
          title: 'Erreur de récupération.',
          description: 'Une erreur est survenue lors de la récupération des questions.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      setForm({ ...formData, questions: questionsData });
    };

    fetchForm();
  }, [formId, selectedEventId, toast]);

  const handleSubmit = async () => {
    if (!selectedEventId) {
      toast({
        title: 'Événement non sélectionné.',
        description: 'Veuillez sélectionner un événement avant de soumettre le formulaire.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);

    // Validation des réponses obligatoires
    let hasEmptyRequired = false;
    for (const question of form?.questions || []) {
      if (question.is_required) {
        const response = responses[question.id];
        if (
          response === undefined ||
          response === null ||
          (typeof response === 'string' && response.trim() === '') ||
          (Array.isArray(response) && response.length === 0)
        ) {
          hasEmptyRequired = true;
          toast({
            title: 'Réponse manquante.',
            description: `La question "${question.question_text}" est requise.`,
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          break;
        }
      }
    }

    if (hasEmptyRequired) {
      setIsSubmitting(false);
      return;
    }

    // Vérifier que les 'value's des options sont corrects
    for (const question of form?.questions || []) {
      if (
        ['radio', 'checkbox', 'dropdown'].includes(question.type) &&
        question.options &&
        question.options.some((option) => !option.value.trim())
      ) {
        toast({
          title: 'Valeurs d\'options invalides.',
          description: `La question "${question.question_text}" contient des options avec des valeurs invalides.`,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        setIsSubmitting(false);
        return;
      }
    }

    const { error } = await supabase.from('responses').insert([
      {
        form_id: formId,
        response_data: responses,
        event_id: selectedEventId, // Ajouter event_id
        team_id: teamUUID || null, // Ajouter team_id si disponible
      },
    ]);

    if (error) {
      console.error('FormSubmit: Erreur lors de la soumission des réponses:', error);
      toast({
        title: 'Erreur de soumission.',
        description: 'Une erreur est survenue lors de la soumission des réponses.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Succès.',
        description: 'Réponses soumises avec succès !',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setResponses({});
    }

    setIsSubmitting(false);
  };

  if (!form) {
    return (
      <Box p={6} borderWidth="1px" borderRadius="md" boxShadow="md">
        <Text>Chargement...</Text>
      </Box>
    );
  }

  return (
    <Box p={6} borderWidth="1px" borderRadius="md" boxShadow="md">
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
                      <Radio key={option.value} value={option.value} mb={2}>
                        {option.label}
                      </Radio>
                    ))}
                  </RadioGroup>
                </FormControl>
              );
            case 'checkbox':
              return (
                <FormControl key={question.id} isRequired={question.is_required}>
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
