const mongoose = require('mongoose');

const interestRequestSchema = new mongoose.Schema({
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
  compatibilityScore: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('InterestRequest', interestRequestSchema);