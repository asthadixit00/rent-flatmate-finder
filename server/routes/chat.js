const express = require('express');
const router = express.Router();
const { getChatRooms, getMessages } = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

router.get('/rooms', protect, getChatRooms);
router.get('/rooms/:roomId/messages', protect, getMessages);

module.exports = router;