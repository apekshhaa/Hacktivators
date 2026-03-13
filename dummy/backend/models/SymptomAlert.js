import mongoose from 'mongoose';

const symptomAlertSchema = new mongoose.Schema({
    householdId: { type: String, required: true },
    memberId: { type: String, required: true },
    memberName: { type: String, required: true },
    headName: { type: String },
    village: { type: String },
    age: { type: Number },
    symptoms: { type: String, required: true },         // "Fever, Cough, Headache"
    riskLevel: { type: String, default: 'Low' },        // from ML analysis
    riskScore: { type: Number, default: 0 },
    predictedCondition: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('SymptomAlert', symptomAlertSchema);
