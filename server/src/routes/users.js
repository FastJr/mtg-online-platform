// server/src/routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/find-or-create', async (req, res) => {
    const { email, name, auth0Id } = req.body;
  
    try {
      let user = await User.findOne({ email });
      if (!user) {
        user = new User({ email, name, auth0Id, decks: [] });
        await user.save();
      }
      res.status(200).json(user);
    } catch (error) {
      console.error('Error finding or creating user:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });  

module.exports = router;
