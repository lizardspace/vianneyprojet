import React from 'react';
import { Box, Text, Grid } from '@chakra-ui/react';
import EmployerCard from './components/EmployerCard';
import ContractDetails from './components/ContractDetails';
import CompanyInfo from './components/CompanyInfo';
import EmployeeInfo from './components/EmployeeInfo';
import JobClassification from './components/JobClassification';
import SalaryDetails from './components/SalaryDetails';
import ContractualSalaryDetails from './components/ContractualSalaryDetails';

const PaySlip: React.FC = () => {
  return (
    <Box p={8} bg="white">
      {/* Pay Slip Header */}
      <Text fontSize="2xl" textAlign="center" fontWeight="bold" mb={2}>
        BULLETIN DE PAIE
      </Text>
      <Text fontSize="md" textAlign="center" mb={8}>
        EN EUROS
      </Text>

      {/* Section 1: Employer and Contract Details */}
      <Grid templateColumns="repeat(2, 1fr)" gap={6}>
        {/* Employer Information */}
        <EmployerCard />
        
        {/* Contract Details */}
        <ContractDetails />
      </Grid>

      {/* Section 2: Company Info and Employee Info */}
      <Grid templateColumns="repeat(2, 1fr)" gap={6} mt={6}>
        {/* Company Info */}
        <CompanyInfo />
        
        {/* Employee Info */}
        <EmployeeInfo />
      </Grid>

      {/* Section 3: Job Classification, Salary Breakdown */}
      <Grid templateColumns="repeat(3, 1fr)" gap={6} mt={6}>
        {/* Job Classification */}
        <JobClassification />

        {/* Salary Details */}
        <SalaryDetails />

        {/* Contractual Salary Details */}
        <ContractualSalaryDetails />
      </Grid>
    </Box>
  );
};

export default PaySlip;
