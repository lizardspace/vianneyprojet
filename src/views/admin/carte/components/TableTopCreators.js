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
        <Flex
          align={{ sm: "flex-start", lg: "center" }}
          justify='space-between'
          w='100%'
          px='22px'
          pb='20px'
          mb='10px'
          boxShadow='0px 40px 58px -20px rgba(112, 144, 176, 0.26)'>
          <Heading me='auto'
            color={textColor}
            fontSize='2xl'
            fontWeight='700'
            lineHeight='100%'
            mb="20px">
            Les équipiers en intervention
          </Heading>
          <Button variant='action' onClick={handleToggleShowAll}>
            {showAll ? 'Voir moins' : 'Les voir tous'}
          </Button>
        </Flex>
        <Flex
          direction='column'
          overflowY={showAll ? 'scroll' : 'hidden'}
          maxH={showAll ? '300px' : 'auto'}>
          <EquipiersTable showAll={showAll} />
        </Flex>
      </Flex>
    </>
  );
}

export default TopCreatorTable;
