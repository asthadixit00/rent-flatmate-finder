const InterestRequest = require('../models/InterestRequest');
const Listing = require('../models/Listing');
const CompatibilityScore = require('../models/CompatibilityScore');
const ChatRoom = require('../models/ChatRoom');
const { sendOwnerNotification, sendTenantNotification } = require('../utils/emailService');

const sendInterest = async (req, res) => {
  try {
    const { listingId } = req.params;

    const listing = await Listing.findById(listingId).populate('owner', 'name email');
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (listing.isFilled) return res.status(400).json({ message: 'This listing is already filled' });

    const existing = await InterestRequest.findOne({ tenant: req.user._id, listing: listingId });
    if (existing) return res.status(400).json({ message: 'You have already sent an interest request for this listing' });

    const compatibilityRecord = await CompatibilityScore.findOne({ tenant: req.user._id, listing: listingId });
    const score = compatibilityRecord ? compatibilityRecord.score : 0;

    const interest = await InterestRequest.create({
      tenant: req.user._id,
      listing: listingId,
      owner: listing.owner._id,
      compatibilityScore: score
    });

    // Notify owner only if compatibility score is high
    if (score >= 80) {
      await sendOwnerNotification(listing.owner.email, req.user.name, listing.title, score);
    }

    res.status(201).json(interest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOwnerRequests = async (req, res) => {
  try {
    const requests = await InterestRequest.find({ owner: req.user._id })
      .populate('tenant', 'name email')
      .populate('listing', 'title location rent')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTenantRequests = async (req, res) => {
  try {
    const requests = await InterestRequest.find({ tenant: req.user._id })
      .populate('listing', 'title location rent')
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const respondToInterest = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['accepted', 'declined'].includes(status)) {
      return res.status(400).json({ message: 'Status must be accepted or declined' });
    }

    const interest = await InterestRequest.findById(req.params.id)
      .populate('listing', 'title')
      .populate('tenant', 'name email');

    if (!interest) return res.status(404).json({ message: 'Interest request not found' });
    if (interest.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to respond to this request' });
    }

    interest.status = status;
    await interest.save();

    // Create a chat room when owner accepts
    if (status === 'accepted') {
      const existingRoom = await ChatRoom.findOne({ interestRequest: interest._id });
      if (!existingRoom) {
        await ChatRoom.create({
          interestRequest: interest._id,
          tenant: interest.tenant._id,
          owner: req.user._id
        });
      }
    }

    await sendTenantNotification(interest.tenant.email, status, interest.listing.title);

    res.json(interest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { sendInterest, getOwnerRequests, getTenantRequests, respondToInterest };