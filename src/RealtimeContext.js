// src/RealtimeContext.js
import React, { createContext, useEffect, useState } from 'react';
import supabase from './supabaseClient';

export const RealtimeContext = createContext();

export const RealtimeProvider = ({ children }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Function to handle real-time updates
    const handleRealTimeUpdate = (event, payload) => {
      console.log(`Change in ${event.table}:`, payload);
      setData((prevData) => [...prevData, payload.new]);
    };

    // Subscriptions array to keep track of all subscriptions
    const subscriptions = [];

    const tables = [
      'vianney_alertes_specifiques',
      'vianney_areas',
      'vianney_cameras',
      'vianney_chat_messages',
      'vianney_event',
      'vianney_expenses_reimbursement',
      'vianney_fiche_bilan_suap',
      'vianney_flux_rss',
      'vianney_form_utile_salle_de_crise',
      'vianney_incident_reports',
      'vianney_inventaire_materiel',
      'vianney_itineraries',
      'vianney_materials_with_events',
      'vianney_moyens_effectifs_fichiers',
      'vianney_moyens_materiels_fichiers',
      'vianney_operationnel_fichiers',
      'vianney_pdf_documents',
      'vianney_pdf_documents_salle_de_crise',
      'vianney_points_of_interest',
      'vianney_renseignements_fichiers',
      'vianney_renseignements_informations_reports',
      'vianney_sitac',
      'vianney_sos_alerts',
      'vianney_teams',
      'vianney_teams_and_materiel',
      'vianney_textarea',
      'vianney_textarea_salle_de_crise',
    ];

    tables.forEach((table) => {
      const subscription = supabase
        .channel(`schema-db-changes-${table}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table,
          },
          (payload) => handleRealTimeUpdate(table, payload)
        )
        .subscribe();

      subscriptions.push(subscription);
    });

    // Cleanup subscriptions on component unmount
    return () => {
      subscriptions.forEach((subscription) => supabase.removeChannel(subscription));
    };
  }, []);

  return (
    <RealtimeContext.Provider value={data}>
      {children}
    </RealtimeContext.Provider>
  );
};
