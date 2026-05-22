const db = require('../../config/mysql');

const Staff = {
  async findAll() {
    const [rows] = await db.execute('SELECT * FROM staff ORDER BY created_at DESC');
    return rows;
  },

  async findById(id) {
    const [rows] = await db.execute('SELECT * FROM staff WHERE id = ?', [id]);
    return rows[0];
  },

  async create({ name, email, phone, photo_url }) {
    const [result] = await db.execute(
      'INSERT INTO staff (name, email, phone, photo_url) VALUES (?, ?, ?, ?)',
      [name, email, phone, photo_url || null]
    );
    return result;
  },

  async update(id, { name, email, phone, photo_url, status }) {
    const [result] = await db.execute(
      'UPDATE staff SET name = ?, email = ?, phone = ?, photo_url = ?, status = ? WHERE id = ?',
      [name, email, phone, photo_url, status, id]
    );
    return result;
  },

  async delete(id) {
    const [result] = await db.execute('DELETE FROM staff WHERE id = ?', [id]);
    return result;
  },

  async updateRating(id, avgRating) {
    const [result] = await db.execute(
      'UPDATE staff SET avg_rating = ? WHERE id = ?',
      [avgRating, id]
    );
    return result;
  }
};

module.exports = Staff;
