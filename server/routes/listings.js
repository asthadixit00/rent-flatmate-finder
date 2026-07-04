const express = require('express');
const router = express.Router();
const {
  createListing, getListings, getListing,
  updateListing, deleteListing, markFilled, getOwnerListings
} = require('../controllers/listingController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getListings);
router.get('/my', protect, authorize('owner'), getOwnerListings);
router.get('/:id', getListing);
router.post('/', protect, authorize('owner'), upload.array('photos', 5), createListing);
router.put('/:id', protect, authorize('owner'), updateListing);
router.delete('/:id', protect, authorize('owner'), deleteListing);
router.patch('/:id/fill', protect, authorize('owner'), markFilled);

module.exports = router;