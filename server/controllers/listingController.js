const Listing = require('../models/Listing');

const createListing = async (req, res) => {
  try {
    const { title, location, rent, availableFrom, roomType, furnishing, description } = req.body;
    const photos = req.files ? req.files.map(f => f.path) : [];

    const listing = await Listing.create({
      owner: req.user._id,
      title, location, rent, availableFrom,
      roomType, furnishing, description, photos
    });

    res.status(201).json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getListings = async (req, res) => {
  try {
    const { location, minBudget, maxBudget } = req.query;
    const query = { isFilled: false };

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    if (minBudget || maxBudget) {
      query.rent = {};
      if (minBudget) query.rent.$gte = Number(minBudget);
      if (maxBudget) query.rent.$lte = Number(maxBudget);
    }

    const listings = await Listing.find(query)
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });

    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('owner', 'name email');
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (listing.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this listing' });
    }

    const updated = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (listing.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this listing' });
    }
    await listing.deleteOne();
    res.json({ message: 'Listing removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markFilled = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (listing.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    listing.isFilled = true;
    await listing.save();
    res.json({ message: 'Listing marked as filled' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOwnerListings = async (req, res) => {
  try {
    const listings = await Listing.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createListing, getListings, getListing, updateListing, deleteListing, markFilled, getOwnerListings };