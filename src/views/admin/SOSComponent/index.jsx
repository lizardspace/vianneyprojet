import React, { useState } from "react";
import { Box, Button } from "@chakra-ui/react";
import AccidentDetected from "./components/AccidentDetected";
import SOSAlertsView from "./components/SOSAlertsView";

export default function Settings() {
  const [showAccidentDetected, setShowAccidentDetected] = useState(false);

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SOSAlertsView />
      <Button 
        mt={4} 
        onClick={() => setShowAccidentDetected(!showAccidentDetected)}
        colorScheme="teal"
      >
        {showAccidentDetected ? "Masquer SOS Alerte silencieuse" : "Montrer SOS Alerte silencieuse"}
      </Button>
      {showAccidentDetected && <AccidentDetected />}
    </Box>
  );
}
