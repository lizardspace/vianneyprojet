import React from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Grid,
  GridItem,
} from '@chakra-ui/react';

function Etape1() {
  return (
    <Box
      maxWidth="800px"
      mx="auto"
      mt="10"
      p="6"
      boxShadow="lg"
      borderRadius="md"
      borderWidth="1px"
      borderColor="gray.200"
    >
      <Grid templateColumns="repeat(2, 1fr)" gap="6">
        <GridItem>
          <FormControl id="lastName">
            <FormLabel>Nom</FormLabel>
            <Input placeholder="Ex. Richard" />
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl id="firstName">
            <FormLabel>Prénom</FormLabel>
            <Input placeholder="Ex. Louis" />
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl id="phoneNumber">
            <FormLabel>Numéro de téléphone</FormLabel>
            <Input placeholder="Ex. 0769094854" />
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl id="email">
            <FormLabel>Adresse mail</FormLabel>
            <Input placeholder="Ex. louis.richard@ndc.com" />
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl id="pole">
            <FormLabel>Choisir un pôle</FormLabel>
            <Select placeholder="Choisir un pôle">
              {/* Options for poles */}
            </Select>
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl id="polePrior">
            <FormLabel>Choisir un pôle d'abord</FormLabel>
            <Select placeholder="Choisir un pôle d'abord">
              {/* Options for poles */}
            </Select>
          </FormControl>
        </GridItem>

        <GridItem colSpan={2}>
          <FormControl id="address">
            <FormLabel>Adresse postale</FormLabel>
            <Input placeholder="Ex. 3 avenue du général Mangin, 78000 Versailles" />
          </FormControl>
        </GridItem>

        <GridItem colSpan={2}>
          <FormControl id="rib">
            <FormLabel>RIB</FormLabel>
            <Textarea placeholder="Cliquez ici pour ajouter une photo ou un PDF" />
          </FormControl>
        </GridItem>

        <GridItem colSpan={2}>
          <FormControl id="donation">
            <FormLabel>
              Souhaitez-vous abandonner vos frais au profit de Notre-dame de Chrétienté ?
            </FormLabel>
            <Select placeholder="Choisir une option">
              <option value="yes">Oui</option>
              <option value="no">Non</option>
            </Select>
          </FormControl>
        </GridItem>
      </Grid>

      <Box textAlign="right" mt="6">
        <Button colorScheme="blue" type="submit">
          Suivant
        </Button>
      </Box>
    </Box>
  );
}

export default Etape1;
