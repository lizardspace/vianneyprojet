import React, { useState, useEffect } from 'react';
import {
    Box, Button, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Text, useToast, Center, Flex, Badge, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Tooltip
} from '@chakra-ui/react';
import { MdArrowBackIosNew } from "react-icons/md";
import { CiCirclePlus } from "react-icons/ci";
import MaterialComponent from 'views/admin/MaterialComponent'; // Ajustez le chemin si nécessaire
import { supabase } from './../../../../supabaseClient';
import QRCode from 'qrcode.react';
import AfficherMateriels from 'views/admin/carte/components/AfficherMateriels';
import { useEvent } from './../../../../EventContext';
import './styles.css';

const InventoryDisplay = () => {
    const [inventoryItems, setInventoryItems] = useState([]);
    const toast = useToast();
    const [loading, setLoading] = useState(true);
    const [selectedMaterialId, setSelectedMaterialId] = useState(null);
    const [printModalOpen, setPrintModalOpen] = useState(false);
    const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
    const [printItem, setPrintItem] = useState(null);
    const displayQrCode = (itemId) => {
        setSelectedMaterialId(itemId);
    };

    const goBack = () => {
        setSelectedMaterialId(null); // Effacez l'ID du matériel sélectionné pour revenir en arrière
    };

    const { selectedEventId } = useEvent();

    useEffect(() => {
        const fetchMaterialsForEvent = async () => {
            setLoading(true);
            let query = supabase
                .from('vianney_materials_with_events')
                .select('*');
            if (selectedEventId) {
                query = query
                    .or(`event_id.eq.${selectedEventId},associated_team_id.is.null`);
            }
            const { data, error } = await query;
            if (error) {
                toast({
                    title: 'Erreur lors de la récupération des matériels',
                    description: error.message,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            } else {
                const filteredData = data.filter((item) => {
                    return item.event_id === selectedEventId || item.associated_team_id == null;
                });

                setInventoryItems(filteredData);
            }
            setLoading(false);
        };
        fetchMaterialsForEvent();
    }, [selectedEventId, toast]);

    const openPrintModal = (item) => {
        setPrintItem(item);
        setPrintModalOpen(true);
    };
    const printQRCode = () => {
        window.print();
    };

    if (loading) {
        return <Text>Chargement de l'inventaire...</Text>;
    }

    if (selectedMaterialId) {
        return (
            <Flex direction="column" alignItems="center" justifyContent="center">
                <Button leftIcon={<MdArrowBackIosNew />} onClick={goBack} mb={4}>
                    Revenir en arrière
                </Button>
                <Center width="full">
                    <AfficherMateriels materialId={selectedMaterialId} />
                </Center>
            </Flex>
        );
    }

    return (
        <Box overflowX="auto" borderWidth="1px" borderRadius="lg" p={2} position="relative"> {/* Ajoutez la position relative pour le positionnement absolu du bouton */}
            <Tooltip label="Le module Matériel complet">
                <Button
                    textAlign="center" // Centrer l'icône horizontalement
                    fontSize="24px" // Augmenter la taille de l'icône
                    colorScheme="orange"
                    onClick={() => setIsMaterialModalOpen(true)}
                    mb={4}
                    position="absolute"
                    top={4} // Ajustez la valeur en fonction de votre espacement préféré depuis le haut
                    right={4} // Ajustez la valeur en fonction de votre espacement préféré depuis la droite
                    zIndex="10000"
                >
                    <CiCirclePlus /> {/* Ajoutez l'icône à l'intérieur du bouton */}
                </Button>
            </Tooltip>

            <TableContainer>
                <Table variant="striped" colorScheme="orange" size="sm">
                    <Thead bg="orange.400">
                        <Tr>
                            <Th color="white">Matériel</Th>
                            <Th color="white">À qui ?</Th>
                            <Th color="white">QR Code</Th>
                            <Th color="white">Impression</Th>
                            <Th color="white">Description (texte)</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {inventoryItems.map((item, index) => (
                            <Tr key={index}>
                                <Td>{item.nom}</Td>
                                <Td>
                                    {item.name_of_the_team ? item.name_of_the_team : <Badge colorScheme="red">non attribué</Badge>}
                                </Td>
                                <Td>
                                    <Button onClick={() => displayQrCode(item.id)}>Afficher le QR Code</Button>
                                </Td>
                                <Td>
                                    <Button onClick={() => openPrintModal(item)}>Imprimer le QR Code</Button>
                                </Td>
                                <Td>{item.description}</Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
            {printModalOpen && (
                <Modal isOpen={printModalOpen} onClose={() => setPrintModalOpen(false)}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Impression du QR Code</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Center id="printContainer">
                                <QRCode value={String(printItem.id)} size={256} level="L" includeMargin={true} />
                                <Button colorScheme="blue" onClick={printQRCode} mt={4}>
                                    Imprimer
                                </Button>
                            </Center>
                        </ModalBody>
                    </ModalContent>
                </Modal>
            )}
            {isMaterialModalOpen && (
                <Modal isOpen={isMaterialModalOpen} onClose={() => setIsMaterialModalOpen(false)} isCentered>
                    <ModalOverlay />
                    <ModalContent maxWidth="100%" width="100vw"> {/* Assurer que la modal soit pleine largeur mais avec une légère marge */}
                        <ModalCloseButton />
                        <ModalBody>
                            <MaterialComponent />
                        </ModalBody>
                    </ModalContent>
                </Modal>
            )}

        </Box>
    );
};

export default InventoryDisplay;