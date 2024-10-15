// views/admin/Form.jsx
import React from 'react';
import { Box } from '@chakra-ui/react';
import EmployerForm from './components/formulaire/EmployerForm';

const Form = () => {
  return (
    <Box>
      <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
        <EmployerForm/>        
      </Box>
    </Box>
  );
};

export default Form;