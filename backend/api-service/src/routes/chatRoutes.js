const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/:orderId', authMiddleware, chatController.sendMessage);
router.get('/:orderId', authMiddleware, chatController.getMessages);

module.exports = router;
