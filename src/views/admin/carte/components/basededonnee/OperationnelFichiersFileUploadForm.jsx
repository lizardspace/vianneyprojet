import React, { useState } from 'react';
import { Button, Input, FormControl, FormLabel, Box } from '@chakra-ui/react';
import { supabase } from './../../../../../supabaseClient';

const OperationnelFichiersFileUploadForm = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    let { error: uploadError } = await supabase.storage
      .from('vianney-operationnel-fichiers')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      return;
    }

    const { data: urlData, error: urlError } = supabase
      .storage
      .from('vianney-operationnel-fichiers')
      .getPublicUrl(filePath);

    if (urlError) {
      console.error('Error getting public URL:', urlError);
      return;
    }

    const publicURL = urlData.publicUrl;

    if (!publicURL) {
      console.error('Public URL is null');
      return;
    }

    const { error: dbError } = await supabase
      .from('vianney_operationnel_fichiers')
      .insert([{ file_name: file.name, url: publicURL }]);

    if (dbError) {
      console.error('Error inserting into database:', dbError);
      return;
    }

    setFileName(file.name);
    alert('File uploaded successfully!');
  };

  return (
    <Box p={4}>
      <FormControl>
        <FormLabel htmlFor="file">Choose file to upload</FormLabel>
        <Input type="file" id="file" onChange={handleFileChange} />
      </FormControl>
      <Button mt={4} colorScheme="teal" onClick={handleUpload}>
        Upload File
      </Button>
      {fileName && <Box mt={4}>Uploaded file: {fileName}</Box>}
    </Box>
  );
};

export default OperationnelFichiersFileUploadForm;
