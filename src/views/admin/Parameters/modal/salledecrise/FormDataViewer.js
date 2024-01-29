import React, { useEffect, useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Spinner, Text, Alert, AlertIcon } from '@chakra-ui/react';
import { supabase } from './../../../../../supabaseClient';
import { useEvent } from './../../../../../EventContext'; // Import the useEvent hook


const FormDataViewer = () => {
  const [formData, setFormData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { selectedEventId } = useEvent(); // Get the selected event from EventContext

  useEffect(() => {
    async function fetchFormData() {
      try {
        const { data, error } = await supabase
          .from('vianney_form_utile_salle_de_crise')
          .select('*')
          .eq('event_id', selectedEventId); // Filter by selected event_id

        if (error) {
          setError('Error fetching data');
        } else {
          setFormData(data);
        }
      } catch (error) {
        setError('Error fetching data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchFormData();
  }, [selectedEventId]);


  if (isLoading) {
    return <Spinner size="lg" />;
  }

  if (error) {
    return (
      <Alert status="error" variant="subtle" flexDirection="column" alignItems="center">
        <AlertIcon />
        <Text fontSize='xl' m={4}>
          {error}
        </Text>
      </Alert>
    );
  }

  if (formData.length === 0) {
    return (
      <Alert status="info" variant="subtle" flexDirection="column" alignItems="center">
        <AlertIcon />
        <Text fontSize='xl' m={4}>
          No data available.
        </Text>
      </Alert>
    );
  }

  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Name</Th>
          <Th>Email</Th>
          <Th>Phone</Th>
          <Th>Street</Th>
          <Th>Zip</Th>
          <Th>City</Th>
          <Th>Message</Th>
        </Tr>
      </Thead>
      <Tbody>
        {formData.map((entry) => (
          <Tr key={entry.id}>
            <Td>{entry.name}</Td>
            <Td>{entry.email}</Td>
            <Td>{entry.phone}</Td>
            <Td>{entry.street}</Td>
            <Td>{entry.zip}</Td>
            <Td>{entry.city}</Td>
            <Td>{entry.message}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default FormDataViewer;
