import React from "react";
import ReactDOM from "react-dom";
import { ChakraProvider } from "@chakra-ui/react";
import AlertForm from "./components/AlertForm"; 

ReactDOM.render(
  <ChakraProvider>
    <AlertForm />
  </ChakraProvider>,
  document.getElementById("root")
);
