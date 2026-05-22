const db = require('../../config/mysql');

const Rating = {
  async findByStaffId(staffId) {
    const [rows] = await db.execute(
      `SELECT r.*, u.name as user_name
       FROM ratings r
       LEFT JOIN users u ON r.user_id = u.id
       WHERE r.staff_id = ?
       ORDER BY r.created_at DESC`,
      [staffId]
    );
    return rows;
  },

  async create({ order_id, user_id, staff_id, score, comment }) {
    const [result] = await db.execute(
      'INSERT INTO ratings (order_id, user_id, staff_id, score, comment) VALUES (?, ?, ?, ?, ?)',
      [order_id, user_id, staff_id, score, comment || null]
    );
    return result;
  },

  async getAverageByStaffId(staffId) {
    const [rows] = await db.execute(
      'SELECT AVG(score) as avg_score, COUNT(*) as total FROM ratings WHERE staff_id = ?',
      [staffId]
    );
    return rows[0];
  }
};

module.exports = Rating;
