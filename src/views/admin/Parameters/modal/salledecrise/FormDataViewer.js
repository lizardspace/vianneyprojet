import React, { useEffect, useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Spinner, Text, Alert, AlertIcon, Box } from '@chakra-ui/react';
import { supabase } from './../../../../../supabaseClient';
import { useEvent } from './../../../../../EventContext';

const FormDataViewer = () => {
  const [formData, setFormData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { selectedEventId } = useEvent();

  useEffect(() => {
    async function fetchFormData() {
      try {
        const { data, error } = await supabase
          .from('vianney_form_utile_salle_de_crise')
          .select('*')
          .eq('event_id', selectedEventId);

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
    <Box p={4} background="linear-gradient(to bottom, #ffffff, #f0f0f0)">
      <Table variant="simple" boxShadow="md" borderRadius="md">
        <Thead>
          <Tr>
            <Th background="linear-gradient(to bottom, #007bff, #0056b3)" color="white"> {/* Add background gradient to header */}
              Name
            </Th>
            <Th background="linear-gradient(to bottom, #007bff, #0056b3)" color="white"> {/* Add background gradient to header */}
              Email
            </Th>
            <Th background="linear-gradient(to bottom, #007bff, #0056b3)" color="white"> {/* Add background gradient to header */}
              Phone
            </Th>
            <Th background="linear-gradient(to bottom, #007bff, #0056b3)" color="white"> {/* Add background gradient to header */}
              Street
            </Th>
            <Th background="linear-gradient(to bottom, #007bff, #0056b3)" color="white"> {/* Add background gradient to header */}
              Zip
            </Th>
            <Th background="linear-gradient(to bottom, #007bff, #0056b3)" color="white"> {/* Add background gradient to header */}
              City
            </Th>
            <Th background="linear-gradient(to bottom, #007bff, #0056b3)" color="white"> {/* Add background gradient to header */}
              Message
            </Th>
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
    </Box>
  );
};

export default FormDataViewer;
