import React, { useState, useEffect } from 'react';
import { Box, VStack, Text, Image, Link, Badge, Stack, Alert, AlertIcon } from '@chakra-ui/react';
import { useTeam } from '../TeamContext'; // Adjust the import path
import { supabase } from '../../../../supabaseClient'; // Ensure this path is correct

const DocumentsViewer = () => {
    const { teamUUID } = useTeam();
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchDocuments();
    }, [teamUUID]);

    if (loading) {
        return <Text>Chargement des documents...</Text>;
    }

    if (error) {
        return (
            <Alert status="error">
                <AlertIcon />
                Une erreur s'est produite lors du chargement des documents. Veuillez réessayer plus tard.
            </Alert>
        );
    }

    if (!teamUUID) {
        return (
            <Alert status="info">
                <AlertIcon />
                Veuillez sélectionner une équipe pour voir les documents.
            </Alert>
        );
    }

    if (documents.length === 0) {
        return (
            <Alert status="info">
                <AlertIcon />
                Aucun document disponible pour cette équipe.
            </Alert>
        );
    }

    return (
        <VStack spacing={5}>
            {documents.map((doc) => (
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
            ))}
        </VStack>
    );
};

export default DocumentsViewer;
