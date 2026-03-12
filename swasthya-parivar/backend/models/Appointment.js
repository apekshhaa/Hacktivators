import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    householdId: { type: String, required: true },
    patient: { type: String, required: true },
    date: { type: Date, required: true },
    type: { type: String, default: "Routine Checkup" },
    status: { type: String, enum: ["Scheduled", "Done", "Missed"], default: "Scheduled" },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Appointment", appointmentSchema);
