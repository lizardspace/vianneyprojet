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
  Text,
} from '@chakra-ui/react';
import { supabase } from '../../../../supabaseClient'; // Import your Supabase configuration here
import { useEvent } from './../../../../EventContext'; // Import the useEvent hook
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';

const TeamTable = () => {
  const { selectedEventId } = useEvent(); // Get the selected event_id from the context
  const [teamsData, setTeamsData] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);

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
                    </Tr>
                  </Thead>
                  <Tbody>
                    {team.team_members.map((member, index) => (
                      <Tr key={index}>
                        <Td>{member.mail}</Td>
                        <Td>{member.phone}</Td>
                        <Td>{member.isLeader ? 'Yes' : 'No'}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Collapse>
            </React.Fragment>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default TeamTable;
