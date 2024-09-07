import React, { useEffect, useCallback } from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel, Icon } from "@chakra-ui/react";
import { FcDocument, FcGrid, FcList, FcFolder } from "react-icons/fc";
import { useHistory, useLocation } from "react-router-dom";

const DocumentTabs = () => {
  const history = useHistory();
  const location = useLocation();

  // Déterminer quel onglet est actif en fonction du chemin
  const determineActiveIndex = useCallback(() => {
    switch (location.pathname) {
      case "/admin/ajouter-document":
        return 0;
      case "/admin/rapport-incident":
        return 1;
      case "/admin/tableau-excel":
        return 2;
      case "/admin/alertejesuisendanger":
        return 3;
      default:
        return 0;
    }
  }, [location.pathname]);

  const [tabIndex, setTabIndex] = React.useState(determineActiveIndex());

  // Mettre à jour l'index de l'onglet lorsque l'emplacement change
  useEffect(() => {
    setTabIndex(determineActiveIndex());
  }, [location.pathname, determineActiveIndex]);

  const handleTabClick = (index, path) => {
    setTabIndex(index);
    history.push(path);
  };

  return (
    <Tabs index={tabIndex} variant="soft-rounded" colorScheme="blue">
      <TabList>
        <Tab onClick={() => handleTabClick(0, "/admin/ajouter-document")}>
          <Icon as={FcFolder} mr={2} />
          Documents
        </Tab>
        <Tab onClick={() => handleTabClick(1, "/admin/rapport-incident")}>
          <Icon as={FcDocument} mr={2} />
          Rapport d'incident
        </Tab>
        <Tab onClick={() => handleTabClick(2, "/admin/tableau-excel")}>
          <Icon as={FcGrid} mr={2} />
          Tableau Excel
        </Tab>
        <Tab onClick={() => handleTabClick(3, "/admin/alertejesuisendanger")}>
          <Icon as={FcList} mr={2} />
          Fiche Suap
        </Tab>
      </TabList>

      <TabPanels>
        <TabPanel />
        <TabPanel />
        <TabPanel />
        <TabPanel />
      </TabPanels>
    </Tabs>
  );
};

export default DocumentTabs;
