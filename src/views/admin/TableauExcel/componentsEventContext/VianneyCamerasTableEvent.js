import React, { useEffect, useState } from 'react';
import { Button, Alert, AlertIcon, AlertDescription, CloseButton } from '@chakra-ui/react';
import { utils, writeFile } from 'xlsx';
import { supabase } from '../../../../supabaseClient';
import { FcAddDatabase, FcRightUp2 } from "react-icons/fc";
import { useEvent } from '../../../../EventContext'; // Assuming the path is correct

const VianneyCamerasTableEvent = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const { selectedEventId } = useEvent(); // Using the context to get the selected event ID

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
      <Button colorScheme="teal" onClick={handleExport}>
        Exporter vers Excel les cameras <FcAddDatabase style={{ marginLeft: '8px' }} />
      </Button>
      {isErrorVisible && (
        <Alert status="info" mt="2" maxW="300px">
          <AlertIcon as={FcRightUp2} />
          <AlertDescription> {error}</AlertDescription>
          <CloseButton onClick={handleCloseError} position="absolute" right="8px" top="8px" />
        </Alert>
      )}
    </div>
  );
};

export default VianneyCamerasTableEvent;
