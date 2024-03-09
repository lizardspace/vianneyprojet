import React, { useState, useEffect } from 'react';
import { Box, VStack, Text } from '@chakra-ui/react';
import { useTeam } from './../TeamContext'; // Adjust the import path to where your TeamContext is located
import { supabase } from './../../../../supabaseClient'; // Ensure this path is correct

const DocumentsViewer = () => {
    const { teamUUID } = useTeam(); // Use the custom hook to access the team context
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        async function fetchDocuments() {
            if (!teamUUID) {
                setDocuments([]); // Clear documents if no team is selected
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('vianney_pdf_documents')
                    .select('*')
                    .contains('teams_that_can_read_the_document', [teamUUID]); // Use contains to filter by team UUID

                if (error) throw error;

                if (data) {
                    setDocuments(data);
                }
            } catch (error) {
                console.error('Error fetching documents:', error);
                setDocuments([]); // Handle error by clearing documents
            }
        }

        fetchDocuments();
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
                            {/* You can add more document details here */}
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
