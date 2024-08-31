import { useEffect, useState } from 'react';
import { supabase } from './../../../../supabaseClient';  // Make sure this is correctly configured in your project

const useInvoiceData = (invoiceNumber) => {
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

  return { invoice, loading, error };
};

export default useInvoiceData;
