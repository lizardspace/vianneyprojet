import React, { useState, useEffect } from 'react';
import { Box, Text, Stack, Heading, Divider, Grid, GridItem, Table, Tbody, Tr, Td, Thead, Th, Spinner, Alert, AlertIcon, Button } from '@chakra-ui/react';
import { supabase } from './../../../../supabaseClient';  // Ensure this is the correct path to your Supabase client
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const InvoicePreview = ({ invoiceNumber }) => {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const { data, error } = await supabase
          .from('vianney_factures')
          .select('*')
          .eq('invoice_number', invoiceNumber)
          .single();

        if (error) {
          throw error;
        }

        setInvoice(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [invoiceNumber]);

  const downloadPdf = () => {
    if (!invoice) return;

    const doc = new jsPDF('p', 'pt', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Add Title
    doc.setFontSize(20);
    doc.text('Facture', pageWidth / 2, 40, { align: 'center' });

    // Add Seller Information
    doc.setFontSize(12);
    doc.text(`Nom de la société: ${invoice.seller_name}`, 40, 80);
    doc.text(`Adresse: ${invoice.seller_address}`, 40, 100);
    doc.text(`SIREN: ${invoice.seller_siren || 'N/A'}`, 40, 120);
    doc.text(`SIRET: ${invoice.seller_siret || 'N/A'}`, 40, 140);

    // Add Buyer Information
    doc.text(`Facturer à: ${invoice.buyer_name}`, 400, 80);
    doc.text(`Adresse: ${invoice.buyer_address}`, 400, 100);

    // Add Invoice Information
    doc.text(`Numéro de Facture: ${invoice.invoice_number}`, 40, 180);
    doc.text(`Date de Facture: ${new Date(invoice.invoice_date).toLocaleDateString()}`, 40, 200);
    doc.text(`Date d'Échéance: ${new Date(invoice.payment_due_date).toLocaleDateString()}`, 40, 220);

    // Add Table for Products/Services
    const products = invoice.product_descriptions.map((desc, index) => [
      desc,
      invoice.product_quantities[index],
      `${invoice.product_unit_prices[index]?.toFixed(2)} €`,
      `${(invoice.product_unit_prices[index] * invoice.product_quantities[index]).toFixed(2)} €`
    ]);

    doc.autoTable({
      startY: 260,
      head: [['Description', 'Quantité', 'Prix unitaire HT', 'Prix total HT']],
      body: products,
      margin: { top: 260 },
    });

    // Add Totals
    doc.text(`Sous-Total: ${invoice.total_ht?.toFixed(2)} €`, pageWidth - 150, doc.lastAutoTable.finalY + 20);
    doc.text(`TVA: ${invoice.product_vat_rates[0]}%`, pageWidth - 150, doc.lastAutoTable.finalY + 40);
    doc.text(`Total TTC: ${invoice.total_ttc?.toFixed(2)} €`, pageWidth - 150, doc.lastAutoTable.finalY + 60);

    // Add Footer
    doc.setFontSize(10);
    doc.text('Nous apprécions votre clientèle.', pageWidth / 2, doc.internal.pageSize.getHeight() - 50, { align: 'center' });

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
