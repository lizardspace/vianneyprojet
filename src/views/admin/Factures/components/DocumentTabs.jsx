import React, { useEffect, useCallback } from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel, Icon } from "@chakra-ui/react";
import { FcMoneyTransfer, FcDiploma2 } from "react-icons/fc";
import { useHistory, useLocation } from "react-router-dom";

const DocumentTabs = () => {
    const history = useHistory();
    const location = useLocation();

    // Determine which tab should be active based on the current path
    const determineActiveIndex = useCallback(() => {
        switch (location.pathname) {
            case "/admin/factures":
                return 0;
            case "/admin/note-de-frais":
                return 1;
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
                <Tab onClick={() => handleTabClick(1, "/admin/note-de-frais")}>
                    <Icon as={FcDiploma2} mr={2} />
                    Comptabilité
                </Tab>
                <Tab onClick={() => handleTabClick(0, "/admin/factures")}>
                    <Icon as={FcMoneyTransfer} mr={2} />
                    Gestion des Factures
                </Tab>
            </TabList>

            <TabPanels>
                <TabPanel />
                <TabPanel />
            </TabPanels>
        </Tabs>
    );
};

export default DocumentTabs;
