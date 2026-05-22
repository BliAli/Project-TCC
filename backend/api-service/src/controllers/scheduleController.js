const Schedule = require('../models/sql/scheduleModel');

const scheduleController = {
  async getAll(req, res) {
    try {
      const { staff_id, date } = req.query;
      const schedules = await Schedule.findAll({ staff_id, date });
      res.json({ schedules });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async create(req, res) {
    try {
      const { staff_id, date, start_time, end_time } = req.body;
      if (!staff_id || !date || !start_time || !end_time) {
        return res.status(400).json({ message: 'staff_id, date, start_time, dan end_time wajib diisi' });
      }
      const result = await Schedule.create({ staff_id, date, start_time, end_time });
      res.status(201).json({ message: 'Jadwal berhasil ditambahkan', id: result.insertId });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

module.exports = scheduleController;
