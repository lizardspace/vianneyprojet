// views/admin/Form.jsx
import React from 'react';
import { Box } from '@chakra-ui/react';
import EmployerForm from './components/formulaire/EmployerForm';
import EmployeeForm from './components/formulaire/EmployeeForm';

const Form = () => {
  return (
    <Box>
      <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
        <EmployerForm/>  
        <EmployeeForm/>      
      </Box>
    </Box>
  );
};

export default Form;