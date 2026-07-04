const ChatRoom = require('../models/ChatRoom');
const Message = require('../models/Message');

const getChatRooms = async (req, res) => {
  try {
    const query = req.user.role === 'owner'
      ? { owner: req.user._id }
      : { tenant: req.user._id };

    const rooms = await ChatRoom.find(query)
      .populate('tenant', 'name')
      .populate('owner', 'name')
      .sort({ createdAt: -1 });

    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const room = await ChatRoom.findById(req.params.roomId);
    if (!room) return res.status(404).json({ message: 'Chat room not found' });

    const isParticipant =
      room.tenant.toString() === req.user._id.toString() ||
      room.owner.toString() === req.user._id.toString();

    if (!isParticipant) return res.status(403).json({ message: 'Not authorized to view this chat' });

    const messages = await Message.find({ chatRoom: req.params.roomId })
      .populate('sender', 'name')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getChatRooms, getMessages };