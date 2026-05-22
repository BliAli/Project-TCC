const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/', authMiddleware, ratingController.create);
router.get('/staff/:id', ratingController.getByStaffId);

module.exports = router;
