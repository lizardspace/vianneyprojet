import React, { useEffect, useState } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { FcDocument } from 'react-icons/fc';
import { supabase } from './../../../../../supabaseClient';

const OperationnelFichiersFichierIconList = () => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      const { data, error } = await supabase
        .from('vianney_operationnel_fichiers')
        .select('*');
      
      if (error) {
        console.error('Error fetching files:', error);
      } else {
        setFiles(data);
      }
    };

    fetchFiles();
  }, []);

  return (
    <Box p={4}>
      <Flex wrap="wrap" justifyContent="center">
        {files.map(file => (
          <Box
            key={file.id}
            m={4}
            textAlign="center"
            cursor="pointer"
            _hover={{ transform: 'scale(1.05)', transition: 'transform 0.2s' }}
          >
            <FcDocument size={50} />
            <Text mt={2} fontSize="sm">
              {file.file_name}
            </Text>
          </Box>
        ))}
      </Flex>
    </Box>
  );
};

export default OperationnelFichiersFichierIconList;
