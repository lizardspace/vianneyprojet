import React from "react";
import { Box } from "@chakra-ui/react"; 

import AlertForm from "./components/AlertForm"; 

const AlerteEquipe = () => {
    return (
        <Box pt={{ base: '180px', md: '80px', xl: '80px' }}> 
            <AlertForm />
        </Box>
    );
};

export default AlerteEquipe;
