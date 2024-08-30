import React, { useEffect, useCallback } from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel, Icon } from "@chakra-ui/react";
import { FcDocument, FcGrid, FcList } from "react-icons/fc";
import { useHistory, useLocation } from "react-router-dom";

const DocumentTabs = () => {
  const history = useHistory();
  const location = useLocation();

  // Determine which tab should be active based on the current path
  const determineActiveIndex = useCallback(() => {
    switch (location.pathname) {
      case "/admin/rapport-incident":
        return 0;
      case "/admin/tableau-excel":
        return 1;
      case "/admin/alertejesuisendanger":
        return 2;
      default:
        return 0;
    }
  }, [location.pathname]);

  const [tabIndex, setTabIndex] = React.useState(determineActiveIndex());

  // Update the tab index when the location changes
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
        <Tab onClick={() => handleTabClick(0, "/admin/rapport-incident")}>
          <Icon as={FcDocument} mr={2} />
          Rapport d'incident
        </Tab>
        <Tab onClick={() => handleTabClick(1, "/admin/tableau-excel")}>
          <Icon as={FcGrid} mr={2} />
          Tableau Excel
        </Tab>
        <Tab onClick={() => handleTabClick(2, "/admin/alertejesuisendanger")}>
          <Icon as={FcList} mr={2} />
          Fiche Suap
        </Tab>
      </TabList>

      <TabPanels>
        <TabPanel />
        <TabPanel />
        <TabPanel />
      </TabPanels>
    </Tabs>
  );
};

export default DocumentTabs;
