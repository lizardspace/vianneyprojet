// src/components/QuestionEditor.tsx
import React from 'react';
import { TextInput, Select, Checkbox, Button, Box } from '@mantine/core';
import { Question, Option } from '../Types';

interface QuestionEditorProps {
  question: Question;
  onUpdate: (question: Question) => void;
}

const questionTypes = [
  { value: 'text', label: 'Texte court' },
  { value: 'textarea', label: 'Texte long' },
  { value: 'radio', label: 'Choix multiple' },
  { value: 'checkbox', label: 'Cases à cocher' },
  { value: 'dropdown', label: 'Menu déroulant' },
  { value: 'slider', label: 'Échelle' },
  { value: 'file', label: 'Téléchargement de fichier' },
];

const QuestionEditor: React.FC<QuestionEditorProps> = ({ question, onUpdate }) => {
  const updateQuestion = (key: keyof Question, value: any) => {
    onUpdate({ ...question, [key]: value });
  };

  const addOption = () => {
    const newOption: Option = { label: '', value: '' };
    const options = question.options ? [...question.options, newOption] : [newOption];
    updateQuestion('options', options);
  };

  const removeOption = (index: number) => {
    if (question.options) {
      const options = [...question.options];
      options.splice(index, 1);
      updateQuestion('options', options);
    }
  };

  return (
    <Box
      sx={{
        border: '1px solid #ccc',
        padding: '1em',
        marginTop: '1em',
        borderRadius: '8px',
      }}
    >
      <Select
        label="Type de question"
        data={questionTypes}
        value={question.type}
        onChange={(value) => updateQuestion('type', value)}
        required
        mb="sm"
      />
      <TextInput
        label="Texte de la question"
        value={question.question_text}
        onChange={(e) => updateQuestion('question_text', e.currentTarget.value)}
        required
        mb="sm"
      />
      <Checkbox
        label="Réponse obligatoire"
        checked={question.is_required}
        onChange={(e) => updateQuestion('is_required', e.currentTarget.checked)}
        mb="sm"
      />

      {(question.type === 'radio' ||
        question.type === 'checkbox' ||
        question.type === 'dropdown') && (
        <Box mt="sm">
          <h4>Options</h4>
          {question.options?.map((option, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', marginBottom: '0.5em' }}>
              <TextInput
                placeholder="Label de l'option"
                value={option.label}
                onChange={(e) => {
                  const options = [...(question.options || [])];
                  options[index] = { ...options[index], label: e.currentTarget.value };
                  updateQuestion('options', options);
                }}
                style={{ flexGrow: 1, marginRight: '0.5em' }}
                required
                mb="sm"
              />
              <Button color="red" onClick={() => removeOption(index)}>
                Supprimer
              </Button>
            </Box>
          ))}
          <Button onClick={addOption}>Ajouter une option</Button>
        </Box>
      )}
    </Box>
  );
};

export default QuestionEditor;
