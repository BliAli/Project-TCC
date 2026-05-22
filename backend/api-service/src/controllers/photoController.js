const ServicePhoto = require('../models/nosql/photoModel');
const { bucket } = require('../config/storage');
const path = require('path');

const photoController = {
  async upload(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'File gambar wajib diupload' });
      }

      const { order_id, staff_id, type } = req.body;
      if (!order_id || !staff_id || !type) {
        return res.status(400).json({ message: 'order_id, staff_id, dan type wajib diisi' });
      }

      const fileName = `photos/${order_id}/${Date.now()}${path.extname(req.file.originalname)}`;
      const blob = bucket.file(fileName);
      const blobStream = blob.createWriteStream({
        resumable: false,
        metadata: { contentType: req.file.mimetype }
      });

      await new Promise((resolve, reject) => {
        blobStream.on('error', reject);
        blobStream.on('finish', resolve);
        blobStream.end(req.file.buffer);
      });

      await blob.makePublic();
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

      let photo = await ServicePhoto.findOne({ order_id });
      if (!photo) {
        photo = new ServicePhoto({ order_id, staff_id, photos: [] });
      }
      photo.photos.push({ url: publicUrl, type });
      await photo.save();

      res.status(201).json({ message: 'Foto berhasil diupload', url: publicUrl });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async getByOrderId(req, res) {
    try {
      const photos = await ServicePhoto.findOne({ order_id: req.params.orderId });
      if (!photos) return res.status(404).json({ message: 'Foto tidak ditemukan' });
      res.json({ photos });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

module.exports = photoController;
