// server/src/models/Room.js
const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  privacy: { type: String, enum: ['Public', 'Private'], default: 'Public' },
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  occupants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Room', RoomSchema);
