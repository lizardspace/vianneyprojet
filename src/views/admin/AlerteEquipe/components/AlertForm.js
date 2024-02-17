import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Checkbox,
  VStack,
  useToast
} from "@chakra-ui/react";
import { v4 as uuidv4 } from "uuid";
import { supabase } from './../../../../supabaseClient';

const AlertForm = () => {
  const [textAlert, setTextAlert] = useState("");
  const [teamsId, setTeamsId] = useState("");
  const [readOrNot, setReadOrNot] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('vianney_alertes_specifiques')
        .insert([
          {
            id: uuidv4(),
            text_alert: textAlert,
            teams_id: teamsId,
            read_or_not: readOrNot
          }
        ]);

      if (error) {
        throw error;
      }

      // Reset form fields
      setTextAlert("");
      setTeamsId("");
      setReadOrNot(false);
      // Show success toast
      toast({
        title: "Alert created.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      // Show error toast
      toast({
        title: "An error occurred.",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing="4" alignItems="flex-start">
        <FormControl>
          <FormLabel>Text Alert</FormLabel>
          <Input
            type="text"
            value={textAlert}
            onChange={(e) => setTextAlert(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Teams ID</FormLabel>
          <Input
            type="text"
            value={teamsId}
            onChange={(e) => setTeamsId(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <Checkbox
            isChecked={readOrNot}
            onChange={(e) => setReadOrNot(e.target.checked)}
          >
            Read or Not
          </Checkbox>
        </FormControl>
        <Button type="submit" colorScheme="blue">
          Submit
        </Button>
      </VStack>
    </form>
  );
};

export default AlertForm;
