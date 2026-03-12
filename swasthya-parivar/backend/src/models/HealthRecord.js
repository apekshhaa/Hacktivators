const mongoose = require('mongoose');

const HealthRecordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  symptoms: [String],
  diagnosis: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('HealthRecord', HealthRecordSchema);