import express from "express";
import Household from "../models/Household.js";
import Checkup from "../models/Checkup.js";
import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// ──────────────────────────────────────────────
// Helper: compute per-member risk from data using ML API
// ──────────────────────────────────────────────
const getMemberRisk = async (member, memberCheckups = []) => {
    let score = 0;
    let reasons = [];

    // 1. Core health/status logic
    if (member.status === "Critical") {
        reasons.push("Critical health status");
    } else if (member.status === "Follow-up") {
        reasons.push("Pending follow-up");
    } else if (member.status === "Due") {
        reasons.push("Checkup overdue");
    }

    if (member.flag && member.flag !== "") {
        reasons.push(`Active flag: ${member.flag}`);
    }

    // 2. Call ML API
    let mlLevel = "Low";
    let mlCondition = "Healthy";
    
    try {
        const mlResponse = await fetch("http://localhost:8000/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                age: member.age || 30,
                symptoms: member.flag || ""
            })
        });
        
        if (mlResponse.ok) {
            const mlData = await mlResponse.json();
            mlCondition = mlData.predicted_condition;
            
            // If ML says "Healthy", INVERT the confidence:
            //   95% confident healthy → risk score = 5 (low risk)
            // If ML says a disease, use confidence directly:
            //   95% confident disease → risk score = 95 (high risk)
            if (mlCondition === "Healthy") {
                score = Math.round(100 - mlData.confidence);
                reasons.push("No illness detected by health screening");
            } else {
                score = Math.round(mlData.confidence);
                reasons.push(`Predicted condition: ${mlCondition}`);
            }
            
            // Determine level from the corrected score
            if (score >= 70) mlLevel = "High";
            else if (score >= 40) mlLevel = "Moderate";
            else if (score >= 20) mlLevel = "Mild";
            else mlLevel = "Low";
            
            // Add age-based context as a reason
            if (member.age < 5) reasons.push("Infant — needs extra care");
            else if (member.age < 12) reasons.push("Child — growing body needs monitoring");
            else if (member.age >= 60) reasons.push("Elderly — immune system is weaker");
            
            // Capture the full disease breakdown from ML
            var diseaseRisks = mlData.disease_risks || [];
        } else {
             console.error("ML API error:", mlResponse.status);
             score = member.flag ? 50 : 20;
             mlLevel = score >= 40 ? "Moderate" : "Mild";
             reasons.push("Could not connect to health screening service");
             var diseaseRisks = [];
        }
    } catch (err) {
        console.error("Failed to reach ML API:", err.message);
        score = member.flag ? 50 : 20;
        mlLevel = score >= 40 ? "Moderate" : "Mild";
        reasons.push("Could not connect to health screening service");
        var diseaseRisks = [];
    }

    return { score, level: mlLevel, reasons, predictedCondition: mlCondition, diseaseRisks };
};

// ──────────────────────────────────────────────
// Helper: calculate community risk via ML
// ──────────────────────────────────────────────
const calculateCommunityRisk = async (village) => {
    try {
        const filter = village && village !== "All Villages" ? { village } : {};
        const households = await Household.find(filter);
        
        if (!households || households.length === 0) return null;

        let totalScore = 0;
        let totalMembers = 0;
        let feverCount = 0;
        let coughCount = 0;
        
        const individualPromises = [];
        
        households.forEach(hh => {
           hh.familyMembers.forEach(member => {
               if (!member.privacyPassword) { // only score unlocked
                   individualPromises.push(getMemberRisk(member, []));
               }
           });
        });
        
        const risks = await Promise.all(individualPromises);
        
        risks.forEach(risk => {
             totalScore += risk.score;
             totalMembers++;
             if (risk.predictedCondition === "Flu" || risk.predictedCondition === "ViralFever") feverCount++;
             if (risk.predictedCondition === "Flu" || risk.predictedCondition === "Asthma") coughCount++;
        });

        if (totalMembers === 0) return null;

        const avgScore = totalScore / totalMembers;
        // Transform the 0-100 ML score to the 0-10 env_risk_index scale the frontend expects
        const avgRisk = Math.round((avgScore / 10) * 10) / 10;
        
        let communityRiskLevel = "Low";
        if (avgRisk >= 7) communityRiskLevel = "High";
        else if (avgRisk >= 5) communityRiskLevel = "Moderate";
        else if (avgRisk >= 3) communityRiskLevel = "Mild";

        return {
             avgFever: Math.round((feverCount / totalMembers) * 10 * 10) / 10,
             avgCough: Math.round((coughCount / totalMembers) * 10 * 10) / 10,
             avgDiarrhea: 0, // Not explicitly handled right now
             avgRisk: avgRisk,
             trend: avgRisk > 5 ? "Rising" : "Stable",
             communityRiskLevel,
             message: `Community risk analyzed via ML. Average risk index: ${avgRisk}/10.`,
             villages: village !== "All Villages" ? [village] : []
        };
    } catch (err) {
        console.error("Community Risk error:", err);
        return null;
    }
};

// ──────────────────────────────────────────────
// GET /api/risk/:householdId
// ──────────────────────────────────────────────
router.get("/:householdId", async (req, res) => {
    try {
        const { householdId } = req.params;

        const household = await Household.findOne({ householdId });
        if (!household) {
            return res.status(404).json({ message: "Household not found" });
        }

        const allCheckups = await Checkup.find({ householdId });

        // ── INDIVIDUAL RISKS ─────────────────────────
        const individualRiskPromises = household.familyMembers.map(async member => {
            // Skip locked members — only surface non-sensitive data
            const isLocked = !!member.privacyPassword;
            if (isLocked) {
                return {
                    memberId: member._id,
                    name: member.name,
                    relation: member.relation,
                    age: member.age,
                    gender: member.gender,
                    isLocked: true,
                    risk: { score: 0, level: "Hidden", reasons: ["Record is privacy-locked"] }
                };
            }

            const risk = await getMemberRisk(member, allCheckups);
            return {
                memberId: member._id,
                name: member.name,
                relation: member.relation,
                age: member.age,
                gender: member.gender,
                isLocked: false,
                risk
            };
        });
        
        const individualRisks = await Promise.all(individualRiskPromises);

        // ── FAMILY RISK PATTERNS ──────────────────────
        const visibleMembers = household.familyMembers.filter(m => !m.privacyPassword);
        const total = visibleMembers.length;
        const flagCounts = {};
        const statusCounts = {};

        visibleMembers.forEach(m => {
            if (m.flag) {
                const key = m.flag.trim().toLowerCase();
                flagCounts[key] = (flagCounts[key] || 0) + 1;
            }
            if (m.status) {
                const key = m.status.trim();
                statusCounts[key] = (statusCounts[key] || 0) + 1;
            }
        });

        const familyAlerts = [];

        // Shared flags: if >= 2 or >= 40% of visible members share a flag
        Object.entries(flagCounts).forEach(([flag, count]) => {
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            if (count >= 2 || pct >= 40) {
                // Guess the disease cluster
                let possibleCondition = "health concern";
                if (flag.includes("fever")) possibleCondition = "flu or viral fever";
                else if (flag.includes("cough")) possibleCondition = "respiratory illness";
                else if (flag.includes("diarrhea") || flag.includes("loose")) possibleCondition = "gastrointestinal infection";
                else if (flag.includes("rash") || flag.includes("skin")) possibleCondition = "skin infection or allergy";
                else if (flag.includes("vomit")) possibleCondition = "food poisoning";

                familyAlerts.push({
                    type: "SharedFlag",
                    severity: pct >= 60 ? "High" : "Moderate",
                    message: `${count} of ${total} visible member(s) share the flag "${flag}" — possible ${possibleCondition} spreading in household`,
                    count,
                    pct,
                    possibleCondition,
                    recommendation: `Seek medical attention as a family unit. Isolate symptomatic members and ensure hygiene practices`
                });
            }
        });

        // Critical / Follow-up cluster
        const criticalCount = statusCounts["Critical"] || 0;
        const followupCount = statusCounts["Follow-up"] || 0;
        if (criticalCount >= 1) {
            familyAlerts.push({
                type: "CriticalMember",
                severity: "High",
                message: `${criticalCount} member(s) have a Critical health status — immediate medical attention required`,
                recommendation: "Contact your primary health centre or ASHA worker immediately"
            });
        }
        if (followupCount >= 2) {
            familyAlerts.push({
                type: "MultipleFollowups",
                severity: "Moderate",
                message: `${followupCount} members have pending follow-ups — risk of conditions worsening`,
                recommendation: "Schedule a combined family health checkup to address all follow-ups together"
            });
        }

        // Overdue checkup
        const overallScore = individualRisks
            .filter(m => !m.isLocked)
            .reduce((s, m) => s + m.risk.score, 0);
        const avgFamilyScore = total > 0
            ? Math.round(overallScore / individualRisks.filter(m => !m.isLocked).length)
            : 0;

        let familyRiskLevel = "Low";
        if (avgFamilyScore >= 55) familyRiskLevel = "High";
        else if (avgFamilyScore >= 35) familyRiskLevel = "Moderate";
        else if (avgFamilyScore >= 20) familyRiskLevel = "Mild";

        // ── COMMUNITY RISK ────────────────────────────
        const communityData = await calculateCommunityRisk(household.village);

        res.json({
            householdId,
            village: household.village,
            individual: individualRisks,
            family: {
                riskLevel: familyRiskLevel,
                avgScore: avgFamilyScore,
                alerts: familyAlerts,
                summary: familyAlerts.length > 0
                    ? `${familyAlerts.length} shared risk pattern(s) detected in the household`
                    : "No shared risk patterns detected — household appears individually distributed"
            },
            community: communityData || {
                communityRiskLevel: "Unknown",
                message: "Community health data not available",
                trend: "Unknown",
                avgFever: 0,
                avgCough: 0,
                avgDiarrhea: 0,
                avgRisk: 0
            }
        });

    } catch (err) {
        console.error("Risk route error:", err);
        res.status(500).json({ message: "Failed to compute risk analysis" });
    }
});

export default router;
