import React, { useState } from 'react';
import { useTeam } from './../TeamContext';
import { Box, Text, VStack, Button } from '@chakra-ui/react';

const TeamMembersDisplay = () => {
  const { teamMembers } = useTeam(); // Use the custom hook to access the context

  const [showNonLeaders, setShowNonLeaders] = useState(false);

  if (!teamMembers.length) return null; // Do not render if no team members

  // Separate leaders from non-leader members
  const leaders = teamMembers.filter(member => member.isLeader);
  const nonLeaders = teamMembers.filter(member => !member.isLeader);

  return (
    <Box p={5} shadow="md" borderWidth="1px">
      <VStack align="stretch">
        {/* Render leaders with bold heading */}
        {leaders.length > 0 && (
          <>
            <Text fontWeight="bold" color="green.500">Chefs d'équipe :</Text>
            {leaders.map((leader, index) => (
              <Box key={index} >
                <Text fontWeight="bold">{leader.firstname} {leader.familyname}</Text>
                {showNonLeaders && leaders.length > 0 && (
                  <>
                    <Text>Email: {leader.mail}</Text>
                    <Text>Téléphone: {leader.phone}</Text>
                  </>)}
              </Box>
            ))}
          </>
        )}
        {/* Render non-leader members with bold heading */}
        {showNonLeaders && leaders.length > 0 && (
          <>
            <Text fontWeight="bold" color="blue.500">Autres membres d'équipe :</Text>
            {nonLeaders.map((member, index) => (
              <Box key={index} >
                <Text fontWeight="bold">{member.firstname} {member.familyname}</Text>
                <Text>Email: {member.mail}</Text>
                <Text>Téléphone: {member.phone}</Text>
              </Box>
            ))}
          </>
        )}
        {leaders.length > 0 && (
          <Button onClick={() => setShowNonLeaders(!showNonLeaders)} size="sm" colorScheme="blue">
            {showNonLeaders ? "Masquer les détails de l'équipe" : "Afficher les détails de l'équipe"}
          </Button>
        )}
      </VStack>
    </Box>
  );
};

export default TeamMembersDisplay;
