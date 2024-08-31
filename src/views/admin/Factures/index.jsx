import React from 'react';
import { Box} from '@chakra-ui/react';
import InvoiceForm from './components/InvoiceForm';
import InvoiceList from './components/InvoiceList';

const Index = () => {
  return (
    <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
        <InvoiceForm/>
        <InvoiceList/>
    </Box>
  );
};

export default Index;