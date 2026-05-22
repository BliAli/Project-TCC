const db = require('../../config/mysql');

const Order = {
  async findAll(filters = {}) {
    let query = `SELECT o.*, u.name as user_name, s.name as staff_name, sp.name as package_name
                 FROM orders o
                 LEFT JOIN users u ON o.user_id = u.id
                 LEFT JOIN staff s ON o.staff_id = s.id
                 LEFT JOIN service_packages sp ON o.package_id = sp.id`;
    const params = [];

    if (filters.user_id) {
      query += ' WHERE o.user_id = ?';
      params.push(filters.user_id);
    } else if (filters.staff_id) {
      query += ' WHERE o.staff_id = ?';
      params.push(filters.staff_id);
    } else if (filters.status) {
      query += ' WHERE o.status = ?';
      params.push(filters.status);
    }

    query += ' ORDER BY o.created_at DESC';
    const [rows] = await db.execute(query, params);
    return rows;
  },

  async findById(id) {
    const [rows] = await db.execute(
      `SELECT o.*, u.name as user_name, u.phone as user_phone,
              s.name as staff_name, s.phone as staff_phone,
              sp.name as package_name, sp.duration_minutes
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       LEFT JOIN staff s ON o.staff_id = s.id
       LEFT JOIN service_packages sp ON o.package_id = sp.id
       WHERE o.id = ?`,
      [id]
    );
    return rows[0];
  },

  async create({ user_id, staff_id, package_id, order_date, order_time, address, latitude, longitude, vehicle_plate, total_price, notes }) {
    const [result] = await db.execute(
      `INSERT INTO orders (user_id, staff_id, package_id, order_date, order_time, address, latitude, longitude, vehicle_plate, total_price, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_id, staff_id || null, package_id, order_date, order_time, address, latitude || null, longitude || null, vehicle_plate || null, total_price, notes || null]
    );
    return result;
  },

  async update(id, { staff_id, status, notes }) {
    const fields = [];
    const params = [];

    if (staff_id !== undefined) { fields.push('staff_id = ?'); params.push(staff_id); }
    if (status) { fields.push('status = ?'); params.push(status); }
    if (notes !== undefined) { fields.push('notes = ?'); params.push(notes); }

    if (fields.length === 0) return null;

    params.push(id);
    const [result] = await db.execute(
      `UPDATE orders SET ${fields.join(', ')} WHERE id = ?`,
      params
    );
    return result;
  },

  async delete(id) {
    const [result] = await db.execute(
      "UPDATE orders SET status = 'cancelled' WHERE id = ?",
      [id]
    );
    return result;
  }
};

module.exports = Order;
