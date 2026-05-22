const mongoose = require('mongoose');

const statusUpdateSchema = new mongoose.Schema({
  order_id: { type: Number, required: true },
  updates: [{
    status: { type: String, required: true },
    message: { type: String },
    updated_by: { type: String, enum: ['system', 'staff', 'admin'], required: true },
    updated_at: { type: Date, default: Date.now }
  }],
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('OrderStatusUpdate', statusUpdateSchema);
