const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authController = {
  // POST /api/auth/register
  async register(req, res) {
    try {
      const { name, email, password, phone, address, role } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, dan password wajib diisi' });
      }

      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: 'Email sudah terdaftar' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await User.create({
        name,
        email,
        password: hashedPassword,
        phone,
        address,
        role
      });

      const token = jwt.sign(
        { id: result.insertId, email, role: role || 'customer' },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        message: 'Registrasi berhasil',
        token,
        user: { id: result.insertId, name, email, role: role || 'customer' }
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // POST /api/auth/login
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email dan password wajib diisi' });
      }

      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Email atau password salah' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Email atau password salah' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        message: 'Login berhasil',
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // GET /api/auth/profile
  async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User tidak ditemukan' });
      }
      res.json({ user });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // PUT /api/auth/profile
  async updateProfile(req, res) {
    try {
      const { name, phone, address } = req.body;

      if (!name) {
        return res.status(400).json({ message: 'Name wajib diisi' });
      }

      await User.update(req.user.id, { name, phone, address });
      const updatedUser = await User.findById(req.user.id);

      res.json({ message: 'Profile berhasil diupdate', user: updatedUser });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

module.exports = authController;
