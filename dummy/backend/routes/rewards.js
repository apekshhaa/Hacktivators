import express from "express";
import Reward from "../models/Reward.js";
import Checkup from "../models/Checkup.js";
import { syncRewardData, REWARD_ACTIONS } from "../utils/rewardHelper.js";

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

router.post("/:householdId/action", async (req, res) => {
  const { householdId } = req.params;
  const { actionType } = req.body;

  const action = REWARD_ACTIONS[actionType];
  if (!action) {
    return res.status(400).json({ message: "Invalid action type" });
  }

  try {
    let reward = await Reward.findOne({ householdId });

    if (!reward) {
      reward = new Reward({
        householdId,
        totalPoints: 0,
        currentStreak: 0,
        badges: [],
        benefits: []
      });
    }

    // Apply action rewards
    reward.totalPoints += action.points;
    if (action.streak) {
      reward.currentStreak += action.streak;
    }

    // Capture old unlocked badges to detect NEW unlocks
    const oldUnlockedIds = new Set(
      (reward.badges || [])
        .filter(b => b.unlocked)
        .map(b => b.id)
    );

    const checkupCount = await Checkup.countDocuments({ householdId, status: "Done" });
    await syncRewardData(reward, checkupCount);

    // Achievement Bonus Logic: Award extra points for NEW unlocks
    const newUnlockedBadges = (reward.badges || []).filter(
      b => b.unlocked && !oldUnlockedIds.has(b.id)
    );

    if (newUnlockedBadges.length > 0) {
      // Award 50 bonus points per new achievement
      reward.totalPoints += newUnlockedBadges.length * 50;
      // Re-sync benefits in case bonus points pushed them over the edge
      await syncRewardData(reward, checkupCount);
    }

    reward.lastUpdated = Date.now();
    await reward.save();

    res.json({
      message: action.message,
      pointsAwarded: action.points,
      achievementBonus: newUnlockedBadges.length * 50,
      reward
    });
  } catch (error) {
    console.error("Error processing reward action:", error);
    res.status(500).json({ message: "Error processing reward action", error });
  }
});

export default router;
