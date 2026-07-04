const express = require('express');
const router = express.Router();
const { sendInterest, getOwnerRequests, getTenantRequests, respondToInterest } = require('../controllers/interestController');
const { protect, authorize } = require('../middleware/auth');

router.get('/owner/requests', protect, authorize('owner'), getOwnerRequests);
router.get('/tenant/requests', protect, authorize('tenant'), getTenantRequests);
router.post('/:listingId', protect, authorize('tenant'), sendInterest);
router.patch('/:id/respond', protect, authorize('owner'), respondToInterest);

module.exports = router;