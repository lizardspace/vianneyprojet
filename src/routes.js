import React from "react";
import { Icon } from "@chakra-ui/react";
import {
  FcMindMap,
  FcSerialTasks,
  FcSurvey,
  FcSettings,
  FcGrid,
  FcHighPriority,
  FcDiploma2,
} from "react-icons/fc";
import { MdQrCodeScanner, MdOutlineSos } from "react-icons/md"; // Import the new icon
import { LuCross } from "react-icons/lu"; // Import the new icon

import MainDashboard from "views/admin/default";
import NFTMarketplace from "views/admin/carte";
import TableauDeBord from "views/admin/TableauDeBord";
//import InterfaceEquipe from "views/admin/InterfaceEquipe";
import TableauExcel from "views/admin/TableauExcel";
import AlerteEquipe from "views/admin/AlerteEquipe";
import MaterialComponent from "views/admin/MaterialComponent";
import ZoomedMapComponent from "views/admin/ZoomedMapComponent";
import NoteDeFraisComponent from "views/admin/NoteDeFraisComponent";
import AlerteJeSuisEnDanger from "views/admin/alertejesuisendanger"; // Import the new component
import Parameters from "views/admin/Parameters";
import SOSComponent from "views/admin/SOSComponent"; // Assuming you have a new component for the sosroute
import ChatComponent from "views/admin/ChatComponent"; // Import the new chat component

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
    icon: <Icon as={FcSerialTasks} width="20px" height="20px" color="inherit" />,
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
    name: "Paramètres",
    layout: "/admin",
    path: "/parameters",
    icon: <Icon as={FcSettings} width="20px" height="20px" color="inherit" />,
    component: Parameters,
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
    name: "Alerte à une équipe",
    layout: "/admin",
    path: "/alerte-equipe",
    icon: <Icon as={FcHighPriority} width="20px" height="20px" color="inherit" />,
    component: AlerteEquipe,
  },
  {
    name: "Matériel",
    layout: "/admin",
    path: "/material",
    icon: <Icon as={MdQrCodeScanner} width="20px" height="20px" color="inherit" />,
    component: MaterialComponent,
  },
  {
    name: "Note de frais",
    layout: "/admin",
    path: "/note-de-frais",
    icon: <Icon as={FcDiploma2} width="20px" height="20px" color="inherit" />,
    component: NoteDeFraisComponent,
  },
  {
    name: "Secours",
    layout: "/admin",
    path: "/alertejesuisendanger",
    icon: <Icon as={LuCross} width="20px" height="20px" color="red" />, // Set the icon color to red
    component: AlerteJeSuisEnDanger,
  },
  {
    name: "SOS Route",
    layout: "/admin",
    path: "/sosroute",
    icon: <Icon as={MdOutlineSos} width="20px" height="20px" color="red" />, // Set the icon color to red
    component: SOSComponent, // Assuming you have a new component for this route
  },
  {
    name: "Chat",
    layout: "/admin",
    path: "/chat",
    icon: <Icon as={FcSerialTasks} width="20px" height="20px" color="inherit" />, // You can choose another icon if you prefer
    component: ChatComponent,
  },
];

export default routes;