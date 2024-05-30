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
            <FormLabel fontWeight="bold" fontSize="sm">Nom</FormLabel>
            <Input
              placeholder="Ex. Richard"
              borderColor="gray.300"
              _placeholder={{ color: 'gray.500' }}
              borderRadius="md"
              padding="10px"
            />
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl id="firstName">
            <FormLabel fontWeight="bold" fontSize="sm">Prénom</FormLabel>
            <Input
              placeholder="Ex. Louis"
              borderColor="gray.300"
              _placeholder={{ color: 'gray.500' }}
              borderRadius="md"
              padding="10px"
            />
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl id="phoneNumber">
            <FormLabel fontWeight="bold" fontSize="sm">Numéro de téléphone</FormLabel>
            <Input
              placeholder="Ex. 0769094854"
              borderColor="gray.300"
              _placeholder={{ color: 'gray.500' }}
              borderRadius="md"
              padding="10px"
            />
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl id="email">
            <FormLabel fontWeight="bold" fontSize="sm">Adresse mail</FormLabel>
            <Input
              placeholder="Ex. louis.richard@ndc.com"
              borderColor="gray.300"
              _placeholder={{ color: 'gray.500' }}
              borderRadius="md"
              padding="10px"
            />
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl id="pole">
            <FormLabel fontWeight="bold" fontSize="sm">Choisir un pôle</FormLabel>
            <Select
              placeholder="Choisir un pôle"
              borderColor="gray.300"
              borderRadius="md"
              padding="10px"
            >
              {/* Options for poles */}
            </Select>
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl id="polePrior">
            <FormLabel fontWeight="bold" fontSize="sm">Choisir un pôle d'abord</FormLabel>
            <Select
              placeholder="Choisir un pôle d'abord"
              borderColor="gray.300"
              borderRadius="md"
              padding="10px"
            >
              {/* Options for poles */}
            </Select>
          </FormControl>
        </GridItem>

        <GridItem colSpan={2}>
          <FormControl id="address">
            <FormLabel fontWeight="bold" fontSize="sm">Adresse postale</FormLabel>
            <Input
              placeholder="Ex. 3 avenue du général Mangin, 78000 Versailles"
              borderColor="gray.300"
              _placeholder={{ color: 'gray.500' }}
              borderRadius="md"
              padding="10px"
            />
          </FormControl>
        </GridItem>

        <GridItem colSpan={2}>
          <FormControl id="rib">
            <FormLabel fontWeight="bold" fontSize="sm">RIB</FormLabel>
            <Textarea
              placeholder="Cliquez ici pour ajouter une photo ou un PDF"
              borderColor="gray.300"
              _placeholder={{ color: 'gray.500' }}
              borderRadius="md"
              padding="10px"
            />
          </FormControl>
        </GridItem>

        <GridItem colSpan={2}>
          <FormControl id="donation">
            <FormLabel fontWeight="bold" fontSize="sm">
              Souhaitez-vous abandonner vos frais au profit de Notre-dame de Chrétienté ?
            </FormLabel>
            <Select
              placeholder="Choisir une option"
              borderColor="gray.300"
              borderRadius="md"
              padding="10px"
            >
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
