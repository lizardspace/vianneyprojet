import React from 'react';
import { Box, Text, Stack, Heading, Divider, Button } from '@chakra-ui/react';
import jsPDF from 'jspdf';

const InvoicePreview = ({ invoice = {} }) => {
  const downloadPdf = () => {
    const doc = new jsPDF('p', 'pt', 'a4');

    // Define some general styles
    doc.setFontSize(12);

    // Company Name
    doc.setFontSize(18);
    doc.text("Le nom de votre société", 40, 40);

    // Company Information
    doc.setFontSize(12);
    doc.text(`Adresse`, 40, 80);
    doc.text(`Code postale ville`, 40, 95);
    doc.text(`Téléphone`, 40, 110);
    doc.text(`Email`, 40, 125);
    doc.text(`Site web`, 40, 140);

    // Invoice Information
    doc.text(`Facture`, 400, 80);
    doc.text(`Numéro de client : ${invoice.client_number || ''}`, 400, 95);
    doc.text(`Numéro de facture : ${invoice.invoice_number || ''}`, 400, 110);
    doc.text(`Date de facture : ${invoice.invoice_date ? new Date(invoice.invoice_date).toLocaleDateString() : ''}`, 400, 125);
    doc.text(`Date de livraison : ${invoice.delivery_date ? new Date(invoice.delivery_date).toLocaleDateString() : ''}`, 400, 140);
    doc.text(`Échéance de paiement : ${invoice.payment_due_date ? new Date(invoice.payment_due_date).toLocaleDateString() : ''}`, 400, 155);

    // Bill To Section
    doc.text(`Facturer à :`, 40, 180);
    doc.text(invoice.buyer_name || '', 40, 195);
    doc.text(invoice.buyer_address || '', 40, 210);

    // Ship To Section
    doc.text(`Expédier à :`, 400, 180);
    doc.text(invoice.shipping_name || '', 400, 195);
    doc.text(invoice.shipping_address || '', 400, 210);

    // Table Header
    doc.text(`Description`, 40, 250);
    doc.text(`Quantité`, 250, 250);
    doc.text(`Prix unitaire HT`, 350, 250);
    doc.text(`Prix total HT`, 450, 250);

    // Table Content
    let yPos = 270;
    if (invoice.product_descriptions && invoice.product_descriptions.length > 0) {
      invoice.product_descriptions.forEach((desc, index) => {
        doc.text(desc, 40, yPos);
        doc.text(`${invoice.product_quantities[index] || ''}`, 250, yPos);
        doc.text(`${invoice.product_unit_prices[index] || ''} €`, 350, yPos);
        doc.text(`${(invoice.product_unit_prices[index] * invoice.product_quantities[index] || 0).toFixed(2)} €`, 450, yPos);
        yPos += 20;
      });
    }

    // Totals
    yPos += 20;
    if (invoice.discount) doc.text(`Remise : ${invoice.discount} €`, 10, yPos);
    yPos += 20;
    doc.text(`Total HT : ${invoice.total_ht || 0} €`, 10, yPos);
    yPos += 10;
    doc.text(`Total TTC : ${invoice.total_ttc || 0} €`, 10, yPos);

    // Save the PDF
    doc.save(`Facture_${invoice.invoice_number}.pdf`);
  };

  return (
    <Box p={6} maxW="800px" mx="auto" borderWidth={1} borderRadius={8} boxShadow="lg">
      <Heading as="h2" size="lg" mb={6}>
        Aperçu de la Facture
      </Heading>
      <Box mb={6}>
        <Text fontSize="lg" fontWeight="bold">Le nom de votre société</Text>
        <Text>Adresse</Text>
        <Text>Code postale ville</Text>
        <Text>Téléphone</Text>
        <Text>Email | Site web</Text>
      </Box>
      <Box mb={6}>
        <Text fontSize="lg" fontWeight="bold">Facture</Text>
        <Text>Numéro de client: {invoice.client_number || ''}</Text>
        <Text>Numéro de facture: {invoice.invoice_number || ''}</Text>
        <Text>Date de facture: {invoice.invoice_date ? new Date(invoice.invoice_date).toLocaleDateString() : ''}</Text>
        <Text>Date de livraison: {invoice.delivery_date ? new Date(invoice.delivery_date).toLocaleDateString() : ''}</Text>
        <Text>Échéance de paiement: {invoice.payment_due_date ? new Date(invoice.payment_due_date).toLocaleDateString() : ''}</Text>
      </Box>
      <Box mb={6}>
        <Text fontWeight="bold">Facturer à :</Text>
        <Text>{invoice.buyer_name || ''}</Text>
        <Text>{invoice.buyer_address || ''}</Text>
      </Box>
      <Box mb={6}>
        <Text fontWeight="bold">Expédier à :</Text>
        <Text>{invoice.shipping_name || ''}</Text>
        <Text>{invoice.shipping_address || ''}</Text>
      </Box>
      <Divider mb={6} />
      <Stack direction="row" spacing={10} mb={6}>
        <Text>Description</Text>
        <Text>Quantité</Text>
        <Text>Prix unitaire HT</Text>
        <Text>Prix total HT</Text>
      </Stack>
      {(invoice.product_descriptions || []).map((desc, index) => (
        <Stack direction="row" spacing={10} key={index} mb={2}>
          <Text>{desc || ''}</Text>
          <Text>{invoice.product_quantities[index] || ''}</Text>
          <Text>{invoice.product_unit_prices[index] || ''} €</Text>
          <Text>{(invoice.product_unit_prices[index] * invoice.product_quantities[index] || 0).toFixed(2)} €</Text>
        </Stack>
      ))}
      <Divider mt={6} mb={6} />
      <Text fontWeight="bold">Total HT: {invoice.total_ht || 0} €</Text>
      {invoice.discount && <Text fontWeight="bold">Remise: {invoice.discount} €</Text>}
      <Text fontWeight="bold">Total TTC: {invoice.total_ttc || 0} €</Text>
      <Divider mt={6} mb={6} />
      <Button colorScheme="teal" onClick={downloadPdf}>Télécharger en PDF</Button>
    </Box>
  );
};

export default InvoicePreview;
