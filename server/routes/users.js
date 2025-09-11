const express = require('express');
const router = express.Router();
const { updatePassword } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// All routes here are protected
router.use(protect);

router.put('/password', updatePassword);

module.exports = router;