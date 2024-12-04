// src/Types.ts
export type QuestionType = 'text' | 'textarea' | 'radio' | 'checkbox' | 'dropdown' | 'slider' | 'file';

export interface Option {
  id?: string; // Optionnel si vous utilisez un ID unique
  label: string;
  value: string;
}

export interface Question {
  id: string;
  form_id: string;
  type: string;
  question_text: string;
  options?: Option[];
  is_required: boolean;
}

export interface Form {
  id: string;
  title: string;
  description: string;
  created_at: string; // Assurez-vous que cette colonne existe dans votre table 'forms'
}

export interface Response {
  id: string;
  form_id: string;
  user_id?: string | null; // ou tout autre champ pertinent
  response_data: Record<string, any>;
  submitted_at: string;
}
