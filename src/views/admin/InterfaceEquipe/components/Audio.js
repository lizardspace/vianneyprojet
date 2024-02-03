import React, { useState, useEffect, useRef } from 'react';
import { ChakraProvider, Box, VStack, IconButton } from '@chakra-ui/react';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import Peer from 'simple-peer';

function AudioSpace() {
  const [peers, setPeers] = useState([]);
  const [stream, setStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false); 
  const peerRef = useRef();
  const audioRef = useRef();

  useEffect(() => {
    // Get the user's audio stream (you may need to request microphone access)
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((userStream) => {
        setStream(userStream);

        // Initialize WebRTC connections for each user
        peerRef.current = new Peer({ initiator: true, stream: userStream });

        // Add code to handle signaling and other WebRTC logic
        peerRef.current.on('signal', (data) => {
          // Send the signaling data to other users
          // Example: socket.emit('signal', data);
        });

        // Handle incoming streams from other users
        peerRef.current.on('stream', (remoteStream) => {
          // Create a new peer object for each user and add it to the state
          setPeers((prevPeers) => [...prevPeers, { peer: peerRef.current, stream: remoteStream }]);
        });
      })
      .catch((error) => {
        console.error('Error accessing microphone:', error);
      });

    return () => {
      // Clean up resources when component unmounts
      peerRef.current.destroy();
      setPeers([]);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const toggleMute = () => {
    // Toggle microphone mute/unmute
    if (stream) {
      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length > 0) {
        audioTracks[0].enabled = !audioTracks[0].enabled;
        setIsMuted(!audioTracks[0].enabled);
      }
    }
  };

  return (
    <Box>
      <VStack spacing={4}>
        {/* UI elements for audio space */}
        <IconButton
          icon={isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
          onClick={toggleMute}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        />
        {peers.map((peerData, index) => (
          <div key={index}>
            {/* Display audio stream for each user */}
            <audio ref={audioRef} autoPlay></audio>
          </div>
        ))}
      </VStack>
    </Box>
  );
}

function Audio() {
  return (
    <ChakraProvider>
      <AudioSpace />
    </ChakraProvider>
  );
}

export default Audio;
