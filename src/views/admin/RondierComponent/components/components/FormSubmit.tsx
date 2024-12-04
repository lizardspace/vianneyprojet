// src/components/FormSubmit.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from './../../../../../supabaseClient';
import { TextInput, Textarea, Checkbox, RadioGroup, Radio, Select, Slider, Button } from '@mantine/core';
import { Form, Question } from '../Types';

const FormSubmit: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const [form, setForm] = useState<Form | null>(null);
  const [responses, setResponses] = useState<Record<string, any>>({});

  useEffect(() => {
    const fetchForm = async () => {
      const { data: formData, error } = await supabase.from('forms').select('*').eq('id', formId).single();
      if (error) {
        console.error(error);
        return;
      }

      const { data: questionsData } = await supabase.from('questions').select('*').eq('form_id', formId);

      setForm({ ...formData, questions: questionsData });
    };

    fetchForm();
  }, [formId]);

  const handleSubmit = async () => {
    const { error } = await supabase.from('responses').insert([
      {
        form_id: formId,
        response_data: responses,
      },
    ]);

    if (error) {
      console.error(error);
    } else {
      alert('Réponses soumises avec succès !');
    }
  };

  if (!form) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
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
                label={question.questionText}
                required={question.isRequired}
                onChange={(e) => handleChange(e.currentTarget.value)}
              />
            );
          case 'textarea':
            return (
              <Textarea
                key={question.id}
                label={question.questionText}
                required={question.isRequired}
                onChange={(e) => handleChange(e.currentTarget.value)}
              />
            );
          case 'radio':
            return (
              <RadioGroup
                key={question.id}
                label={question.questionText}
                required={question.isRequired}
                onChange={handleChange}
              >
                {question.options?.map((option) => (
                  <Radio key={option.value} value={option.value} label={option.label} />
                ))}
              </RadioGroup>
            );
          case 'checkbox':
            return (
              <div key={question.id}>
                <p>{question.questionText}</p>
                {question.options?.map((option) => (
                  <Checkbox
                    key={option.value}
                    label={option.label}
                    onChange={(e) => {
                      const prevValues = responses[question.id] || [];
                      const newValues = e.currentTarget.checked
                        ? [...prevValues, option.value]
                        : prevValues.filter((val: string) => val !== option.value);
                      handleChange(newValues);
                    }}
                  />
                ))}
              </div>
            );
          case 'dropdown':
            return (
              <Select
                key={question.id}
                label={question.questionText}
                required={question.isRequired}
                data={question.options?.map((option) => ({ value: option.value, label: option.label })) || []}
                onChange={handleChange}
              />
            );
          case 'slider':
            return (
              <div key={question.id}>
                <p>{question.questionText}</p>
                <Slider onChange={handleChange} />
              </div>
            );
          default:
            return null;
        }
      })}
      <Button onClick={handleSubmit}>Soumettre</Button>
    </div>
  );
};

export default FormSubmit;
