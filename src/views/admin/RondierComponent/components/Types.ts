// src/Types.ts
export type QuestionType = 'text' | 'textarea' | 'radio' | 'checkbox' | 'dropdown' | 'slider' | 'file';

export interface Option {
  label: string;
  value: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  questionText: string;
  options?: Option[];
  isRequired: boolean;
}

export interface Form {
  title: string;
  description: string;
  questions: Question[];
}
