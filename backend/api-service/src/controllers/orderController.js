const Order = require('../models/sql/orderModel');
const Payment = require('../models/sql/paymentModel');

const orderController = {
  async getAll(req, res) {
    try {
      const { user_id, staff_id, status } = req.query;
      const orders = await Order.findAll({ user_id, staff_id, status });
      res.json({ orders });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async getById(req, res) {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) return res.status(404).json({ message: 'Order tidak ditemukan' });

      const payment = await Payment.findByOrderId(order.id);
      res.json({ order, payment });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async create(req, res) {
    try {
      const { package_id, order_date, order_time, address, latitude, longitude, vehicle_plate, total_price, notes, payment_method } = req.body;

      if (!package_id || !order_date || !order_time || !address || !total_price) {
        return res.status(400).json({ message: 'package_id, order_date, order_time, address, dan total_price wajib diisi' });
      }

      const result = await Order.create({
        user_id: req.user.id,
        package_id,
        order_date,
        order_time,
        address,
        latitude,
        longitude,
        vehicle_plate,
        total_price,
        notes
      });

      if (payment_method) {
        await Payment.create({
          order_id: result.insertId,
          amount: total_price,
          method: payment_method
        });
      }

      res.status(201).json({ message: 'Order berhasil dibuat', id: result.insertId });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async update(req, res) {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) return res.status(404).json({ message: 'Order tidak ditemukan' });

      const { staff_id, status, notes } = req.body;
      await Order.update(req.params.id, { staff_id, status, notes });
      res.json({ message: 'Order berhasil diupdate' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) return res.status(404).json({ message: 'Order tidak ditemukan' });

      await Order.delete(req.params.id);
      res.json({ message: 'Order berhasil dibatalkan' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

module.exports = orderController;
