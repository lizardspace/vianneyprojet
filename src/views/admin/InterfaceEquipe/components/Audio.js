import React, { useState, useEffect, useRef } from 'react';
import { ChakraProvider, Box, VStack, IconButton, Slider, SliderTrack, SliderFilledTrack, SliderThumb } from '@chakra-ui/react';
import { FaMicrophone, FaMicrophoneSlash, FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import Peer from 'simple-peer';
import io from 'socket.io-client'; // Import Socket.IO client library

const socket = io('your_signaling_server_url'); // Initialize Socket.IO connection

function AudioSpace() {
  const [peers, setPeers] = useState([]);
  const [stream, setStream] = useState(null);
  const [isMuted, setIsMuted] = useState(true); 
  const [volume, setVolume] = useState(100); // Initial volume
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
          socket.emit('signal', data); // Send signaling data to the server
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

    // Handle signaling messages from the server
    socket.on('signal', (data) => {
      // Process signaling data and establish WebRTC connection with other users
      peerRef.current.signal(data);
    });

    return () => {
      // Clean up resources when component unmounts
      if (peerRef.current) {
        peerRef.current.destroy();
      }
      setPeers([]);
      if (stream) {
        const audioTracks = stream.getAudioTracks();
        if (audioTracks.length > 0) {
          audioTracks[0].stop();
        }
      }
    };
  }, [stream]);

  const toggleMute = () => {
    setIsMuted((prevIsMuted) => !prevIsMuted); // Toggle the isMuted state
    if (stream) {
      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length > 0) {
        const track = audioTracks[0];
        track.enabled = !track.enabled; // Toggle the enabled state of the track
      }
    }
  };
  
  
  

  const handleVolumeChange = (value) => {
    // Adjust the volume of the audio element
    setVolume(value);
    if (audioRef.current) {
      audioRef.current.volume = value / 100; // Convert volume to a value between 0 and 1
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
        <div style={{ display: 'flex', alignItems: 'center', minWidth: '200px' }}>
          <FaVolumeMute style={{ marginRight: '8px' }} />
          <Slider
            value={volume}
            onChange={handleVolumeChange}
            min={0}
            max={100}
            aria-label="Volume Control"
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
          <FaVolumeUp style={{ marginLeft: '8px' }} />
        </div>
        {peers.map((peerData, index) => (
          <div key={index}>
            {/* Display audio stream for each user */}
            <audio ref={audioRef} autoPlay muted={isMuted}></audio> {/* Set muted attribute based on isMuted state */}
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
