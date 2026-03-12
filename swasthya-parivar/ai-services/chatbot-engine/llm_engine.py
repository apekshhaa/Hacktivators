def get_chatbot_response(prompt, lang="en"):
    # Mocking Gemini / LLaMA response
    responses = {
        "en": "Please consult a health worker if symptoms persist.",
        "hi": "यदी लक्षण बने रहते हैं, तो स्वास्थ्य कार्यकर्ता से संपर्क करें।"
    }
    return responses.get(lang, responses["en"])