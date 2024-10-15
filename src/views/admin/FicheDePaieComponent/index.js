// views/admin/FicheDePaieComponent.jsx
import React from 'react';
import { Box} from '@chakra-ui/react';
import EmployerCard from './components/EmployerCard';
import ContractDetails from './components/ContractDetails';
import PaySlip from './PaySlip';

const FicheDePaieComponent = () => {
  return (
    <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
        <PaySlip/>
    </Box>
  );
};

export default FicheDePaieComponent;