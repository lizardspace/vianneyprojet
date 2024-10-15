import React from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Text } from '@chakra-ui/react';

const SalaryTable: React.FC = () => {
  return (
    <Box p={4}>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th border="1px solid black" textAlign="center">Désignation</Th>
            <Th border="1px solid black" textAlign="center">Base</Th>
            <Th border="1px solid black" textAlign="center" colSpan={2}>Part employé</Th>
            <Th border="1px solid black" textAlign="center">Employeur</Th>
          </Tr>
          <Tr>
            <Th></Th>
            <Th></Th>
            <Th border="1px solid black" textAlign="center">Taux ou %</Th>
            <Th border="1px solid black" textAlign="center">Montant</Th>
            <Th border="1px solid black" textAlign="center">Montant</Th>
          </Tr>
        </Thead>
        <Tbody>
          {/* Row: Salaire de base */}
          <Tr>
            <Td border="1px solid black">
              <Text fontWeight="bold">Salaire de base</Text>
              <Text color="gray.500" fontSize="sm">
                "Heures supplémentaire contractuelle (option)"
              </Text>
              <Text color="gray.500" fontSize="sm">
                "Prime (option)"
              </Text>
            </Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
          </Tr>

          {/* Row: Rémunération brute */}
          <Tr>
            <Td border="1px solid black" fontWeight="bold">Rémunération brute (1)</Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
          </Tr>
        </Tbody>
      </Table>
    </Box>
  );
};

export default SalaryTable;
