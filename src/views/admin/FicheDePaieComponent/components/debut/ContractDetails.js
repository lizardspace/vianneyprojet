import React, { useEffect, useState } from 'react';
import { Box, Text, Flex } from '@chakra-ui/react';
import { supabase } from './../../../../../supabaseClient';  // Assure-toi que le chemin est correct

const ContractDetails: React.FC = () => {
  const [contractData, setContractData] = useState(null);  // State to store contract data

  // Fetch contract details from Supabase
  useEffect(() => {
    const fetchContractData = async () => {
      const { data, error } = await supabase
        .from('vianney_fiche_de_paye_employees')
        .select('start_period_travail, end_period, start_contract, seniority_date, social_security_number')  // Updated fields
        .order('created_at', { ascending: false })  // Get the most recent contract entry
        .limit(1);

      if (error) {
        console.error('Error fetching contract data:', error.message);
      } else if (data && data.length > 0) {
        setContractData(data[0]);  // Set the most recent contract data
      }
    };

    fetchContractData();
  }, []);

  if (!contractData) {
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
      <Flex direction="column" spacing={2}>
        {/* Row 1: Début de période de travail */}
        <Flex justifyContent="space-between">
          <Text fontWeight="bold">Début de période de travail</Text>
          <Text color="brown" fontStyle="italic">
            {contractData.start_period_travail || "ex: 01 octobre 2020"}  {/* Updated */}
          </Text>
        </Flex>

        {/* Row 2: Fin de période */}
        <Flex justifyContent="space-between">
          <Text fontWeight="bold">Fin de période</Text>
          <Text color="brown" fontStyle="italic">
            {contractData.end_period || "ex: 31 octobre 2020"}
          </Text>
        </Flex>

        {/* Row 3: Début du contrat */}
        <Flex justifyContent="space-between">
          <Text fontWeight="bold">Début du contrat</Text>
          <Text color="brown" fontStyle="italic">
            {contractData.start_contract || "ex: 24 août 2020"}
          </Text>
        </Flex>

        {/* Row 4: Date d'ancienneté */}
        <Flex justifyContent="space-between">
          <Text fontWeight="bold">Date d'ancienneté</Text>
          <Text color="brown" fontStyle="italic">
            {contractData.seniority_date || "ex: 24 août 2020"}
          </Text>
        </Flex>

        {/* Row 5: N° de sécurité sociale */}
        <Flex justifyContent="space-between">
          <Text fontWeight="bold">N° de sécurité sociale</Text>
          <Text color="brown" fontStyle="italic">
            {contractData.social_security_number || "XXXXXXXX"}
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
};

export default ContractDetails;
