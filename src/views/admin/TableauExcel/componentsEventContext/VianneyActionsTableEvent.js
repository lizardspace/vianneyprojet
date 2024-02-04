import React, { useEffect, useState } from 'react';
import { Button, Alert, AlertIcon, AlertDescription, CloseButton } from '@chakra-ui/react';
import { utils, writeFile } from 'xlsx';
import { supabase } from './../../../../supabaseClient';
import { FcAddDatabase } from "react-icons/fc"; 
import { useEvent } from './../../../../EventContext';

const VianneyActionsTableEvent = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isErrorVisible, setIsErrorVisible] = useState(false); // Track error visibility
  const { selectedEventId } = useEvent(); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: tableData, error } = await supabase
          .from('vianney_actions')
          .select('*')
          .eq('event_id', selectedEventId); 

        if (error) {
          setError(error.message);
          setIsErrorVisible(true); // Show the error alert
        } else {
          setData(tableData);
        }
      } catch (error) {
        setError(error.message);
        setIsErrorVisible(true); // Show the error alert
      }
    };

    fetchData();
  }, [selectedEventId]); // Add selectedEventId as a dependency

  const handleCloseError = () => {
    setIsErrorVisible(false); // Close the error alert
  };

  const handleExport = async () => {
    if (data.length === 0) {
      setError('Aucune donnée à exporter.'); // Updated error message for French
      setIsErrorVisible(true); // Show the error alert
      return;
    }

    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Actions de Vianney'); // Updated sheet name for French
    
    try {
      await writeFile(wb, 'actions_vianney.xlsx'); // Updated file name for French
    } catch (error) {
      setError('Erreur lors de l\'exportation vers Excel : ' + error.message); // Updated error message for French
    } finally {
      setIsErrorVisible(true); // Show the error alert after export
    }
  };

  return (
    <div>
      <Button colorScheme="teal" onClick={handleExport}>
         Exporter vers Excel les actions <FcAddDatabase style={{ marginLeft: '8px' }} />
      </Button>
      {/* Display error alert */}
      {isErrorVisible && (
        <Alert status="info" mt="2">
          <AlertIcon />
          {error && <AlertDescription>{error}</AlertDescription>}
          <CloseButton onClick={handleCloseError} position="absolute" right="8px" top="8px" />
        </Alert>
      )}
    </div>
  );
};

export default VianneyActionsTableEvent;
