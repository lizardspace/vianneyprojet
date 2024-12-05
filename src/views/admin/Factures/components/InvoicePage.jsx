// InvoicePage.js
import React from 'react';
import InvoicePreview from './InvoicePreview';

const InvoicePage = ({ invoiceNumber }) => {
  return (
    <div>
      <InvoicePreview invoiceNumber={invoiceNumber} />
    </div>
  );
};

export default InvoicePage;
