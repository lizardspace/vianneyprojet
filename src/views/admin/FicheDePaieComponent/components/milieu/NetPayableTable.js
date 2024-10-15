import React from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Text, Grid } from '@chakra-ui/react';

const NetPayableTable: React.FC = () => {
  return (
    <Box p={4}>
      <Grid templateColumns="3fr 1fr" gap={4}>
        {/* Main Table Section */}
        <Box>
          <Table variant="simple" size="sm" border="1px solid black">
            <Thead>
              <Tr>
                <Th border="1px solid black" textAlign="left" colSpan={4}>
                  NET À PAYER AVANT IMPÔT SUR LE REVENU
                </Th>
                <Th border="1px solid black" textAlign="right">
                  <Text color="brown" fontWeight="bold" fontSize="lg">"ex: 2345€"</Text>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {/* Row: Impôt sur le revenu */}
              <Tr>
                <Td border="1px solid black" width="50%">Impôt sur le revenu</Td>
                <Td border="1px solid black" width="15%">Base</Td>
                <Td border="1px solid black" width="15%">Taux personnalisé</Td>
                <Td border="1px solid black" width="15%">Montant</Td>
              </Tr>

              {/* Row: Impôt sur le revenu prélevé à la source */}
              <Tr>
                <Td border="1px solid black" colSpan={3}>Impôt sur le revenu prélevé à la source (5)</Td>
                <Td border="1px solid black"></Td>
              </Tr>

              {/* Row: NET PAYÉ */}
              <Tr>
                <Td border="1px solid black" colSpan={4} textAlign="center">
                  <Text fontWeight="bold">NET PAYÉ (1) + (2) - (3) - (4) - (5) - (6) EN EUROS</Text>
                  <Text color="gray.500" fontSize="sm">
                    "Virement, espèce, chèque ou paiement par un autre établissement"
                  </Text>
                </Td>
                <Td border="1px solid black" textAlign="right">
                  <Text color="brown" fontWeight="bold" fontSize="lg">"ex: 2235€"</Text>
                </Td>
              </Tr>

              {/* Row: Date de paiement */}
              <Tr>
                <Td border="1px solid black" colSpan={4}>DATE DE PAIEMENT</Td>
                <Td border="1px solid black" textAlign="right">
                  <Text color="brown" fontWeight="bold">"ex: le 28 octobre 2020"</Text>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </Box>

        {/* Right Section "Du Mois" */}
        <Box border="1px solid black" width="100%">
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th border="1px solid black" textAlign="center">
                  DU MOIS
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td border="1px solid black">Dont évolution de la rémunération liée à la suppression des cotisations chômage et maladie</Td>
                <Td border="1px solid black" textAlign="right" color="red">X€</Td>
              </Tr>
              <Tr>
                <Td border="1px solid black">Total versé par l'employeur</Td>
                <Td border="1px solid black" textAlign="right" color="red">X€</Td>
              </Tr>
              <Tr>
                <Td border="1px solid black">Allégements des cotisations employeur</Td>
                <Td border="1px solid black" textAlign="right" color="red">X€</Td>
              </Tr>
              <Tr>
                <Td border="1px solid black">Allégements des cotisations employeur</Td>
                <Td border="1px solid black" textAlign="right" color="red">X€</Td>
              </Tr>
            </Tbody>
          </Table>
        </Box>
      </Grid>
    </Box>
  );
};

export default NetPayableTable;
