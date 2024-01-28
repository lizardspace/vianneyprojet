import React, { useState } from "react";
import {
  Button,
  Flex,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";
import EquipiersTable from "./EquipiersTable";

function TopCreatorTable(props) {
  const [showAll, setShowAll] = useState(false);
  const textColor = useColorModeValue("navy.700", "white");

  const handleToggleShowAll = () => {
    setShowAll(!showAll);
  };

  return (
    <>
      <Flex
        direction='column'
        w='100%'
        overflowX={{ sm: "scroll", lg: "hidden" }}>
        <Heading me='auto'
          color={textColor}
          fontSize='2xl'
          fontWeight='700'
          lineHeight='100%'
          mb="20px">
          Les équipiers en intervention
        </Heading>
      </Flex>
      <Flex
        direction='column'

        maxH={showAll ? '300px' : 'auto'}>
        <EquipiersTable showAll={showAll} />
        <Button variant='action' onClick={handleToggleShowAll}>
          {showAll ? 'Voir moins' : 'Voir tout le monde'}
        </Button>
      </Flex>
    </>
  );
}

export default TopCreatorTable;
