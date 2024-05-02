import { useEffect, useState } from 'react';
import { Box, Text, Table, Thead, Tbody, Tr, Th, Td, TableContainer } from '@chakra-ui/react';
import supabase from './../../../../supabaseClient';

const ShowSITAC = () => {
    const [sitacRecords, setSitacRecords] = useState([]);

    useEffect(() => {
        const fetchSITAC = async () => {
            let { data: sitacData, error } = await supabase
                .from('vianney_sitac')
                .select('*');
            
            if (error) {
                console.error('Error fetching SITAC data:', error);
            } else {
                setSitacRecords(sitacData);
            }
        };

        fetchSITAC();
    }, []);

    return (
        <Box>
            {sitacRecords.length > 0 ? (
                <TableContainer>
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th>Situation</Th>
                                <Th>Moyen Logistique</Th>
                                <Th>Commandement</Th>
                                <Th>Anticipation</Th>
                                <Th>Objectif</Th>
                                <Th>Idée de Manœuvre</Th>
                                <Th>Exécution</Th>
                                <Th>Fichier</Th>
                                <Th>Événement</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {sitacRecords.map((record) => (
                                <Tr key={record.id}>
                                    <Td>{record.situation}</Td>
                                    <Td>{record.moyen_logistique}</Td>
                                    <Td>{record.commandement}</Td>
                                    <Td>{record.anticipation}</Td>
                                    <Td>{record.objectif}</Td>
                                    <Td>{record.idee_manoeuvre}</Td>
                                    <Td>{record.execution}</Td>
                                    <Td><a href={record.file_url} target="_blank" rel="noopener noreferrer">View File</a></Td>
                                    <Td>{record.event_id}</Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            ) : (
                <Text>No SITAC records found.</Text>
            )}
        </Box>
    );
};

export default ShowSITAC;