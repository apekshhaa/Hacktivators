import express from "express";
import Household from "../models/Household.js";
import Checkup from "../models/Checkup.js";

const router = express.Router();

router.get("/:householdId", async (req, res) => {
  const { householdId } = req.params;

  const household = await Household.findOne({ householdId });
  const checkups = await Checkup.find({ householdId }).sort({ date: -1 }).limit(50);

  if (!household) {
    return res.status(404).json({ message: "Household not found" });
  }

  // Determine health flag logic (mock logic for now based on flags array)
  const healthFlag = household.flags.length > 0 ? household.flags[0] : "Healthy";

  res.json({
    householdId,
    head: household.head,
    members_count: household.members_count,
    village: household.village,
    status: household.status,
    flags: household.flags,
    familyMembers: household.familyMembers.map(m => {
      const isLocked = !!m.privacyPassword;
      return {
        _id: m._id,
        name: m.name,
        relation: m.relation,
        age: m.age,
        gender: m.gender,
        isLocked,
        // Redact these if locked
        status: isLocked ? "Hidden" : m.status,
        flag: isLocked ? null : m.flag
      };
    }),
    lastCheckup: checkups.at(-1)?.date || "N/A",
    nextScheduledVisit: household.nextScheduledVisit,
    checkupHistory: checkups // Return full checkup objects for the frontend to parse
  });
});

export default router;
