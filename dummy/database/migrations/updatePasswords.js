import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Household from './models/Household.js';

dotenv.config();

const generatePassword = () => {
    return Math.random().toString(36).slice(-8); // Generate 8 char random password
};

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const households = await Household.find({});
        console.log(`Found ${households.length} households.`);

        let updatedCount = 0;
        for (const hh of households) {
            if (!hh.password) {
                const newPass = generatePassword();
                hh.password = newPass;
                await hh.save();
                console.log(`Updated ${hh.householdId} with password: ${newPass}`);
                updatedCount++;
            }
        }

        console.log(`Finished. Updated passwords for ${updatedCount} households.`);

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
};

run();
