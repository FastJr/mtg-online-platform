// server/src/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  auth0Id: { type: String, required: true, unique: true }, // Store Auth0 user ID
  name: { type: String },
  email: { type: String },
  decks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Deck' }], // Reference to Decks
});

module.exports = mongoose.model('User', UserSchema);
