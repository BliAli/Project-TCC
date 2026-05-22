const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const { authMiddleware, adminOnly } = require('../middleware/authMiddleware');

router.get('/', authMiddleware, scheduleController.getAll);
router.post('/', authMiddleware, adminOnly, scheduleController.create);

module.exports = router;
