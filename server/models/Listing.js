const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  location: { type: String, required: true },
  rent: { type: Number, required: true },
  availableFrom: { type: Date, required: true },
  roomType: { type: String, enum: ['single', 'shared', 'studio', 'apartment'], required: true },
  furnishing: { type: String, enum: ['furnished', 'semi-furnished', 'unfurnished'], required: true },
  description: { type: String },
  photos: [{ type: String }],
  isFilled: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Listing', listingSchema);