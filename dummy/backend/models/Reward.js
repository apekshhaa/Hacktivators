import mongoose from "mongoose";

const badgeSchema = new mongoose.Schema({
  id: Number,
  name: String,
  desc: String,
  icon: String,
  unlocked: { type: Boolean, default: false }
});

const benefitSchema = new mongoose.Schema({
  id: Number,
  name: String,
  points: Number,
  eligible: { type: Boolean, default: false }
});

const rewardSchema = new mongoose.Schema({
  householdId: { type: String, required: true, unique: true },
  totalPoints: { type: Number, default: 0 },
  currentStreak: { type: Number, default: 0 },
  badges: [badgeSchema],
  benefits: [benefitSchema],
  rewardEligibility: { type: Boolean, default: false }, // Keeping for backward compatibility if needed, but benefits array is better
  lastUpdated: { type: Date, default: Date.now }
});

export default mongoose.model("Reward", rewardSchema);
