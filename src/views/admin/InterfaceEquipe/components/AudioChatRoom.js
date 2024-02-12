import React, { useEffect, useRef, useState } from 'react';
import { HMSClient } from '@100mslive/hmsvideo-web';

const AudioChatRoom = () => {
  const [room, setRoom] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const remoteStreamRef = useRef(null);

  useEffect(() => {
    const client = new HMSClient({
      tokenEndpoint: 'https://prod-in2.100ms.live/hmsapi/hello-audioroom-1938.app.100ms.live/managementToken',
      appAccessKey: '65ca65817a79cd025cf7d736',
      appSecret: 'aAidTXnmT18Cz67FfOZ_9A_JzV43qfamlxCM0QPug6qf0Vo_kkXitP9fYWB8Nf9VBSMV6UFvUMB-QpMs_F_TaDcb3-50kobT_f_IDQaoBfFpGPv6TYPlJzZ2UpFIUgsfMSUWvLsfmants5us9WjEdE0RK7fxSKj7HGWPKYoBB5Y=',
    });

    const initializeRoom = async () => {
      try {
        const room = await client.createRoom({ type: 'group' });
        setRoom(room);

        const localStream = await client.getLocalStream({
          audio: true,
          video: false,
        });
        setLocalStream(localStream);

        await client.joinRoom({
          role: 'audience',
          roomId: room.roomId,
          userId: localStream.streamId,
          userName: 'YourUserName',
        });

        client.on('stream-added', (stream) => {
          remoteStreamRef.current = stream;
          attachStreamToAudioElement(stream);
        });
      } catch (error) {
        console.error('Error initializing room:', error);
      }
    };

    initializeRoom();

    return () => {
      client.leaveRoom();
    };
  }, []);

  const attachStreamToAudioElement = (stream) => {
    const audioElement = document.createElement('audio');
    audioElement.srcObject = stream.mediaStream;
    audioElement.autoplay = true;
    audioElement.controls = false;
    document.body.appendChild(audioElement);
  };

  return (
    <div>
      <h1>Audio Chat Room</h1>
      <p>You are in room: {room?.roomId}</p>
      <p>Local User ID: {localStream?.streamId}</p>
    </div>
  );
};

export default AudioChatRoom;
