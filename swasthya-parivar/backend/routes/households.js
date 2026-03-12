import express from "express";
import Household from "../models/Household.js";

const router = express.Router();

// Create a new household
router.post('/', async (req, res) => {
    try {
        const { householdId, head, village, members_count, familyMembers } = req.body;

        // Check if household ID already exists
        const existingHousehold = await Household.findOne({ householdId });
        if (existingHousehold) {
            return res.status(409).json({ message: 'Household ID already exists' });
        }

        const newHousehold = new Household({
            householdId,
            head,
            village,
            members_count: members_count || (familyMembers ? familyMembers.length : 1),
            familyMembers: familyMembers || []
        });

        await newHousehold.save();
        res.status(201).json({ message: 'Household created successfully', household: newHousehold });
    } catch (error) {
        console.error("Error creating household:", error);
        res.status(500).json({ message: 'Error creating household', error: error.message });
    }
});



// Get a household by ID
router.get('/:householdId', async (req, res) => {
    try {
        const household = await Household.findOne({ householdId: req.params.householdId });
        if (!household) {
            return res.status(404).json({ message: 'Household not found' });
        }
        res.json(household);
    } catch (error) {
        console.error("Error fetching household:", error);
        res.status(500).json({ message: 'Error fetching household' });
    }
});

// Update a household's reminder preference
router.put('/:householdId/preferences', async (req, res) => {
    try {
        const { preference } = req.body;
        if (!["Call", "Text", "In-person"].includes(preference)) {
            return res.status(400).json({ message: 'Invalid preference type' });
        }

        const household = await Household.findOneAndUpdate(
            { householdId: req.params.householdId },
            { reminderPreference: preference },
            { new: true }
        );

        if (!household) {
            return res.status(404).json({ message: 'Household not found' });
        }

        res.json({ message: 'Preferences updated', reminderPreference: household.reminderPreference });
    } catch (error) {
        console.error("Error updating preferences:", error);
        res.status(500).json({ message: 'Error updating preferences' });
    }
});

// Lock a family member's health record (requires age >= 18)
router.post('/:householdId/members/:memberId/lock', async (req, res) => {
    try {
        const { password } = req.body;
        const { householdId, memberId } = req.params;

        if (!password) {
            return res.status(400).json({ message: 'Password is required' });
        }

        const household = await Household.findOne({ householdId });
        if (!household) return res.status(404).json({ message: 'Household not found' });

        const member = household.familyMembers.id(memberId);
        if (!member) return res.status(404).json({ message: 'Member not found' });

        if (member.age < 18) {
            return res.status(403).json({ message: 'Only members 18+ can set a privacy password' });
        }

        member.privacyPassword = password;
        await household.save();

        res.json({ message: `Health record for ${member.name} is now private.` });
    } catch (error) {
        console.error("Error locking record:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Unlock and verify access to a member's health record
router.post('/:householdId/members/:memberId/unlock', async (req, res) => {
    try {
        const { password } = req.body;
        const { householdId, memberId } = req.params;

        const household = await Household.findOne({ householdId });
        if (!household) return res.status(404).json({ message: 'Household not found' });

        const member = household.familyMembers.id(memberId);
        if (!member) return res.status(404).json({ message: 'Member not found' });

        if (member.privacyPassword !== password) {
            return res.status(401).json({ message: 'Incorrect privacy password' });
        }

        // Return the full member data if password is correct
        res.json({
            status: member.status,
            flag: member.flag
        });
    } catch (error) {
        console.error("Error unlocking record:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Remove privacy password permanently
router.delete('/:householdId/members/:memberId/lock', async (req, res) => {
    try {
        const { password } = req.body;
        const { householdId, memberId } = req.params;

        const household = await Household.findOne({ householdId });
        if (!household) return res.status(404).json({ message: 'Household not found' });

        const member = household.familyMembers.id(memberId);
        if (!member) return res.status(404).json({ message: 'Member not found' });

        if (member.privacyPassword !== password) {
            return res.status(401).json({ message: 'Incorrect password to remove privacy' });
        }

        member.privacyPassword = null;
        await household.save();

        res.json({ message: `Privacy lock removed for ${member.name}.` });
    } catch (error) {
        console.error("Error removing lock:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update a household's general information
router.put('/:householdId', async (req, res) => {
    try {
        const { head, village, familyMembers } = req.body;

        const updateData = {};
        if (head) updateData.head = head;
        if (village) updateData.village = village;
        if (familyMembers) {
            updateData.familyMembers = familyMembers;
            updateData.members_count = familyMembers.length;
        }

        const household = await Household.findOneAndUpdate(
            { householdId: req.params.householdId },
            { $set: updateData },
            { new: true }
        );

        if (!household) {
            return res.status(404).json({ message: 'Household not found' });
        }

        res.json({ message: 'Household updated successfully', household });
    } catch (error) {
        console.error("Error updating household:", error);
        res.status(500).json({ message: 'Error updating household' });
    }
});

// Reschedule a household visit
router.put('/:householdId/reschedule', async (req, res) => {
    try {
        const { date } = req.body;
        if (!date) {
            return res.status(400).json({ message: 'Date is required' });
        }

        const household = await Household.findOneAndUpdate(
            { householdId: req.params.householdId },
            { nextScheduledVisit: new Date(date) },
            { new: true }
        );

        if (!household) {
            return res.status(404).json({ message: 'Household not found' });
        }

        res.json({ message: 'Visit rescheduled successfully', nextScheduledVisit: household.nextScheduledVisit });
    } catch (error) {
        console.error("Error rescheduling visit:", error);
        res.status(500).json({ message: 'Error rescheduling visit' });
    }
});

export default router;
