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

const AlertForm = () => {
  const [textAlert, setTextAlert] = useState("");
  const [teamsId, setTeamsId] = useState("");
  const [readOrNot, setReadOrNot] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Assuming you have a function to send data to the backend
    try {
      const newData = {
        id: uuidv4(), // Generating a UUID for the id field
        text_alert: textAlert,
        teams_id: teamsId,
        read_or_not: readOrNot
      };
      // Send newData to your backend to save to the database
      console.log("Data to be saved:", newData);
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
