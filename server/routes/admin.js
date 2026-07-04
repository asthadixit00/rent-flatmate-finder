const express = require('express');
const router = express.Router();
const { getStats, getUsers, toggleUserStatus, getAllListings } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.get('/stats', protect, authorize('admin'), getStats);
router.get('/users', protect, authorize('admin'), getUsers);
router.patch('/users/:id/toggle', protect, authorize('admin'), toggleUserStatus);
router.get('/listings', protect, authorize('admin'), getAllListings);

module.exports = router;