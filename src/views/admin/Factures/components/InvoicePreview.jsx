import React, { useState, useEffect } from 'react';
import { Box, Text, Stack, Heading, Divider, Grid, GridItem, Button, Table, Tbody, Tr, Td, Thead, Th, Spinner, Alert, AlertIcon } from '@chakra-ui/react';
import jsPDF from 'jspdf';
import { supabase } from './../../../../supabaseClient';  // Ensure you have the correct path to your Supabase client

const InvoicePreview = ({ invoiceNumber }) => {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      setLoading(true); // Start loading state
      try {
        const { data, error } = await supabase
          .from('vianney_factures')
          .select('*')
          .eq('invoice_number', invoiceNumber)
          .maybeSingle(); // Use maybeSingle() to allow handling no rows or multiple rows

        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error('No invoice found with the provided invoice number.');
        }

        setInvoice(data); // Set the retrieved invoice data
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false); // Stop loading state
      }
    };

    fetchInvoice();
  }, [invoiceNumber]);

  const downloadPdf = () => {
    if (!invoice) return;

    const doc = new jsPDF('p', 'pt', 'a4');

    // Add PDF generation logic here using the invoice data

    doc.save(`Facture_${invoice.invoice_number}.pdf`);
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

  if (!invoice) {
    return (
      <Box p={4}>
        <Alert status="error">
          <AlertIcon />
          Facture non trouvée.
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={6} maxW="900px" mx="auto" borderWidth={1} borderRadius={8} boxShadow="lg">
      <Grid templateColumns="repeat(2, 1fr)" gap={6}>
        <GridItem>
          <Heading color="blue.500">{invoice.seller_name}</Heading>
          <Text mt={4}>{invoice.seller_address}</Text>
          <Text>SIREN: {invoice.seller_siren || 'N/A'}</Text>
          <Text>SIRET: {invoice.seller_siret || 'N/A'}</Text>
          <Text>Forme juridique: {invoice.seller_legal_form || 'N/A'}</Text>
          <Text>Capital: {invoice.seller_capital ? `${invoice.seller_capital.toFixed(2)} €` : 'N/A'}</Text>
          <Text>RCS: {invoice.seller_rcs || 'N/A'}</Text>
          <Text>Greffe: {invoice.seller_greffe || 'N/A'}</Text>
          <Text>RM: {invoice.seller_rm || 'N/A'}</Text>
        </GridItem>
        <GridItem textAlign="right">
          <Heading color="blue.500">Facture</Heading>
          <Text mt={4}>Numéro de facture : {invoice.invoice_number}</Text>
          <Text>Date de facture : {new Date(invoice.invoice_date).toLocaleDateString()}</Text>
          <Text>Date de vente/prestation : {invoice.sale_date ? new Date(invoice.sale_date).toLocaleDateString() : 'N/A'}</Text>
          <Text>Date de livraison : {invoice.delivery_address ? new Date(invoice.delivery_address).toLocaleDateString() : 'N/A'}</Text>
          <Text>Échéance de paiement : {new Date(invoice.payment_due_date).toLocaleDateString()}</Text>
        </GridItem>
      </Grid>

      <Grid templateColumns="repeat(2, 1fr)" gap={6} mt={6}>
        <GridItem>
          <Text bg="blue.500" color="white" p={2} borderRadius={4}>Facturer à :</Text>
          <Text mt={2}>{invoice.buyer_name}</Text>
          <Text>{invoice.buyer_address}</Text>
        </GridItem>
        <GridItem>
          <Text bg="blue.500" color="white" p={2} borderRadius={4}>Expédier à :</Text>
          <Text mt={2}>{invoice.delivery_address || 'Adresse de livraison non spécifiée'}</Text>
        </GridItem>
      </Grid>

      <Table variant="simple" mt={6}>
        <Thead bg="blue.500">
          <Tr>
            <Th color="white">Description</Th>
            <Th color="white">Quantité</Th>
            <Th color="white">Prix unitaire HT</Th>
            <Th color="white">Prix total HT</Th>
          </Tr>
        </Thead>
        <Tbody>
          {(invoice.product_descriptions || []).map((desc, index) => (
            <Tr key={index}>
              <Td>{desc}</Td>
              <Td>{invoice.product_quantities[index] || 0}</Td>
              <Td>{invoice.product_unit_prices[index]?.toFixed(2)} €</Td>
              <Td>{(invoice.product_unit_prices[index] * invoice.product_quantities[index]).toFixed(2)} €</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Grid templateColumns="repeat(2, 1fr)" gap={6} mt={6}>
        <GridItem>
          <Text bg="blue.500" color="white" p={2} borderRadius={4}>Remarques et instructions de paiement :</Text>
          <Text mt={2}>{invoice.discount_conditions || 'Aucune condition de remise spécifiée.'}</Text>
          <Text>{invoice.late_payment_penalties || 'Aucune pénalité de retard spécifiée.'}</Text>
        </GridItem>
        <GridItem>
          <Stack spacing={2} textAlign="right">
            <Text><strong>SOUS-TOTAL :</strong> {invoice.total_ht?.toFixed(2)} €</Text>
            <Text><strong>REMISE :</strong> {invoice.discount?.toFixed(2) || '0.00'} €</Text>
            <Text><strong>SOUS-TOTAL MOINS LES REMISES :</strong> {(invoice.total_ht - (invoice.discount || 0)).toFixed(2)} €</Text>
            <Text><strong>TAUX DE TVA :</strong> {invoice.product_vat_rates.length > 0 ? `${invoice.product_vat_rates[0]}%` : 'N/A'}</Text>
            <Text><strong>TOTAL TTC :</strong> {invoice.total_ttc?.toFixed(2)} €</Text>
            <Text><strong>EXPÉDITION ET MANUTENTION :</strong> 0,00 €</Text>
            <Text><strong>SOMME FINALE À PAYER :</strong> {invoice.total_ttc?.toFixed(2)} €</Text>
          </Stack>
        </GridItem>
      </Grid>

      <Divider mt={6} mb={6} />
      <Text textAlign="center" fontStyle="italic">{invoice.special_mention || "Nous apprécions votre clientèle. Si vous avez des questions sur cette facture, n'hésitez pas à nous contacter."}</Text>
      <Text textAlign="center" mt={6} fontSize="sm">Numéro SIRET | Code APE | Numéro TVA Intracommunautaire</Text>

      <Button colorScheme="teal" onClick={downloadPdf} mt={6} width="full">Télécharger en PDF</Button>
    </Box>
  );
};

export default InvoicePreview;
