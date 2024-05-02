import { useRef, useState } from 'react';
import {
  Grid,
  GridItem,
  Input,
  Button,
  ChakraProvider,
  useToast,
  Icon,
  Box
} from '@chakra-ui/react';
import { FcCollect } from "react-icons/fc";
import supabase from './../../../../supabaseClient';
import { useEvent } from './../../../../EventContext';  // Import useEvent

const PlanSITAC = () => {
    const fileInputRef = useRef(null);
    const [fileUrl, setFileUrl] = useState('');
    const toast = useToast();
    const [situation, setSituation] = useState('');
    const [moyenLogistique, setMoyenLogistique] = useState('');
    const [commandement, setCommandement] = useState('');
    const [anticipation, setAnticipation] = useState('');
    const [objectif, setObjectif] = useState('');
    const [ideeManoeuvre, setIdeeManoeuvre] = useState('');
    const [execution, setExecution] = useState('');
    const { selectedEventId } = useEvent();  // Use the selected event ID from the context

    const handleFileUpload = async (event) => {
        const uploadedFile = event.target.files[0];
        if (!uploadedFile) return;
    
        const fileExt = uploadedFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from('vianneysitac')
            .upload(fileName, uploadedFile);
    
        if (uploadError) {
            console.error('Error uploading file:', uploadError);
            return;
        }
    
        const { fullPath } = uploadData;
        const publicURL = `https://hvjzemvfstwwhhahecwu.supabase.co/storage/v1/object/public/${fullPath}`;
        setFileUrl(publicURL);
    };

    const handleSaveSITAC = async () => {
        if (!fileUrl || !selectedEventId) {
            toast({
                title: 'Erreur',
                description: "Veuillez d'abord télécharger un fichier et sélectionner un événement.",
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            return;
        }
  // eslint-disable-next-line no-unused-vars
        const { data, error } = await supabase.from('vianney_sitac').insert([
            {
                situation,
                moyen_logistique: moyenLogistique,
                commandement,
                anticipation,
                objectif,
                idee_manoeuvre: ideeManoeuvre,
                execution,
                file_url: fileUrl,
                event_id: selectedEventId  // Include the event ID in your insert statement
            }
        ]);

        if (error) {
            toast({
                title: 'Erreur lors de la sauvegarde du SITAC',
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } else {
            toast({
                title: 'Succès',
                description: 'Les informations du SITAC ont été enregistrées avec succès!',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
        }
    };
    
    return (
        <ChakraProvider>
          <Grid
            h='600px'
            templateRows='repeat(6, 1fr)'
            templateColumns='repeat(12, 1fr)'
            gap={4}
            p={4}
            position="relative"
          >
              <Box position="absolute" top={2} right={2} p="12px">
                <Icon as={FcCollect} w={6} h={6} />
              </Box>
            <GridItem
              colSpan={8}
              rowSpan={2}
              p={2}
              border='1px solid black'
              borderRadius='md'
              bgImage={fileUrl ? `url(${fileUrl})` : ''}
              bgPosition="center"
              bgRepeat="no-repeat"
              bgSize="cover"
            >
              <Button onClick={() => fileInputRef.current.click()} width="full" size="lg">
                Télécharger le fichier
              </Button>
              <Input
                ref={fileInputRef}
                type="file"
                hidden
                onChange={handleFileUpload}
              />
            </GridItem>
            
            {/* Moyen Logistique Input */}
            <GridItem colStart={9} colEnd={13} border='1px solid black' borderRadius='md'>
              <Input
                placeholder="Moyen Logistique"
                variant="unstyled"
                value={moyenLogistique}
                onChange={(e) => setMoyenLogistique(e.target.value)}
              />
            </GridItem>
        
            {/* Commandement Input */}
            <GridItem colStart={9} colEnd={13} border='1px solid black' borderRadius='md'>
              <Input
                placeholder="Commandement"
                variant="unstyled"
                value={commandement}
                onChange={(e) => setCommandement(e.target.value)}
              />
            </GridItem>
        
            {/* Situation Input */}
            <GridItem colSpan={2} border='1px solid black' borderRadius='md'>
              <Input
                placeholder="Situation"
                variant="unstyled"
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
              />
            </GridItem>
        
            {/* Anticipation Input */}
            <GridItem colSpan={2} border='1px solid black' borderRadius='md'>
              <Input
                placeholder="Anticipation"
                variant="unstyled"
                value={anticipation}
                onChange={(e) => setAnticipation(e.target.value)}
              />
            </GridItem>
        
            {/* Objectif Input */}
            <GridItem colSpan={2} border='1px solid black' borderRadius='md'>
              <Input
                placeholder="Objectif"
                variant="unstyled"
                value={objectif}
                onChange={(e) => setObjectif(e.target.value)}
              />
            </GridItem>
        
            {/* Idée de Manoeuvre Input */}
            <GridItem colSpan={2} border='1px solid black' borderRadius='md'>
              <Input
                placeholder="Idée de Manoeuvre"
                variant="unstyled"
                value={ideeManoeuvre}
                onChange={(e) => setIdeeManoeuvre(e.target.value)}
              />
            </GridItem>
        
            {/* Execution Input */}
            <GridItem colSpan={4} border='1px solid black' borderRadius='md'>
              <Input
                placeholder="Exécution"
                variant="unstyled"
                value={execution}
                onChange={(e) => setExecution(e.target.value)}
              />
            </GridItem>
        
            <GridItem colSpan={12}>
              <Button colorScheme="blue" onClick={handleSaveSITAC}>
                Sauvegarder le SITAC
              </Button>
            </GridItem>
          </Grid>
        </ChakraProvider>
    );
};

export default PlanSITAC;