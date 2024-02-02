import React, { useEffect, useState } from 'react';
import { Button } from '@chakra-ui/react';
import { utils, writeFile } from 'xlsx';
import { supabase } from './../../../../supabaseClient';

const VianneyTeamsTable = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: tableData, error } = await supabase
          .from('vianney_teams') // Replace with your actual table name
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
      setError('No data to export.');
      return;
    }

    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Vianney Teams');
    
    try {
      writeFile(wb, 'vianney_teams.xlsx');
    } catch (error) {
      setError('Error exporting to Excel: ' + error.message);
    }
  };

  return (
    <div>
      {error && <div>Error: {error}</div>}
      <Button colorScheme="teal" onClick={handleExport}>
        Export to Excel
      </Button>
    </div>
  );
};

export default VianneyTeamsTable;
