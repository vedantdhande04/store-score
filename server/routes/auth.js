const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Define the signup route
// POST /api/auth/signup
router.post('/signup', authController.signup);
// ... existing code
// const authController = require('../controllers/authController');

// POST /api/auth/signup
router.post('/signup', authController.signup);

// POST /api/auth/login  <-- ADD THIS LINE
router.post('/login', authController.login);


module.exports = router;