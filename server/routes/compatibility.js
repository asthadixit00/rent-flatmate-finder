const express = require('express');
const router = express.Router();
const { getCompatibilityScore } = require('../controllers/compatibilityController');
const { protect, authorize } = require('../middleware/auth');

router.get('/:listingId', protect, authorize('tenant'), getCompatibilityScore);

module.exports = router;