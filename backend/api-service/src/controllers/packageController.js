const Package = require('../models/sql/packageModel');

const packageController = {
  async getAll(req, res) {
    try {
      const packages = await Package.findAll();
      res.json({ packages });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async create(req, res) {
    try {
      const { name, description, vehicle_type, price, duration_minutes } = req.body;
      if (!name || !vehicle_type || !price || !duration_minutes) {
        return res.status(400).json({ message: 'Name, vehicle_type, price, dan duration_minutes wajib diisi' });
      }
      const result = await Package.create({ name, description, vehicle_type, price, duration_minutes });
      res.status(201).json({ message: 'Paket berhasil ditambahkan', id: result.insertId });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async update(req, res) {
    try {
      const pkg = await Package.findById(req.params.id);
      if (!pkg) return res.status(404).json({ message: 'Paket tidak ditemukan' });

      const { name, description, vehicle_type, price, duration_minutes, is_active } = req.body;
      await Package.update(req.params.id, {
        name: name || pkg.name,
        description: description !== undefined ? description : pkg.description,
        vehicle_type: vehicle_type || pkg.vehicle_type,
        price: price || pkg.price,
        duration_minutes: duration_minutes || pkg.duration_minutes,
        is_active: is_active !== undefined ? is_active : pkg.is_active
      });
      res.json({ message: 'Paket berhasil diupdate' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const pkg = await Package.findById(req.params.id);
      if (!pkg) return res.status(404).json({ message: 'Paket tidak ditemukan' });

      await Package.delete(req.params.id);
      res.json({ message: 'Paket berhasil dihapus' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

module.exports = packageController;
