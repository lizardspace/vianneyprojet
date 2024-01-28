import React, { useState, useEffect } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Collapse,
  IconButton,
  Textarea,
  Button,
  Alert,
  AlertIcon,
  CloseButton,
} from '@chakra-ui/react';
import { supabase } from '../../../../supabaseClient'; // Import your Supabase configuration here
import { useEvent } from './../../../../EventContext'; // Import the useEvent hook
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';

const TeamTable = () => {
  const { selectedEventId } = useEvent(); // Obtenir l'event_id sélectionné depuis le contexte
  const [teamsData, setTeamsData] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [emailList, setEmailList] = useState('');
  const [isCopied, setIsCopied] = useState(false); // État pour suivre si les e-mails sont copiés

  useEffect(() => {
    async function fetchTeamsData() {
      const { data, error } = await supabase
        .from('vianney_teams')
        .select('*')
        .eq('event_id', selectedEventId); // Filtrer les équipes par event_id

      if (error) {
        console.error('Erreur lors de la récupération des données :', error.message);
      } else {
        setTeamsData(data);
      }
    }

    if (selectedEventId) {
      fetchTeamsData();
    }
  }, [selectedEventId]);

  const toggleRowExpansion = (rowId) => {
    if (expandedRow === rowId) {
      setExpandedRow(null);
    } else {
      setExpandedRow(rowId);
    }
  };

  useEffect(() => {
    // Générer la liste des e-mails en fonction des données dans teamsData
    const emails = teamsData.reduce((acc, team) => {
      const teamEmails = team.team_members.map((member) => member.mail);
      return acc.concat(teamEmails);
    }, []);

    setEmailList(emails.join('; ')); // Joindre les e-mails avec un point-virgule et un espace
  }, [teamsData]);

  const copyEmailList = () => {
    // Implémentez votre logique pour copier la liste des e-mails ici
    navigator.clipboard.writeText(emailList);
    setIsCopied(true); // Définir l'état de copie à true
    // Réinitialisez l'état de copie après quelques secondes
    setTimeout(() => {
      setIsCopied(false);
    }, 5000); // 5 secondes
  };

  return (
    <Box p={4}>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Nom de l'équipe</Th>
            <Th>Membres</Th>
          </Tr>
        </Thead>
        <Tbody>
          {teamsData.map((team) => (
            <React.Fragment key={team.id}>
              <Tr onClick={() => toggleRowExpansion(team.id)}>
                <Td>{team.name_of_the_team}</Td>
                <Td>
                  <IconButton
                    aria-label={
                      expandedRow === team.id ? 'Réduire' : 'Développer'
                    }
                    icon={
                      expandedRow === team.id ? (
                        <ChevronUpIcon />
                      ) : (
                        <ChevronDownIcon />
                      )
                    }
                    variant="outline"
                    size="sm"
                    colorScheme="teal"
                  />
                </Td>
              </Tr>
              <Collapse in={expandedRow === team.id}>
                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr>
                      <Th>E-mail</Th>
                      <Th>Téléphone</Th>
                      <Th>Est Leader</Th>
                      <Th>Prénom</Th>
                      <Th>Nom de famille</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {team.team_members.map((member, index) => (
                      <Tr key={index}>
                        <Td>{member.mail}</Td>
                        <Td>{member.phone}</Td>
                        <Td>{member.isLeader ? 'Oui' : 'Non'}</Td>
                        <Td>{member.firstname}</Td>
                        <Td>{member.familyname}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Collapse>
            </React.Fragment>
          ))}
        </Tbody>
      </Table>
      <Textarea
        value={emailList}
        readOnly
        mt={4}
        placeholder="Liste des e-mails"
        size="sm"
        rows={4}
      />
      <Button
        mt={2}
        colorScheme="teal"
        onClick={copyEmailList}
        isDisabled={isCopied} // Désactiver le bouton lorsque les e-mails sont copiés
      >
        Copier la liste des e-mails
      </Button>
      {isCopied && (
        <Alert status="success" mt={2}>
          <AlertIcon />
          E-mails bien copiés dans le presse-papier
          <CloseButton
            onClick={() => setIsCopied(false)}
            position="absolute"
            right="8px"
            top="8px"
          />
        </Alert>
      )}
    </Box>
  );
};

export default TeamTable;
