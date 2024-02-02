import React, { useEffect, useState } from 'react';
import { Button } from '@chakra-ui/react';
import { utils, writeFile } from 'xlsx';
import { supabase } from './../../../../supabaseClient';

const VianneyTeamsTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: tableData, error } = await supabase
        .from('your_table_name') // Replace with your actual table name
        .select('*'); // Fetch all columns

      if (error) {
        console.error('Error fetching data from Supabase:', error);
      } else {
        setData(tableData);
      }
    };

    fetchData();
  }, []);

  const handleExport = () => {
    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Vianney Teams');
    writeFile(wb, 'vianney_teams.xlsx');
  };

  return (
    <div>
      <Button colorScheme="teal" onClick={handleExport}>
        Export to Excel
      </Button>
    </div>
  );
};

export default VianneyTeamsTable;
