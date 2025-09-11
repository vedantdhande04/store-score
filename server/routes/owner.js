const express = require('express');
const router = express.Router();
const { getDashboardData } = require('../controllers/ownerController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Protect and authorize this route for Store Owners only
router.get('/dashboard', protect, authorize('Store Owner'), getDashboardData);

module.exports = router;