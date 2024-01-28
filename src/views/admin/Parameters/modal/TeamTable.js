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
  const { selectedEventId } = useEvent(); // Get the selected event_id from the context
  const [teamsData, setTeamsData] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [emailList, setEmailList] = useState('');
  const [isCopied, setIsCopied] = useState(false); // State for tracking if emails are copied

  useEffect(() => {
    async function fetchTeamsData() {
      const { data, error } = await supabase
        .from('vianney_teams')
        .select('*')
        .eq('event_id', selectedEventId); // Filter teams by event_id

      if (error) {
        console.error('Error fetching data:', error.message);
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
    // Generate the email list based on the data in teamsData
    const emails = teamsData.reduce((acc, team) => {
      const teamEmails = team.team_members.map((member) => member.mail);
      return acc.concat(teamEmails);
    }, []);

    setEmailList(emails.join('; ')); // Join emails with semicolon and space
  }, [teamsData]);

  const copyEmailList = () => {
    // Implement your logic to copy the email list here
    navigator.clipboard.writeText(emailList);
    setIsCopied(true); // Set the copied state to true
    // Reset the copied state after a few seconds
    setTimeout(() => {
      setIsCopied(false);
    }, 5000); // 5 seconds
  };

  return (
    <Box p={4}>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Team Name</Th>
            <Th>Members</Th>
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
                      expandedRow === team.id ? 'Collapse' : 'Expand'
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
                      <Th>Mail</Th>
                      <Th>Phone</Th>
                      <Th>Is Leader</Th>
                      <Th>Firstname</Th>
                      <Th>Familyname</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {team.team_members.map((member, index) => (
                      <Tr key={index}>
                        <Td>{member.mail}</Td>
                        <Td>{member.phone}</Td>
                        <Td>{member.isLeader ? 'Yes' : 'No'}</Td>
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
        placeholder="Email List"
        size="sm"
        rows={4}
      />
      <Button
        mt={2}
        colorScheme="teal"
        onClick={copyEmailList}
        isDisabled={isCopied} // Disable the button when emails are copied
      >
        Copy Email List
      </Button>
      {isCopied && (
        <Alert status="success" mt={2}>
          <AlertIcon />
          Mails bien copiés dans le presse-papier
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
