import React, { useState } from 'react';
import { Box, Button, VStack, Flex } from '@chakra-ui/react';
import InvoiceForm from './components/InvoiceForm';
import InvoiceList from './components/InvoiceList';
import InvoicePage from './components/InvoicePage';
import DocumentTabs from './components/DocumentTabs';
import SellerInfoForm from './components/SellerInfoForm';

const Index = () => {
  const [showSellerInfo, setShowSellerInfo] = useState(false);
  const [showInvoiceDetails, setShowInvoiceDetails] = useState(false);

  return (
    <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
      <DocumentTabs />
      <InvoiceForm />

      {/* Toggle Buttons */}
      <Flex direction="column" align="center" mt={8} gap={4}>
        {/* Button for Seller Info Section */}
        <Button
          onClick={() => setShowSellerInfo((prev) => !prev)}
          colorScheme="blue"
          size="md"
        >
          {showSellerInfo
            ? 'Cacher Informations du Vendeur'
            : 'Montrer Informations du Vendeur'}
        </Button>

        {/* Button for Invoice Details Section */}
        <Button
          onClick={() => setShowInvoiceDetails((prev) => !prev)}
          colorScheme="teal"
          size="md"
        >
          {showInvoiceDetails
            ? 'Cacher Détails des Factures'
            : 'Montrer Détails des Factures'}
        </Button>
      </Flex>

      {/* Seller Info Section */}
      {showSellerInfo && (
        <VStack spacing={4} mt={6}>
          <SellerInfoForm />
        </VStack>
      )}

      {/* Invoice Details Section */}
      {showInvoiceDetails && (
        <VStack spacing={4} mt={6}>
          <InvoiceList />
          <InvoicePage />
        </VStack>
      )}
    </Box>
  );
};

export default Index;
