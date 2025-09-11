const express = require('express');
const router = express.Router();
const {
    addUser,
    addStore,
    getDashboardStats,
    getUsers,
    getStores
} = require('../controllers/adminController');

const { protect, authorize } = require('../middleware/authMiddleware');

// Apply protect and authorize middleware to all routes in this file
router.use(protect, authorize('System Administrator'));

router.post('/users', addUser);
router.post('/stores', addStore);
router.get('/stats', getDashboardStats);
router.get('/users', getUsers);
router.get('/stores', getStores);

module.exports = router;