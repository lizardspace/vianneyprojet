// InvoiceList.js
import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Heading,
  Table,
  Tbody,
  Tr,
  Td,
  Thead,
  Th,
  Spinner,
  Alert,
  AlertIcon,
  IconButton,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { supabase } from './../../../../supabaseClient';
import { ViewIcon, DeleteIcon } from '@chakra-ui/icons';
import InvoicePreview from './InvoicePreview';
import { useEvent } from '../../../../EventContext';

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const { selectedEventId } = useEvent();
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);

  // Contrôles du modal Chakra UI
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const [deleting, setDeleting] = useState(false);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('vianney_factures')
        .select('*')
        .order('invoice_date', { ascending: false });

      if (selectedEventId) {
        query = query.eq('event_id', selectedEventId);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      // Process invoices to calculate Total TTC
      const processedInvoices = data.map((invoice) => {
        // Initialize totals
        let totalHT = 0;
        let discountValue = invoice.discount ? parseFloat(invoice.discount) : 0;
        let vatTotal = 0;
        let totalTTC = 0;

        if (invoice.products && invoice.products.length > 0) {
          // Calculate total HT
          totalHT = invoice.products.reduce((acc, product) => {
            return acc + product.unitPrice * product.quantity;
          }, 0);

          // Subtotal after discount
          const subtotalAfterDiscount = totalHT - discountValue;

          // Calculate VAT total
          if (totalHT > 0) {
            invoice.products.forEach((product) => {
              const productTotal = product.unitPrice * product.quantity;
              const productDiscount = (productTotal / totalHT) * discountValue;
              const taxableAmount = productTotal - productDiscount;
              const vatAmount = (taxableAmount * product.vatRate) / 100;
              vatTotal += vatAmount;
            });
          }

          // Total TTC
          totalTTC = subtotalAfterDiscount + vatTotal;
        }

        // Return invoice with calculated totalTTC
        return {
          ...invoice,
          calculatedTotalTTC: totalTTC,
        };
      });

      setInvoices(processedInvoices);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
    // eslint-disable-next-line
  }, [selectedEventId]);

  const handleDeleteClick = (invoice) => {
    setInvoiceToDelete(invoice);
    onOpen();
  };

  const handleDeleteConfirm = async () => {
    if (!invoiceToDelete) return;
    setDeleting(true);
    try {
      const { error } = await supabase
        .from('vianney_factures')
        .delete()
        .eq('id', invoiceToDelete.id);

      if (error) {
        throw error;
      }

      // Retire la facture supprimée de l'état local
      setInvoices(invoices.filter((inv) => inv.id !== invoiceToDelete.id));
      onClose();
      setInvoiceToDelete(null);
    } catch (error) {
      setError(error.message);
      onClose();
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      </Box>
    );
  }

  if (invoices.length === 0) {
    return (
      <Box p={4}>
        <Alert status="info">
          <AlertIcon />
          Aucune facture trouvée.
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={6} maxW="1200px" mx="auto">
      <Heading as="h2" size="lg" mb={6}>
        Liste des Factures
      </Heading>

      {selectedInvoice ? (
        <Box mb={6}>
          <InvoicePreview invoiceNumber={selectedInvoice.invoice_number} />
          <Button mt={4} onClick={() => setSelectedInvoice(null)}>
            Retour à la liste des factures
          </Button>
        </Box>
      ) : (
        <>
          <Table variant="striped" colorScheme="blue">
            <Thead>
              <Tr>
                <Th>Numéro de Facture</Th>
                <Th>Date de Facture</Th>
                <Th>Nom du Vendeur</Th>
                <Th>Nom de l'Acheteur</Th>
                <Th>Total TTC</Th>
                <Th>Date d'Échéance</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {invoices.map((invoice) => (
                <Tr key={invoice.id}>
                  <Td>{invoice.invoice_number}</Td>
                  <Td>
                    {invoice.invoice_date
                      ? new Date(invoice.invoice_date).toLocaleDateString()
                      : 'N/A'}
                  </Td>
                  <Td>{invoice.seller_name}</Td>
                  <Td>{invoice.buyer_name}</Td>
                  <Td>{invoice.calculatedTotalTTC.toFixed(2)} €</Td>
                  <Td>
                    {invoice.payment_due_date
                      ? new Date(invoice.payment_due_date).toLocaleDateString()
                      : 'N/A'}
                  </Td>
                  <Td>
                    <IconButton
                      icon={<ViewIcon />}
                      onClick={() => setSelectedInvoice(invoice)}
                      variant="outline"
                      colorScheme="teal"
                      aria-label="Voir la facture"
                      mr={2}
                    />
                    <IconButton
                      icon={<DeleteIcon />}
                      onClick={() => handleDeleteClick(invoice)}
                      variant="outline"
                      colorScheme="red"
                      aria-label="Supprimer la facture"
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          {/* Modal de confirmation */}
          <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Supprimer la facture
                </AlertDialogHeader>

                <AlertDialogBody>
                  Êtes-vous sûr de vouloir supprimer cette facture ? Cette action
                  est définitive et ne peut pas être annulée.
                </AlertDialogBody>

                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={onClose}>
                    Annuler
                  </Button>
                  <Button
                    colorScheme="red"
                    onClick={handleDeleteConfirm}
                    ml={3}
                    isLoading={deleting}
                  >
                    Supprimer
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </>
      )}
    </Box>
  );
};

export default InvoiceList;
