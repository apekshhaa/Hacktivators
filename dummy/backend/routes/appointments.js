import express from "express";
import Appointment from "../models/Appointment.js";
import Household from "../models/Household.js";

const router = express.Router();

// Get all scheduled appointments
router.get("/", async (req, res) => {
    try {
        const appointments = await Appointment.find({ status: "Scheduled" }).sort({ date: 1 });
        res.json(appointments);
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Create or update an appointment (for rescheduling)
router.post("/reschedule", async (req, res) => {
    try {
        const { householdId, date, patient } = req.body;

        if (!householdId || !date) {
            return res.status(400).json({ message: "Household ID and date are required" });
        }

        // Upsert appointment for this household if one is already scheduled
        const appointment = await Appointment.findOneAndUpdate(
            { householdId, status: "Scheduled" },
            {
                date: new Date(date),
                patient: patient || "Household Head",
                type: "Rescheduled Visit"
            },
            { upsert: true, new: true }
        );

        res.json({ message: "Appointment synced successfully", appointment });
    } catch (error) {
        console.error("Error syncing appointment:", error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
