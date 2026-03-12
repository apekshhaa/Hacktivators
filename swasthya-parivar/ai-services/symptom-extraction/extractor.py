def extract_symptoms(text):
    # Call to NLP model like BioBERT or similar
    # Placeholder logic
    keywords = ["fever", "cough", "headache"]
    return [word for word in keywords if word in text.lower()]