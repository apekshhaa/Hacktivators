const healthService = require('../services/health/health.service');

exports.getRecords = async (req, res) => {
  res.json({ records: await healthService.fetchUserRecords(req.user?.id) });
};

exports.addRecord = async (req, res) => {
  res.status(201).json({ success: true, record: req.body });
};