const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema({
  interestRequest: { type: mongoose.Schema.Types.ObjectId, ref: 'InterestRequest', required: true },
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('ChatRoom', chatRoomSchema);