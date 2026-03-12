import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let rewardsContext = "";

const SYSTEM_PROMPT = `
You are a fast, helpful rural healthcare rewards assistant for "Swasthya Parivar".

RULES:
1. Answer ONLY using the context provided. 
2. BE EXTREMELY CONCISE. Short sentences only.
3. LANGUAGE: Detect the user's language. If they ask in Hindi, reply in Hindi. If Kannada, reply in Kannada. If English, reply in English.
4. If not in context, say: "Information not available. Contact health worker."

CONTEXT:
{context}
`;

export const initChatbot = () => {
    try {
        const filePath = path.join(__dirname, "../docs/rewards.txt");
        if (fs.existsSync(filePath)) {
            rewardsContext = fs.readFileSync(filePath, "utf8");
            console.log("✅ Chatbot loaded rewards context from rewards.txt");
        } else {
            console.error("❌ rewards.txt not found at", filePath);
        }
    } catch (error) {
        console.error("❌ Error initializing chatbot:", error);
    }
};

export const askQuestion = async (question, language = "detect") => {
    if (!rewardsContext) {
        return "Loading context...";
    }

    try {
        const langInstruction = language === "detect"
            ? "Detect the user's language and reply in it."
            : `REPLY ONLY IN ${language.toUpperCase()}.`;

        const response = await fetch("http://localhost:11434/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "llama3",
                prompt: `${SYSTEM_PROMPT.replace("{context}", rewardsContext)}\n\nLANGUAGE INSTRUCTION: ${langInstruction}\n\nUSER QUESTION: ${question}`,
                stream: false,
                options: {
                    num_predict: 100, // Even shorter for more speed
                    temperature: 0.2
                }
            })
        });

        if (!response.ok) throw new Error(`Ollama status: ${response.status}`);

        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error("❌ Ollama Error:", error.message);
        if (error.message.includes("fetch failed")) {
            return "Ollama is not running. Please start the Ollama app.";
        }
        return `Error: ${error.message}`;
    }
};
