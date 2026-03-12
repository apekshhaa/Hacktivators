def predict_disease(symptoms):
    if "fever" in symptoms and "cough" in symptoms:
        return {"prediction": "Flu", "confidence": 0.85}
    return {"prediction": "Unknown", "confidence": 0.0}