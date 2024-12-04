// Importations nécessaires
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

// À l'intérieur de votre composant FormBuilder
const [user, setUser] = useState<any>(null);

useEffect(() => {
  const session = supabase.auth.session();
  setUser(session?.user ?? null);

  const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
    setUser(session?.user ?? null);
  });

  return () => {
    listener?.unsubscribe();
  };
}, []);

// Lors de l'insertion du formulaire
const saveForm = async () => {
  if (!user) {
    alert('Vous devez être connecté pour créer un formulaire.');
    return;
  }

  const { data: formData, error: formError } = await supabase
    .from('forms')
    .insert([
      {
        title: form.title,
        description: form.description,
        created_by: user.id,
      },
    ])
    .single();

  // ... le reste de votre code
};
