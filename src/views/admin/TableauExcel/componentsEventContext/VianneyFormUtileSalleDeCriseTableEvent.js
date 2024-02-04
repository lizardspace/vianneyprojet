import React, { useEffect, useState } from 'react';
import { Button } from '@chakra-ui/react';
import { utils, writeFile } from 'xlsx';
import { supabase } from '../../../../supabaseClient';
import { FcAddDatabase } from "react-icons/fc"; // Importing the icon

const VianneyFormUtileSalleDeCriseTable = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: tableData, error } = await supabase
          .from('vianney_form_utile_salle_de_crise') // Replace with your actual table name
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
    const sheetName = 'Formulaire_Salle_Crise_Vianney'; // Shortened sheet name
    utils.book_append_sheet(wb, ws, sheetName); // Updated sheet name
    
    try {
      writeFile(wb, 'formulaire_utile_salle_de_crise_vianney.xlsx'); // Updated file name for French
    } catch (error) {
      setError('Erreur lors de l\'exportation vers Excel : ' + error.message); // Updated error message for French
    }
  };

  return (
    <div>
      {error && <div>Erreur : {error}</div>} {/* Updated error message for French */}
      <Button colorScheme="teal" onClick={handleExport}>
        Exporter vers Excel le formulaire utile salle de crise <FcAddDatabase style={{ marginLeft: '8px' }} />
      </Button>
    </div>
  );
};

export default VianneyFormUtileSalleDeCriseTable;
