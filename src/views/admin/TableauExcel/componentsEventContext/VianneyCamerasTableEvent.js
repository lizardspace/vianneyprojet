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
      if (!selectedEventId) {
        return;
      }

      try {
        const { data: tableData, error } = await supabase
          .from('vianney_cameras') // Make sure this matches your actual table name
          .select('*')
          .eq('event_id', selectedEventId); // Assuming you have an 'event_id' column to filter by

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
    utils.book_append_sheet(wb, ws, 'Cameras de Vianney');

    try {
      await writeFile(wb, 'cameras_vianney.xlsx');
    } catch (error) {
      setError(`Erreur lors de l'exportation vers Excel : ${error.message}`);
      setIsErrorVisible(true);
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
