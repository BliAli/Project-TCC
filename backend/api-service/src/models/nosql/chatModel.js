const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  order_id: { type: Number, required: true },
  participants: {
    user_id: { type: Number, required: true },
    staff_id: { type: Number, required: true }
  },
  messages: [{
    sender_type: { type: String, enum: ['user', 'staff'], required: true },
    sender_id: { type: Number, required: true },
    message: { type: String, required: true },
    sent_at: { type: Date, default: Date.now },
    read: { type: Boolean, default: false }
  }],
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Chat', chatSchema);
