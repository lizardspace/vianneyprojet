import React from 'react';
import { Box} from '@chakra-ui/react';
import InvoiceForm from './components/InvoiceForm';
import InvoiceList from './components/InvoiceList';
import InvoicePage from './components/InvoicePage';
import DocumentTabs from './components/DocumentTabs';

const Index = () => {
  return (
    <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
      <DocumentTabs/>
        <InvoiceForm/>
        <InvoiceList/>
        <InvoicePage/>
    </Box>
  );
};

export default Index;