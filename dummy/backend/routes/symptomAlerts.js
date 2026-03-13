import express from 'express';
import SymptomAlert from '../models/SymptomAlert.js';
import Household from '../models/Household.js';

const router = express.Router();

// POST - Create a new symptom alert (from user symptom checker)
router.post('/', async (req, res) => {
    try {
        const { householdId, memberId, memberName, symptoms, riskLevel, riskScore, predictedCondition, age } = req.body;

        // Get household info for context
        const household = await Household.findOne({ householdId });
        const alert = new SymptomAlert({
            householdId,
            memberId,
            memberName,
            headName: household?.head || '',
            village: household?.village || '',
            age: age || 0,
            symptoms,
            riskLevel: riskLevel || 'Low',
            riskScore: riskScore || 0,
            predictedCondition: predictedCondition || '',
            status: 'pending'
        });

        await alert.save();
        res.status(201).json({ message: 'Symptom alert sent to admin for review.', alert });
    } catch (err) {
        console.error('Error creating symptom alert:', err);
        res.status(500).json({ error: 'Failed to create alert' });
    }
});

// GET - Fetch all pending alerts (for admin)
router.get('/', async (req, res) => {
    try {
        const alerts = await SymptomAlert.find({ status: 'pending' }).sort({ createdAt: -1 });
        res.json(alerts);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch alerts' });
    }
});

// PATCH - Approve an alert (saves symptoms to the member record)
router.patch('/:id/approve', async (req, res) => {
    try {
        const alert = await SymptomAlert.findById(req.params.id);
        if (!alert) return res.status(404).json({ error: 'Alert not found' });

        // Save symptoms to the member's household record
        const household = await Household.findOne({ householdId: alert.householdId });
        if (household) {
            const member = household.familyMembers.id(alert.memberId);
            if (member) {
                const newStatus = alert.riskLevel === 'High' ? 'Critical'
                    : (alert.riskLevel === 'Moderate' || alert.riskLevel === 'Mild') ? 'Follow-up'
                    : 'Healthy';
                member.status = newStatus;
                member.flag = alert.symptoms;
                await household.save();
            }
        }

        alert.status = 'approved';
        await alert.save();
        res.json({ message: 'Alert approved and symptoms saved.', alert });
    } catch (err) {
        console.error('Error approving alert:', err);
        res.status(500).json({ error: 'Failed to approve alert' });
    }
});

// PATCH - Reject an alert
router.patch('/:id/reject', async (req, res) => {
    try {
        const alert = await SymptomAlert.findById(req.params.id);
        if (!alert) return res.status(404).json({ error: 'Alert not found' });

        alert.status = 'rejected';
        await alert.save();
        res.json({ message: 'Alert rejected.', alert });
    } catch (err) {
        res.status(500).json({ error: 'Failed to reject alert' });
    }
});

export default router;
