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
  Stack,
  Grid,
  GridItem
} from "@chakra-ui/react";

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
      <FormControl>
          <FormLabel>CIRCONSTANCES:</FormLabel>
          <Input type="textarea" id="telPersonnePrevenir" />
        </FormControl>
      <SimpleGrid columns={2} spacing={5} my={5}>
      <FormControl>
          <FormLabel>Lieu:</FormLabel>
          <CheckboxGroup>
            <Stack direction="row">
              <Checkbox value="VR">V.R</Checkbox>
              <Checkbox value="Domicile">Domicile</Checkbox>
              <Checkbox value="Travail">Travail</Checkbox>
              <Checkbox value="ERP">ERP</Checkbox>
              <Checkbox value="Milieu naturel">Milieu naturel</Checkbox>
              <Checkbox value="Autres">Autres</Checkbox>
            </Stack>
          </CheckboxGroup>
        </FormControl>
        <FormControl>
          <FormLabel>Accident de circulation:</FormLabel>
          <CheckboxGroup>
            <Stack direction="row">
              <Checkbox value="Piéton">Piéton</Checkbox>
              <Checkbox value="Deux roues">Deux roues</Checkbox>
              <Checkbox value="VL">VL</Checkbox>
              <Checkbox value="PL">PL</Checkbox>
              <Checkbox value="Bus">Bus</Checkbox>
              <Checkbox value="Autre">Autre</Checkbox>
            </Stack>
          </CheckboxGroup>
        </FormControl>
      </SimpleGrid>

      <FormControl my={5}>
        <FormLabel>Type de choc:</FormLabel>
        <CheckboxGroup>
          <Stack direction="row">
            <Checkbox value="Frontal">Frontal</Checkbox>
            <Checkbox value="Latéral">Latéral</Checkbox>
            <Checkbox value="Fronto-latéral">Fronto-latéral</Checkbox>
            <Checkbox value="Arrière">Arrière</Checkbox>
            <Checkbox value="Tonneaux">Tonneaux</Checkbox>
            <Checkbox value="Obstacle fixe">Obstacle fixe</Checkbox>
          </Stack>
        </CheckboxGroup>
      </FormControl>

      <FormControl my={5}>
        <FormLabel>Position dans le véhicule:</FormLabel>
        <CheckboxGroup>
          <Stack direction="row">
            <Checkbox value="Conducteur">Conducteur</Checkbox>
            <Checkbox value="Passager AV">Passager AV</Checkbox>
            <Checkbox value="Passager AR">Passager AR</Checkbox>
          </Stack>
        </CheckboxGroup>
      </FormControl>

      <FormControl my={5}>
        <FormLabel>Vitesse estimée au moment du choc (Km/h):</FormLabel>
        <Input type="number" id="vitesseEstimee" />
      </FormControl>

      <FormControl my={5}>
        <FormLabel>Équipement de sécurité au port de la victime:</FormLabel>
        <CheckboxGroup>
          <Stack direction="row">
            <Checkbox value="Airbag type">Airbag type</Checkbox>
            <Checkbox value="Ceinture">Ceinture</Checkbox>
            <Checkbox value="Aucune">Aucune</Checkbox>
          </Stack>
        </CheckboxGroup>
      </FormControl>

      <FormControl my={5}>
        <FormLabel>Situation à l'arrivée des secours:</FormLabel>
        <CheckboxGroup>
          <Stack direction="row">
            <Checkbox value="Incarcéré">Incarcéré</Checkbox>
            <Checkbox value="Éjecté, projeté">Éjecté, projeté</Checkbox>
            <Checkbox value="Casque retiré">Casque retiré</Checkbox>
            <Checkbox value="Pégé">Pégé</Checkbox>
            <Checkbox value="Sortie du véhicule">Sortie du véhicule</Checkbox>
          </Stack>
        </CheckboxGroup>
      </FormControl>

      <FormControl my={5}>
        <FormLabel>Intoxication par:</FormLabel>
        <CheckboxGroup>
          <Stack direction="row">
            <Checkbox value="Alcool">Alcool</Checkbox>
            <Checkbox value="Fumées d'incendie">Fumées d'incendie</Checkbox>
            <Checkbox value="Médicaments">Médicaments</Checkbox>
            <Checkbox value="Autres">Autres</Checkbox>
          </Stack>
        </CheckboxGroup>
      </FormControl>

      <FormControl my={5}>
        <FormLabel>Accident divers:</FormLabel>
        <CheckboxGroup>
          <Stack direction="row">
            <Checkbox value="Arme à feu">Arme à feu</Checkbox>
            <Checkbox value="Pendaison-étrangulation">Pendaison-étrangulation</Checkbox>
            <Checkbox value="Noyade">Noyade</Checkbox>
            <Checkbox value="Electrisation">Electrisation</Checkbox>
            <Checkbox value="Chute">Chute</Checkbox>
          </Stack>
        </CheckboxGroup>
      </FormControl>

      <FormControl my={5}>
        <FormLabel>Accouchement:</FormLabel>
        <CheckboxGroup>
          <Stack direction="row">
            <Checkbox value="Début de travail">Début de travail</Checkbox>
            <Checkbox value="Accouchement réalisé">Accouchement réalisé</Checkbox>
          </Stack>
        </CheckboxGroup>
      </FormControl>

      <Box bg="black" color="white" p={2} textAlign="center" my={5}>BILAN PRIMAIRE</Box>

      <Grid templateColumns="repeat(3, 1fr)" gap={5} my={5}>
        <GridItem>
          <FormControl>
            <FormLabel>Voies aériennes (VA):</FormLabel>
            <CheckboxGroup>
              <Stack direction="column">
                <Checkbox value="Libres">Libres</Checkbox>
                <Checkbox value="Obstruction totale des VA">Obstruction totale des VA</Checkbox>
                <Checkbox value="Obstruction partielle des VA">Obstruction partielle des VA</Checkbox>
              </Stack>
            </CheckboxGroup>
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel>Respiration:</FormLabel>
            <CheckboxGroup>
              <Stack direction="column">
                <Checkbox value="Normale">Normale</Checkbox>
                <Checkbox value="Arrêt respiratoire ou pause > 6s">Arrêt respiratoire ou pause > 6s</Checkbox>
              </Stack>
            </CheckboxGroup>
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel>Circulation:</FormLabel>
            <CheckboxGroup>
              <Stack direction="column">
                <Checkbox value="Normale">Normale</Checkbox>
                <Checkbox value="Pouls radial non perçu">Pouls radial non perçu</Checkbox>
                <Checkbox value="Hémorragie contrôlée">Hémorragie contrôlée</Checkbox>
                <Checkbox value="Hémorragie non contrôlée">Hémorragie non contrôlée</Checkbox>
              </Stack>
            </CheckboxGroup>
          </FormControl>
        </GridItem>
      </Grid>

      <SimpleGrid columns={3} spacing={5} my={5}>
        <FormControl>
          <FormLabel>Localisation:</FormLabel>
          <Input type="text" id="localisation" />
        </FormControl>
        <FormControl>
          <FormLabel>Sensation de soif:</FormLabel>
          <Input type="text" id="sensationDeSoif" />
        </FormControl>
        <FormControl>
          <FormLabel>Glasgow:</FormLabel>
          <Input type="text" id="glasgow" />
        </FormControl>
      </SimpleGrid>

      <SimpleGrid columns={2} spacing={5} my={5}>
        <FormControl>
          <FormLabel>Convulsions:</FormLabel>
          <CheckboxGroup>
            <Stack direction="column">
              <Checkbox value="Convulsions répétitives">Convulsions répétitives</Checkbox>
              <Checkbox value="Pupilles asymétriques">Pupilles asymétriques</Checkbox>
            </Stack>
          </CheckboxGroup>
        </FormControl>
        <FormControl>
          <FormLabel>État:</FormLabel>
          <CheckboxGroup>
            <Stack direction="column">
              <Checkbox value="Non réactif">Non réactif</Checkbox>
            </Stack>
          </CheckboxGroup>
        </FormControl>
      </SimpleGrid>

      <Box bg="black" color="white" p={2} textAlign="center" my={5}>BILAN SECONDAIRE</Box>

      <Grid templateColumns="repeat(3, 1fr)" gap={5} my={5}>
        <GridItem>
          <FormControl>
            <FormLabel>Causes:</FormLabel>
            <CheckboxGroup>
              <Stack direction="column">
                <Checkbox value="Corps étranger">Corps étranger</Checkbox>
                <Checkbox value="Trauma cervical">Trauma cervical</Checkbox>
                <Checkbox value="Autres">Autres</Checkbox>
              </Stack>
            </CheckboxGroup>
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel>Fréquence respiratoire (FR):</FormLabel>
            <Input type="number" id="frequenceRespiratoire" />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel>SpO2:</FormLabel>
            <Input type="text" id="spo2" />
          </FormControl>
        </GridItem>
      </Grid>

      <Grid templateColumns="repeat(3, 1fr)" gap={5} my={5}>
        <GridItem>
          <FormControl>
            <FormLabel>Fréquence cardiaque (FC):</FormLabel>
            <Input type="number" id="frequenceCardiaque" />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel>Pouls:</FormLabel>
            <CheckboxGroup>
              <Stack direction="column">
                <Checkbox value="Régulier">Régulier</Checkbox>
                <Checkbox value="Irrégulier">Irrégulier</Checkbox>
                <Checkbox value="Filant">Filant</Checkbox>
                <Checkbox value="Asymétrique">Asymétrique</Checkbox>
                <Checkbox value="Bradycardie">Bradycardie</Checkbox>
                <Checkbox value="Tachycardie">Tachycardie</Checkbox>
              </Stack>
            </CheckboxGroup>
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel>Pupilles:</FormLabel>
            <CheckboxGroup>
              <Stack direction="column">
                <Checkbox value="Normales">Normales</Checkbox>
                <Checkbox value="Serrées">Serrées</Checkbox>
                <Checkbox value="Dilatées">Dilatées</Checkbox>
                <Checkbox value="Non réactives">Non réactives</Checkbox>
              </Stack>
            </CheckboxGroup>
          </FormControl>
        </GridItem>
      </Grid>

      <Grid templateColumns="repeat(3, 1fr)" gap={5} my={5}>
        <GridItem>
          <FormControl>
            <FormLabel>Motricité:</FormLabel>
            <CheckboxGroup>
              <Stack direction="column">
                <Checkbox value="Normale">Normale</Checkbox>
                <Checkbox value="Déficit sensitif">Déficit sensitif</Checkbox>
                <Checkbox value="Paralysie">Paralysie</Checkbox>
                <Checkbox value="Agitation">Agitation</Checkbox>
              </Stack>
            </CheckboxGroup>
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel>Détection des symptômes:</FormLabel>
            <CheckboxGroup>
              <Stack direction="column">
                <Checkbox value="Hypo">Hypo</Checkbox>
                <Checkbox value="Hypotension">Hypotension</Checkbox>
                <Checkbox value="Hyper">Hyper</Checkbox>
                <Checkbox value="Hypothermie">Hypothermie</Checkbox>
                <Checkbox value="Hyperthermie">Hyperthermie</Checkbox>
                <Checkbox value="Hypoxie">Hypoxie</Checkbox>
              </Stack>
            </CheckboxGroup>
          </FormControl>
        </GridItem>
      </Grid>
    </Box>
  );
}

export default FicheBilanSUAP;
