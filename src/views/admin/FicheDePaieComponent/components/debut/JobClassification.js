import React, { useEffect, useState } from 'react';
import { Box, Text, Flex } from '@chakra-ui/react';
import { supabase } from './../../../../../supabaseClient';  // Assure-toi que le chemin est correct

const JobClassification: React.FC = () => {
  const [jobData, setJobData] = useState(null);  // State pour stocker les données

  // Fetch job classification data from Supabase
  useEffect(() => {
    const fetchJobData = async () => {
      const { data, error } = await supabase
        .from('vianney_fiche_de_paye_employees')
        .select('classification, categorie, emploi')
        .order('created_at', { ascending: false })  // Obtenir la dernière entrée
        .limit(1);

      if (error) {
        console.error('Erreur lors de la récupération des données:', error.message);
      } else if (data && data.length > 0) {
        setJobData(data[0]);  // Définir les données les plus récentes
      }
    };

    fetchJobData();
  }, []);

  if (!jobData) {
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
        {/* Row 1: Classification */}
        <Flex justifyContent="space-between">
          <Text fontWeight="bold">Classification</Text>
          <Text color="brown" fontStyle="italic">
            {jobData.classification || "ex: salarié-cadre"}
          </Text>
        </Flex>

        {/* Row 2: Catégorie */}
        <Flex justifyContent="space-between">
          <Text fontWeight="bold">Catégorie</Text>
          <Text color="brown" fontStyle="italic">
            {jobData.categorie || "ex: ingénieurs et cadres - 130 - 2.2"}
          </Text>
        </Flex>

        {/* Row 3: Emploi */}
        <Flex justifyContent="space-between">
          <Text fontWeight="bold">Emploi</Text>
          <Text color="brown" fontStyle="italic">
            {jobData.emploi || "ex: juriste"}
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
};

export default JobClassification;
