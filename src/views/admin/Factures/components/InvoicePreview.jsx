// InvoicePreview.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Stack,
  Heading,
  Divider,
  Grid,
  GridItem,
  Table,
  Tbody,
  Tr,
  Td,
  Thead,
  Th,
  Spinner,
  Alert,
  AlertIcon,
  Button,
} from '@chakra-ui/react';
import { supabase } from './../../../../supabaseClient';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const InvoicePreview = ({ invoiceNumber }) => {
  const [invoice, setInvoice] = useState(null);
  const [totalHT, setTotalHT] = useState(0);
  const [totalTTC, setTotalTTC] = useState(0);
  const [vatTotal, setVatTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
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

        // Calculate totals
        if (data.products && data.products.length > 0) {
          // Total HT (before discount)
          const totalHTCalculated = data.products.reduce((acc, product) => {
            return acc + product.unitPrice * product.quantity;
          }, 0);

          // Discount
          const discountValue = data.discount ? parseFloat(data.discount) : 0;

          // Subtotal after discount
          const subtotalAfterDiscount = totalHTCalculated - discountValue;

          // Calculate VAT total
          let vatTotalCalculated = 0;
          if (totalHTCalculated > 0) {
            data.products.forEach((product) => {
              const productTotal = product.unitPrice * product.quantity;
              const productDiscount = (productTotal / totalHTCalculated) * discountValue;
              const taxableAmount = productTotal - productDiscount;
              const vatAmount = (taxableAmount * product.vatRate) / 100;
              vatTotalCalculated += vatAmount;
            });
          }

          // Total TTC
          const totalTTCCalculated = subtotalAfterDiscount + vatTotalCalculated;

          // Update states
          setTotalHT(totalHTCalculated);
          setDiscount(discountValue);
          setVatTotal(vatTotalCalculated);
          setTotalTTC(totalTTCCalculated);
        } else {
          setTotalHT(0);
          setDiscount(0);
          setVatTotal(0);
          setTotalTTC(0);
        }
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

    // Ajouter le titre
    doc.setFontSize(20);
    doc.text('Facture', pageWidth / 2, 40, { align: 'center' });

    // Ajouter les informations du vendeur
    doc.setFontSize(12);
    let yPosition = 80;
    doc.text(`Nom de la société: ${invoice.seller_name}`, 40, yPosition);
    yPosition += 20;
    doc.text(`Adresse: ${invoice.seller_address}`, 40, yPosition);
    yPosition += 20;
    doc.text(`SIREN: ${invoice.seller_siren || 'N/A'}`, 40, yPosition);
    yPosition += 20;
    doc.text(`SIRET: ${invoice.seller_siret || 'N/A'}`, 40, yPosition);
    yPosition += 20;
    doc.text(`Code APE: ${invoice.code_ape || 'N/A'}`, 40, yPosition);
    yPosition += 20;
    doc.text(`Numéro TVA Intracommunautaire: ${invoice.seller_vat_intracommunity_number || 'N/A'}`, 40, yPosition);
    yPosition += 20;
    doc.text(`Forme juridique: ${invoice.seller_legal_form || 'N/A'}`, 40, yPosition);
    yPosition += 20;
    doc.text(`Capital: ${invoice.seller_capital ? `${invoice.seller_capital.toFixed(2)} €` : 'N/A'}`, 40, yPosition);
    yPosition += 20;
    doc.text(`RCS: ${invoice.seller_rcs || 'N/A'}`, 40, yPosition);
    yPosition += 20;
    doc.text(`Greffe: ${invoice.seller_greffe || 'N/A'}`, 40, yPosition);
    yPosition += 20;
    doc.text(`RM: ${invoice.seller_rm || 'N/A'}`, 40, yPosition);

    // Ajouter les informations de l'acheteur
    doc.text(`Facturer à: ${invoice.buyer_name}`, 400, 80);
    doc.text(`Adresse: ${invoice.buyer_address}`, 400, 100);

    // Ajouter les informations de la facture
    yPosition += 40;
    doc.text(`Numéro de Facture: ${invoice.invoice_number}`, 40, yPosition);
    yPosition += 20;
    doc.text(
      `Date de Facture: ${invoice.invoice_date ? new Date(invoice.invoice_date).toLocaleDateString() : 'N/A'}`,
      40,
      yPosition
    );
    yPosition += 20;
    doc.text(
      `Date d'Échéance: ${invoice.payment_due_date ? new Date(invoice.payment_due_date).toLocaleDateString() : 'N/A'}`,
      40,
      yPosition
    );

    // Ajouter le tableau des produits/services
    const products = (invoice.products || []).map((product) => [
      product.description,
      product.quantity,
      `${product.unitPrice.toFixed(2)} €`,
      `${(product.unitPrice * product.quantity).toFixed(2)} €`,
    ]);

    doc.autoTable({
      startY: yPosition + 20,
      head: [['Description', 'Quantité', 'Prix unitaire HT', 'Prix total HT']],
      body: products,
      margin: { top: yPosition + 20 },
    });

    // Ajouter les totaux
    doc.text(
      `Sous-Total: ${totalHT.toFixed(2)} €`,
      pageWidth - 200,
      doc.lastAutoTable.finalY + 20
    );
    doc.text(
      `REMISE: ${discount.toFixed(2)} €`,
      pageWidth - 200,
      doc.lastAutoTable.finalY + 40
    );
    doc.text(
      `Sous-Total après Remise: ${(totalHT - discount).toFixed(2)} €`,
      pageWidth - 200,
      doc.lastAutoTable.finalY + 60
    );
    doc.text(
      `TVA: ${vatTotal.toFixed(2)} €`,
      pageWidth - 200,
      doc.lastAutoTable.finalY + 80
    );
    doc.text(
      `Total TTC: ${totalTTC.toFixed(2)} €`,
      pageWidth - 200,
      doc.lastAutoTable.finalY + 100
    );

    // Ajouter le pied de page
    doc.setFontSize(10);
    doc.text(
      'Nous apprécions votre clientèle.',
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 50,
      { align: 'center' }
    );

    // Pied de page avec les détails du vendeur
    doc.text(
      `Numéro SIRET : ${invoice.seller_siret || 'N/A'} | Code APE : ${invoice.code_ape || 'N/A'} | Numéro TVA Intracommunautaire : ${invoice.seller_vat_intracommunity_number || 'N/A'}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 30,
      { align: 'center' }
    );

    doc.save(`Facture_${invoice.invoice_number}.pdf`);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
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
    <Box
      p={6}
      maxW="900px"
      mx="auto"
      borderWidth={1}
      borderRadius={8}
      boxShadow="lg"
    >
      <Grid templateColumns="repeat(2, 1fr)" gap={6}>
        <GridItem>
          <Heading color="blue.500">{invoice.seller_name}</Heading>
          <Text mt={4}>{invoice.seller_address}</Text>
          <Text>SIREN: {invoice.seller_siren || 'N/A'}</Text>
          <Text>SIRET: {invoice.seller_siret || 'N/A'}</Text>
          <Text>Code APE: {invoice.code_ape || 'N/A'}</Text>
          <Text>
            Numéro TVA Intracommunautaire:{' '}
            {invoice.seller_vat_intracommunity_number || 'N/A'}
          </Text>
          <Text>
            Forme juridique: {invoice.seller_legal_form || 'N/A'}
          </Text>
          <Text>
            Capital:{' '}
            {invoice.seller_capital
              ? `${invoice.seller_capital.toFixed(2)} €`
              : 'N/A'}
          </Text>
          <Text>RCS: {invoice.seller_rcs || 'N/A'}</Text>
          <Text>Greffe: {invoice.seller_greffe || 'N/A'}</Text>
          <Text>RM: {invoice.seller_rm || 'N/A'}</Text>
        </GridItem>
        <GridItem textAlign="right">
          <Heading color="blue.500">Facture</Heading>
          <Text mt={4}>
            Numéro de facture : {invoice.invoice_number}
          </Text>
          <Text>
            Date de facture :{' '}
            {invoice.invoice_date
              ? new Date(invoice.invoice_date).toLocaleDateString()
              : 'N/A'}
          </Text>
          <Text>
            Date de vente/prestation :{' '}
            {invoice.sale_date
              ? new Date(invoice.sale_date).toLocaleDateString()
              : 'N/A'}
          </Text>
          <Text>
            Échéance de paiement :{' '}
            {invoice.payment_due_date
              ? new Date(invoice.payment_due_date).toLocaleDateString()
              : 'N/A'}
          </Text>
        </GridItem>
      </Grid>

      <Grid templateColumns="repeat(2, 1fr)" gap={6} mt={6}>
        <GridItem>
          <Text bg="blue.500" color="white" p={2} borderRadius={4}>
            Facturer à :
          </Text>
          <Text mt={2}>{invoice.buyer_name}</Text>
          <Text>{invoice.buyer_address}</Text>
        </GridItem>
        <GridItem>
          <Text bg="blue.500" color="white" p={2} borderRadius={4}>
            Expédier à :
          </Text>
          <Text mt={2}>
            {invoice.delivery_address || 'Adresse de livraison non spécifiée'}
          </Text>
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
          {(invoice.products || []).map((product, index) => (
            <Tr key={index}>
              <Td>{product.description}</Td>
              <Td>{product.quantity || 0}</Td>
              <Td>{product.unitPrice?.toFixed(2)} €</Td>
              <Td>
                {(product.unitPrice * product.quantity).toFixed(2)} €
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Grid templateColumns="repeat(2, 1fr)" gap={6} mt={6}>
        <GridItem>
          <Text bg="blue.500" color="white" p={2} borderRadius={4}>
            Remarques et instructions de paiement :
          </Text>
          <Text mt={2}>
            {invoice.discount_conditions ||
              'Aucune condition de remise spécifiée.'}
          </Text>
          <Text>
            {invoice.late_payment_penalties ||
              'Aucune pénalité de retard spécifiée.'}
          </Text>
        </GridItem>
        <GridItem>
          <Stack spacing={2} textAlign="right">
            <Text>
              <strong>SOUS-TOTAL :</strong> {totalHT.toFixed(2)} €
            </Text>
            <Text>
              <strong>REMISE :</strong> {discount.toFixed(2)} €
            </Text>
            <Text>
              <strong>SOUS-TOTAL MOINS LES REMISES :</strong>{' '}
              {(totalHT - discount).toFixed(2)} €
            </Text>
            <Text>
              <strong>TVA :</strong> {vatTotal.toFixed(2)} €
            </Text>
            <Text>
              <strong>TOTAL TTC :</strong> {totalTTC.toFixed(2)} €
            </Text>
            <Text>
              <strong>EXPÉDITION ET MANUTENTION :</strong> 0,00 €
            </Text>
            <Text>
              <strong>SOMME FINALE À PAYER :</strong> {totalTTC.toFixed(2)} €
            </Text>
          </Stack>
        </GridItem>
      </Grid>

      <Divider mt={6} mb={6} />
      <Text textAlign="center" fontStyle="italic">
        {invoice.special_mention ||
          "Nous apprécions votre clientèle. Si vous avez des questions sur cette facture, n'hésitez pas à nous contacter."}
      </Text>
      <Text textAlign="center" mt={6} fontSize="sm">
        Numéro SIRET : {invoice.seller_siret || 'N/A'} | Code APE : {invoice.code_ape || 'N/A'} | Numéro TVA Intracommunautaire : {invoice.seller_vat_intracommunity_number || 'N/A'}
      </Text>

      <Button
        colorScheme="teal"
        onClick={downloadPdf}
        mt={6}
        width="full"
      >
        Télécharger en PDF
      </Button>
    </Box>
  );
};

export default InvoicePreview;
