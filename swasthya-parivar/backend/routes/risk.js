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
// Helper: compute per-member risk from data
// ──────────────────────────────────────────────
const getMemberRisk = (member, memberCheckups = []) => {
    let score = 0;
    let reasons = [];

    // 1. Age-based vulnerability
    if (member.age < 5) {
        score += 30;
        reasons.push("Infant (high vulnerability)");
    } else if (member.age < 12) {
        score += 15;
        reasons.push("Child (moderate vulnerability)");
    } else if (member.age >= 60) {
        score += 30;
        reasons.push("Elderly (high vulnerability)");
    } else if (member.age >= 45) {
        score += 10;
        reasons.push("Middle-aged (mild elevated risk)");
    }

    // 2. Health status
    if (member.status === "Critical") {
        score += 40;
        reasons.push("Critical health status");
    } else if (member.status === "Follow-up") {
        score += 20;
        reasons.push("Pending follow-up");
    } else if (member.status === "Due") {
        score += 10;
        reasons.push("Checkup overdue");
    }

    // 3. Active flag
    if (member.flag && member.flag !== "") {
        score += 20;
        reasons.push(`Active flag: ${member.flag}`);
    }

    // 4. Recurring diseases in checkup history
    const diseaseCounts = {};
    memberCheckups.forEach(c => {
        if (Array.isArray(c.diseases)) {
            c.diseases.forEach(d => {
                diseaseCounts[d] = (diseaseCounts[d] || 0) + 1;
            });
        }
    });
    const recurring = Object.entries(diseaseCounts).filter(([, count]) => count >= 2);
    if (recurring.length > 0) {
        score += 15;
        reasons.push(`Recurring: ${recurring.map(([d]) => d).join(", ")}`);
    }

    // Cap at 100
    score = Math.min(score, 100);

    let level = "Low";
    if (score >= 70) level = "High";
    else if (score >= 40) level = "Moderate";
    else if (score >= 20) level = "Mild";

    return { score, level, reasons };
};

// ──────────────────────────────────────────────
// Helper: read community CSV data
// ──────────────────────────────────────────────
const readCommunityCSV = (village) => {
    return new Promise((resolve) => {
        const csvPath = path.join(__dirname, "../../village_V001_health_timeseries_daily.csv");
        if (!fs.existsSync(csvPath)) return resolve(null);

        const results = [];
        fs.createReadStream(csvPath)
            .pipe(csv({ mapHeaders: ({ header }) => header.trim() }))
            .on("data", (row) => {
                for (let key in row) {
                    if (typeof row[key] === "string") row[key] = row[key].trim();
                    if (key !== "date" && key !== "village") row[key] = parseFloat(row[key]);
                }
                results.push(row);
            })
            .on("end", () => {
                let data = results;
                // Filter by village if known, otherwise use all
                if (village && village !== "All Villages") {
                    const filtered = results.filter(r => r.village === village);
                    if (filtered.length > 0) data = filtered;
                }
                // Get last 14 days
                const recent = data.slice(-14);
                if (recent.length === 0) return resolve(null);

                const avgFever = recent.reduce((s, d) => s + (d.fever_cases || 0), 0) / recent.length;
                const avgCough = recent.reduce((s, d) => s + (d.cough_cases || 0), 0) / recent.length;
                const avgDiarrhea = recent.reduce((s, d) => s + (d.diarrhea_cases || 0), 0) / recent.length;
                const avgRisk = recent.reduce((s, d) => s + (d.env_risk_index || 0), 0) / recent.length;

                // Trend: compare last 7 vs previous 7
                const half = Math.floor(recent.length / 2);
                const prev7 = recent.slice(0, half);
                const last7 = recent.slice(half);
                const prevFever = prev7.reduce((s, d) => s + (d.fever_cases || 0), 0) / (prev7.length || 1);
                const lastFever = last7.reduce((s, d) => s + (d.fever_cases || 0), 0) / (last7.length || 1);
                const trend = lastFever > prevFever * 1.1 ? "Rising" : lastFever < prevFever * 0.9 ? "Falling" : "Stable";

                let communityRiskLevel = "Low";
                if (avgRisk >= 7) communityRiskLevel = "High";
                else if (avgRisk >= 5) communityRiskLevel = "Moderate";
                else if (avgRisk >= 3) communityRiskLevel = "Mild";

                resolve({
                    avgFever: Math.round(avgFever * 10) / 10,
                    avgCough: Math.round(avgCough * 10) / 10,
                    avgDiarrhea: Math.round(avgDiarrhea * 10) / 10,
                    avgRisk: Math.round(avgRisk * 10) / 10,
                    trend,
                    communityRiskLevel,
                    message: `Community ${trend.toLowerCase()} fever trend over last 14 days. Environmental risk index: ${Math.round(avgRisk * 10) / 10}/10.`,
                    villages: [...new Set(results.map(r => r.village))]
                });
            })
            .on("error", () => resolve(null));
    });
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
        const individualRisks = household.familyMembers.map(member => {
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

            const risk = getMemberRisk(member, allCheckups);
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
        const communityData = await readCommunityCSV(household.village);

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
