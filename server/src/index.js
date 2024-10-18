const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const roomsRouter = require('./routes/rooms');
const decksRouter = require('./routes/decks');
const usersRouter = require('./routes/users');
const http = require('http');
const { Server } = require('socket.io');
const PORT = 5000;

// Create HTTP server and Socket.IO server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Allow requests from your frontend
    methods: ['GET', 'POST'],
  },
});

// Handle socket connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Define socket events and behaviors here

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Use the HTTP server for both Express and Socket.IO
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

// Express middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json());

// Use the rooms route
app.use('/api/rooms', roomsRouter);
app.use('/api/decks', decksRouter);
app.use('/api/users', usersRouter);

// Connect to MongoDB
mongoose
  .connect('mongodb+srv://fastjr2002:T90TEn9f6LsSoZsw@replacementeffectcluste.pgpoc.mongodb.net/?retryWrites=true&w=majority&appName=ReplacementEffectCluster')
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

