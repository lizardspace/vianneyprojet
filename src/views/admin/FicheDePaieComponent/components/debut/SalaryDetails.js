import React, { useEffect, useState } from 'react';
import { Box, Text, Flex } from '@chakra-ui/react';
import { supabase } from './../../../../../supabaseClient';  // Assure-toi que le chemin est correct

const SalaryDetails: React.FC = () => {
  const [salaryData, setSalaryData] = useState(null);  // State pour stocker les données de salaire

  // Fetch salary data from Supabase
  useEffect(() => {
    const fetchSalaryData = async () => {
      const { data, error } = await supabase
        .from('vianney_fiche_de_paye_employees')
        .select('minimum_coefficient, remuneration_totale')
        .order('created_at', { ascending: false })  // Obtenir la dernière entrée
        .limit(1);

      if (error) {
        console.error('Erreur lors de la récupération des données:', error.message);
      } else if (data && data.length > 0) {
        setSalaryData(data[0]);  // Définir les données les plus récentes
      }
    };

    fetchSalaryData();
  }, []);

  if (!salaryData) {
    return <Text>Chargement...</Text>;  // Afficher un texte de chargement pendant la récupération des données
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
        {/* Row 1: Minimum Coefficient */}
        <Flex justifyContent="space-between">
          <Text fontWeight="bold">Minimum coefficient</Text>
          <Text color="brown" fontStyle="italic">
            {salaryData.minimum_coefficient ? `${salaryData.minimum_coefficient} €` : "ex: 2.543 €"}
          </Text>
        </Flex>

        {/* Row 2: Rémunération totale du mois */}
        <Flex justifyContent="space-between">
          <Text fontWeight="bold">Rémunération totale du mois</Text>
          <Text color="brown" fontStyle="italic">
            {salaryData.remuneration_totale ? `${salaryData.remuneration_totale} €` : "ex: 4.600 €"}
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
};

export default SalaryDetails;
