import React, { useEffect, useState } from 'react';
import { Button, Alert, AlertIcon, AlertDescription, CloseButton } from '@chakra-ui/react';
import { utils, writeFile } from 'xlsx';
import { supabase } from '../../../../supabaseClient';
import { FcAddDatabase, FcRightUp2 } from "react-icons/fc";
import { useEvent } from './../../../../EventContext';

const VianneyTeamsTableEvent = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const { selectedEventId } = useEvent();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!selectedEventId) {
          return;
        }
        const { data: tableData, error } = await supabase
          .from('vianney_teams') // Ensure this matches your actual table name
          .select('*')
          .eq('event_id', selectedEventId);

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
    utils.book_append_sheet(wb, ws, 'Équipes de Vianney');

    try {
      await writeFile(wb, 'equipes_vianney.xlsx');
    } catch (error) {
      setError(`Erreur lors de l'exportation vers Excel : ${error.message}`);
    } finally {
      setIsErrorVisible(true);
    }
  };

  return (
    <div>
      <Button colorScheme="teal" onClick={handleExport}>
         Exporter vers Excel les équipes <FcAddDatabase style={{ marginLeft: '8px' }} />
      </Button>
      {isErrorVisible && (
        <Alert status="info" mt="2" maxW="300px">
          <AlertDescription>Erreur : {error}</AlertDescription>
          <AlertIcon as={FcRightUp2} />
          <CloseButton onClick={handleCloseError} position="absolute" right="8px" top="8px" />
        </Alert>
      )}
    </div>
  );
};

export default VianneyTeamsTableEvent;
