import React, { useEffect, useState } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { supabase } from './../../../../../supabaseClient'; // Assure-toi que le chemin est correct

const EmployeeInfo = () => {
  const [employeeData, setEmployeeData] = useState(null);  // State to store employee data

  // Fetch employee data from Supabase
  useEffect(() => {
    const fetchEmployeeData = async () => {
      const { data, error } = await supabase
        .from('vianney_fiche_de_paye_employees')
        .select('*')
        .order('created_at', { ascending: false })  // Get the most recent employee entry
        .limit(1);

      if (error) {
        console.error('Error fetching employee data:', error.message);
      } else if (data && data.length > 0) {
        setEmployeeData(data[0]);  // Set the most recent employee data
      }
    };

    fetchEmployeeData();
  }, []);  // Fetch only once when the component mounts

  if (!employeeData) {
    return <Text>Loading...</Text>;  // Show loading text while data is being fetched
  }

  return (
    <Box 
      border="1px solid" 
      borderColor="black" 
      p={6} 
      width="90%"             
      minWidth="90%"         
      maxWidth="90%"        
      mx="auto" 
      borderRadius="md"
      boxShadow="md"
      bg="white"
      textAlign="center"
    >
      <Text color="brown" fontStyle="italic" mb={2}>
        {employeeData.first_name} / {employeeData.last_name}
      </Text>
      <Text color="brown" fontStyle="italic">
        {employeeData.address}
      </Text>
    </Box>
  );
};

export default EmployeeInfo;
