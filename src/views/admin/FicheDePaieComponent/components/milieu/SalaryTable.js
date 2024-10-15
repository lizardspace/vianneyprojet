import React from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Text } from '@chakra-ui/react';

const SalaryTable: React.FC = () => {
  return (
    <Box p={4}>
      <Table variant="simple">
        <Thead>
          <Tr>
            {/* Désignation column spans 2 rows */}
            <Th border="1px solid black" textAlign="center" rowSpan={2}>
              Désignation
            </Th>
            {/* Base column spans 2 rows */}
            <Th border="1px solid black" textAlign="center" rowSpan={2}>
              Base
            </Th>
            {/* Part employé column spans 2 columns */}
            <Th border="1px solid black" textAlign="center" colSpan={2}>
              Part employé
            </Th>
            {/* Empty column without border */}
            <Th textAlign="center" rowSpan={2}></Th>
            {/* Employeur column spans 1 row */}
            <Th border="1px solid black" textAlign="center" rowSpan={2}>
              Employeur
            </Th>
          </Tr>
          <Tr>
            <Th border="1px solid black" textAlign="center">Taux ou %</Th>
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
            <Td></Td> {/* Empty column without border */}
            <Td border="1px solid black"></Td>
          </Tr>

          {/* Row: Rémunération brute */}
          <Tr>
            <Td border="1px solid black" fontWeight="bold">Rémunération brute (1)</Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
            <Td></Td> {/* Empty column without border */}
            <Td border="1px solid black"></Td>
          </Tr>

          {/* Additional rows for Santé and other sections */}
          <Tr>
            <Td border="1px solid black" fontWeight="bold">Santé</Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
            <Td></Td> {/* Empty column without border */}
            <Td border="1px solid black"></Td>
          </Tr>
          <Tr>
            <Td border="1px solid black">Assurance maladie</Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
            <Td></Td> {/* Empty column without border */}
            <Td border="1px solid black"></Td>
          </Tr>
          {/* Continue with other rows... */}
        </Tbody>
      </Table>
    </Box>
  );
};

export default SalaryTable;
