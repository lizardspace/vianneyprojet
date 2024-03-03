import React, { useEffect, useState } from 'react';
import { Button, Alert, AlertIcon, AlertDescription, CloseButton } from '@chakra-ui/react';
import { utils, writeFile } from 'xlsx';
import { supabase } from './../../../../supabaseClient';
import { FcAddDatabase, FcRightUp2 } from "react-icons/fc";
import { useEvent } from './../../../../EventContext';

const VianneyActionsTableEventDate = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
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

    if (!startDate || !endDate) {
      setError('Veuillez sélectionner à la fois la date de début et la date de fin.');
      setIsErrorVisible(true);
      return;
    }

    // Adjust start and end dates to UTC midnight to avoid timezone issues
    const adjustDateToUTC = (date) => {
      const localDate = new Date(date);
      return new Date(Date.UTC(localDate.getFullYear(), localDate.getMonth(), localDate.getDate()));
    };

    const parsedStartDate = adjustDateToUTC(startDate);
    const parsedEndDate = adjustDateToUTC(endDate);

    const filteredData = data.filter(({ starting_date, ending_date }) => {
      const parsedStartingDate = adjustDateToUTC(starting_date);
      const parsedEndingDate = adjustDateToUTC(ending_date);
      return (parsedStartingDate >= parsedStartDate && parsedStartingDate <= parsedEndDate) ||
        (parsedEndingDate >= parsedStartDate && parsedEndingDate <= parsedEndDate);
    });

    if (filteredData.length === 0) {
      setError('Aucune donnée disponible pour la plage de dates spécifiée.');
      setIsErrorVisible(true);
      return;
    }
    // Function to format datetime in French format with hours and minutes
    const formatDateTimeFrench = (dateString) => {
      const date = new Date(dateString);
      const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false };
      // Use toLocaleString with 'fr-FR' locale for French formatting
      return date.toLocaleString('fr-FR', options);
    };

    const mappedData = filteredData.map(({ created_at, updated_at, last_updated, event_id, id, ...rest }) => {
      const adjustedData = { ...rest };
      if (adjustedData.starting_date) {
        adjustedData.starting_date = formatDateTimeFrench(adjustedData.starting_date);
      }
      if (adjustedData.ending_date) {
        adjustedData.ending_date = formatDateTimeFrench(adjustedData.ending_date);
      }
      return adjustedData;
    });





    const ws = utils.json_to_sheet(mappedData);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Actions de Vianney');

    try {
      await writeFile(wb, 'actions_vianney.xlsx');
    } catch (error) {
      setError(`Erreur lors de l'exportation vers Excel : ${error.message}`);
      setIsErrorVisible(true);
    }
  };



  return (
    <div>
      <label htmlFor="start-date">Date de début:</label>
      <input type="date" id="start-date" onChange={(e) => setStartDate(e.target.value)} />
      <label htmlFor="end-date">Date de fin:</label>
      <input type="date" id="end-date" onChange={(e) => setEndDate(e.target.value)} />
      <Button colorScheme="teal" onClick={handleExport}>
        Exporter vers Excel les actions <FcAddDatabase style={{ marginLeft: '8px' }} />
      </Button>
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

export default VianneyActionsTableEventDate;
