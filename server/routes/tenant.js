const express = require('express');
const router = express.Router();
const { createOrUpdateProfile, getProfile } = require('../controllers/tenantController');
const { protect, authorize } = require('../middleware/auth');

router.get('/profile', protect, authorize('tenant'), getProfile);
router.post('/profile', protect, authorize('tenant'), createOrUpdateProfile);

module.exports = router;