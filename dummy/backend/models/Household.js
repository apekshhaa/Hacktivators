import mongoose from "mongoose";

const householdSchema = new mongoose.Schema({
  householdId: { type: String, required: true, unique: true },
  head: { type: String, required: true },
  members_count: { type: Number, required: true },
  village: { type: String, required: true },
  status: { type: String, enum: ["Done", "Due", "Missed"], default: "Due" },
  flags: [{ type: String }],
  password: { type: String }, // Plain text for prototype simplicity
  reminderPreference: {
    type: String,
    enum: ["Call", "Text", "In-person"],
    default: "Text"
  },
  nextScheduledVisit: { type: Date, default: null },
  familyMembers: [{
    name: String,
    relation: String,
    age: Number,
    gender: String,
    status: String,
    flag: String,
    privacyPassword: { type: String, default: null }
  }]
});

export default mongoose.model("Household", householdSchema);
