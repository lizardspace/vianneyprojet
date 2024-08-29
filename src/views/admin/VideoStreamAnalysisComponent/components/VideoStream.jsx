import React, { useRef, useEffect, useState } from 'react';
import { Box, Button, Text } from '@chakra-ui/react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';

const VideoStream = () => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [erreur, setErreur] = useState(null);
  const [modele, setModele] = useState(null);
  const [predictionsStables, setPredictionsStables] = useState([]);
  const accumulateurDePredictions = useRef({});

  useEffect(() => {
    const demarrerFluxVideo = async () => {
      try {
        const flux = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = flux;
        if (videoRef.current) {
          videoRef.current.srcObject = flux;
        }
      } catch (erreur) {
        console.error('Erreur d\'accès à la webcam : ', erreur);
        setErreur('Erreur d\'accès à la webcam. Veuillez vérifier votre appareil et les paramètres de votre navigateur.');
      }
    };

    const chargerModele = async () => {
      try {
        const modeleCharge = await cocoSsd.load();
        setModele(modeleCharge);
      } catch (erreur) {
        console.error('Erreur de chargement du modèle TensorFlow : ', erreur);
        setErreur('Erreur de chargement du modèle. Veuillez réessayer plus tard.');
      }
    };

    demarrerFluxVideo();
    chargerModele();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (modele && videoRef.current) {
      const detecterObjets = async () => {
        if (videoRef.current.readyState === 4) {
          const predictions = await modele.detect(videoRef.current);

          // Accumuler les prédictions
          predictions.forEach(prediction => {
            const { class: objetClasse } = prediction;
            if (!accumulateurDePredictions.current[objetClasse]) {
              accumulateurDePredictions.current[objetClasse] = {
                count: 0,
                lastDetected: new Date(),
              };
            }
            accumulateurDePredictions.current[objetClasse].count += 1;
            accumulateurDePredictions.current[objetClasse].lastDetected = new Date();
          });

          // Filtrer les prédictions stables
          const maintenant = new Date();
          const stables = Object.entries(accumulateurDePredictions.current)
            .filter(([_, value]) => {
              // Garder uniquement les objets détectés plusieurs fois et récemment
              return value.count > 2 && (maintenant - value.lastDetected) < 1000;
            })
            .map(([key]) => key);

          setPredictionsStables(stables);
        }
        requestAnimationFrame(detecterObjets);
      };
      detecterObjets();
    }
  }, [modele]);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
      {erreur ? (
        <Text color="red">{erreur}</Text>
      ) : (
        <>
          <Box 
            as="video" 
            ref={videoRef} 
            autoPlay 
            width="80%" // Ajuster la largeur pour rendre la vidéo plus petite
            maxWidth="500px" // Définir une largeur maximale pour la vidéo
            height="auto" 
            borderRadius="md" 
            boxShadow="md" 
            mb={4}
            mx="auto" // Centrer la vidéo horizontalement
          />
          <Button onClick={() => { if (videoRef.current) videoRef.current.srcObject = null }} colorScheme="red">
            Arrêter la vidéo
          </Button>
          <Box mt={4} width="100%" textAlign="left">
            <Text fontWeight="bold" mb={2}>Objets détectés :</Text>
            <Box display="flex" flexDirection="column" gap={2}>
              {predictionsStables.length > 0 ? (
                predictionsStables.map((prediction, index) => (
                  <Box
                    key={index}
                    bg="blue.50"
                    border="1px solid"
                    borderColor="blue.500"
                    borderRadius="md"
                    p={2}
                  >
                    <Text color="blue.700" fontWeight="bold">{prediction}</Text>
                  </Box>
                ))
              ) : (
                <Text>Aucun objet détecté.</Text>
              )}
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default VideoStream;
