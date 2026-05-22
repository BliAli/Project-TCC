const db = require('../config/database');

const User = {
  async create({ name, email, password, phone, address, role }) {
    const [result] = await db.execute(
      'INSERT INTO users (name, email, password, phone, address, role) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, password, phone || null, address || null, role || 'customer']
    );
    return result;
  },

  async findByEmail(email) {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },

  async findById(id) {
    const [rows] = await db.execute(
      'SELECT id, name, email, phone, address, role, created_at, updated_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  },

  async update(id, { name, phone, address }) {
    const [result] = await db.execute(
      'UPDATE users SET name = ?, phone = ?, address = ? WHERE id = ?',
      [name, phone, address, id]
    );
    return result;
  }
};

module.exports = User;
