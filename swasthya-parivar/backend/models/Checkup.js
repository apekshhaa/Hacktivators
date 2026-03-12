import mongoose from "mongoose";

const checkupSchema = new mongoose.Schema({
  householdId: { type: String, required: true },
  date: { type: String, required: true }, // Keeping as string for "dd/mm/yyyy" format simplicity for now, or Date object
  status: { type: String, required: true },
  notes: { type: String },
  pointsEarned: { type: Number, default: 0 },
  diseases: [String],
  medications: [String]
});

export default mongoose.model("Checkup", checkupSchema);
