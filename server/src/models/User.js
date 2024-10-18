const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  auth0Id: { type: String, unique: true, required: true }, // Ensure this is required and unique
  decks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Deck' }]
});

module.exports = mongoose.model('User', UserSchema);
