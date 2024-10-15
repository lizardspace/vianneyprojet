import React from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Grid } from '@chakra-ui/react';

const AcquisPrisSoldeTable: React.FC = () => {
  return (
    <Box p={4}>
      <Grid templateColumns="3fr 1fr" gap={4}>
        {/* Left Table: Acquis, Pris, Solde */}
        <Box>
          <Table variant="simple" size="sm" border="1px solid black">
            <Thead>
              <Tr>
                <Th border="1px solid black" textAlign="center">Acquis</Th>
                <Th border="1px solid black" textAlign="center">Pris</Th>
                <Th border="1px solid black" textAlign="center">Solde</Th>
              </Tr>
            </Thead>
            <Tbody>
              {/* Row: CP N-1 */}
              <Tr>
                <Td border="1px solid black">CP N-1</Td>
                <Td border="1px solid black" textAlign="right" color="brown">"ex: 0,00"</Td>
                <Td border="1px solid black" textAlign="right" color="brown">"ex: 0,00"</Td>
                <Td border="1px solid black" textAlign="right" color="brown">"ex: 0,00"</Td>
              </Tr>

              {/* Row: CP N */}
              <Tr>
                <Td border="1px solid black">CP N</Td>
                <Td border="1px solid black" textAlign="right" color="brown">"ex: 4,70"</Td>
                <Td border="1px solid black" textAlign="right" color="brown">"ex: 4,70"</Td>
                <Td border="1px solid black" textAlign="right" color="brown">"ex: 4,7"</Td>
              </Tr>

              {/* Row: RTT (option) */}
              <Tr>
                <Td border="1px solid black">RTT (option)</Td>
                <Td border="1px solid black" textAlign="right" color="brown">"ex: 0,92"</Td>
                <Td border="1px solid black" textAlign="right" color="brown">"ex: 0,92"</Td>
                <Td border="1px solid black" textAlign="right" color="brown">"ex: 0,92"</Td>
              </Tr>
            </Tbody>
          </Table>
        </Box>

        {/* Right Section: Commentaires */}
        <Box border="1px solid black" width="100%">
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th border="1px solid black" textAlign="left">
                  Commentaires
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td height="100px" border="1px solid black"></Td> {/* Empty space for comments */}
              </Tr>
            </Tbody>
          </Table>
        </Box>
      </Grid>
    </Box>
  );
};

export default AcquisPrisSoldeTable;
