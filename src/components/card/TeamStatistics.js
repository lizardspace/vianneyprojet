import React from "react";
import {
  Flex,
  Stat,
  StatNumber,
  StatLabel,
  useColorModeValue,
  Icon,
} from "@chakra-ui/react";
import IconBox from "components/icons/IconBox";
import Card from "components/card/Card.js";
import { FcManager } from "react-icons/fc";

export default function TeamStatistics(props) {
  const {
    teamName,
    teamColor,
    teamSpeciality,
    teamLeader,
    teamMembersCount,
  } = props;

  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const textColor = useColorModeValue("secondaryGray.900", "white");

  return (
    <Card py="15px">
      <Flex
        my="auto"
        h="100%"
        align={{ base: "center", xl: "start" }}
        justify={{ base: "center", xl: "center" }}
      >
        <IconBox
          w="56px"
          h="56px"
          bg={boxBg}
          icon={
            <Icon w="32px" h="32px" as={FcManager} color={teamColor} /> // Use an appropriate team icon
          }
        />
        <Stat my="auto" ms="10px">
          <StatNumber
            color={textColor}
            fontSize={{
              base: "xl",
            }}
          >
            {teamName}
          </StatNumber>
          <StatLabel color={textColor} fontSize="md">
            Spécialité: {teamSpeciality}
          </StatLabel>
          <StatLabel color={textColor} fontSize="md">
            Leader: {teamLeader}
          </StatLabel>
          <StatLabel color={textColor} fontSize="md">
            Membres: {teamMembersCount}
          </StatLabel>
        </Stat>
      </Flex>
    </Card>
  );
}
