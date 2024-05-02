import React, { useState, useEffect } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Text, Badge } from '@chakra-ui/react';
import { supabase } from './../../../../supabaseClient';
import { useEvent } from './../../../../EventContext';

const RenseignementsInformationsDisplayReports = () => {
  const [reports, setReports] = useState([]);
  const { selectedEventId } = useEvent();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('vianney_renseignements_informations_reports')
        .select('*')
        .eq('event_id', selectedEventId);

      if (error) {
        console.log('Error fetching reports:', error);
      } else {
        setReports(data);
      }
      setLoading(false);
    };

    if (selectedEventId) {
      fetchReports();
    }
  }, [selectedEventId]);

  if (loading) {
    return <Text>Loading reports...</Text>;
  }

  if (!reports.length) {
    return <Text>No reports found for the selected event.</Text>;
  }

  return (
    <Box overflowX="auto" borderRadius="lg" boxShadow="lg" p={2} bg="white">
      <TableContainer>
        <Table variant="simple" size="sm">
          <Thead bg="orange.400" borderRadius="lg">
            <Tr>
              <Th color="white">Date</Th>
              <Th color="white">Heure:Minute</Th>
              <Th color="white">Rédacteur</Th>
              <Th color="white">Thème</Th>
              <Th color="white">Information</Th>
              <Th color="white">Fiabilité</Th>
              <Th color="white">Action</Th>
              <Th color="white">Confidentialité</Th>
            </Tr>
          </Thead>
          <Tbody bg="white">
            {reports.map((report, index) => (
              <Tr key={index} _hover={{ bg: 'gray.100' }}>
                <Td>{new Date(report.date).toLocaleDateString()}</Td>
                <Td>{report.time}</Td>
                <Td>{report.redacteur}</Td>
                <Td>{report.theme}</Td>
                <Td isTruncated maxW="250px" title={report.information}>
                  {report.information}
                </Td>
                <Td>
                  <Badge colorScheme={report.fiabilite >= 3 ? 'green' : 'red'}>
                    {report.fiabilite}
                  </Badge>
                </Td>
                <Td>{report.action}</Td>
                <Td>
                  <Badge colorScheme={report.confidentialite ? 'blue' : 'gray'}>
                    {report.confidentialite ? 'Privé' : 'Public'}
                  </Badge>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default RenseignementsInformationsDisplayReports;