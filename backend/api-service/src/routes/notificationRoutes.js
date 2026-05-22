const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/', authMiddleware, notificationController.create);
router.get('/:userId', authMiddleware, notificationController.getByUserId);
router.put('/:id/read', authMiddleware, notificationController.markAsRead);

module.exports = router;
