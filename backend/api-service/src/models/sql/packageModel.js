const db = require('../../config/mysql');

const Package = {
  async findAll() {
    const [rows] = await db.execute('SELECT * FROM service_packages WHERE is_active = TRUE ORDER BY vehicle_type, price');
    return rows;
  },

  async findById(id) {
    const [rows] = await db.execute('SELECT * FROM service_packages WHERE id = ?', [id]);
    return rows[0];
  },

  async create({ name, description, vehicle_type, price, duration_minutes }) {
    const [result] = await db.execute(
      'INSERT INTO service_packages (name, description, vehicle_type, price, duration_minutes) VALUES (?, ?, ?, ?, ?)',
      [name, description, vehicle_type, price, duration_minutes]
    );
    return result;
  },

  async update(id, { name, description, vehicle_type, price, duration_minutes, is_active }) {
    const [result] = await db.execute(
      'UPDATE service_packages SET name = ?, description = ?, vehicle_type = ?, price = ?, duration_minutes = ?, is_active = ? WHERE id = ?',
      [name, description, vehicle_type, price, duration_minutes, is_active, id]
    );
    return result;
  },

  async delete(id) {
    const [result] = await db.execute('UPDATE service_packages SET is_active = FALSE WHERE id = ?', [id]);
    return result;
  }
};

module.exports = Package;
