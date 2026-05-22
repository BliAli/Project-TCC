const mongoose = require('mongoose');

const trackingSchema = new mongoose.Schema({
  staff_id: { type: Number, required: true, unique: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  heading: { type: Number, default: 0 },
  speed: { type: Number, default: 0 },
  is_online: { type: Boolean, default: false },
  last_updated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('StaffTracking', trackingSchema);
