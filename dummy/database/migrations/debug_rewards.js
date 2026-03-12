import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Reward from './models/Reward.js';

dotenv.config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const id = 'HH-2024-1002';
        const reward = await Reward.findOne({ householdId: id });

        if (reward) {
            console.log("Found Reward:");
            console.log(JSON.stringify(reward, null, 2));
        } else {
            console.log(`No reward found for ${id}`);
        }

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
};

run();
