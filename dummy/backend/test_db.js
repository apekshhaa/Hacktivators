import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const householdSchema = new mongoose.Schema({}, { strict: false });
const Household = mongoose.model("Household", householdSchema);

async function run() {
    await mongoose.connect(process.env.MONGO_URI);
    const h = await Household.findOne({});
    console.log("Found ID:", h ? h.householdId : "None");
    process.exit(0);
}

run();
