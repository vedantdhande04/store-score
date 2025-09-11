const express = require('express');
const router = express.Router();
const { getStores, rateStore } = require('../controllers/storeController');
const { protect } = require('../middleware/authMiddleware');

// All routes here are protected
router.use(protect);

router.get('/', getStores);
router.post('/:id/rate', rateStore);

module.exports = router;