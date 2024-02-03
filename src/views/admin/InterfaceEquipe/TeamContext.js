import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a context
const TeamContext = createContext();

// Provider component that wraps your app and makes the team info available globally
export const TeamProvider = ({ children }) => {
  const [selectedTeam, setSelectedTeam] = useState(""); // The selected team
  const [teamData, setTeamData] = useState([]); // To store fetched team data

  useEffect(() => {
    // Suppose this function fetches team data
    async function fetchTeamData() {
      // Your fetching logic here...
    }

    fetchTeamData();
  }, []);

  // Value provided to consumers
  const value = {
    selectedTeam,
    setSelectedTeam,
    teamData,
    setTeamData,
  };

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
};

// Custom hook to use the team context
export const useTeam = () => useContext(TeamContext);
