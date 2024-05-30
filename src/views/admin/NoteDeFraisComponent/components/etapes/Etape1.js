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
      bg="white"
    >
      <Grid templateColumns="repeat(2, 1fr)" gap="4">
        <GridItem>
          <FormControl id="lastName" position="relative" mt="6">
            <FormLabel
              position="absolute"
              top="-0.6rem"
              left="1rem"
              bg="white"
              px="0.25rem"
              fontSize="xs"
              fontWeight="bold"
              zIndex="1"
            >
              Nom
            </FormLabel>
            <Input
              placeholder="Ex. Richard"
              borderColor="gray.300"
              _placeholder={{ color: 'gray.500' }}
              borderRadius="md"
              padding="10px 15px"
              height="40px"
              position="relative"
              zIndex="0"
            />
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl id="firstName" position="relative" mt="6">
            <FormLabel
              position="absolute"
              top="-0.6rem"
              left="1rem"
              bg="white"
              px="0.25rem"
              fontSize="xs"
              fontWeight="bold"
              zIndex="1"
            >
              Prénom
            </FormLabel>
            <Input
              placeholder="Ex. Louis"
              borderColor="gray.300"
              _placeholder={{ color: 'gray.500' }}
              borderRadius="md"
              padding="10px 15px"
              height="40px"
              position="relative"
              zIndex="0"
            />
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl id="phoneNumber" position="relative" mt="6">
            <FormLabel
              position="absolute"
              top="-0.6rem"
              left="1rem"
              bg="white"
              px="0.25rem"
              fontSize="xs"
              fontWeight="bold"
              zIndex="1"
            >
              Numéro de téléphone
            </FormLabel>
            <Input
              placeholder="Ex. 0769094854"
              borderColor="gray.300"
              _placeholder={{ color: 'gray.500' }}
              borderRadius="md"
              padding="10px 15px"
              height="40px"
              position="relative"
              zIndex="0"
            />
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl id="email" position="relative" mt="6">
            <FormLabel
              position="absolute"
              top="-0.6rem"
              left="1rem"
              bg="white"
              px="0.25rem"
              fontSize="xs"
              fontWeight="bold"
              zIndex="1"
            >
              Adresse mail
            </FormLabel>
            <Input
              placeholder="Ex. louis.richard@ndc.com"
              borderColor="gray.300"
              _placeholder={{ color: 'gray.500' }}
              borderRadius="md"
              padding="10px 15px"
              height="40px"
              position="relative"
              zIndex="0"
            />
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl id="pole" position="relative" mt="6">
            <FormLabel
              position="absolute"
              top="-0.6rem"
              left="1rem"
              bg="white"
              px="0.25rem"
              fontSize="xs"
              fontWeight="bold"
              zIndex="1"
            >
              Choisir un pôle
            </FormLabel>
            <Select
              placeholder="Choisir un pôle"
              borderColor="gray.300"
              borderRadius="md"
              padding="10px 15px"
              height="40px"
              position="relative"
              zIndex="0"
            >
              {/* Options for poles */}
            </Select>
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl id="polePrior" position="relative" mt="6">
            <FormLabel
              position="absolute"
              top="-0.6rem"
              left="1rem"
              bg="white"
              px="0.25rem"
              fontSize="xs"
              fontWeight="bold"
              zIndex="1"
            >
              Choisir un pôle d'abord
            </FormLabel>
            <Select
              placeholder="Choisir un pôle d'abord"
              borderColor="gray.300"
              borderRadius="md"
              padding="10px 15px"
              height="40px"
              position="relative"
              zIndex="0"
            >
              {/* Options for poles */}
            </Select>
          </FormControl>
        </GridItem>

        <GridItem colSpan={2}>
          <FormControl id="address" position="relative" mt="6">
            <FormLabel
              position="absolute"
              top="-0.6rem"
              left="1rem"
              bg="white"
              px="0.25rem"
              fontSize="xs"
              fontWeight="bold"
              zIndex="1"
            >
              Adresse postale
            </FormLabel>
            <Input
              placeholder="Ex. 3 avenue du général Mangin, 78000 Versailles"
              borderColor="gray.300"
              _placeholder={{ color: 'gray.500' }}
              borderRadius="md"
              padding="10px 15px"
              height="40px"
              position="relative"
              zIndex="0"
            />
          </FormControl>
        </GridItem>

        <GridItem colSpan={2}>
          <FormControl id="rib" position="relative" mt="6">
            <FormLabel
              position="absolute"
              top="-0.6rem"
              left="1rem"
              bg="white"
              px="0.25rem"
              fontSize="xs"
              fontWeight="bold"
              zIndex="1"
            >
              RIB
            </FormLabel>
            <Textarea
              placeholder="Cliquez ici pour ajouter une photo ou un PDF"
              borderColor="gray.300"
              _placeholder={{ color: 'gray.500' }}
              borderRadius="md"
              padding="10px 15px"
              height="100px"
              position="relative"
              zIndex="0"
            />
          </FormControl>
        </GridItem>

        <GridItem colSpan={2}>
          <FormControl id="donation" position="relative" mt="6">
            <FormLabel
              position="absolute"
              top="-0.6rem"
              left="1rem"
              bg="white"
              px="0.25rem"
              fontSize="xs"
              fontWeight="bold"
              zIndex="1"
            >
              Souhaitez-vous abandonner vos frais au profit de Notre-dame de Chrétienté ?
            </FormLabel>
            <Select
              placeholder="Choisir une option"
              borderColor="gray.300"
              borderRadius="md"
              padding="10px 15px"
              height="40px"
              position="relative"
              zIndex="0"
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
