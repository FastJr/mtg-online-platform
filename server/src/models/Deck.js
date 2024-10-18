// server/src/models/Deck.js
const mongoose = require('mongoose');

const DeckSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cards: [
    {
      cardId: { type: String, required: true }, // Scryfall ID
      quantity: { type: Number, default: 1 },
    },
  ],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Deck', DeckSchema);
