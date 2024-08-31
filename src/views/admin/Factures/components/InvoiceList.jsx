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
  Icon,
} from '@chakra-ui/react';
import { FaFilePdf } from "react-icons/fa6";
import jsPDF from 'jspdf';

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

  const downloadPdf = (invoice) => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(18);
    doc.text(`Facture #${invoice.invoice_number}`, 10, 10);

    // Seller Information
    doc.setFontSize(12);
    doc.text(`Nom du vendeur: ${invoice.seller_name}`, 10, 20);
    doc.text(`Adresse du vendeur: ${invoice.seller_address}`, 10, 30);
    if (invoice.seller_siren) doc.text(`SIREN: ${invoice.seller_siren}`, 10, 40);
    if (invoice.seller_siret) doc.text(`SIRET: ${invoice.seller_siret}`, 10, 50);
    if (invoice.seller_legal_form) doc.text(`Forme juridique: ${invoice.seller_legal_form}`, 10, 60);
    if (invoice.seller_capital) doc.text(`Capital: ${invoice.seller_capital}`, 10, 70);
    if (invoice.seller_rcs) doc.text(`RCS: ${invoice.seller_rcs}`, 10, 80);
    if (invoice.seller_greffe) doc.text(`Greffe: ${invoice.seller_greffe}`, 10, 90);
    if (invoice.seller_rm) doc.text(`RM: ${invoice.seller_rm}`, 10, 100);
    if (invoice.seller_vat_number) doc.text(`Numéro de TVA: ${invoice.seller_vat_number}`, 10, 110);

    // Buyer Information
    doc.text(`Nom de l'acheteur: ${invoice.buyer_name}`, 10, 120);
    doc.text(`Adresse de l'acheteur: ${invoice.buyer_address}`, 10, 130);
    if (invoice.delivery_address) doc.text(`Adresse de livraison: ${invoice.delivery_address}`, 10, 140);
    if (invoice.billing_address) doc.text(`Adresse de facturation: ${invoice.billing_address}`, 10, 150);
    if (invoice.buyer_vat_number) doc.text(`Numéro de TVA de l'acheteur: ${invoice.buyer_vat_number}`, 10, 160);

    // Invoice Details
    doc.text(`Date de la facture: ${new Date(invoice.invoice_date).toLocaleDateString()}`, 10, 170);
    if (invoice.sale_date) doc.text(`Date de vente/prestation: ${new Date(invoice.sale_date).toLocaleDateString()}`, 10, 180);
    doc.text(`Date d'échéance: ${new Date(invoice.payment_due_date).toLocaleDateString()}`, 10, 190);

    // Product Details
    let startY = 200;
    doc.text(`Détails des produits/services:`, 10, startY);
    startY += 10;

    invoice.product_descriptions.forEach((desc, index) => {
      doc.text(`${index + 1}. ${desc}`, 10, startY);
      doc.text(`Quantité: ${invoice.product_quantities[index]}`, 120, startY);
      startY += 10;
      doc.text(`Prix unitaire HT: ${invoice.product_unit_prices[index]} €`, 10, startY);
      doc.text(`Taux de TVA: ${invoice.product_vat_rates[index]}%`, 120, startY);
      startY += 10;
    });

    // Totals and Financial Information
    startY += 10;
    if (invoice.discount) doc.text(`Remise: ${invoice.discount} €`, 10, startY);
    startY += 10;
    doc.text(`Total HT: ${invoice.total_ht} €`, 10, startY);
    startY += 10;
    doc.text(`Total TTC: ${invoice.total_ttc} €`, 10, startY);
    startY += 10;
    if (invoice.discount_conditions) doc.text(`Conditions de remise: ${invoice.discount_conditions}`, 10, startY);
    startY += 10;
    if (invoice.late_payment_penalties) doc.text(`Pénalités de retard: ${invoice.late_payment_penalties}`, 10, startY);
    startY += 10;
    if (invoice.warranty_info) doc.text(`Informations sur la garantie: ${invoice.warranty_info}`, 10, startY);
    startY += 10;
    if (invoice.special_mention) doc.text(`Mention spéciale: ${invoice.special_mention}`, 10, startY);

    // Save the PDF
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
              <Heading as="h3" size="md" mb={2} display="flex" alignItems="center">
                Facture #{invoice.invoice_number}
                <Icon 
                  as={FaFilePdf} 
                  color="red.500" 
                  w={6} 
                  h={6} 
                  ml={2} 
                  cursor="pointer" 
                  onClick={() => downloadPdf(invoice)} 
                />
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
