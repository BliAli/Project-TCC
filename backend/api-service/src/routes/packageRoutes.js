const express = require('express');
const router = express.Router();
const packageController = require('../controllers/packageController');
const { authMiddleware, adminOnly } = require('../middleware/authMiddleware');

router.get('/', packageController.getAll);
router.post('/', authMiddleware, adminOnly, packageController.create);
router.put('/:id', authMiddleware, adminOnly, packageController.update);
router.delete('/:id', authMiddleware, adminOnly, packageController.delete);

module.exports = router;
