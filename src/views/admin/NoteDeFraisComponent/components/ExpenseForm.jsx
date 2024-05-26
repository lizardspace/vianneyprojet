import React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  VStack,
  HStack,
  Text
} from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';

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
          <VStack>
            <FormControl>
              <FormLabel>Nom</FormLabel>
              <Input placeholder="Nom du bénévole" />
            </FormControl>
          </VStack>
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <h2>
          <AccordionButton as={Box}>
            <CustomAccordionButton number="2" title="Véhicule utilisé" />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          <VStack>
            <FormControl>
              <FormLabel>Véhicule</FormLabel>
              <Input placeholder="Véhicule utilisé" />
            </FormControl>
          </VStack>
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <h2>
          <AccordionButton as={Box}>
            <CustomAccordionButton number="3" title="Remboursement des frais kilométriques" />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          <VStack>
            <FormControl>
              <FormLabel>Frais kilométriques</FormLabel>
              <Input placeholder="Montant des frais kilométriques" />
            </FormControl>
          </VStack>
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <h2>
          <AccordionButton as={Box}>
            <CustomAccordionButton number="4" title="Remboursement de frais" />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          <VStack spacing={4}>
            <HStack justifyContent="space-between" width="100%">
              <Text>Péage Tassin-Paris</Text>
              <Text>40.40 €</Text>
              <Button>Modifier</Button>
            </HStack>
            <HStack justifyContent="space-between" width="100%">
              <Text>Péage Chartres-Tassin</Text>
              <Text>56.80 €</Text>
              <Button>Modifier</Button>
            </HStack>
            <Button>Ajouter une dépense</Button>
          </VStack>
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <h2>
          <AccordionButton as={Box}>
            <CustomAccordionButton number="5" title="Récapitulatif" />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          <Box>
            {/* Contenu du récapitulatif */}
            <Text>Identité du bénévole: [Nom]</Text>
            <Text>Véhicule utilisé: [Véhicule]</Text>
            <Text>Frais kilométriques: [Montant]</Text>
            <Text>Péage Tassin-Paris: 40.40 €</Text>
            <Text>Péage Chartres-Tassin: 56.80 €</Text>
          </Box>
          <Button mt={4}>Suivant</Button>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default ExpenseForm;
