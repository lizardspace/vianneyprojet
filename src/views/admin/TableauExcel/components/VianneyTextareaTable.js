import React, { useEffect, useState, useContext } from 'react'; // Updated to include useContext
import { Button, Alert, AlertIcon, AlertDescription, CloseButton } from '@chakra-ui/react';
import { utils, writeFile } from 'xlsx';
import { supabase } from './../../../../supabaseClient';
import { FcAddDatabase, FcRightUp2 } from "react-icons/fc";
import { EventContext } from './../../../../EventContext'; // Assuming the usage of EventContext for consistency

const VianneyTextareaTableEvent = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  // Context might not be used here if there's no event ID to filter by, adjust according to your needs
  // const { selectedEventId } = useContext(EventContext); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: tableData, error } = await supabase
          .from('vianney_textarea') // Ensure this matches your actual table name
          .select('*');

        if (error) {
          setError(error.message);
          setIsErrorVisible(true);
        } else {
          setData(tableData);
        }
      } catch (error) {
        setError(error.message);
        setIsErrorVisible(true);
      }
    };

    fetchData();
  }, []);

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
      setError(`Erreur lors de l'exportation vers Excel : ${error.message}`);
      setIsErrorVisible(true);
    }
  };

  return (
    <div>
      <Button colorScheme="teal" onClick={handleExport}>
         Exporter vers Excel l'aire de texte <FcAddDatabase style={{ marginLeft: '8px' }} />
      </Button>
      {isErrorVisible && (
        <Alert status="info" mt="2" maxW="300px">
          <AlertIcon as={FcRightUp2} />
          <AlertDescription>Erreur : {error}</AlertDescription>
          <CloseButton onClick={handleCloseError} position="absolute" right="8px" top="8px" />
        </Alert>
      )}
    </div>
  );
};

export default VianneyTextareaTableEvent;
