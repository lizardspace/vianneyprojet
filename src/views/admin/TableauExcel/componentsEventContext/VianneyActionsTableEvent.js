import React, { useEffect, useState } from 'react';
import { Button, Alert, AlertIcon, AlertDescription, CloseButton, Tooltip } from '@chakra-ui/react'; // Import Tooltip
import { utils, writeFile } from 'xlsx';
import { supabase } from './../../../../supabaseClient';
import { FcAddDatabase, FcRightUp2 } from "react-icons/fc";
import { useEvent } from './../../../../EventContext';

const VianneyActionsTableEvent = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const { selectedEventId } = useEvent();

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedEventId) {
        return;
      }

      try {
        const { data: tableData, error } = await supabase
          .from('vianney_actions')
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

    // Remove unwanted columns (created_at and updated_at)
    const filteredData = data.map(({ created_at, updated_at, last_updated, event_id, id, ...rest }) => rest);

    const ws = utils.json_to_sheet(filteredData);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Actions prévues pour l\'événement sélectionné');

    try {
      await writeFile(wb, 'actions_evenement_vianney.xlsx');
    } catch (error) {
      setError('Erreur lors de l\'exportation vers Excel : ' + error.message);
    } finally {
      setIsErrorVisible(true);
    }
  };

  return (
    <div>
      <Tooltip
        label="Ce tableau contient les actions dans le calendrier prévues pour l'événement sélectionné."
        fontSize="sm"
        bg="gray.700"
        color="white"
        placement="top"
        hasArrow
      >
        <Button colorScheme="orange" onClick={handleExport}>
          Exporter les actions dans le calendrier de l'événement <FcAddDatabase style={{ marginLeft: '8px' }} />
        </Button>
      </Tooltip>
      {error && isErrorVisible && (
        <Alert status="info" mt="2" maxW="300px">
          <AlertDescription>{error}</AlertDescription>
          <AlertIcon as={FcRightUp2} />
          <CloseButton onClick={handleCloseError} position="absolute" right="8px" top="8px" />
        </Alert>
      )}
    </div>
  );  
};

export default VianneyActionsTableEvent;
