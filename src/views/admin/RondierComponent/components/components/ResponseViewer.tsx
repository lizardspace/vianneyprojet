// src/components/ResponseViewer.tsx
import React, { useEffect, useState } from 'react';
import { supabase } from './../../../../../supabaseClient';
import { Table } from '@mantine/core';
import { useParams } from 'react-router-dom';

const ResponseViewer: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const [responses, setResponses] = useState<any[]>([]);

  useEffect(() => {
    const fetchResponses = async () => {
      const { data, error } = await supabase.from('responses').select('*').eq('form_id', formId);
      if (error) {
        console.error(error);
        return;
      }
      setResponses(data);
    };

    fetchResponses();
  }, [formId]);

  return (
    <div>
      <h1>Réponses du formulaire</h1>
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Données de réponse</th>
            <th>Date de soumission</th>
          </tr>
        </thead>
        <tbody>
          {responses.map((response) => (
            <tr key={response.id}>
              <td>{response.id}</td>
              <td>{JSON.stringify(response.response_data)}</td>
              <td>{response.submitted_at}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ResponseViewer;
