import React, { useState, useEffect } from 'react';
import { Box, VStack, Text, Image, Link, Badge, Stack } from '@chakra-ui/react';
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
        <VStack spacing={5}>
            {documents.length > 0 ? (
                documents.map((doc) => (
                    <Box
                        key={doc.id}
                        p={5}
                        shadow="md"
                        borderWidth="1px"
                        borderRadius="md"
                        bg="gray.50"
                        width="full"
                        _hover={{ bg: "gray.100" }}
                    >
                        <Stack direction={["column", "row"]} spacing={4} align="center">
                            <Image
                                borderRadius="md"
                                boxSize="100px"
                                objectFit="cover"
                                src={doc.file_url}
                                alt={`Image for ${doc.title}`}
                                fallbackSrc="https://via.placeholder.com/100"
                            />
                            <Box flex="1">
                            <Badge colorScheme="orange" fontWeight="bold" mt={2}>{doc.title}</Badge>
                                <Text color="gray.500">{doc.description}</Text>
                                
                            </Box>
                            <Link href={doc.file_url} isExternal color="teal.500">
                                Ouvrir le document
                            </Link>
                        </Stack>
                    </Box>
                ))
            ) : (
                <Text>No documents available for this team.</Text>
            )}
        </VStack>
    );
};

export default DocumentsViewer;
