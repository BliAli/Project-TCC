const db = require('../../config/mysql');

const Schedule = {
  async findAll(filters = {}) {
    let query = 'SELECT sc.*, s.name as staff_name FROM schedules sc LEFT JOIN staff s ON sc.staff_id = s.id';
    const params = [];

    if (filters.staff_id) {
      query += ' WHERE sc.staff_id = ?';
      params.push(filters.staff_id);
    } else if (filters.date) {
      query += ' WHERE sc.date = ?';
      params.push(filters.date);
    }

    query += ' ORDER BY sc.date, sc.start_time';
    const [rows] = await db.execute(query, params);
    return rows;
  },

  async create({ staff_id, date, start_time, end_time }) {
    const [result] = await db.execute(
      'INSERT INTO schedules (staff_id, date, start_time, end_time) VALUES (?, ?, ?, ?)',
      [staff_id, date, start_time, end_time]
    );
    return result;
  },

  async update(id, { date, start_time, end_time, is_available }) {
    const [result] = await db.execute(
      'UPDATE schedules SET date = ?, start_time = ?, end_time = ?, is_available = ? WHERE id = ?',
      [date, start_time, end_time, is_available, id]
    );
    return result;
  },

  async delete(id) {
    const [result] = await db.execute('DELETE FROM schedules WHERE id = ?', [id]);
    return result;
  }
};

module.exports = Schedule;
