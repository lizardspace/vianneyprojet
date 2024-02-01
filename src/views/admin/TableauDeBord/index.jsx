// Chakra imports
import { Box, SimpleGrid } from "@chakra-ui/react";
import React from "react";
import VianneyAlertChat from "./components/VianneyAlertChat";
import UserForm from "../carte/components/UserForm";
import TeamScheduleMadeMySelf from "./components/TeamScheduleMadeMySelf";
import AddActionForm from "./components/AddActionForm";
import TeamTimelineAmeliore from "./components/TeamTimelineAmeliore";

export default function Settings() {
  // Chakra Color Mode
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        mb='20px'
        columns={{ sm: 1, md: 2 }}
        spacing={{ base: "20px", xl: "20px" }}>
        <TeamScheduleMadeMySelf />
        <VianneyAlertChat />
        <TeamTimelineAmeliore/>
      </SimpleGrid>
      <UserForm />
      <AddActionForm />
    </Box>
  );
}
