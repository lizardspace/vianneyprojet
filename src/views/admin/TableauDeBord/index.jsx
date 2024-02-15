import React, { useState } from "react";
import { Box, SimpleGrid, Button } from "@chakra-ui/react";
import VianneyAlertChat from "./components/VianneyAlertChat";
import UserForm from "../carte/components/UserForm";
import TeamScheduleMadeMySelf from "./components/TeamScheduleMadeMySelf";
import AddActionForm from "./components/AddActionForm";
import TeamTimelineAmeliore from "./components/TeamTimelineAmeliore";

export default function Settings() {
  const [showForms, setShowForms] = useState(false); 
  const toggleForms = () => {
    setShowForms(!showForms);
  };
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        mb='20px'
        columns={{ sm: 1, md: 1 }}
        spacing={{ base: "20px", xl: "20px" }}>
        <TeamScheduleMadeMySelf />
        <VianneyAlertChat />
        {showForms && <TeamTimelineAmeliore />}
      </SimpleGrid>
      {showForms && (
        <>
          <UserForm />
          <AddActionForm />
        </>
      )}
      <Button onClick={toggleForms} mt="4">
        {showForms ? "Cacher" : "Montrer"}
      </Button>
    </Box>
  );
}
