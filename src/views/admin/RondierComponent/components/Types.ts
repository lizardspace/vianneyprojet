// src/Types.ts
export type QuestionType =
  | 'text'
  | 'textarea'
  | 'radio'
  | 'checkbox'
  | 'dropdown'
  | 'slider'
  | 'file';

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
  event_id: string; // Ajouter event_id
}

export interface Form {
  id: string;
  title: string;
  description: string;
  created_at: string; // Assurez-vous que cette colonne existe dans votre table 'forms'
  event_id: string; // Ajouter event_id
  questions?: Question[]; // Ajouter si vous utilisez des questions imbriquées
}

export interface Response {
  id: string;
  form_id: string;
  user_id?: string | null; // ou tout autre champ pertinent
  response_data: Record<string, any>;
  submitted_at: string;
  event_id: string; // Ajouter event_id
  team_id?: string | null; // Ajouter team_id
}
