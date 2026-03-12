const express = require('express');
const router = express.Router();
const { login } = require('../controllers/auth.controller');

// @route POST /api/auth/login
router.post('/login', login);

module.exports = router;