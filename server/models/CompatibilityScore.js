const mongoose = require('mongoose');

const compatibilityScoreSchema = new mongoose.Schema({
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
  score: { type: Number, required: true },
  explanation: { type: String, required: true },
  method: { type: String, enum: ['ai', 'fallback'], default: 'fallback' }
}, { timestamps: true });

compatibilityScoreSchema.index({ tenant: 1, listing: 1 }, { unique: true });

module.exports = mongoose.model('CompatibilityScore', compatibilityScoreSchema);