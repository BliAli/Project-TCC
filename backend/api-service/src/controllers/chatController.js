const Chat = require('../models/nosql/chatModel');

const chatController = {
  async sendMessage(req, res) {
    try {
      const { orderId } = req.params;
      const { sender_type, sender_id, message } = req.body;

      if (!sender_type || !sender_id || !message) {
        return res.status(400).json({ message: 'sender_type, sender_id, dan message wajib diisi' });
      }

      let chat = await Chat.findOne({ order_id: orderId });

      if (!chat) {
        chat = new Chat({
          order_id: orderId,
          participants: {
            user_id: sender_type === 'user' ? sender_id : req.body.user_id,
            staff_id: sender_type === 'staff' ? sender_id : req.body.staff_id
          },
          messages: []
        });
      }

      chat.messages.push({ sender_type, sender_id, message });
      await chat.save();

      res.status(201).json({ message: 'Pesan berhasil dikirim', chat });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async getMessages(req, res) {
    try {
      const chat = await Chat.findOne({ order_id: req.params.orderId });
      if (!chat) return res.status(404).json({ message: 'Chat tidak ditemukan' });
      res.json({ chat });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

module.exports = chatController;
