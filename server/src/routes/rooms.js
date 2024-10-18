// server/src/routes/rooms.js
const express = require('express');
const router = express.Router();
const Room = require('../models/Room');

// Get all rooms - GET /api/rooms
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

// Get a room by ID - GET /api/rooms/:id
router.get('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json(room);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new room - POST /api/rooms
router.post('/', async (req, res) => {
  try {
    // Ensure all necessary fields are included
    const { name, privacy } = req.body;
    const newRoom = new Room({
      name,
      privacy,
      host: req.userId, // assuming you have user authentication set up
      occupants: [],
    });
    const savedRoom = await newRoom.save();
    res.status(201).json(savedRoom); // Send back the entire room object, including _id
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;