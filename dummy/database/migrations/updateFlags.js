import mongoose from "mongoose";
import dotenv from "dotenv";
import Household from "./models/Household.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected for Updating Flags"))
    .catch(err => console.error(err));

const newSymptoms = ["Diabetes", "Fever", "Typhoid", "Diarrhea", "Vomiting", "Constipation", "Headache"];

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const updateFlags = async () => {
    try {
        const households = await Household.find();

        for (const household of households) {
            // Update familyMembers flags: remove relation part
            household.familyMembers.forEach(member => {
                if (member.flag) {
                    member.flag = member.flag.split(':')[0].trim();
                }
            });

            // Add Diarrhea to most households (75% chance) by assigning to a random family member
            if (Math.random() < 0.75) {
                const membersWithFlags = household.familyMembers.filter(m => m.flag);
                const membersWithoutFlags = household.familyMembers.filter(m => !m.flag);

                let targetMember;
                if (membersWithoutFlags.length > 0) {
                    targetMember = getRandom(membersWithoutFlags);
                } else if (membersWithFlags.length > 0) {
                    // If all have flags, replace one randomly
                    targetMember = getRandom(membersWithFlags);
                } else {
                    // If no members, skip (though households should have members)
                    targetMember = null;
                }

                if (targetMember) {
                    targetMember.flag = "Diarrhea";
                }
            }

            // Update household flags: based on actual family member symptoms, unique and minimal
            let symptoms = household.familyMembers
                .filter(member => member.flag)
                .map(member => member.flag);
            symptoms = [...new Set(symptoms)]; // unique

            // Keep minimal: if more than 3, randomly keep 2-3
            if (symptoms.length > 3) {
                const keepCount = getRandomInt(2, 3);
                symptoms = symptoms.slice(0, keepCount);
            }

            household.flags = symptoms;

            await household.save();
        }

        // Keep exactly three households with empty flags
        const allHouseholds = await Household.find();
        const householdsWithFlags = allHouseholds.filter(h => h.flags.length > 0);
        
        // Randomly select 3 households to make empty
        const toEmpty = [];
        for (let i = 0; i < 3 && householdsWithFlags.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * householdsWithFlags.length);
            toEmpty.push(householdsWithFlags.splice(randomIndex, 1)[0]);
        }

        for (const household of toEmpty) {
            household.flags = [];
            household.familyMembers.forEach(member => {
                member.flag = null;
            });
            await household.save();
        }

        console.log("Flags updated with diversity for all households!");
        process.exit();
    } catch (error) {
        console.error("Error updating flags:", error);
        process.exit(1);
    }
};

updateFlags();