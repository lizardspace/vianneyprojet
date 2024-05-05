import { useRef, useState } from 'react';
import { Box, Input, useToast, Image, Button } from '@chakra-ui/react';
import sitacImage from './../../../../assets/img/sitac.png';
import supabase from './../../../../supabaseClient';
import { useEvent } from './../../../../EventContext';

function SitacComponent() {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
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
    setFile(uploadedFile);
    setFileUrl(publicURL);
  };

  const handleSaveSITAC = async () => {
    if (!file || !selectedEventId) {
        toast({
            title: 'Erreur',
            description: "Veuillez d'abord télécharger un fichier et sélectionner un événement.",
            status: 'error',
            duration: 5000,
            isClosable: true,
        });
        return;
    }
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('vianneysitac')
        .upload(fileName, file);

    if (uploadError) {
        console.error('Error uploading file:', uploadError);
        return;
    }

    const { fullPath } = uploadData;
    const publicURL = `https://hvjzemvfstwwhhahecwu.supabase.co/storage/v1/object/public/${fullPath}`;
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
            file_url: publicURL,
            event_id: selectedEventId
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
      <Image src={fileUrl || sitacImage} alt="Sitac Background" fit="cover" w="100%" h="100%" />
      <Input position="absolute" top="70%" left="2%" w="15%" h="20%" placeholder="Situation" onChange={(e) => setSituation(e.target.value)} />
      <Input position="absolute" top="70%" left="22%" w="15%" h="20%" placeholder="Anticipation" onChange={(e) => setAnticipation(e.target.value)} />
      <Input position="absolute" top="70%" left="40%" w="15%" h="20%" placeholder="Objectif" onChange={(e) => setObjectif(e.target.value)} />
      <Input position="absolute" top="70%" left="60%" w="15%" h="20%" placeholder="Idée de manoeuvre" onChange={(e) => setIdeeManoeuvre(e.target.value)} />
      <Input position="absolute" top="70%" left="81%" w="15%" h="20%" placeholder="Exécution" onChange={(e) => setExecution(e.target.value)} />
      <Input position="absolute" top="15%" left="76%" w="20%" h="20%" placeholder="Moyen Logistique" onChange={(e) => setMoyenLogistique(e.target.value)} />
      <Input position="absolute" top="42%" left="76%" w="20%" h="20%" placeholder="Commandement" onChange={(e) => setCommandement(e.target.value)} />
      <Input position="absolute" bottom="75%" right="75%" w="auto" h="auto" type="file" ref={fileInputRef} hidden onChange={handleFileUpload} />
      <Button position="absolute" bottom="75%" right="75%" onClick={() => fileInputRef.current.click()}>
        Télécharger le fichier
      </Button>
      <Button position="absolute" bottom="-10%" left="80%" onClick={handleSaveSITAC}>
        Sauvegarder le SITAC
      </Button>
    </Box>
  );
}

export default SitacComponent;
