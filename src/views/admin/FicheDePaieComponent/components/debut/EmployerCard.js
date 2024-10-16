import React, { useEffect, useState } from 'react';
import { Box, Text, Flex } from '@chakra-ui/react';
import { supabase } from './../../../../../supabaseClient';  // Assure-toi que le chemin est correct
import { useEvent } from './../../../../../EventContext';  // Assuming you're using the EventContext to get event_id

const EmployerCard = () => {
  const { selectedEventId } = useEvent();  // Get the event ID from context
  const [employerData, setEmployerData] = useState(null);  // State to store employer data

  // Fetch the most recent employer data for the selected event
  useEffect(() => {
    const fetchEmployerData = async () => {
      if (!selectedEventId) return;

      const { data, error } = await supabase
        .from('vianney_employers')
        .select('*')
        .eq('event_id', selectedEventId)
        .order('created_at', { ascending: false })  // Order by created_at in descending order
        .limit(1);  // Get the most recent entry

      if (error) {
        console.error('Error fetching employer data:', error.message);
      } else if (data && data.length > 0) {
        setEmployerData(data[0]);  // Set the most recent employer data
      }
    };

    fetchEmployerData();
  }, [selectedEventId, setEmployerData]);  // Include setEmployerData in dependencies

  if (!employerData) {
    return <Text>Loading...</Text>;  // Show loading text while data is being fetched
  }

  return (
    <Box 
      border="1px solid" 
      borderColor="black" 
      p={4} 
      width="90%" 
      minWidth="90%" 
      maxWidth="90%" 
      mx="auto" 
      borderRadius="md"
      boxShadow="md"
      bg="white"
    >
      <Flex alignItems="center" justifyContent="space-between">
        {/* Logo Section */}
        <Box textAlign="center">
          {employerData.logo_url ? (
            <img src={employerData.logo_url} alt="Logo de l'entreprise" style={{ width: '100px', height: '100px' }} />
          ) : (
            <Text fontStyle="italic" color="brown">
              "Logo de l'entreprise"
            </Text>
          )}
        </Box>

        {/* Info Section */}
        <Box textAlign="right">
          <Text fontWeight="bold" color="brown">
            {employerData.name || 'Nom de l\'employeur'}
          </Text>
          <Text fontStyle="italic" color="brown">
            {employerData.address || 'Adresse de l\'employeur'}
          </Text>
          <Text fontStyle="italic" color="brown">
            {employerData.postal_code || 'Code postal de l\'employeur'}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};

export default EmployerCard;
