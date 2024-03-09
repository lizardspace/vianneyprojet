import React, { useState, useEffect } from 'react';
import { Box, VStack, Text } from '@chakra-ui/react';
import { useTeam } from '../TeamContext'; // Adjust the import path
import { supabase } from '../../../../supabaseClient'; // Ensure this path is correct

const DocumentsViewer = () => {
    const { teamUUID } = useTeam();
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDocuments() {
            if (!teamUUID) {
                setDocuments([]);
                setLoading(false);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('vianney_pdf_documents')
                    .select('*');

                if (error) throw error;

                // Filter the documents client-side after fetching
                const filteredDocuments = data.filter(doc => {
                    const teams = doc.teams_that_can_read_the_document;
                    // Check if 'teams' is an array and if it contains an object with the matching 'teamUUID'
                    return Array.isArray(teams) && teams.some(team => team.uuid === teamUUID);
                });

                setDocuments(filteredDocuments);
            } catch (error) {
                console.error('Error fetching documents:', error);
                setDocuments([]); // Handle error by clearing documents
            } finally {
                setLoading(false);
            }
        }

        fetchDocuments();
    }, [teamUUID]);

    if (loading) {
        return <Text>Loading documents...</Text>;
    }

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
