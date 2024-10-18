const express = require('express');
const router = express.Router();
const Room = require('../models/Room');

// Get all rooms
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

// Create a new room
router.post('/', async (req, res) => {
  const { name, privacy } = req.body;

  try {
    const newRoom = new Room({
      name,
      privacy,
    });

    await newRoom.save(); // Save room to MongoDB
    res.status(201).json(newRoom);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create room' });
  }
});

module.exports = router;
