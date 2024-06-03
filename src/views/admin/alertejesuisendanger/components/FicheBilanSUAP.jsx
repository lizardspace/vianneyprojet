import React from 'react';
import { Box, Heading, FormControl, FormLabel, Input, Textarea, CheckboxGroup, Checkbox, SimpleGrid} from "@chakra-ui/react";

function FicheBilanSUAP() {
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
            </Box>
    );
}

export default FicheBilanSUAP;
