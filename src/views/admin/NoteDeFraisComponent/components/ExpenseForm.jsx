import React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Box,
  Button,
  VStack,
  HStack,
  Text
} from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import Etape1 from './etapes/Etape1';
import Etape2 from './etapes/Etape2';
import Etape3 from './etapes/Etape3';
import Etape4 from './etapes/Etape4';

const CustomAccordionButton = ({ number, title }) => (
  <HStack width="100%" justifyContent="space-between">
    <HStack>
      <Box as="span" display="inline-block" width="24px" height="24px" bg="gray.100" borderRadius="full" textAlign="center" lineHeight="24px">
        {number}
      </Box>
      <Box flex="1" textAlign="left">
        {title}
      </Box>
    </HStack>
    <Button size="sm" leftIcon={<EditIcon />} variant="outline">
      Modifier
    </Button>
  </HStack>
);

const ExpenseForm = () => {
  return (
    <Accordion allowToggle>
      <AccordionItem>
        <h2>
          <AccordionButton as={Box}>
            <CustomAccordionButton number="1" title="Identité du bénévole" />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>

          <Etape1 />

        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <h2>
          <AccordionButton as={Box}>
            <CustomAccordionButton number="2" title="Véhicule utilisé" />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          <Etape2 />
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <h2>
          <AccordionButton as={Box}>
            <CustomAccordionButton number="3" title="Remboursement des frais kilométriques" />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
            <Etape3/>
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <h2>
          <AccordionButton as={Box}>
            <CustomAccordionButton number="4" title="Remboursement de frais" />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          <Etape4/>
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <h2>
          <AccordionButton as={Box}>
            <CustomAccordionButton number="5" title="Récapitulatif" />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default ExpenseForm;
