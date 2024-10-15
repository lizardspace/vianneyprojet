import React from 'react';
import { Box, Text } from '@chakra-ui/react';

const PaySlipNotice: React.FC = () => {
  return (
    <Box p={4} textAlign="center">
      <Text fontSize="sm" color="gray.700">
        Dans votre intérêt, et pour vous aider à faire valoir vos droits, conservez ce bulletin de paie sans limitation de durée.
        Pour la définition des termes employés, se reporter au site Internet{" "}
        <Text as="span" fontWeight="bold" color="blue.600">
          www.service-public.fr
        </Text>{" "}
        rubrique cotisations sociales.
      </Text>
    </Box>
  );
};

export default PaySlipNotice;
