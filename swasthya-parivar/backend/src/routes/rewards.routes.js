const express = require('express');
const router = express.Router();

// Example rewards endpoint
router.get('/points', (req, res) => res.json({ points: 250 }));

module.exports = router;