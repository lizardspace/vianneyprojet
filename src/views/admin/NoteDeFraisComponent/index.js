// views/admin/NoteDeFraisComponent.jsx
import React from 'react';
import { Box} from '@chakra-ui/react';
import ExpenseForm from './components/ExpenseForm';

const NoteDeFraisComponent = () => {
  return (
    <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
      <ExpenseForm/>
    </Box>
  );
};

export default NoteDeFraisComponent;
