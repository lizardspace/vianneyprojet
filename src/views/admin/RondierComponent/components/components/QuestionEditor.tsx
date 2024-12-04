// src/components/QuestionEditor.tsx
import React from 'react';
import { TextInput, Select, Checkbox, Button } from '@mantine/core';
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

  return (
    <div style={{ border: '1px solid #ccc', padding: '1em', marginTop: '1em' }}>
      <Select
        label="Type de question"
        data={questionTypes}
        value={question.type}
        onChange={(value) => updateQuestion('type', value)}
      />
      <TextInput
        label="Texte de la question"
        value={question.questionText}
        onChange={(e) => updateQuestion('questionText', e.currentTarget.value)}
      />
      <Checkbox
        label="Réponse obligatoire"
        checked={question.isRequired}
        onChange={(e) => updateQuestion('isRequired', e.currentTarget.checked)}
      />
      {(question.type === 'radio' || question.type === 'checkbox' || question.type === 'dropdown') && (
        <div>
          <h4>Options</h4>
          {question.options?.map((option, index) => (
            <div key={index}>
              <TextInput
                placeholder="Label de l'option"
                value={option.label}
                onChange={(e) => {
                  const options = [...(question.options || [])];
                  options[index] = { ...options[index], label: e.currentTarget.value };
                  updateQuestion('options', options);
                }}
              />
            </div>
          ))}
          <Button onClick={addOption}>Ajouter une option</Button>
        </div>
      )}
    </div>
  );
};

export default QuestionEditor;
