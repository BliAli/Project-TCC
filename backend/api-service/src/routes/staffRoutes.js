const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const { authMiddleware, adminOnly } = require('../middleware/authMiddleware');

router.get('/', authMiddleware, staffController.getAll);
router.get('/:id', authMiddleware, staffController.getById);
router.post('/', authMiddleware, adminOnly, staffController.create);
router.put('/:id', authMiddleware, adminOnly, staffController.update);
router.delete('/:id', authMiddleware, adminOnly, staffController.delete);

module.exports = router;
