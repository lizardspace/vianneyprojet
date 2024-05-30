import React from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
} from '@chakra-ui/react';

function Etape1() {
  return (
    <Box maxWidth="600px" mx="auto" mt="10">
      <FormControl id="lastName" mb="4">
        <FormLabel>Nom</FormLabel>
        <Input placeholder="Ex. Richard" />
      </FormControl>
      
      <FormControl id="firstName" mb="4">
        <FormLabel>Prénom</FormLabel>
        <Input placeholder="Ex. Louis" />
      </FormControl>
      
      <FormControl id="phoneNumber" mb="4">
        <FormLabel>Numéro de téléphone</FormLabel>
        <Input placeholder="Ex. 0769094854" />
      </FormControl>
      
      <FormControl id="email" mb="4">
        <FormLabel>Adresse mail</FormLabel>
        <Input placeholder="Ex. louis.richard@ndc.com" />
      </FormControl>
      
      <FormControl id="pole" mb="4">
        <FormLabel>Choisir un pôle</FormLabel>
        <Select placeholder="Choisir un pôle">
          {/* Options for poles */}
        </Select>
      </FormControl>
      
      <FormControl id="polePrior" mb="4">
        <FormLabel>Choisir un pôle d'abord</FormLabel>
        <Select placeholder="Choisir un pôle d'abord">
          {/* Options for poles */}
        </Select>
      </FormControl>
      
      <FormControl id="address" mb="4">
        <FormLabel>Adresse postale</FormLabel>
        <Input placeholder="Ex. 3 avenue du général Mangin, 78000 Versailles" />
      </FormControl>
      
      <FormControl id="rib" mb="4">
        <FormLabel>RIB</FormLabel>
        <Textarea placeholder="Cliquez ici pour ajouter une photo ou un PDF" />
      </FormControl>
      
      <FormControl id="donation" mb="4">
        <FormLabel>Souhaitez-vous abandonner vos frais au profit de Notre-dame de Chrétienté ?</FormLabel>
        <Select placeholder="Choisir une option">
          <option value="yes">Oui</option>
          <option value="no">Non</option>
        </Select>
      </FormControl>
      
      <Button colorScheme="blue" type="submit">Suivant</Button>
    </Box>
  );
}

export default Etape1;
