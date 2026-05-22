const Staff = require('../models/sql/staffModel');

const staffController = {
  async getAll(req, res) {
    try {
      const staff = await Staff.findAll();
      res.json({ staff });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async getById(req, res) {
    try {
      const staff = await Staff.findById(req.params.id);
      if (!staff) return res.status(404).json({ message: 'Staff tidak ditemukan' });
      res.json({ staff });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async create(req, res) {
    try {
      const { name, email, phone, photo_url } = req.body;
      if (!name || !email || !phone) {
        return res.status(400).json({ message: 'Name, email, dan phone wajib diisi' });
      }
      const result = await Staff.create({ name, email, phone, photo_url });
      res.status(201).json({ message: 'Staff berhasil ditambahkan', id: result.insertId });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'Email sudah terdaftar' });
      }
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async update(req, res) {
    try {
      const staff = await Staff.findById(req.params.id);
      if (!staff) return res.status(404).json({ message: 'Staff tidak ditemukan' });

      const { name, email, phone, photo_url, status } = req.body;
      await Staff.update(req.params.id, {
        name: name || staff.name,
        email: email || staff.email,
        phone: phone || staff.phone,
        photo_url: photo_url || staff.photo_url,
        status: status || staff.status
      });
      res.json({ message: 'Staff berhasil diupdate' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const staff = await Staff.findById(req.params.id);
      if (!staff) return res.status(404).json({ message: 'Staff tidak ditemukan' });

      await Staff.delete(req.params.id);
      res.json({ message: 'Staff berhasil dihapus' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

module.exports = staffController;
