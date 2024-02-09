import React, { useState, useEffect, useRef } from 'react';
import { ChakraProvider, Box, VStack, IconButton, Slider, SliderTrack, SliderFilledTrack, SliderThumb} from '@chakra-ui/react';
import { FaMicrophone, FaMicrophoneSlash, FaVolumeMute, FaVolumeUp, FaRecordVinyl, FaStop } from 'react-icons/fa';
import Peer from 'simple-peer';
import io from 'socket.io-client'; 
import { supabase } from './../../../../supabaseClient';

const socket = io('your_signaling_server_url'); 

function AudioSpace() {
  const [peers, setPeers] = useState([]);
  const [stream, setStream] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(100);
  const [recording, setRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const peerRef = useRef();
  const audioRef = useRef();
  const mediaRecorder = useRef(null);

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

  useEffect(() => {
    let timeoutId;

    const handleInactivity = () => {
      setIsMuted(true); // Mute the microphone
    };

    const resetInactivityTimer = () => {
      clearTimeout(timeoutId); // Clear any existing timeout
      timeoutId = setTimeout(handleInactivity, 60000); // Set a new timeout for one minute (60000 milliseconds)
    };

    // Reset the inactivity timer whenever there is user interaction (clicking the microphone icon)
    const handleClick = () => {
      setIsMuted((prevIsMuted) => !prevIsMuted);
      resetInactivityTimer();
    };

    window.addEventListener('click', handleClick);

    // Start the inactivity timer when the component mounts
    resetInactivityTimer();

    // Clean up event listener and timeout when the component unmounts or when the mute state changes
    return () => {
      window.removeEventListener('click', handleClick);
      clearTimeout(timeoutId);
    };
  }, [isMuted]);

  useEffect(() => {
    if (recording && stream) {
      const chunks = [];
      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.ondataavailable = (e) => {
        chunks.push(e.data);
      };
      mediaRecorder.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setRecordedChunks(chunks);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.style = 'display: none';
        a.href = url;
        a.download = 'recorded_audio.webm';
        a.click();
        window.URL.revokeObjectURL(url);
      };
      mediaRecorder.current.start();
    } else if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      mediaRecorder.current.stop();
    }

    return () => {
      if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
        mediaRecorder.current.stop();
      }
    };
  }, [recording, stream]);

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
    setVolume(value);
    if (audioRef.current) {
      audioRef.current.volume = value / 100;
    }
  };

  const startRecording = () => {
    setRecording(true);
  };

  const stopRecording = () => {
    setRecording(false);
    if (recordedChunks.length > 0) {
      const blob = new Blob(recordedChunks, { type: 'audio/webm' });
      const fileName = 'recorded_audio.webm'; // Adjust the file name if needed
      const file = new File([blob], fileName);
  
      // Upload file to Supabase storage bucket
      supabase.storage
        .from('your_recording') // Replace 'your_bucket_name' with your actual bucket name
        .upload(fileName, file)
        .then((response) => {
          console.log('File uploaded:', response);
        })
        .catch((error) => {
          console.error('Error uploading file:', error);
        });
    }
  };
  

  return (
    <Box>
      <VStack spacing={4}>
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
        {recording ? (
          <IconButton
            icon={<FaStop />}
            onClick={stopRecording}
            aria-label="Stop Recording"
          />
        ) : (
          <IconButton
            icon={<FaRecordVinyl />}
            onClick={startRecording}
            aria-label="Start Recording"
          />
        )}
        {peers.map((peerData, index) => (
          <div key={index}>
            <audio ref={audioRef} autoPlay muted={isMuted}></audio>
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
