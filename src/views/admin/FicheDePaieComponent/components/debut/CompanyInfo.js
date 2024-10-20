import React, { useEffect, useState } from 'react';
import { Box, Text, Flex } from '@chakra-ui/react';
import { supabase } from './../../../../../supabaseClient';  // Assure-toi que le chemin est correct
import { useEvent } from './../../../../../EventContext';  // Assuming you're using the EventContext to get event_id

const CompanyInfo: React.FC = () => {
  const { selectedEventId } = useEvent();  // Récupère l'ID de l'événement à partir du contexte
  const [companyData, setCompanyData] = useState(null);  // État pour stocker les données de l'entreprise

  // Fonction pour récupérer les données de la base de données
  useEffect(() => {
    const fetchCompanyData = async () => {
      if (!selectedEventId) return;

      const { data, error } = await supabase
        .from('vianney_employers')  // Requête à la table vianney_employers
        .select('*')
        .eq('event_id', selectedEventId)  // Filtrer par l'ID de l'événement
        .order('created_at', { ascending: false })  // Trier par la date de création
        .limit(1);  // Récupérer l'entrée la plus récente

      if (error) {
        console.error('Error fetching company data:', error.message);
      } else if (data && data.length > 0) {
        setCompanyData(data[0]);  // Stocker les données de l'entreprise
      }
    };

    fetchCompanyData();
  }, [selectedEventId]);

  if (!companyData) {
    return <Text>Loading...</Text>;  // Affiche un texte de chargement pendant la récupération des données
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
        {/* Row 1: N° de SIRET */}
        <Flex justifyContent="space-between">
          <Text fontWeight="bold">N° de SIRET</Text>
          <Text color="brown" fontStyle="italic">
            {companyData.siret || "ex : 054312354323"}
          </Text>
        </Flex>

        {/* Row 2: Code APE */}
        <Flex justifyContent="space-between">
          <Text fontWeight="bold">Code APE</Text>
          <Text color="brown">
            {companyData.ape_code || "6534Z"}
          </Text>
        </Flex>

        {/* Row 3: Convention collective */}
        <Flex justifyContent="space-between" alignItems="flex-start">
          <Text fontWeight="bold">Convention collective</Text>
          <Text color="brown" fontStyle="italic" textAlign="right">
            {companyData.collective_agreement || "ex: bureaux d'études techniques, cabinets d'ingénieurs-conseils et sociétés de conseil (syntec)"}
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
};

export default CompanyInfo;
