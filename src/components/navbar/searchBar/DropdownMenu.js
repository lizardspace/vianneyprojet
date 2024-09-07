import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Alert,
  AlertIcon,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react';
import { FcExpand, FcCollapse, FcAdvance } from 'react-icons/fc';
import { useEvent } from './../../../EventContext'; // Use EventContext to access selected event
import { createClient } from '@supabase/supabase-js';
import AlertModal from 'components/AlertModal';

const supabaseUrl = 'https://hvjzemvfstwwhhahecwu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2anplbXZmc3R3d2hoYWhlY3d1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5MTQ4Mjc3MCwiZXhwIjoyMDA3MDU4NzcwfQ.6jThCX2eaUjl2qt4WE3ykPbrh6skE8drYcmk-UCNDSw';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const DropdownMenu = () => {
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [unresolvedAlert, setUnresolvedAlert] = useState(null);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [teams, setTeams] = useState([]);

  const { selectedEventId, selectedEventName } = useEvent(); // Get event details from context
  const toast = useToast();

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const { data, error } = await supabase
          .from('vianney_sos_alerts')
          .select('*')
          .or('resolved.is.false,resolved.is.null');
        if (error) {
          throw error;
        }
        if (data.length > 0) {
          setUnresolvedAlert(data[0]); // Show the first unresolved alert
          setIsAlertModalOpen(true);
        }
      } catch (error) {
        console.error('Error fetching alerts:', error.message);
      }
    };

    fetchAlerts(); // Initial fetch

    // Check for unresolved alerts every 60 seconds
    const intervalId = setInterval(fetchAlerts, 60000); // 60 seconds in milliseconds

    return () => clearInterval(intervalId); // Clean up the interval on component unmount
  }, []);

  useEffect(() => {
    const fetchTeams = async () => {
      if (selectedEventId) {
        try {
          const { data, error } = await supabase.from('vianney_teams').select('*').eq('event_id', selectedEventId);
          if (error) {
            throw error;
          }
          setTeams(data);

          // Update the unresolved alert with the list of team IDs
          if (unresolvedAlert) {
            const teamIds = data.map(team => team.id);
            await supabase
              .from('vianney_sos_alerts')
              .update({ teams_to_which_send_a_notification: teamIds })
              .eq('id', unresolvedAlert.id);
          }
        } catch (error) {
          console.error('Error fetching teams:', error.message);
        }
      }
    };

    fetchTeams();
  }, [selectedEventId, unresolvedAlert]);

  const resolveAlert = async (id) => {
    const { error } = await supabase
      .from('vianney_sos_alerts')
      .update({ resolved: true })
      .eq('id', id);

    if (!error) {
      setUnresolvedAlert(null);
      setIsAlertModalOpen(false);
      toast({
        title: "Alerte résolue.",
        description: "L'alerte a été marquée comme résolue avec succès.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } else {
      console.error('Error resolving alert:', error);
    }
  };

  return (
    <Box>
      <Button rightIcon={selectedEventId ? <FcCollapse /> : <FcExpand />} isDisabled>
        {selectedEventName || 'Chargement de l\'événement...'}
      </Button>

      {!selectedEventId && (
        <Alert status="warning" mt={2}>
          <AlertIcon />
          Aucun événement sélectionné.
        </Alert>
      )}

      <Modal isOpen={isEventModalOpen && !selectedEventId} onClose={() => setIsEventModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Sélectionnez un événement</ModalHeader>
          <ModalBody>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              Veuillez sélectionner un événement pour continuer.&nbsp;   <FcAdvance />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={() => setIsEventModalOpen(false)}>
              Fermer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <AlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        alert={unresolvedAlert}
        onResolve={resolveAlert}
        teams={teams}
      />
    </Box>
  );
};

export default DropdownMenu;
