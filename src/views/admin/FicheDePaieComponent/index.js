// views/admin/FicheDePaieComponent.jsx
import React from 'react';
import { Box} from '@chakra-ui/react';
import PaySlip from './PaySlip';
import SalaryTable from './components/milieu/SalaryTable';
import NetPayableTable from './components/milieu/NetPayableTable';
import AcquisPrisSoldeTable from './components/fin/AcquisPrisSoldeTable';
import PaySlipNotice from './components/fin/PaySlipNotice';

const FicheDePaieComponent = () => {
  return (
    <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
        <PaySlip/>
        <SalaryTable/>
        <NetPayableTable/>
        <AcquisPrisSoldeTable/>
        <PaySlipNotice/>
    </Box>
  );
};

export default FicheDePaieComponent;