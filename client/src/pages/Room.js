import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:5000');

function Room() {
  const { roomId } = useParams();

  useEffect(() => {
    // Join the room
    socket.emit('join_room', roomId);

    // Clean up on unmount
    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  return (
    <div>
      <h1>Welcome to Room {roomId}</h1>
      {/* Implement the game interface here */}
    </div>
  );
}

export default Room;
