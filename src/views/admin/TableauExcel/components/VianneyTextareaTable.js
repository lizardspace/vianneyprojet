import React, { useEffect, useState } from 'react';
import { Button } from '@chakra-ui/react';
import { utils, writeFile } from 'xlsx';
import { supabase } from './../../../../supabaseClient';
import { FcAddDatabase } from "react-icons/fc"; // Importing the icon

const VianneyTextareaSalleDeCriseTable = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: tableData, error } = await supabase
          .from('vianney_textarea_salle_de_crise') // Replace with your actual table name
          .select('*'); // Fetch all columns

        if (error) {
          setError(error.message);
        } else {
          setData(tableData);
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  const handleExport = () => {
    if (data.length === 0) {
      setError('Aucune donnée à exporter.'); // Updated error message for French
      return;
    }

    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Salle de crise de Vianney'); // Updated sheet name for French
    
    try {
      writeFile(wb, 'salle_de_crise_vianney.xlsx'); // Updated file name for French
    } catch (error) {
      setError('Erreur lors de l\'exportation vers Excel : ' + error.message); // Updated error message for French
    }
  };

  return (
    <div>
      {error && <div>Erreur : {error}</div>} {/* Updated error message for French */}
      <Button colorScheme="orange" onClick={handleExport}>
         Exporter vers Excel la salle de crise <FcAddDatabase style={{ marginLeft: '8px' }} />
      </Button>
    </div>
  );
};

export default VianneyTextareaSalleDeCriseTable;

