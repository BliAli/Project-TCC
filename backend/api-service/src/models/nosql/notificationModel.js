const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user_id: { type: Number, required: true },
  user_type: { type: String, enum: ['customer', 'staff', 'admin'], required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['order', 'schedule', 'promo', 'system'], required: true },
  is_read: { type: Boolean, default: false },
  data: { type: mongoose.Schema.Types.Mixed, default: {} },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
