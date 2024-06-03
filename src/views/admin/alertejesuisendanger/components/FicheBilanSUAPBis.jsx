import React from 'react';
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  CheckboxGroup,
  Checkbox,
  SimpleGrid,
  RadioGroup,
  Radio,
  Stack,
  Text
} from "@chakra-ui/react";

function FicheBilanSUAPBis() {
  return (
    <Box width="80%" margin="auto" border="1px" borderColor="black" p={5}>
      <Heading as="h1" size="lg" textAlign="center">FICHE BILAN SUAP - N° INTER:</Heading>

      <SimpleGrid columns={2} spacing={5} my={5}>
        <FormControl>
          <FormLabel>ENGIN A:</FormLabel>
          <Input type="text" id="enginA" />
        </FormControl>
        <FormControl>
          <FormLabel>ENGIN B:</FormLabel>
          <Input type="text" id="enginB" />
        </FormControl>
      </SimpleGrid>

      <SimpleGrid columns={2} spacing={5} my={5}>
        <FormControl>
          <FormLabel>Date:</FormLabel>
          <Input type="date" id="date" />
        </FormControl>
        <FormControl>
          <FormLabel>Début évént:</FormLabel>
          <Input type="time" id="debutEvent" />
        </FormControl>
        <FormControl>
          <FormLabel>Prise en ch:</FormLabel>
          <Input type="time" id="priseCharge" />
        </FormControl>
        <FormControl>
          <FormLabel>Convergence:</FormLabel>
          <Input type="time" id="convergence" />
        </FormControl>
        <FormControl>
          <FormLabel>Arrivée hôp:</FormLabel>
          <Input type="time" id="arriveHop" />
        </FormControl>
      </SimpleGrid>

      <Box bg="black" color="white" p={2} textAlign="center" my={5}>ÉTAT CIVIL VICTIME</Box>

      <SimpleGrid columns={2} spacing={5} my={5}>
        <FormControl>
          <FormLabel>NOM:</FormLabel>
          <Input type="text" id="nom" />
        </FormControl>
        <FormControl>
          <FormLabel>PRÉNOM:</FormLabel>
          <Input type="text" id="prenom" />
        </FormControl>
        <FormControl>
          <FormLabel>DATE DE NAISSANCE:</FormLabel>
          <Input type="date" id="dateNaissance" />
        </FormControl>
        <FormControl>
          <FormLabel>ÂGE:</FormLabel>
          <Input type="number" id="age" />
        </FormControl>
        <FormControl>
          <FormLabel>SEXE:</FormLabel>
          <RadioGroup id="sexe">
            <Stack direction="row">
              <Radio value="H">H</Radio>
              <Radio value="F">F</Radio>
            </Stack>
          </RadioGroup>
        </FormControl>
      </SimpleGrid>

      <FormControl my={5}>
        <FormLabel>ADRESSE DE LA VICTIME:</FormLabel>
        <Textarea id="adresse" />
      </FormControl>

      <SimpleGrid columns={2} spacing={5} my={5}>
        <FormControl>
          <FormLabel>TEL:</FormLabel>
          <Input type="tel" id="tel" />
        </FormControl>
        <FormControl>
          <FormLabel>MÉDECIN TRAITANT:</FormLabel>
          <Input type="text" id="medecinTraitant" />
        </FormControl>
        <FormControl>
          <FormLabel>PERSONNE À PRÉVENIR:</FormLabel>
          <Input type="text" id="personnePrevenir" />
        </FormControl>
        <FormControl>
          <FormLabel>TEL:</FormLabel>
          <Input type="tel" id="telPersonnePrevenir" />
        </FormControl>
      </SimpleGrid>

      <Box bg="black" color="white" p={2} textAlign="center" my={5}>BILAN CIRCONSTANCIEL</Box>

      <CheckboxGroup colorScheme="green" my={5}>
        <SimpleGrid columns={3} spacing={5}>
          <Checkbox value="accident_blesse">ACCIDENT / BLESSÉ</Checkbox>
          <Checkbox value="maladie_malaise">MALADIE / MALAISE</Checkbox>
          <Checkbox value="autres_missions">AUTRES MISSIONS</Checkbox>
        </SimpleGrid>
      </CheckboxGroup>

      <FormControl my={5}>
        <FormLabel>CIRCONSTANCES :</FormLabel>
        <Textarea id="circonstances" />
      </FormControl>

      <Box bg="black" color="white" p={2} textAlign="center" my={5}>BILAN PRIMAIRE</Box>

      <SimpleGrid columns={2} spacing={5} my={5}>
        <FormControl>
          <FormLabel>Liberté des voies aériennes :</FormLabel>
          <CheckboxGroup colorScheme="red">
            <Stack>
              <Checkbox value="libres">LIBRES</Checkbox>
              <Checkbox value="obstruction_totale">OBSTRUCTION TOTALE DES V.A.</Checkbox>
              <Checkbox value="obstruction_partielle">OBSTRUCTION PARTIELLE DES V.A.</Checkbox>
            </Stack>
          </CheckboxGroup>
        </FormControl>
        <FormControl>
          <FormLabel>Respiration :</FormLabel>
          <CheckboxGroup colorScheme="red">
            <Stack>
              <Checkbox value="normale">NORMALE</Checkbox>
              <Checkbox value="arret_resp">ARRÊT RESPIRATOIRE OU PAUSE > 6 SEC.</Checkbox>
            </Stack>
          </CheckboxGroup>
        </FormControl>
      </SimpleGrid>

      <SimpleGrid columns={2} spacing={5} my={5}>
        <FormControl>
          <FormLabel>Pouls radial :</FormLabel>
          <CheckboxGroup colorScheme="red">
            <Stack>
              <Checkbox value="percu">PERCU</Checkbox>
              <Checkbox value="non_percu">NON PERCU</Checkbox>
            </Stack>
          </CheckboxGroup>
        </FormControl>
        <FormControl>
          <FormLabel>Hémorragie :</FormLabel>
          <CheckboxGroup colorScheme="red">
            <Stack>
              <Checkbox value="controlee">CONTROLÉE</Checkbox>
              <Checkbox value="non_controlee">NON CONTROLÉE</Checkbox>
            </Stack>
          </CheckboxGroup>
        </FormControl>
      </SimpleGrid>

      <FormControl my={5}>
        <FormLabel>Score de Glasgow :</FormLabel>
        <SimpleGrid columns={3} spacing={5}>
          <Input type="number" id="glasgowO" placeholder="O" />
          <Input type="number" id="glasgowV" placeholder="V" />
          <Input type="number" id="glasgowM" placeholder="M" />
        </SimpleGrid>
        <Text>Total: </Text>
      </FormControl>

      <Box bg="black" color="white" p={2} textAlign="center" my={5}>BILAN SECONDAIRE</Box>

      <FormControl my={5}>
        <FormLabel>Causes:</FormLabel>
        <Textarea id="causes" />
      </FormControl>

      <SimpleGrid columns={2} spacing={5} my={5}>
        <FormControl>
          <FormLabel>FR:</FormLabel>
          <Input type="text" id="frSecondaire" />
        </FormControl>
        <FormControl>
          <FormLabel>SPO2:</FormLabel>
          <Input type="text" id="spo2Secondaire" />
        </FormControl>
      </SimpleGrid>

      <FormControl my={5}>
        <FormLabel>Remarques:</FormLabel>
        <Textarea id="remarques" />
      </FormControl>
    </Box>
  );
}

export default FicheBilanSUAPBis;
