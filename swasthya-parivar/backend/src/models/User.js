const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['villager', 'worker', 'admin'], default: 'villager' },
  points: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);