import express from "express";
import { askQuestion } from "../utils/chatbot.js";

const router = express.Router();

router.post("/", async (req, res) => {
    const { question, language } = req.body;

    if (!question) {
        return res.status(400).json({ error: "Question is required" });
    }

    try {
        const answer = await askQuestion(question, language);
        res.json({ answer });
    } catch (error) {
        res.status(500).json({ error: "Failed to get answer" });
    }
});

export default router;
