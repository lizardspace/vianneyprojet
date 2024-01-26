import React, { useEffect, useState } from "react";
import { Box, Button, Flex, Icon, SimpleGrid, Stat, StatNumber, StatLabel, useColorModeValue, Heading } from "@chakra-ui/react";
import { FcDocument } from "react-icons/fc";
import { createClient } from "@supabase/supabase-js";
import Card from "components/card/Card.js"; // Import Card
import IconBox from "components/icons/IconBox"; // Import IconBox
import PdfUploader from "./PdfUploader";
import { FcPlus, FcLeft } from "react-icons/fc";

const supabaseUrl = 'https://hvjzemvfstwwhhahecwu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2anplbXZmc3R3d2hoYWhlY3d1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5MTQ4Mjc3MCwiZXhwIjoyMDA3MDU4NzcwfQ.6jThCX2eaUjl2qt4WE3ykPbrh6skE8drYcmk-UCNDSw';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const PdfDownloadButton = ({ handlePdfClick }) => {
    const [documents, setDocuments] = useState([]);
    const [showPdfUploader, setShowPdfUploader] = useState(false);
    const brandColor = useColorModeValue("brand.500", "white");
    const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
    const textColor = useColorModeValue("secondaryGray.900", "white");

    useEffect(() => {
        const fetchDocuments = async () => {
            const { data, error } = await supabase.from("vianney_pdf_documents").select();
            if (error) {
                console.error("Error fetching documents:", error);
            } else {
                setDocuments(data);
            }
        };

        fetchDocuments();
    }, []);

    // Function to format the date as desired
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };
    const togglePdfUploader = () => setShowPdfUploader(!showPdfUploader);

    return (
        <Box>
            <Heading me='auto'
                color={textColor}
                fontSize='2xl'
                fontWeight='700'
                lineHeight='100%'
                mb="20px">
                Document de base
            </Heading>
            <SimpleGrid
                columns={{ base: 1, md: 2, lg: 3, "2xl": 6 }}
                gap='20px'
                mb='20px'>
                {documents.map((data) => (
                    <Card key={data.id} py='15px' cursor="pointer" onClick={() => handlePdfClick(data)}>
                        <Flex
                            my='auto'
                            h='100%'
                            align={{ base: "center", xl: "start" }}
                            justify={{ base: "center", xl: "center" }}>
                            <IconBox
                                w='56px'
                                h='56px'
                                bg={boxBg}
                                icon={<Icon w='32px' h='32px' as={FcDocument} color={brandColor} />}
                            />
                            <Stat my='auto' ms="10px">
                                <StatNumber color={textColor} fontSize={{ base: "xl" }}>
                                    {data.title}
                                </StatNumber>
                                <StatLabel color={textColor} fontSize="md">
                                    {formatDate(data.uploaded_at)}
                                </StatLabel>
                            </Stat>
                        </Flex>
                    </Card>
                ))}
                <Button
                    mt="30px"
                    onClick={togglePdfUploader}
                    leftIcon={<Icon as={showPdfUploader ? FcLeft : FcPlus} />}
                    colorScheme='blue'
                    variant='solid'
                    size='md'
                    boxShadow='sm'
                    _hover={{ boxShadow: 'md' }}
                    _active={{ boxShadow: 'lg' }}>
                    {showPdfUploader ? "Masquer" : "Ajouter un document"}
                </Button>
            </SimpleGrid>
            {showPdfUploader && <PdfUploader />}
        </Box>
    );
};

export default PdfDownloadButton;