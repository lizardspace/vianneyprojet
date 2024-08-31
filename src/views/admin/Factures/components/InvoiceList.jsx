import React, { useState, useEffect } from 'react';
import { Box, Button, Heading, Table, Tbody, Tr, Td, Thead, Th, Spinner, Alert, AlertIcon, IconButton } from '@chakra-ui/react';
import { supabase } from './../../../../supabaseClient';  // Ensure this is the correct path to your Supabase client
import { ViewIcon } from '@chakra-ui/icons';
import InvoicePreview from './InvoicePreview';  // Import the InvoicePreview component

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const { data, error } = await supabase
          .from('vianney_factures')
          .select('*')
          .order('invoice_date', { ascending: false });

        if (error) {
          throw error;
        }

        setInvoices(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

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
          <Button mt={4} onClick={() => setSelectedInvoice(null)}>Retour à la liste des factures</Button>
        </Box>
      ) : (
        <Table variant="striped" colorScheme="blue">
          <Thead>
            <Tr>
              <Th>Numéro de Facture</Th>
              <Th>Date de Facture</Th>
              <Th>Nom du Vendeur</Th>
              <Th>Nom de l'Acheteur</Th>
              <Th>Total TTC</Th>
              <Th>Date d'Échéance</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {invoices.map((invoice) => (
              <Tr key={invoice.id}>
                <Td>{invoice.invoice_number}</Td>
                <Td>{new Date(invoice.invoice_date).toLocaleDateString()}</Td>
                <Td>{invoice.seller_name}</Td>
                <Td>{invoice.buyer_name}</Td>
                <Td>{invoice.total_ttc?.toFixed(2)} €</Td>
                <Td>{new Date(invoice.payment_due_date).toLocaleDateString()}</Td>
                <Td>
                  <IconButton
                    icon={<ViewIcon />}
                    onClick={() => setSelectedInvoice(invoice)}
                    variant="outline"
                    colorScheme="teal"
                    aria-label="Voir la facture"
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};

export default InvoiceList;
