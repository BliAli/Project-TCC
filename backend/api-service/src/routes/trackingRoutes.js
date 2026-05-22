const express = require('express');
const router = express.Router();
const trackingController = require('../controllers/trackingController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.put('/:staffId', authMiddleware, trackingController.update);
router.get('/:staffId', authMiddleware, trackingController.get);

module.exports = router;
