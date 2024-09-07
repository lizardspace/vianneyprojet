import React from "react";
import { Icon } from "@chakra-ui/react";
import { FcMindMap, FcVideoCall, FcPlanner, FcSurvey, FcSettings, FcGrid, FcHighPriority, FcDiploma2, FcDocument, FcAbout, FcOpenedFolder, FcMoneyTransfer } from "react-icons/fc";
import { MdQrCodeScanner, MdOutlineSos } from "react-icons/md"; 

import MainDashboard from "views/admin/default";
import NFTMarketplace from "views/admin/carte";
import TableauDeBord from "views/admin/TableauDeBord";
import TableauExcel from "views/admin/TableauExcel";
import AlerteEquipe from "views/admin/AlerteEquipe";
import MaterialComponent from "views/admin/MaterialComponent";
import ZoomedMapComponent from "views/admin/ZoomedMapComponent";
import NoteDeFraisComponent from "views/admin/NoteDeFraisComponent";
import AlerteJeSuisEnDanger from "views/admin/alertejesuisendanger"; 
import Parameters from "views/admin/Parameters";
import SOSComponent from "views/admin/SOSComponent"; 
import ChatComponent from "views/admin/ChatComponent"; 
import IncidentReportForm from "views/admin/IncidentReportForm"; 
import VideoStreamAnalysisComponent from "views/admin/VideoStreamAnalysisComponent"; 
import Factures from "views/admin/Factures"; 
import AddDocumentComponent from "views/admin/AddDocumentComponent";

const routes = [
  {
    name: "Ecran principal",
    layout: "/admin",
    path: "/default",
    icon: <Icon as={FcSurvey} width="20px" height="20px" color="inherit" />,
    component: MainDashboard,
  },
  {
    name: "Gestion opérationnelle",
    layout: "/admin",
    path: "/map",
    icon: <Icon as={FcMindMap} width="20px" height="20px" color="inherit" />,
    component: NFTMarketplace,
    secondary: true,
  },
  {
    name: "Emploi du temps",
    layout: "/admin",
    path: "/data-tables",
    icon: <Icon as={FcPlanner} width="20px" height="20px" color="inherit" />,
    component: TableauDeBord,
  },
  {
    name: "Carte zoomée",
    layout: "/admin",
    path: "/zoomed-map",
    component: ZoomedMapComponent,
  },
  //
 // {
 //   name: "Profil des utilisateurs",
 //   layout: "/admin",
 //   path: "/profile",
//    icon: <Icon as={FcBusinessman} width='20px' height='20px' color='inherit' />,
 //   component: Profile,
 // },
 // {
 //   name: "Login",
 //   layout: "/auth",
 //   path: "/sign-in",
  //  icon: <Icon as={FcLock} width='20px' height='20px' color='inherit' />,
  //  component: SignInCentered,
 // },
  {
    name: "Chat",
    layout: "/admin",
    path: "/chat",
    icon: <Icon as={FcAbout} width="20px" height="20px" color="inherit" />, 
    component: ChatComponent,
  },
  {
    name: "Paramètres",
    layout: "/admin",
    path: "/parameters",
    icon: <Icon as={FcSettings} width="20px" height="20px" color="inherit" />,
    component: Parameters,
  },
  {
    name: "Documents",
    layout: "/admin",
    path: "/alertejesuisendanger",
    icon: <Icon as={FcOpenedFolder} width="20px" height="20px" color="red" />, 
    component: AlerteJeSuisEnDanger,
  },
 // {
 //   name: "Interface Equipe",
 //   layout: "/admin",
 //   path: "/interface-equipe",
 //   icon: <Icon as={FcSelfie} width="20px" height="20px" color="inherit" />,
 //   component: InterfaceEquipe,
 // },
  {
    name: "Tableau Excel",
    layout: "/admin",
    path: "/tableau-excel",
    icon: <Icon as={FcGrid} width="20px" height="20px" color="inherit" />,
    component: TableauExcel,
  },
  {
    name: "Matériel",
    layout: "/admin",
    path: "/material",
    icon: <Icon as={MdQrCodeScanner} width="20px" height="20px" color="inherit" />,
    component: MaterialComponent,
  },
  {
    name: "Comptabilité",
    layout: "/admin",
    path: "/note-de-frais",
    icon: <Icon as={FcDiploma2} width="20px" height="20px" color="inherit" />,
    component: NoteDeFraisComponent,
  },
  {
    name: "SOS Alerte Silencieuse",
    layout: "/admin",
    path: "/sosroute",
    icon: <Icon as={MdOutlineSos} width="20px" height="20px" color="red" />, 
    component: SOSComponent, 
  },
  {
    name: "Rapport d'incident",
    layout: "/admin",
    path: "/rapport-incident",
    icon: <Icon as={FcDocument} width="20px" height="20px" color="inherit" />,
    component: IncidentReportForm,
  },
  {
    name: "Analyse flux vidéo",
    layout: "/admin",
    path: "/video-stream-analysis",
    icon: <Icon as={FcVideoCall} width="20px" height="20px" color="inherit" />,
    component: VideoStreamAnalysisComponent,
  },
  {
    name: "Alerte à une équipe",
    layout: "/admin",
    path: "/alerte-equipe",
    icon: <Icon as={FcHighPriority} width="20px" height="20px" color="inherit" />,
    component: AlerteEquipe,
  },
  {
    name: "Factures",
    layout: "/admin",
    path: "/factures",
    icon: <Icon as={FcMoneyTransfer} width="20px" height="20px" color="inherit" />,
    component: Factures,
  },
  {
    name: "Ajouter un document",
    layout: "/admin",
    path: "/ajouter-document",
    icon: <Icon as={FcOpenedFolder} width="20px" height="20px" color="inherit" />,
    component: AddDocumentComponent,
  },
];

export default routes;
