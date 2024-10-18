// src/pages/Room.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Room() {
  const { roomId } = useParams(); // Extract roomId from the URL
  const [room, setRoom] = useState(null);

  useEffect(() => {
    axios.get(`/api/rooms/${roomId}`)
      .then((response) => setRoom(response.data))
      .catch((error) => console.error('Error fetching room:', error));
  }, [roomId]);

  if (!room) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{room.name}</h1>
      <p>Room details here...</p>
    </div>
  );
}

export default Room;
