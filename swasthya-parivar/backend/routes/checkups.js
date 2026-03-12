import express from "express";
import Checkup from "../models/Checkup.js";
import Household from "../models/Household.js";
import Reward from "../models/Reward.js";
import { syncRewardData } from "../utils/rewardHelper.js";

const router = express.Router();

// Get checkup history for a household
router.get("/:householdId", async (req, res) => {
    try {
        const checkups = await Checkup.find({ householdId: req.params.householdId }).sort({ _id: -1 });
        res.json(checkups);
    } catch (error) {
        console.error("Error fetching checkup history:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// Get recent checkups (simulating "Appointments")
router.get("/recent", async (req, res) => {
    try {
        // Fetch last 10 checkups based on insertion order (_id)
        const checkups = await Checkup.find().sort({ _id: -1 }).limit(10);

        // Enrich with Household Head Name (Patient)
        const appointments = await Promise.all(checkups.map(async (checkup) => {
            const household = await Household.findOne({ householdId: checkup.householdId });
            return {
                id: checkup._id,
                patient: household ? household.head : "Unknown",
                time: checkup.date, // Using date as time for now
                type: checkup.status === "Done" ? "Routine Checkup" : "Follow-up",
                status: checkup.status
            };
        }));

        res.json(appointments);
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// Record a new checkup
router.post("/", async (req, res) => {
    const { householdId, diseases, medications, notes } = req.body;

    try {
        // 1. Create Checkup Record
        const newCheckup = new Checkup({
            householdId,
            date: new Date().toLocaleDateString('en-GB'), // dd/mm/yyyy
            status: "Done",
            diseases: diseases || [],
            medications: medications || [],
            notes: notes || "Routine checkup recorded",
            pointsEarned: 50 // Fixed points for now
        });
        await newCheckup.save();

        // 2. Update Household status
        await Household.findOneAndUpdate(
            { householdId },
            {
                status: "Done",
                lastCheckupDate: new Date()
            }
        );

        // 3. Update Rewards
        let reward = await Reward.findOne({ householdId });
        if (!reward) {
            reward = new Reward({
                householdId,
                totalPoints: 50,
                currentStreak: 1,
                badges: [],
                benefits: []
            });
        } else {
            reward.totalPoints += 50;
            reward.currentStreak += 1;
            reward.lastUpdated = Date.now();
        }

        // Count checkups for badges (like Badge 1: 10+ checkups)
        const checkupCount = await Checkup.countDocuments({ householdId, status: "Done" });

        // Sync and Save Reward
        await syncRewardData(reward, checkupCount);
        await reward.save();

        res.status(201).json({
            message: "Checkup recorded and rewards updated",
            checkup: newCheckup,
            reward
        });

    } catch (error) {
        console.error("Error recording checkup:", error);
        res.status(500).json({ message: "Error recording checkup", error: error.message });
    }
});

export default router;
