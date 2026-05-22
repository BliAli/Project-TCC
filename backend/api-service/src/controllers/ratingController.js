const Rating = require('../models/sql/ratingModel');
const Staff = require('../models/sql/staffModel');

const ratingController = {
  async create(req, res) {
    try {
      const { order_id, staff_id, score, comment } = req.body;
      if (!order_id || !staff_id || !score) {
        return res.status(400).json({ message: 'order_id, staff_id, dan score wajib diisi' });
      }
      if (score < 1 || score > 5) {
        return res.status(400).json({ message: 'Score harus antara 1-5' });
      }

      await Rating.create({ order_id, user_id: req.user.id, staff_id, score, comment });

      const avg = await Rating.getAverageByStaffId(staff_id);
      await Staff.updateRating(staff_id, parseFloat(avg.avg_score).toFixed(2));

      res.status(201).json({ message: 'Rating berhasil diberikan' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async getByStaffId(req, res) {
    try {
      const ratings = await Rating.findByStaffId(req.params.id);
      const avg = await Rating.getAverageByStaffId(req.params.id);
      res.json({
        ratings,
        average: parseFloat(avg.avg_score) || 0,
        total: parseInt(avg.total)
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

module.exports = ratingController;
