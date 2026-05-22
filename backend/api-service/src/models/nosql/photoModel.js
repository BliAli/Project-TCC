const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  order_id: { type: Number, required: true },
  staff_id: { type: Number, required: true },
  photos: [{
    url: { type: String, required: true },
    type: { type: String, enum: ['before', 'after'], required: true },
    uploaded_at: { type: Date, default: Date.now }
  }],
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ServicePhoto', photoSchema);
