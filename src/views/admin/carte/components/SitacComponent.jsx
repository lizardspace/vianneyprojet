import { useRef, useState } from 'react';
import { Box, Input,   useToast, Image } from '@chakra-ui/react';
import sitacImage from './../../../../assets/img/sitac.png'; 
import supabase from './../../../../supabaseClient';
import { useEvent } from './../../../../EventContext'; 

function SitacComponent() {
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
    <Box position="relative" h="768px" w="1020px">
      <Image src={sitacImage} alt="Sitac Background" fit="cover" w="100%" h="100%" />
      <Input position="absolute" top="70%" left="2%" w="15%" h="20%" placeholder="Situation" />
      <Input position="absolute" top="70%" left="22%" w="15%" h="20%" placeholder="Anticipation" />
      <Input position="absolute" top="70%" left="40%" w="15%" h="20%" placeholder="Objectif" />
      <Input position="absolute" top="70%" left="60%" w="15%" h="20%" placeholder="Idée de manoeuvre" />
      <Input position="absolute" top="70%" left="81%" w="15%" h="20%" placeholder="Exécution" />
      <Input position="absolute" top="15%" left="76%" w="20%" h="20%" placeholder="Moyen Logistique" />
      <Input position="absolute" top="42%" left="76%" w="20%" h="20%" placeholder="Commandement" />
    </Box>
  );
}

export default SitacComponent;
