import React, { useEffect, useState } from 'react';
import { Button } from '@chakra-ui/react';
import { utils, writeFile } from 'xlsx';
import { supabase } from '../../../../supabaseClient';
import { FcAddDatabase } from "react-icons/fc"; 
import { useEvent } from './../../../../EventContext';

const VianneyEventTable = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const { selectedEventId } = useEvent();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: tableData, error } = await supabase
          .from('vianney_event') // Replace with your actual table name
          .select('*'); // Fetch all columns
          .eq('event_id', selectedEventId);

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
  }, [selectedEventId]);

  const handleExport = () => {
    if (data.length === 0) {
      setError('Aucune donnée à exporter.'); // Updated error message for French
      return;
    }

    // Remove unwanted columns (created_at and updated_at)
    const filteredData = data.map(({created_at, updated_at, last_updated, event_id, id, image_url, ...rest }) => rest);
    const ws = utils.json_to_sheet(filteredData);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Evenements de Vianney'); // Updated sheet name for French
    
    try {
      writeFile(wb, 'evenements_vianney.xlsx'); // Updated file name for French
    } catch (error) {
      setError('Erreur lors de l\'exportation vers Excel : ' + error.message); // Updated error message for French
    }
  };

  return (
    <div>
      {error && <div> {error}</div>} {/* Updated error message for French */}
      <Button colorScheme="orange" onClick={handleExport}>
         Exporter vers Excel les evenements <FcAddDatabase style={{ marginLeft: '8px' }} />
      </Button>
    </div>
  );
};

export default VianneyEventTable;
