const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photoController');
const { authMiddleware } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.post('/', authMiddleware, upload.single('photo'), photoController.upload);
router.get('/:orderId', authMiddleware, photoController.getByOrderId);

module.exports = router;
