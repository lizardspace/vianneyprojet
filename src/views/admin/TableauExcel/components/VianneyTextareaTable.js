import React, { useEffect, useState } from 'react';
import { Button, Textarea } from '@chakra-ui/react';
import { supabase } from './../../../../supabaseClient';
import { FcAddDatabase } from "react-icons/fc"; // Importing the icon

const VianneyTextareaTable = () => {
  const [textData, setTextData] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('vianney_textarea') // Replace with your actual table name
          .select('*') // Fetch the 'text_data' column

        if (error) {
          setError(error.message);
        } else {
          // Assuming the response is an array with a single object
          if (data.length === 1 && data[0].text_data) {
            setTextData(data[0].text_data);
          }
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  const handleExport = () => {
    if (!textData) {
      setError('Aucun texte à exporter.'); // Updated error message for French
      return;
    }

    // You can export the 'textData' as needed here.
    // For simplicity, we will log it to the console in this example.
    console.log('Texte exporté :', textData);
  };

  return (
    <div>
      {error && <div>Erreur : {error}</div>} {/* Updated error message for French */}
      <Textarea value={textData} readOnly />
      <Button colorScheme="teal" onClick={handleExport}>
        Exporter le texte <FcAddDatabase style={{ marginLeft: '8px' }} />
      </Button>
    </div>
  );
};

export default VianneyTextareaTable;
