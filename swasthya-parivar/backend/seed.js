import mongoose from "mongoose";
import dotenv from "dotenv";
import Household from "./models/Household.js";
import Checkup from "./models/Checkup.js";
import Reward from "./models/Reward.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected for Seeding"))
    .catch(err => console.error(err));

const DEFAULT_BADGES = [
    { id: 1, name: 'Regular Checkup Family', desc: '10+ checkups completed', icon: '👨‍👩‍👧‍👦' },
    { id: 2, name: 'Health Champion', desc: 'Maintained 6-month streak', icon: '💪' },
    { id: 3, name: 'Vaccination Hero', desc: 'All family vaccinated', icon: '💉' },
    { id: 4, name: 'Perfect Attendance', desc: 'No missed appointments', icon: '✨' },
];

const DEFAULT_BENEFITS = [
    { id: 1, name: 'Monthly Ration Kit', points: 400 },
    { id: 2, name: 'Free Medicine Voucher', points: 300 },
    { id: 3, name: 'Health Insurance Subsidy', points: 600 },
];

const villages = ["Chandpur", "Rampur", "Kudlu", "Sodepur", "Malda", "Bishnupur"];
const statuses = ["Done", "Due", "Missed"];
const firstNames = ["Ramesh", "Suresh", "Priya", "Sunita", "Rahul", "Anjali", "Vikram", "Meera", "Arjun", "Kavita", "Deepak", "Sneha"];
const lastNames = ["Kumar", "Devi", "Singh", "Sharma", "Yadav", "Verma", "Gupta", "Das", "Patel", "Mishra"];
const relations = ["Wife", "Son", "Daughter", "Mother", "Father", "Brother", "Sister"];
const healthFlags = ["Hypertension", "Diabetes", "Low SpO2", "Vaccination Pending", "Malnutrition", "Fever"];

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateFamilyMembers = (headName) => {
    const members = [{
        name: headName,
        relation: "Head",
        age: getRandomInt(25, 65),
        gender: "Male",
        status: "Healthy",
        flag: null
    }];

    const count = getRandomInt(1, 5); // Add 1-5 more members
    for (let i = 0; i < count; i++) {
        const relation = getRandom(relations);
        const gender = ["Wife", "Mother", "Sister", "Daughter"].includes(relation) ? "Female" : "Male";
        const age = relation === "Son" || relation === "Daughter" ? getRandomInt(1, 18) : getRandomInt(20, 80);
        const status = Math.random() > 0.7 ? "Follow-up" : "Healthy"; // 30% chance of issue
        const flag = status === "Follow-up" ? getRandom(healthFlags) : null;

        members.push({
            name: `${getRandom(firstNames)} ${headName.split(" ")[1] || "Kumar"}`,
            relation: relation,
            age: age,
            gender: gender,
            status: status,
            flag: flag
        });
    }
    return members;
};

const seedData = async () => {
    try {
        await Household.deleteMany();
        await Checkup.deleteMany();
        await Reward.deleteMany();

        console.log("Cleared old data... Generating 50 households...");

        const households = [];
        const checkups = [];
        const rewards = [];

        for (let i = 1; i <= 50; i++) {
            const householdId = `HH-2024-${1000 + i}`;
            const headName = `${getRandom(firstNames)} ${getRandom(lastNames)}`;
            const village = getRandom(villages);
            const status = getRandom(statuses);
            const familyMembers = generateFamilyMembers(headName);

            // Collect flags from family members
            const activeFlags = familyMembers.filter(m => m.flag).map(m => `${m.flag}: ${m.relation}`);
            if (activeFlags.length === 0 && Math.random() > 0.8) activeFlags.push("Routine Checkup needed");

            households.push({
                householdId,
                head: headName,
                members_count: familyMembers.length,
                village,
                status,
                flags: activeFlags,
                password: "password", // Default password for all seeded households
                familyMembers
            });

            // Generate Checkup History
            const historyCount = getRandomInt(1, 15);
            let completedCheckups = 0;

            for (let j = 0; j < historyCount; j++) {
                const isMissed = Math.random() > 0.8;
                if (!isMissed) completedCheckups++;

                checkups.push({
                    householdId,
                    date: `${getRandomInt(1, 28)}/${getRandomInt(1, 12)}/${2024 + (j > 2 ? 1 : 0)}`,
                    status: isMissed ? "Missed" : "Done",
                    notes: "Routine visit recorded.",
                    pointsEarned: isMissed ? 0 : 50
                });
            }

            // Generate Smart Rewards
            const streak = getRandomInt(0, 10);
            const basePoints = (completedCheckups * 50);
            const streakBonus = (streak * 20);
            const totalPoints = basePoints + streakBonus + getRandomInt(0, 100);

            // Determine badges
            const badges = DEFAULT_BADGES.map(b => {
                let unlocked = false;
                if (b.id === 1 && completedCheckups >= 10) unlocked = true;
                if (b.id === 2 && streak >= 6) unlocked = true;
                if (b.id === 3 && Math.random() > 0.7) unlocked = true;
                if (b.id === 4 && streak >= 8) unlocked = true;
                return { ...b, unlocked };
            });

            // Determine benefits
            const benefits = DEFAULT_BENEFITS.map(b => ({
                ...b,
                eligible: totalPoints >= b.points
            }));

            rewards.push({
                householdId,
                totalPoints,
                currentStreak: streak,
                badges,
                benefits,
                rewardEligibility: totalPoints >= 300
            });
        }

        await Household.insertMany(households);
        await Checkup.insertMany(checkups);
        await Reward.insertMany(rewards);

        console.log("Database Seeded Successfully with 50 entries! 🚀");
        console.log("Sample ID to test: HH-2024-1001");
        process.exit();
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

seedData();
