// Import necessary modules
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;
const http = require('http');
const { Server } = require('socket.io');

// Middleware
app.use(cors());
app.use(express.json());

// Sample data store (in-memory array)
let rooms = [
  { id: 1, name: 'Room 1', occupants: 3, hostName: 'Alice', privacy: 'Public' },
  { id: 2, name: 'Room 2', occupants: 2, hostName: 'Bob', privacy: 'Public' },
];

// Endpoint to get all rooms
app.get('/api/rooms', (req, res) => {
  res.json(rooms);
});

// Endpoint to create a new room
app.post('/api/rooms', (req, res) => {
  const { name, privacy, hostName, occupants } = req.body;
  const newRoom = {
    id: rooms.length + 1,
    name,
    privacy,
    hostName,
    occupants,
  };
  rooms.push(newRoom);
  res.status(201).json(newRoom);
});

// Create HTTP server and Socket.IO server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Handle socket connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Join a room
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  // Handle game events here

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
