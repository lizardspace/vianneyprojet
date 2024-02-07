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
          .from('vianney_textarea') // Ensure this matches your actual table name
          .select('*')
          .eq('event_id', selectedEventId);
  
        if (error) {
          console.log(error.message); // Log to console instead of showing to the user
        } else {
          setData(tableData);
        }
      } catch (error) {
        console.log(error.message); // Log to console instead
      }
    };
  
    fetchData();
  }, [selectedEventId]);

  const handleCloseError = () => {
    setIsErrorVisible(false);
  };
  
  const handleExport = async () => {
    if (data.length === 0) {
      setError('Aucune donnée à exporter.');
      setIsErrorVisible(true);
      return;
    }
  
    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Aire de texte de Vianney');
  
    try {
      await writeFile(wb, 'textarea_vianney.xlsx');
    } catch (error) {
      console.log(`Erreur lors de l'exportation vers Excel : ${error.message}`); // Log this error to console instead
    }
  };
 

  return (
    <div>
      {error && <div> {error}</div>} {/* Updated error message for French */}
      <Button colorScheme="teal" onClick={handleExport}>
         Exporter vers Excel les evenements <FcAddDatabase style={{ marginLeft: '8px' }} />
      </Button>
    </div>
  );
};

export default VianneyEventTable;
