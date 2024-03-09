import React, { useState, useEffect } from 'react';
import { Box, VStack, Text } from '@chakra-ui/react';
import { useTeam } from './../TeamContext'; // Adjust the import path
import { supabase } from './../../../../supabaseClient'; // Ensure this path is correct

const DocumentsViewer = () => {
    const { teamUUID } = useTeam();
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        async function fetchAndFilterDocuments() {
            try {
                const { data, error } = await supabase
                    .from('vianney_pdf_documents')
                    .select('*');

                if (error) throw error;

                // Client-side filtering based on the selected teamUUID
                const filteredDocuments = data.filter(doc =>
                    doc.teams_that_can_read_the_document.some(team => team.uuid === teamUUID)
                );

                setDocuments(filteredDocuments);
            } catch (error) {
                console.error('Error fetching documents:', error);
                setDocuments([]);
            }
        }

        if (teamUUID) {
            fetchAndFilterDocuments();
        } else {
            setDocuments([]); // Clear documents if no team is selected
        }
    }, [teamUUID]);

    if (!teamUUID) {
        return <Text>Please select a team to view documents.</Text>;
    }

    return (
        <Box>
            {documents.length > 0 ? (
                <VStack spacing={4}>
                    {documents.map((doc) => (
                        <Box key={doc.id} p={5} shadow="md" borderWidth="1px">
                            <Text>Document Title: {doc.title}</Text>
                            {/* More document details */}
                        </Box>
                    ))}
                </VStack>
            ) : (
                <Text>No documents available for this team.</Text>
            )}
        </Box>
    );
};

export default DocumentsViewer;
