import React from "react";
import { Box, Flex, Stack } from "@chakra-ui/react";
import Brand from "components/sidebar/components/Brand";
import Links from "components/sidebar/components/Links";
import SidebarCard from "components/sidebar/components/SidebarCard";

function SidebarContent(props) {
  const { routes } = props;
  return (
    <Flex direction="column" height="100%" pt="25px" px="16px" backgroundColor="#465f8b" flex="1">
      <Brand />
      <Stack direction="column" mb="auto" mt="8px" flex="1">
        <Box ps="20px" pe={{ md: "16px", "2xl": "1px" }}>
          <Links routes={routes} />
        </Box>
      </Stack>
      <Box mt="60px" mb="40px" borderRadius="30px">
        <SidebarCard />
      </Box>
    </Flex>
  );
}

export default SidebarContent;
