import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './../../../supabaseClient';

const TeamContext = createContext();

// Provider component that wraps your app and makes the team info available globally
export const TeamProvider = ({ children }) => {
    const [selectedTeam, setSelectedTeam] = useState(""); // The selected team
    const [teamData, setTeamData] = useState([]); // To store fetched team data
    const [teamMembers, setTeamMembers] = useState([]);
    // In TeamContext.js or wherever you have defined your context and provider

    useEffect(() => {
        async function fetchSelectedTeamDetails() {
            if (!selectedTeam) return; // Do not fetch if no team is selected

            try {
                const { data, error } = await supabase
                    .from('vianney_teams')
                    .select('team_members')
                    .eq('name_of_the_team', selectedTeam) // Assuming 'name_of_the_team' is what you store in 'selectedTeam'
                    .single(); // Assuming you want to fetch a single record

                if (error) throw error;

                // Assume 'team_members' is stored directly as an array in the fetched data
                if (data && data.team_members) {
                    setTeamMembers(data.team_members);
                }
            } catch (error) {
                console.error('Error fetching selected team details:', error);
            }
        }

        fetchSelectedTeamDetails();
    }, [selectedTeam, setTeamMembers]); // Add setTeamMembers to your context if it's not already there

    const value = {
        selectedTeam,
        setSelectedTeam,
        teamData,
        setTeamData,
        teamMembers, // Add this line
        setTeamMembers, // And this
      };

    return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
};

// Custom hook to use the team context
export const useTeam = () => useContext(TeamContext);
