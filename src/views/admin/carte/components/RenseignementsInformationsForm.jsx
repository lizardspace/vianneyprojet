import { useState, useEffect } from 'react';
import {
  Box,
  Input,
  FormControl,
  FormLabel,
  Select,
  Switch,
  Button,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { supabase } from './../../../../supabaseClient';
import { useEvent } from './../../../../EventContext';

const RenseignementsInformationsForm = () => {
  const toast = useToast();
  const { selectedEventId } = useEvent(); // Use the event ID from context
  
  // Initialize date and time to current local values
  const now = new Date();
  const currentDate = now.toISOString().split('T')[0]; // Gets the date in YYYY-MM-DD format
  const currentTime = now.toTimeString().split(' ')[0].substr(0, 5); // Gets the time in HH:MM format
  
  const [report, setReport] = useState({
    date: currentDate,
    time: currentTime,
    redacteur: '',
    theme: '',
    information: '',
    fiabilite: '',
    action: '',
    confidentialite: false,
    event_id: selectedEventId // Set event_id from the context
  });

  // Update event_id in the state if it changes in the context
  useEffect(() => {
    setReport(prev => ({ ...prev, event_id: selectedEventId }));
  }, [selectedEventId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setReport(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error } = await supabase.from('vianney_renseignements_informations_reports').insert([report]);

    if (error) {
      toast({
        title: 'Erreur',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    } else {
      toast({
        title: 'Succès',
        description: 'Rapport créé avec succès',
        status: 'success',
        duration: 5000,
        isClosable: true
      });
      // Reset the form, maintaining the current date and time
      setReport({
        date: currentDate,
        time: currentTime,
        redacteur: '',
        theme: '',
        information: '',
        fiabilite: '',
        action: '',
        confidentialite: false,
        event_id: selectedEventId
      });
    }
  };

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg">
      <form onSubmit={handleSubmit}>
        {/* Form controls for each field */}
        <FormControl isRequired hidden>
  <FormLabel>Date</FormLabel>
  <Input type="date" name="date" value={report.date} onChange={handleChange} />
</FormControl>

        <FormControl isRequired hidden>
          <FormLabel>Heure:Minute</FormLabel>
          <Input type="time" name="time" value={report.time} onChange={handleChange} />
        </FormControl>

          <FormControl isRequired>
            <FormLabel>Rédacteur (indicatif)</FormLabel>
            <Input type="text" name="redacteur" value={report.redacteur} onChange={handleChange} />
          </FormControl>
  
          <FormControl isRequired>
            <FormLabel>Thème</FormLabel>
            <Input type="text" name="theme" value={report.theme} onChange={handleChange} />
          </FormControl>
  
          <FormControl isRequired>
            <FormLabel>Information (texte)</FormLabel>
            <Textarea name="information" value={report.information} onChange={handleChange} />
          </FormControl>
  
          <FormControl isRequired>
            <FormLabel>Fiabilité (sur 5)</FormLabel>
            <Select name="fiabilite" value={report.fiabilite} onChange={handleChange}>
              <option value="">Choisir...</option>
              <option value="1/5">⭐1/5</option>
              <option value="2/5">⭐⭐2/5</option>
              <option value="3/5">⭐⭐⭐3/5</option>
              <option value="4/5">⭐⭐⭐⭐4/5</option>
              <option value="5/5">⭐⭐⭐⭐⭐5/5</option>
            </Select>
          </FormControl>
  
          <FormControl>
            <FormLabel>Action (texte)</FormLabel>
            <Input type="text" name="action" value={report.action} onChange={handleChange} />
          </FormControl>
  
          <FormControl display="flex" alignItems="center">
            <FormLabel htmlFor="confidentialite" mb="0">
              Confidentialité (oui/non)
            </FormLabel>
            <Switch id="confidentialite" name="confidentialite" onChange={handleChange} isChecked={report.confidentialite} />
          </FormControl>
        <Button mt={4} colorScheme="blue" type="submit">
          Créer le Rapport
        </Button>
      </form>
    </Box>
  );
};

export default RenseignementsInformationsForm;