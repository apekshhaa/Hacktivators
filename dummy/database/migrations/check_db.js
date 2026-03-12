import mongoose from "mongoose";
import dotenv from "dotenv";
import Household from "./models/Household.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);
const h = await Household.findOne({ householdId: 'HH-2024-1001' });
console.log(`DB Password for 'HH-2024-1001': '${h.password}' (len: ${h.password?.length})`);
process.exit();
