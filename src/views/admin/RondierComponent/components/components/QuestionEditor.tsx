import React from 'react';
import {
  Box,
  Button,
  Input,
  Select,
  Checkbox,
  FormControl,
  FormLabel,
  VStack,
  Flex,
} from '@chakra-ui/react';
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

  // Synchroniser le label et la valeur
  const handleOptionLabelChange = (index: number, newLabel: string) => {
    const options = [...(question.options || [])];
    options[index] = { label: newLabel, value: newLabel }; // Valeur et label identiques
    updateQuestion('options', options);
  };

  return (
    <Box
      p={4}
      borderWidth="1px"
      borderRadius="md"
      mt={4}
      bg="gray.50"
      boxShadow="sm"
    >
      <VStack spacing={4} align="stretch">
        <FormControl isRequired>
          <FormLabel>Type de question</FormLabel>
          <Select
            placeholder="Sélectionnez un type"
            value={question.type}
            onChange={(e) => updateQuestion('type', e.target.value)}
          >
            {questionTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Texte de la question</FormLabel>
          <Input
            placeholder="Texte de la question"
            value={question.question_text}
            onChange={(e) => updateQuestion('question_text', e.target.value)}
          />
        </FormControl>
        <Checkbox
          isChecked={question.is_required}
          onChange={(e) => updateQuestion('is_required', e.target.checked)}
        >
          Réponse obligatoire
        </Checkbox>

        {(question.type === 'radio' ||
          question.type === 'checkbox' ||
          question.type === 'dropdown') && (
          <Box>
            <FormLabel>Options</FormLabel>
            {question.options?.map((option, index) => (
              <Flex key={index} mb={2} align="center">
                <Input
                  placeholder="Label et Valeur de l'option"
                  value={option.label}
                  onChange={(e) => handleOptionLabelChange(index, e.target.value)}
                  mr={2}
                />
                <Button
                  colorScheme="red"
                  size="sm"
                  onClick={() => removeOption(index)}
                >
                  Supprimer
                </Button>
              </Flex>
            ))}
            <Button onClick={addOption} size="sm" colorScheme="teal" mt={2}>
              Ajouter une option
            </Button>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default QuestionEditor;
