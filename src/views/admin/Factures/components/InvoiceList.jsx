import React, { useState, useEffect } from 'react';
import { supabase } from './../../../../supabaseClient';
import {
  Box,
  Heading,
  Stack,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  Divider,
  useToast,
} from '@chakra-ui/react';

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        let { data, error } = await supabase
          .from('vianney_factures')
          .select('*')
          .order('invoice_date', { ascending: false });

        if (error) {
          throw error;
        }

        setInvoices(data);
      } catch (error) {
        setError(error.message);
        toast({
          title: 'Erreur',
          description: "Erreur lors de la récupération des factures.",
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [toast]);

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

  return (
    <Box maxW="800px" mx="auto" p={6}>
      <Heading as="h2" size="lg" mb={6}>
        Liste des Factures
      </Heading>
      {invoices.length === 0 ? (
        <Text>Aucune facture trouvée.</Text>
      ) : (
        <Stack spacing={4}>
          {invoices.map((invoice) => (
            <Box key={invoice.id} p={4} borderWidth={1} borderRadius={8} boxShadow="sm">
              <Heading as="h3" size="md" mb={2}>
                Facture #{invoice.invoice_number}
              </Heading>
              <Text><strong>Date de la facture:</strong> {new Date(invoice.invoice_date).toLocaleDateString()}</Text>
              <Text><strong>Nom du vendeur:</strong> {invoice.seller_name}</Text>
              <Text><strong>Nom de l'acheteur:</strong> {invoice.buyer_name}</Text>
              <Text><strong>Total HT:</strong> {invoice.total_ht} €</Text>
              <Text><strong>Total TTC:</strong> {invoice.total_ttc} €</Text>
              <Divider my={2} />
              <Text><strong>Date d'échéance:</strong> {new Date(invoice.payment_due_date).toLocaleDateString()}</Text>
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default InvoiceList;
