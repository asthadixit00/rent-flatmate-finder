const TenantProfile = require('../models/TenantProfile');

const createOrUpdateProfile = async (req, res) => {
  try {
    const { preferredLocation, budgetMin, budgetMax, moveInDate, roomType, furnishing } = req.body;

    const profile = await TenantProfile.findOneAndUpdate(
      { tenant: req.user._id },
      { preferredLocation, budgetMin, budgetMax, moveInDate, roomType, furnishing },
      { new: true, upsert: true, runValidators: true }
    );

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const profile = await TenantProfile.findOne({ tenant: req.user._id });
    if (!profile) return res.status(404).json({ message: 'Profile not found. Please create your profile.' });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrUpdateProfile, getProfile };