// src/RealtimeContext.js
import React, { createContext, useEffect, useState, useContext } from 'react';
import supabase from './supabaseClient';
import AlertModal from './components/AlertModal';
import { useDisclosure } from '@chakra-ui/react';

export const RealtimeContext = createContext();

export const RealtimeProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [unresolvedAlert, setUnresolvedAlert] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    // Function to handle real-time updates
    const handleRealTimeUpdate = (event, payload) => {
      console.log(`Change in ${event.table}:`, payload);
      const newData = payload.new;
      setData((prevData) => [...prevData, newData]);
      if (event.table === 'vianney_sos_alerts' && !newData.resolved) {
        setUnresolvedAlert(newData);
        onOpen();
      }
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
  }, [onOpen]); // Include onOpen in the dependency array

  const resolveAlert = async (id) => {
    const { error } = await supabase
      .from('vianney_sos_alerts')
      .update({ resolved: true })
      .eq('id', id);

    if (!error) {
      setUnresolvedAlert(null);
      onClose();
    } else {
      console.error('Error resolving alert:', error);
    }
  };

  const unresolvedAlerts = data.filter(alert => alert.table === 'vianney_sos_alerts' && !alert.resolved);

  return (
    <RealtimeContext.Provider value={{ data, unresolvedAlerts, resolveAlert }}>
      {children}
      <AlertModal
        isOpen={isOpen}
        onClose={onClose}
        alert={unresolvedAlert}
        onResolve={resolveAlert}
      />
    </RealtimeContext.Provider>
  );
};

export const useRealtimeContext = () => useContext(RealtimeContext);
