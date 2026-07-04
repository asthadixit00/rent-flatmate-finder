const User = require('../models/User');
const Listing = require('../models/Listing');
const InterestRequest = require('../models/InterestRequest');

const getStats = async (req, res) => {
  try {
    const [totalUsers, totalListings, totalInterests, activeListings] = await Promise.all([
      User.countDocuments(),
      Listing.countDocuments(),
      InterestRequest.countDocuments(),
      Listing.countDocuments({ isFilled: false })
    ]);
    res.json({ totalUsers, totalListings, totalInterests, activeListings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`, isActive: user.isActive });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllListings = async (req, res) => {
  try {
    const listings = await Listing.find()
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStats, getUsers, toggleUserStatus, getAllListings };