const express = require('express');
const router = express.Router();
const { getRecords, addRecord } = require('../controllers/health.controller');

// @route GET /api/health/records
router.get('/records', getRecords);
// @route POST /api/health/records
router.post('/records', addRecord);

module.exports = router;