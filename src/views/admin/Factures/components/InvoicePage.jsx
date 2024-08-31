import React from 'react';
import InvoicePreview from './InvoicePreview';

const InvoicePage = ({ invoice }) => {
  return (
    <div>
      <InvoicePreview invoice={invoice} />
    </div>
  );
};

export default InvoicePage;
