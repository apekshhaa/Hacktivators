import express from "express";
import Household from "../models/Household.js";

const router = express.Router();

router.get("/stats", async (req, res) => {
    try {
        const totalHouseholds = await Household.countDocuments();
        const completedHouseholds = await Household.countDocuments({ status: "Done" });

        const percentage = totalHouseholds > 0
            ? Math.round((completedHouseholds / totalHouseholds) * 100)
            : 0;

        const threshold = 73;
        const isUnlocked = percentage >= threshold;

        res.json({
            totalHouseholds,
            completedHouseholds,
            percentage,
            threshold,
            isUnlocked,
            message: isUnlocked
                ? "Communal Rewards Unlocked! 🏆"
                : `Reach ${threshold}% to unlock community rewards.`
        });
    } catch (error) {
        console.error("Error fetching community stats:", error);
        res.status(500).json({ message: "Error fetching community stats" });
    }
});

export default router;
