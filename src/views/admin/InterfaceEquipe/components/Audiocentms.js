import React, { useEffect } from 'react';
import HundredMs from '@100mslive/hmsvideo-web';

const Audiocentms = () => {
  useEffect(() => {
    // Initialize the 100ms client with your credentials
    const client = new HundredMs({
      tokenEndpoint: 'https://prod-in2.100ms.live/hmsapi/hello-audioroom-1938.app.100ms.live/',
      appAccessKey: '65ca65817a79cd025cf7d736',
      appSecret: 'aAidTXnmT18Cz67FfOZ_9A_JzV43qfamlxCM0QPug6qf0Vo_kkXitP9fYWB8Nf9VBSMV6UFvUMB-QpMs_F_TaDcb3-50kobT_f_IDQaoBfFpGPv6TYPlJzZ2UpFIUgsfMSUWvLsfmants5us9WjEdE0RK7fxSKj7HGWPKYoBB5Y=',
    });

    // Function to create a room
    async function createRoom() {
      try {
        const room = await client.createRoom({ type: 'group' });
        console.log('Room created:', room);
        return room;
      } catch (error) {
        console.error('Error creating room:', error);
      }
    }

    // Function to join a room
    async function joinRoom(roomId, userId, userName) {
      try {
        const user = await client.joinRoom({
          role: 'audience', // or 'presenter' if you want to host the room
          roomId: roomId,
          userId: userId,
          userName: userName,
        });
        console.log('User joined room:', user);
        return user;
      } catch (error) {
        console.error('Error joining room:', error);
      }
    }

    // Function to start audio transmission
    async function startAudioTransmission(userId) {
      try {
        await client.startAudioTransmission(userId);
        console.log('Audio transmission started for user:', userId);
      } catch (error) {
        console.error('Error starting audio transmission:', error);
      }
    }

    // Example usage
    async function main() {
      const roomId = 'your_room_id';
      const userId = 'your_user_id';
      const userName = 'Your Username';

      await createRoom();
      const user = await joinRoom(roomId, userId, userName);
      await startAudioTransmission(user.userId);
    }

    main();

    // Clean up function
    return () => {
      // Perform any cleanup if needed
    };
  }, []);

  return (
    <div>
      {/* Your component JSX */}
    </div>
  );
};

export default Audiocentms;
