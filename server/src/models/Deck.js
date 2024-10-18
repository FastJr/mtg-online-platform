const mongoose = require('mongoose');

const DeckSchema = new mongoose.Schema({
  name: { type: String, required: true },
  commander: { type: String }, // Store commander name
  cards: [
    {
      cardId: { type: String, required: true },  // Scryfall ID
      cardName: { type: String, required: true }, // Store card name
      quantity: { type: Number, default: 1 },
    },
  ],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to user
});

module.exports = mongoose.model('Deck', DeckSchema);
