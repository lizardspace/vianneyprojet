// views/admin/Form.jsx
import React from 'react';
import { Box } from '@chakra-ui/react';
import EmployerForm from './components/formulaire/EmployerForm';
import EmployeeForm from './components/formulaire/EmployeeForm';
import CompanyInfoForm from './components/formulaire/CompanyInfoForm';
import CompanyAndEmployerForm from './components/formulaire/CompanyAndEmployerForm';

const Form = () => {
  return (
    <Box>
      <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
        <EmployerForm/>  
        <EmployeeForm/>   
        <CompanyInfoForm/> 
        <CompanyAndEmployerForm/>  
      </Box>
    </Box>
  );
};

export default Form;