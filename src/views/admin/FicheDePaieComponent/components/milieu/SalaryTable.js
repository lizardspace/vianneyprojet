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

          {/* Santé Section */}
          <Tr>
            <Td border="1px solid black" fontWeight="bold">Santé</Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
            <Td></Td> {/* Empty column */}
            <Td border="1px solid black"></Td>
          </Tr>
          <Tr>
            <Td border="1px solid black">Assurance maladie</Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
            <Td></Td> {/* Empty column */}
            <Td border="1px solid black"></Td>
          </Tr>
          <Tr>
            <Td border="1px solid black">Complément d'assurance maladie</Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
            <Td></Td> {/* Empty column */}
            <Td border="1px solid black"></Td>
          </Tr>
          <Tr>
            <Td border="1px solid black">Mutuelle I Forfait</Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
            <Td></Td> {/* Empty column */}
            <Td border="1px solid black"></Td>
          </Tr>
          <Tr>
            <Td border="1px solid black">Prévoyance I Tranche A (obligatoire pour les cadres, option pour les non cadres)</Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
            <Td></Td> {/* Empty column */}
            <Td border="1px solid black"></Td>
          </Tr>
          <Tr>
            <Td border="1px solid black">Prévoyance I Tranche B (obligatoire pour les cadres, option pour les non cadres)</Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
            <Td></Td> {/* Empty column */}
            <Td border="1px solid black"></Td>
          </Tr>

          {/* Accidents du travail Section */}
          <Tr>
            <Td border="1px solid black" fontWeight="bold">
              Accidents du travail - Maladies professionnelles
            </Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
            <Td></Td> {/* Empty column */}
            <Td border="1px solid black"></Td>
          </Tr>

          {/* Retraite Section */}
          <Tr>
            <Td border="1px solid black" fontWeight="bold">Retraite</Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
            <Td></Td> {/* Empty column */}
            <Td border="1px solid black"></Td>
          </Tr>
          <Tr>
            <Td border="1px solid black">Sécurité sociale plafonnée</Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
            <Td></Td> {/* Empty column */}
            <Td border="1px solid black"></Td>
          </Tr>
          <Tr>
            <Td border="1px solid black">Sécurité sociale déplafonnée</Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
            <Td></Td> {/* Empty column */}
            <Td border="1px solid black"></Td>
          </Tr>
          <Tr>
            <Td border="1px solid black">Complémentaire I Tranche 1</Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
            <Td></Td> {/* Empty column */}
            <Td border="1px solid black"></Td>
          </Tr>
          <Tr>
            <Td border="1px solid black">Complémentaire I Tranche 2</Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
            <Td></Td> {/* Empty column */}
            <Td border="1px solid black"></Td>
          </Tr>
          <Tr>
            <Td border="1px solid black">Contribution d'Equilibre Technique</Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
            <Td></Td> {/* Empty column */}
            <Td border="1px solid black"></Td>
          </Tr>

          {/* Famille Section */}
          <Tr>
            <Td border="1px solid black" fontWeight="bold">Famille</Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
            <Td></Td> {/* Empty column */}
            <Td border="1px solid black"></Td>
          </Tr>
          <Tr>
            <Td border="1px solid black">Assurance chômage</Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
            <Td></Td> {/* Empty column */}
            <Td border="1px solid black"></Td>
          </Tr>
          <Tr>
            <Td border="1px solid black">Chômage</Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
            <Td></Td> {/* Empty column */}
            <Td border="1px solid black"></Td>
          </Tr>
          <Tr>
            <Td border="1px solid black">APEC (cadre)</Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
            <Td></Td> {/* Empty column */}
            <Td border="1px solid black"></Td>
          </Tr>

          {/* Autres contributions due by employeur */}
          <Tr>
            <Td border="1px solid black" fontWeight="bold">Autres contributions dues par l'employeur</Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
            <Td></Td> {/* Empty column */}
            <Td border="1px solid black"></Td>
          </Tr>
          <Tr>
            <Td border="1px solid black">CSG déductible de l'impôt sur le revenu</Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
            <Td></Td> {/* Empty column */}
            <Td border="1px solid black"></Td>
          </Tr>
          <Tr>
            <Td border="1px solid black">CSG/CRDS non déductible de l'impôt sur le revenu</Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
            <Td></Td> {/* Empty column */}
            <Td border="1px solid black"></Td>
          </Tr>
          <Tr>
            <Td border="1px solid black">CSG/CRDS 9,7% non déductible</Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
            <Td></Td> {/* Empty column */}
            <Td border="1px solid black"></Td>
          </Tr>
          <Tr>
            <Td border="1px solid black">Réduction salariale sur heures supplémentaires</Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
            <Td></Td> {/* Empty column */}
            <Td border="1px solid black"></Td>
          </Tr>

          {/* Total Contributions Section */}
          <Tr>
            <Td border="1px solid black" fontWeight="bold">TOTAL COTISATIONS ET CONTRIBUTIONS SALARIALES (4)</Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
            <Td></Td>
            <Td border="1px solid black"></Td>
          </Tr>
          <Tr>
            <Td border="1px solid black" fontWeight="bold">TOTAL COTISATIONS ET CONTRIBUTIONS PATRONALES</Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
            <Td></Td>
            <Td border="1px solid black"></Td>
          </Tr>

          {/* Other sections */}
          <Tr>
            <Td border="1px solid black">Frais transport public (option)</Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
            <Td></Td> {/* Empty column */}
            <Td border="1px solid black"></Td>
          </Tr>
          <Tr>
            <Td border="1px solid black" fontWeight="bold">Indemnités non soumises (2)</Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
            <Td></Td>
            <Td border="1px solid black"></Td>
          </Tr>
          <Tr>
            <Td border="1px solid black">Autres retenues (3)</Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
            <Td></Td> {/* Empty column */}
            <Td border="1px solid black"></Td>
          </Tr>

          {/* Montant net social */}
          <Tr>
            <Td border="1px solid black" fontWeight="bold">Montant net social</Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
            <Td border="1px solid black"></Td>
            <Td></Td>
            <Td border="1px solid black"></Td>
          </Tr>
        </Tbody>
      </Table>
    </Box>
  );
};

export default SalaryTable;
