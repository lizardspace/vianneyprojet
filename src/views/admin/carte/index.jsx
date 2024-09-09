import React, { useEffect, useState, useRef } from 'react';
import { Box, Flex, Tabs, TabList, TabPanels, Tab, TabPanel, Grid, SimpleGrid } from "@chakra-ui/react";
import MapComponent from "views/admin/carte/components/MapComponent";
import VianneyAlertChat from "views/admin/TableauDeBord/components/VianneyAlertChat";
import TableTopCreators from "views/admin/carte/components/TableTopCreators";
import tableDataTopCreators from "views/admin/carte/variables/tableDataTopCreators.json";
import { tableColumnsTopCreators } from "views/admin/carte/variables/tableColumnsTopCreators";
import MeteoBlue from './components/MeteoBlue';
import MeteoAgricole from './components/MeteoAgricole';
import EquipiersTableSimplify from './components/EquipiersTableSimplify';
import LiveVideo from './components/tv/LiveVideo';
import EuronewsLive from './components/tv/EuronewsLive';
import NewChannelLive from './components/tv/NewChannelLive';
import ShowSITACbis from './components/ShowSITACbis';
import RenseignementsInformationsForm from './components/RenseignementsInformationsForm';
import RenseignementsInformationsDisplayReports from './components/RenseignementsInformationsDisplayReports';
import InventoryDisplay from './components/InventoryDisplay';
import LiveStreamsPage from './components/surveillance/LiveStreamsPage';
import EditableRectangle from './components/SitacComponent';
import JSPaintComponent from './components/JSPaintComponent';
import YandexImage from './components/YandexImage';
import FluxRssInput from './components/FluxRssInput';
import FluxRssRssFeed from './components/FluxRssRssFeed';
import BaseDeDonneeOperationnel from './components/basededonnee/BaseDeDonneeOperationnel';
import BaseDeDonneeRenseignements from './components/basededonnee/BaseDeDonneeRenseignements';
import BaseDeDonneeMoyens from './components/basededonnee/BaseDeDonneeMoyens';
import VianneyAlertTableEvent from '../TableauExcel/componentsEventContext/VianneyAlertTableEvent';
import VideoStream from './components/tv/VideoStream';

export default function Marketplace() {
  // eslint-disable-next-line no-unused-vars
  const [maxWidth, setMaxWidth] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [isFullScreen, setIsFullScreen] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [mapKey, setMapKey] = useState(Date.now());
  const mapRef = useRef(null);

  const setMaxWidthBasedOnScreen = () => {
    const screenSize = window.innerWidth;
    const newMaxWidth = screenSize / 2.1;
    setMaxWidth(screenSize <= 768 ? '100%' : `${newMaxWidth}px`);
  };

  useEffect(() => {
    setMaxWidthBasedOnScreen();
    window.addEventListener('resize', setMaxWidthBasedOnScreen);

    return () => {
      window.removeEventListener('resize', setMaxWidthBasedOnScreen);
    };
  }, []);

  return (
    <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
      <Tabs isFitted variant="enclosed">
        <TabList mb="1em">
          <Tab>Opérationnel</Tab>
          <Tab>Renseignements</Tab>
          <Tab>Moyens</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Tabs variant="enclosed">
              <TabList>
                <Tab>Situation - GOC</Tab>
                <Tab>SITAC</Tab>
                <Tab>Dessin</Tab> {/* Nouvel onglet "Dessin" */}
                <Tab>Base de données</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Box>
                    <Flex direction={{ base: "column", md: "row" }} mt="10px">
                      <Box flex="1" borderRadius="lg" overflow="hidden">
                        <MapComponent key={mapKey} ref={mapRef} />
                      </Box>
                      <Box flex="1" ml={{ md: "10px" }} display={isFullScreen ? 'none' : 'block'}>
                        <VianneyAlertTableEvent />
                        <Box my={4} />
                        <VianneyAlertChat />
                      </Box>
                    </Flex>
                    <Box mt="10px" borderRadius="lg" overflow="hidden">
                      <TableTopCreators
                        tableData={tableDataTopCreators}
                        columnsData={tableColumnsTopCreators}
                      />
                    </Box>
                  </Box>
                </TabPanel>
                <TabPanel>
                  <Box mb="70px">
                    <EditableRectangle />
                  </Box>
                  <ShowSITACbis />
                </TabPanel>
                <TabPanel>
                  {/* Contenu de l'onglet "Dessin" */}
                  <JSPaintComponent />
                </TabPanel>
                <TabPanel>
                  <BaseDeDonneeOperationnel/>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </TabPanel>
          <TabPanel>
            <Tabs variant="enclosed">
              <TabList>
                <Tab>Recherches</Tab>
                <Tab>Informations</Tab>
                <Tab>Surveillances</Tab> {/* Changed "Surveillance" to "Surveillances" */}
                <Tab>Météo</Tab>
                <Tab>Télévision</Tab> {/* Changed "Télévisions" to "Télévision" */}
                <Tab>Base de données</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  {/* Content for "Recherches" sub-tab */}
                  <YandexImage />
                </TabPanel>

                <TabPanel>
                  {/* Content for "Informations" sub-tab */}
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <Box>
                      <RenseignementsInformationsForm />
                    </Box>
                    <Box mt={4}>
                      <RenseignementsInformationsDisplayReports />
                    </Box>
                  </SimpleGrid>
                  <FluxRssInput/>
                  <FluxRssRssFeed/>
                </TabPanel>
                <TabPanel>
                  {/* Content for "Surveillances" sub-tab */}
                  <LiveStreamsPage />
                </TabPanel>
                <TabPanel>
                  <MeteoAgricole />
                  <Box mt={4}>
                    <MeteoBlue />
                  </Box>
                </TabPanel>
                <TabPanel>
                  <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                    <Box>
                      <LiveVideo />
                    </Box>
                    <Box>
                      <EuronewsLive />
                    </Box>
                    <Box>
                      <VideoStream/>
                    </Box>
                    <Box>
                      <NewChannelLive />
                    </Box>
                  </Grid>
                </TabPanel>
                <TabPanel>
                  <BaseDeDonneeRenseignements/>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </TabPanel>
          <TabPanel>
            <Tabs variant="enclosed">
              <TabList>
                <Tab>Matériel</Tab> {/* Changed "Matériels" to "Matériel" */}
                <Tab>Effectif</Tab> {/* Changed "Effectifs" to "Effectif" */}
                <Tab>Base de données</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  {/* Content for "Matériel" sub-tab */}
                  <InventoryDisplay />
                </TabPanel>
                <TabPanel>
                  {/* Content for "Effectif" sub-tab */}
                  <EquipiersTableSimplify />
                </TabPanel>
                <TabPanel>
                  <BaseDeDonneeMoyens/>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}