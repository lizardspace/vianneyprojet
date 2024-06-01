import React, { useState } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Box,
  Button,
  HStack,
  Text,
  FormControl,
  FormLabel,
  Input,
  Select,
  Grid,
  GridItem,
  InputGroup,
  InputRightElement,
  Flex,
  Link,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast
} from '@chakra-ui/react';
import { ChevronDownIcon, EditIcon, AddIcon } from '@chakra-ui/icons';
import supabase from './../../../../supabaseClient';

// Custom Accordion Button
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

// Step 1: Volunteer Information
const Etape1 = ({ data, setData }) => {
  const handleChange = (e) => {
    const { id, value } = e.target;
    setData((prevData) => ({ ...prevData, [id]: value }));
  };

  return (
    <Box mt="10" p="6" boxShadow="lg" borderRadius="md" borderWidth="1px" borderColor="gray.200" bg="white">
      <Grid templateColumns="repeat(2, 1fr)" gap="4">
        <GridItem>
          <FormControl id="volunteer_last_name" position="relative" mt="6">
            <FormLabel position="absolute" top="-0.6rem" left="1rem" bg="white" px="0.25rem" fontSize="xs" fontWeight="bold" zIndex="1">
              Nom
            </FormLabel>
            <Input
              value={data.volunteer_last_name || ''}
              onChange={handleChange}
              placeholder="Ex. Richard"
              borderColor="gray.300"
              _placeholder={{ color: 'gray.500' }}
              borderRadius="md"
              height="40px"
              position="relative"
              zIndex="0"
              _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500', zIndex: '0' }}
            />
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl id="volunteer_first_name" position="relative" mt="6">
            <FormLabel position="absolute" top="-0.6rem" left="1rem" bg="white" px="0.25rem" fontSize="xs" fontWeight="bold" zIndex="1">
              Prénom
            </FormLabel>
            <Input
              value={data.volunteer_first_name || ''}
              onChange={handleChange}
              placeholder="Ex. Louis"
              borderColor="gray.300"
              _placeholder={{ color: 'gray.500' }}
              borderRadius="md"
              height="40px"
              position="relative"
              zIndex="0"
              _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500', zIndex: '0' }}
            />
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl id="phone_number" position="relative" mt="6">
            <FormLabel position="absolute" top="-0.6rem" left="1rem" bg="white" px="0.25rem" fontSize="xs" fontWeight="bold" zIndex="1">
              Numéro de téléphone
            </FormLabel>
            <Input
              value={data.phone_number || ''}
              onChange={handleChange}
              placeholder="Ex. 0769094854"
              borderColor="gray.300"
              _placeholder={{ color: 'gray.500' }}
              borderRadius="md"
              height="40px"
              position="relative"
              zIndex="0"
              _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500', zIndex: '0' }}
            />
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl id="email" position="relative" mt="6">
            <FormLabel position="absolute" top="-0.6rem" left="1rem" bg="white" px="0.25rem" fontSize="xs" fontWeight="bold" zIndex="1">
              Adresse mail
            </FormLabel>
            <Input
              value={data.email || ''}
              onChange={handleChange}
              placeholder="Ex. louis.richard@ndc.com"
              borderColor="gray.300"
              _placeholder={{ color: 'gray.500' }}
              borderRadius="md"
              height="40px"
              position="relative"
              zIndex="0"
              _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500', zIndex: '0' }}
            />
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl id="pole" position="relative" mt="6">
            <FormLabel position="absolute" top="-0.6rem" left="1rem" bg="white" px="0.25rem" fontSize="xs" fontWeight="bold" zIndex="1">
              Choisir un pôle
            </FormLabel>
            <InputGroup>
              <Select
                value={data.pole || ''}
                onChange={handleChange}
                placeholder="Choisir un pôle"
                borderColor="gray.300"
                borderRadius="md"
                height="40px"
                _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500', zIndex: '0' }}
              >
                <option value="pole1">Pole 1</option>
                <option value="pole2">Pole 2</option>
              </Select>
              <InputRightElement pointerEvents="none" height="100%" children={<ChevronDownIcon color="gray.500" />} />
            </InputGroup>
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl id="pole_prior" position="relative" mt="6">
            <FormLabel position="absolute" top="-0.6rem" left="1rem" bg="white" px="0.25rem" fontSize="xs" fontWeight="bold" zIndex="1">
              Choisir un pôle d'abord
            </FormLabel>
            <InputGroup>
              <Select
                value={data.pole_prior || ''}
                onChange={handleChange}
                placeholder="Choisir un pôle d'abord"
                borderColor="gray.300"
                borderRadius="md"
                height="40px"
                _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500', zIndex: '0' }}
              >
                <option value="prior1">Prior 1</option>
                <option value="prior2">Prior 2</option>
              </Select>
              <InputRightElement pointerEvents="none" height="100%" children={<ChevronDownIcon color="gray.500" />} />
            </InputGroup>
          </FormControl>
        </GridItem>

        <GridItem colSpan={2}>
          <FormControl id="address" position="relative" mt="6">
            <FormLabel position="absolute" top="-0.6rem" left="1rem" bg="white" px="0.25rem" fontSize="xs" fontWeight="bold" zIndex="1">
              Adresse postale
            </FormLabel>
            <Input
              value={data.address || ''}
              onChange={handleChange}
              placeholder="Ex. 3 avenue du général Mangin, 78000 Versailles"
              borderColor="gray.300"
              _placeholder={{ color: 'gray.500' }}
              borderRadius="md"
              height="40px"
              position="relative"
              zIndex="0"
              _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500', zIndex: '0' }}
            />
          </FormControl>
        </GridItem>

        <GridItem colSpan={2}>
          <FormControl id="rib" position="relative" mt="6">
            <FormLabel position="absolute" top="-0.6rem" left="1rem" bg="white" px="0.25rem" fontSize="xs" fontWeight="bold" zIndex="1000">
              RIB
            </FormLabel>
            <Box position="relative" height="100px">
              <Input type="file" opacity="0" position="absolute" top="0" left="0" height="100%" width="100%" zIndex="2" />
              <Box position="absolute" top="0" left="0" height="100%" width="100%" bg="white" borderRadius="md" borderWidth="1px" borderColor="gray.300" display="flex" alignItems="center" justifyContent="center" zIndex="1">
                Cliquez ici pour ajouter une photo ou un PDF
              </Box>
            </Box>
          </FormControl>
        </GridItem>

        <GridItem colSpan={2}>
          <FormControl id="donation_option" position="relative" mt="6">
            <FormLabel position="absolute" top="-0.6rem" left="1rem" bg="white" px="0.25rem" fontSize="xs" fontWeight="bold" zIndex="1">
              Souhaitez-vous abandonner vos frais au profit de Notre-dame de Chrétienté ?
            </FormLabel>
            <InputGroup>
              <Select
                value={data.donation_option || ''}
                onChange={handleChange}
                placeholder="Choisir une option"
                borderColor="gray.300"
                borderRadius="md"
                height="40px"
                _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500', zIndex: '0' }}
              >
                <option value="yes">Oui</option>
                <option value="no">Non</option>
              </Select>
              <InputRightElement pointerEvents="none" height="100%" children={<ChevronDownIcon color="gray.500" />} />
            </InputGroup>
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
};

// Step 2: Vehicle Information
const Etape2 = ({ data, setData }) => {
  const handleChange = (e) => {
    const { id, value } = e.target;
    setData((prevData) => ({ ...prevData, [id]: value }));
  };

  return (
    <Box mt="10" p="6" boxShadow="lg" borderRadius="md" borderWidth="1px" borderColor="gray.200" bg="white">
      <Grid templateColumns="repeat(2, 1fr)" gap="4">
        <GridItem colSpan={2}>
          <FormControl id="vehicle_type" position="relative" mt="6">
            <FormLabel position="absolute" top="-0.6rem" left="1rem" bg="white" px="0.25rem" fontSize="xs" fontWeight="bold" zIndex="1">
              Véhicule personnel
            </FormLabel>
            <Select
              value={data.vehicle_type || ''}
              onChange={handleChange}
              placeholder="Sélectionner un type de véhicule"
              borderColor="gray.300"
              borderRadius="md"
              height="40px"
              _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500', zIndex: '0' }}
            >
              <option value="voiture">Voiture - Camion</option>
              {/* Add other vehicle options as needed */}
            </Select>
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl id="fiscal_power" position="relative" mt="6">
            <FormLabel position="absolute" top="-0.6rem" left="1rem" bg="white" px="0.25rem" fontSize="xs" fontWeight="bold" zIndex="1">
              Puissance fiscale (P6 carte grise)
            </FormLabel>
            <Input
              value={data.fiscal_power || ''}
              onChange={handleChange}
              placeholder="6"
              borderColor="gray.300"
              _placeholder={{ color: 'gray.500' }}
              borderRadius="md"
              height="40px"
              position="relative"
              zIndex="0"
              _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500', zIndex: '0' }}
            />
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl id="registration" position="relative" mt="6">
            <FormLabel position="absolute" top="-0.6rem" left="1rem" bg="white" px="0.25rem" fontSize="xs" fontWeight="bold" zIndex="1">
              Immatriculation
            </FormLabel>
            <Input
              value={data.registration || ''}
              onChange={handleChange}
              placeholder="Ex. GD-271-NR"
              borderColor="gray.300"
              _placeholder={{ color: 'gray.500' }}
              borderRadius="md"
              height="40px"
              position="relative"
              zIndex="0"
              _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500', zIndex: '0' }}
            />
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl id="brand" position="relative" mt="6">
            <FormLabel position="absolute" top="-0.6rem" left="1rem" bg="white" px="0.25rem" fontSize="xs" fontWeight="bold" zIndex="1">
              Marque
            </FormLabel>
            <Input
              value={data.brand || ''}
              onChange={handleChange}
              placeholder="Ex. Peugeot"
              borderColor="gray.300"
              _placeholder={{ color: 'gray.500' }}
              borderRadius="md"
              height="40px"
              position="relative"
              zIndex="0"
              _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500', zIndex: '0' }}
            />
          </FormControl>
        </GridItem>

        <GridItem colSpan={2}>
          <FormControl id="departure_odometer" position="relative" mt="6">
            <FormLabel position="absolute" top="-0.6rem" left="1rem" bg="white" px="0.25rem" fontSize="xs" fontWeight="bold" zIndex="1000">
              Compteur de kilomètres départ
            </FormLabel>
            <Box position="relative" height="100px">
              <Input type="file" opacity="0" position="absolute" top="0" left="0" height="100%" width="100%" zIndex="2" />
              <Box position="absolute" top="0" left="0" height="100%" width="100%" bg="white" borderRadius="md" borderWidth="1px" borderColor="gray.300" display="flex" alignItems="center" justifyContent="center" zIndex="1">
                Cliquez ici pour ajouter une photo ou un PDF
              </Box>
            </Box>
          </FormControl>
        </GridItem>

        <GridItem colSpan={2}>
          <FormControl id="return_odometer" position="relative" mt="6">
            <FormLabel position="absolute" top="-0.6rem" left="1rem" bg="white" px="0.25rem" fontSize="xs" fontWeight="bold" zIndex="1000">
              Compteur de kilomètres retour
            </FormLabel>
            <Box position="relative" height="100px">
              <Input type="file" opacity="0" position="absolute" top="0" left="0" height="100%" width="100%" zIndex="2" />
              <Box position="absolute" top="0" left="0" height="100%" width="100%" bg="white" borderRadius="md" borderWidth="1px" borderColor="gray.300" display="flex" alignItems="center" justifyContent="center" zIndex="1">
                Cliquez ici pour ajouter une photo ou un PDF
              </Box>
            </Box>
          </FormControl>
        </GridItem>

        <GridItem colSpan={2}>
          <FormControl id="carte_grise" position="relative" mt="6">
            <FormLabel position="absolute" top="-0.6rem" left="1rem" bg="white" px="0.25rem" fontSize="xs" fontWeight="bold" zIndex="1000">
              Photo de la carte grise
            </FormLabel>
            <Box position="relative" height="100px">
              <Input type="file" opacity="0" position="absolute" top="0" left="0" height="100%" width="100%" zIndex="2" />
              <Box position="absolute" top="0" left="0" height="100%" width="100%" bg="white" borderRadius="md" borderWidth="1px" borderColor="gray.300" display="flex" alignItems="center" justifyContent="center" zIndex="1">
                Cliquez ici pour ajouter une photo ou un PDF
              </Box>
            </Box>
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
};

// Step 3: Trip Information
const Etape3 = ({ trips, setTrips }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newTripName, setNewTripName] = useState('');
  const [newTripDistance, setNewTripDistance] = useState('');
  const [editingTrip, setEditingTrip] = useState(null);

  const handleAddTrip = () => {
    if (editingTrip !== null) {
      const updatedTrips = trips.map((trip, index) =>
        index === editingTrip ? { name: newTripName, distance: parseInt(newTripDistance) } : trip
      );
      setTrips(updatedTrips);
    } else {
      setTrips([...trips, { name: newTripName, distance: parseInt(newTripDistance) }]);
    }
    setNewTripName('');
    setNewTripDistance('');
    setEditingTrip(null);
    onClose();
  };

  const handleEditTrip = (index) => {
    setNewTripName(trips[index].name);
    setNewTripDistance(trips[index].distance);
    setEditingTrip(index);
    onOpen();
  };

  return (
    <Box mt="10" p="6" boxShadow="lg" borderRadius="md" borderWidth="1px" borderColor="gray.200" bg="white">
      {trips.map((trip, index) => (
        <Flex key={index} justifyContent="space-between" alignItems="center" mb="4">
          <Text fontWeight="bold">{trip.name}</Text>
          <Text color="green.500">{trip.distance} KM</Text>
          <Button size="sm" onClick={() => handleEditTrip(index)}>Modifier</Button>
        </Flex>
      ))}

      <Flex alignItems="center" mt="6">
        <Icon as={AddIcon} color="blue.500" mr="2" />
        <Link color="blue.500" href="#" onClick={onOpen}>
          Ajouter un trajet
        </Link>
      </Flex>

      <Box textAlign="right" mt="6">
        <Button colorScheme="blue">Suivant</Button>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editingTrip !== null ? 'Modifier le trajet' : 'Ajouter un nouveau trajet'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl id="newTripName" mb="4">
              <FormLabel>Nom du trajet</FormLabel>
              <Input
                placeholder="Ex. Paris-Lyon"
                value={newTripName}
                onChange={(e) => setNewTripName(e.target.value)}
              />
            </FormControl>
            <FormControl id="newTripDistance">
              <FormLabel>Distance (KM)</FormLabel>
              <Input
                placeholder="Ex. 500"
                value={newTripDistance}
                onChange={(e) => setNewTripDistance(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr="3" onClick={handleAddTrip}>
              {editingTrip !== null ? 'Modifier' : 'Ajouter'}
            </Button>
            <Button variant="ghost" onClick={onClose}>Annuler</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

// Step 4: Expense Information
const Etape4 = ({ expenses, setExpenses }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newExpenseName, setNewExpenseName] = useState('');
  const [newExpenseCost, setNewExpenseCost] = useState('');
  const [editingExpense, setEditingExpense] = useState(null);

  const handleAddExpense = () => {
    if (editingExpense !== null) {
      const updatedExpenses = expenses.map((expense, index) =>
        index === editingExpense ? { name: newExpenseName, cost: parseFloat(newExpenseCost) } : expense
      );
      setExpenses(updatedExpenses);
    } else {
      setExpenses([...expenses, { name: newExpenseName, cost: parseFloat(newExpenseCost) }]);
    }
    setNewExpenseName('');
    setNewExpenseCost('');
    setEditingExpense(null);
    onClose();
  };

  const handleEditExpense = (index) => {
    setNewExpenseName(expenses[index].name);
    setNewExpenseCost(expenses[index].cost);
    setEditingExpense(index);
    onOpen();
  };

  return (
    <Box mt="10" p="6" boxShadow="lg" borderRadius="md" borderWidth="1px" borderColor="gray.200" bg="white">
      {expenses.map((expense, index) => (
        <Flex key={index} justifyContent="space-between" alignItems="center" mb="4">
          <Text fontWeight="bold">{expense.name}</Text>
          <Text color="green.500">{expense.cost.toFixed(2)} €</Text>
          <Button size="sm" onClick={() => handleEditExpense(index)}>Modifier</Button>
        </Flex>
      ))}

      <Flex alignItems="center" mt="6">
        <Icon as={AddIcon} color="blue.500" mr="2" />
        <Link color="blue.500" href="#" onClick={onOpen}>
          Ajouter une dépense
        </Link>
      </Flex>

      <Box textAlign="right" mt="6">
        <Button colorScheme="blue">Suivant</Button>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editingExpense !== null ? 'Modifier la dépense' : 'Ajouter une nouvelle dépense'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl id="newExpenseName" mb="4">
              <FormLabel>Nom de la dépense</FormLabel>
              <Input
                placeholder="Ex. Péage Paris-Lyon"
                value={newExpenseName}
                onChange={(e) => setNewExpenseName(e.target.value)}
              />
            </FormControl>
            <FormControl id="newExpenseCost">
              <FormLabel>Coût (€)</FormLabel>
              <Input
                placeholder="Ex. 50.00"
                value={newExpenseCost}
                onChange={(e) => setNewExpenseCost(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr="3" onClick={handleAddExpense}>
              {editingExpense !== null ? 'Modifier' : 'Ajouter'}
            </Button>
            <Button variant="ghost" onClick={onClose}>Annuler</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

const ExpenseForm = () => {
  const [data, setData] = useState({
    volunteer_last_name: '',
    volunteer_first_name: '',
    phone_number: '',
    email: '',
    pole: '',
    pole_prior: '',
    address: '',
    rib: '',
    donation_option: ''
  });
  const [trips, setTrips] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const toast = useToast();

  const handleSubmit = async () => {
    const formattedData = {
      ...data,
      trips: JSON.stringify(trips),
      expenses: JSON.stringify(expenses),
    };

    const { error } = await supabase
      .from('vianney_expenses_reimbursement')
      .insert([formattedData]);

    if (error) {
      toast({
        title: "Erreur de soumission.",
        description: `Erreur: ${error.message}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Soumission réussie.",
        description: "Vos données ont été soumises avec succès.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      // Optionally, clear the form after successful submission
      setData({
        volunteer_last_name: '',
        volunteer_first_name: '',
        phone_number: '',
        email: '',
        pole: '',
        pole_prior: '',
        address: '',
        rib: '',
        donation_option: ''
      });
      setTrips([]);
      setExpenses([]);
    }
  };

  return (
    <Accordion allowToggle>
      <AccordionItem>
        <h2>
          <AccordionButton as={Box}>
            <CustomAccordionButton number="1" title="Identité du bénévole" />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          <Etape1 data={data} setData={setData} />
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <h2>
          <AccordionButton as={Box}>
            <CustomAccordionButton number="2" title="Véhicule utilisé" />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          <Etape2 data={data} setData={setData} />
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <h2>
          <AccordionButton as={Box}>
            <CustomAccordionButton number="3" title="Remboursement des frais kilométriques" />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          <Etape3 trips={trips} setTrips={setTrips} />
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <h2>
          <AccordionButton as={Box}>
            <CustomAccordionButton number="4" title="Remboursement de frais" />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          <Etape4 expenses={expenses} setExpenses={setExpenses} />
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <h2>
          <AccordionButton as={Box}>
            <CustomAccordionButton number="5" title="Récapitulatif" />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          <Button colorScheme="blue" onClick={handleSubmit}>
            Soumettre
          </Button>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default ExpenseForm;
