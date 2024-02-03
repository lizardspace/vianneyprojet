import React from 'react';
import { useTeam } from './../TeamContext';
import { Box, Text, VStack } from '@chakra-ui/react';

const TeamMembersDisplay = () => {
  const { teamMembers } = useTeam(); // Use the custom hook to access the context

  if (!teamMembers.length) return null; // Do not render if no team members

  return (
    <Box p={5} shadow="md" borderWidth="1px">
      <VStack align="stretch">
        {teamMembers.map((member, index) => (
          <Box key={index} p={2}>
            <Text fontWeight="bold">{member.firstname} {member.familyname}</Text>
            <Text>Email: {member.mail}</Text>
            <Text>Phone: {member.phone}</Text>
            {member.isLeader && <Text fontWeight="bold" color="green.500">Team Leader</Text>}
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default TeamMembersDisplay;
