// views/admin/FicheDePaieComponent.jsx
import React from 'react';
import { Box} from '@chakra-ui/react';
import PaySlip from './PaySlip';
import SalaryTable from './components/milieu/SalaryTable';
import NetPayableTable from './components/milieu/NetPayableTable';

const FicheDePaieComponent = () => {
  return (
    <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
        <PaySlip/>
        <SalaryTable/>
        <NetPayableTable/>
    </Box>
  );
};

export default FicheDePaieComponent;