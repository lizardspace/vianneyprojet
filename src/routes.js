import React from "react";
import { Icon } from "@chakra-ui/react";
import { FcBusinessman, FcLock, FcMindMap, FcSerialTasks, FcSurvey, FcSettings, FcSelfie, FcGrid } from "react-icons/fc";
// Admin Imports
import MainDashboard from "views/admin/default";
import NFTMarketplace from "views/admin/carte";
import Profile from "views/admin/profile";
import TableauDeBord from "views/admin/TableauDeBord";
import InterfaceEquipe from "views/admin/InterfaceEquipe";
import TableauExcel from "views/admin/TableauExcel";

// Auth Imports
import SignInCentered from "views/auth/signIn";
import Parameters from "views/admin/Parameters";

const routes = [
  {
    name: "Ecran principal",
    layout: "/admin",
    path: "/default",
    icon: <Icon as={FcSurvey} width='20px' height='20px' color='inherit' />,
    component: MainDashboard,
  },
  {
    name: "Carte",
    layout: "/admin",
    path: "/map",
    icon: <Icon as={FcMindMap} width='20px' height='20px' color='inherit' />,
    component: NFTMarketplace,
    secondary: true,
  },
  {
    name: "Tableau de bord",
    layout: "/admin",
    path: "/data-tables",
    icon: <Icon as={FcSerialTasks} width='20px' height='20px' color='inherit' />,
    component: TableauDeBord,
  },
  {
    name: "Profile des utilisateur",
    layout: "/admin",
    path: "/profile",
    icon: <Icon as={FcBusinessman} width='20px' height='20px' color='inherit' />,
    component: Profile,
  },
  {
    name: "Login",
    layout: "/auth",
    path: "/sign-in",
    icon: <Icon as={FcLock} width='20px' height='20px' color='inherit' />,
    component: SignInCentered,
  },
  {
    name: "Paramètres",
    layout: "/admin",
    path: "/parameters",
    icon: <Icon as={FcSettings} width='20px' height='20px' color='inherit' />,
    component: Parameters,
  },
  {
    name: "Interface Equipe",
    layout: "/admin",
    path: "/interface-equipe",
    icon: <Icon as={FcSelfie} width='20px' height='20px' color='inherit' />,
    component: InterfaceEquipe,
  },
  {
    name: "Tableau Excel",
    layout: "/admin",
    path: "/tableau-excel",
    icon: <Icon as={FcGrid} width='20px' height='20px' color='inherit' />,
    component: TableauExcel,
  },
];

export default routes;
