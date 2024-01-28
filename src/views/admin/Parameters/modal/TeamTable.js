import React, { useState, useEffect } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Box } from '@chakra-ui/react';
import { supabase } from '../../../../supabaseClient'; // Import your Supabase configuration here

const TeamTable = () => {
  const [teamsData, setTeamsData] = useState([]);

  useEffect(() => {
    async function fetchTeamsData() {
      const { data, error } = await supabase
        .from('vianney_teams')
        .select('*'); // You can specify the columns you need here

      if (error) {
        console.error('Error fetching data:', error.message);
      } else {
        setTeamsData(data);
      }
    }

    fetchTeamsData();
  }, []);

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
            <Tr key={team.id}>
              <Td>{team.name_of_the_team}</Td>
              <Td>
                <ul>
                  {team.team_members.map((member, index) => (
                    <li key={index}>
                      {`${member.firstname} ${member.familyname}, ${member.mail}, ${member.phone}, isLeader: ${member.isLeader ? 'Yes' : 'No'}`}
                    </li>
                  ))}
                </ul>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default TeamTable;
