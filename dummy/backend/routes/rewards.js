import express from "express";
import Reward from "../models/Reward.js";
import Checkup from "../models/Checkup.js";
import { syncRewardData } from "../utils/rewardHelper.js";

const router = express.Router();

router.get("/:householdId", async (req, res) => {
  const { householdId } = req.params;

  try {
    const reward = await Reward.findOne({ householdId });

    if (!reward) {
      // Return default structure for new lookups so frontend doesn't crash
      return res.json({
        householdId,
        totalPoints: 0,
        currentStreak: 0,
        badges: [],
        benefits: [],
        rewardEligibility: false
      });
    }

    res.json(reward);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.post("/:householdId", async (req, res) => {
  const { householdId } = req.params;
  const { totalPoints, currentStreak, badges, benefits } = req.body;

  try {
    let reward = await Reward.findOne({ householdId });

    if (reward) {
      // Update existing
      reward.totalPoints = totalPoints !== undefined ? totalPoints : reward.totalPoints;
      reward.currentStreak = currentStreak !== undefined ? currentStreak : reward.currentStreak;
      // If badges/benefits are provided, use them, otherwise they'll be synced
      if (badges) reward.badges = badges;
      if (benefits) reward.benefits = benefits;

      reward.lastUpdated = Date.now();
    } else {
      // Create new
      reward = new Reward({
        householdId,
        totalPoints: totalPoints || 0,
        currentStreak: currentStreak || 0,
        badges: badges || [],
        benefits: benefits || []
      });
    }

    // Determine checkup count for badge logic
    const checkupCount = await Checkup.countDocuments({ householdId, status: "Done" });

    // Sync reward logic (badges/benefits) before saving
    await syncRewardData(reward, checkupCount);
    await reward.save();

    res.json(reward);
  } catch (error) {
    console.error("Error updating rewards:", error);
    res.status(500).json({ message: "Error updating rewards", error });
  }
});

export default router;
