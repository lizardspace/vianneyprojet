import React, { useEffect, useState } from 'react';
import { Button, Tooltip } from '@chakra-ui/react'; // Import Tooltip
import { utils, writeFile } from 'xlsx';
import { supabase } from './../../../../supabaseClient';
import { FcAddDatabase } from "react-icons/fc"; // Importing the icon

const VianneyAlertTable = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: tableData, error } = await supabase
          .from('vianney_alert') // Replace with your actual table name
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
    utils.book_append_sheet(wb, ws, 'Alertes de Vianney'); // Updated sheet name for French

    try {
      writeFile(wb, 'alertes_vianney.xlsx'); // Updated file name for French
    } catch (error) {
      setError('Erreur lors de l\'exportation vers Excel : ' + error.message); // Updated error message for French
    }
  };

  return (
    <div>
      {error && <div>Erreur : {error}</div>} {/* Updated error message for French */}
      <Tooltip
        label="Ces alertes se trouvent dans Gestion opérationnelle --> Situation-GOC --> Message et alertes. Il s'agit du journal des alertes."
        fontSize="sm"
        bg="gray.700"
        color="white"
        placement="top"
        hasArrow
      >
        <Button colorScheme="orange" onClick={handleExport}>
          Exporter vers Excel le journal des alertes <FcAddDatabase style={{ marginLeft: '8px' }} />
        </Button>
      </Tooltip>
    </div>
  );
};

export default VianneyAlertTable;
