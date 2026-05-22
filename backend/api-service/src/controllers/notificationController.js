const Notification = require('../models/nosql/notificationModel');

const notificationController = {
  async create(req, res) {
    try {
      const { user_id, user_type, title, message, type, data } = req.body;
      if (!user_id || !user_type || !title || !message || !type) {
        return res.status(400).json({ message: 'user_id, user_type, title, message, dan type wajib diisi' });
      }
      const notification = await Notification.create({ user_id, user_type, title, message, type, data });
      res.status(201).json({ message: 'Notifikasi berhasil dibuat', notification });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async getByUserId(req, res) {
    try {
      const notifications = await Notification.find({ user_id: req.params.userId })
        .sort({ created_at: -1 })
        .limit(50);
      res.json({ notifications });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async markAsRead(req, res) {
    try {
      await Notification.findByIdAndUpdate(req.params.id, { is_read: true });
      res.json({ message: 'Notifikasi sudah dibaca' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

module.exports = notificationController;
