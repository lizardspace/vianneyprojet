import React from 'react';
import { useTeam } from './../TeamContext'; // Import the useTeam hook
import { Box, Text, Stack, Avatar, Heading, useColorModeValue } from '@chakra-ui/react';

const TeamMembers = () => {
  const { selectedTeam, teamData } = useTeam();
  const textColor = useColorModeValue("secondaryGray.900", "white");

  // Find the selected team data
  const team = teamData.find(team => team.name_of_the_team === selectedTeam);

  // Parse team members from the selected team
  let teamMembers = [];
  if (team && team.team_members) {
    try {
      teamMembers = JSON.parse(team.team_members); // Assuming team_members is a JSON string
    } catch (error) {
      console.error('Error parsing team members JSON:', error);
    }
  }

  return (
    <Box>
      <Heading size="md" mb={4} color={textColor}>Team Members</Heading>
      <Stack>
        {teamMembers.length > 0 ? (
          teamMembers.map((member, index) => (
            <Box key={index} p={5} shadow="md" borderWidth="1px" flex="1" borderRadius="md">
              <Avatar name={member.name} src={member.photo_profile_url} />
              <Text mt={4}>Name: {member.name}</Text>
              <Text>Role: {member.role}</Text>
              {/* Add more member details you wish to display */}
            </Box>
          ))
        ) : (
          <Text>No team members found.</Text>
        )}
      </Stack>
    </Box>
  );
};

export default TeamMembers;
