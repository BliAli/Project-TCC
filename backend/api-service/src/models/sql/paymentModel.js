const db = require('../../config/mysql');

const Payment = {
  async findByOrderId(orderId) {
    const [rows] = await db.execute('SELECT * FROM payments WHERE order_id = ?', [orderId]);
    return rows[0];
  },

  async create({ order_id, amount, method }) {
    const [result] = await db.execute(
      'INSERT INTO payments (order_id, amount, method) VALUES (?, ?, ?)',
      [order_id, amount, method]
    );
    return result;
  },

  async updateStatus(id, status) {
    const paid_at = status === 'paid' ? new Date() : null;
    const [result] = await db.execute(
      'UPDATE payments SET status = ?, paid_at = ? WHERE id = ?',
      [status, paid_at, id]
    );
    return result;
  }
};

module.exports = Payment;
