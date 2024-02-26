import React from "react";
import { Icon } from "@chakra-ui/react";
import {  FcMindMap, FcSerialTasks, FcSurvey, FcSettings, FcSelfie, FcGrid, FcHighPriority } from "react-icons/fc";
import MainDashboard from "views/admin/default";
import NFTMarketplace from "views/admin/carte";
//import Profile from "views/admin/profile";
import TableauDeBord from "views/admin/TableauDeBord";
import InterfaceEquipe from "views/admin/InterfaceEquipe";
import TableauExcel from "views/admin/TableauExcel";
import AlerteEquipe from "views/admin/AlerteEquipe"; // Import the component for Alerte à une équipe

// Auth Imports
//import SignInCentered from "views/auth/signIn";
import Parameters from "views/admin/Parameters";

const routes = [
  {
    name: "Interface Equipe",
    layout: "/admin",
    path: "/default",
    icon: <Icon as={FcSelfie} width='20px' height='20px' color='inherit' />,
    component: InterfaceEquipe,
  },
 // {
 //   name: "Interface Equipe",
 //   layout: "/admin",
 //   path: "/interface-equipe",
 //   icon: <Icon as={FcSelfie} width='20px' height='20px' color='inherit' />,
  //  component: InterfaceEquipe,
//  },
 // {
 //   name: "Carte",
 //   layout: "/admin",
 //   path: "/map",
 //   icon: <Icon as={FcMindMap} width='20px' height='20px' color='inherit' />,
 //   component: NFTMarketplace,
 //   secondary: true,
 // },
//  {
//    name: "Tableau de bord",
//    layout: "/admin",
//    path: "/data-tables",
//    icon: <Icon as={FcSerialTasks} width='20px' height='20px' color='inherit' />,
 //   component: TableauDeBord,
 // },
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
 // {
 //   name: "Paramètres",
 //   layout: "/admin",
 //   path: "/parameters",
 //   icon: <Icon as={FcSettings} width='20px' height='20px' color='inherit' />,
 //   component: Parameters,
//  },

 // {
 //   name: "Tableau Excel",
 //   layout: "/admin",
 //   path: "/tableau-excel",
 //   icon: <Icon as={FcGrid} width='20px' height='20px' color='inherit' />,
 //   component: TableauExcel,
 // },
 // {
 //   name: "Alerte à une équipe", // Name of the new route
 //   layout: "/admin",
  //  path: "/alerte-equipe", // Path for the new route
 //   icon: <Icon as={FcHighPriority} width='20px' height='20px' color='inherit' />, // You can use an appropriate icon component here
  //  component: AlerteEquipe, // Component for the new route
  //},
];

export default routes;
