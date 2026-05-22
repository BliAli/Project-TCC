const StaffTracking = require('../models/nosql/trackingModel');

const trackingController = {
  async update(req, res) {
    try {
      const { staffId } = req.params;
      const { latitude, longitude, heading, speed, is_online } = req.body;

      const tracking = await StaffTracking.findOneAndUpdate(
        { staff_id: staffId },
        { latitude, longitude, heading, speed, is_online, last_updated: new Date() },
        { upsert: true, new: true }
      );
      res.json({ message: 'Lokasi berhasil diupdate', tracking });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async get(req, res) {
    try {
      const tracking = await StaffTracking.findOne({ staff_id: req.params.staffId });
      if (!tracking) return res.status(404).json({ message: 'Data tracking tidak ditemukan' });
      res.json({ tracking });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

module.exports = trackingController;
