from fastapi import FastAPI
from pydantic import BaseModel
import joblib

app = FastAPI()

# Load trained model
model = joblib.load("health_risk_model.pkl")


# -----------------------------
# Input structure
# -----------------------------
from typing import Union, List
class HealthInput(BaseModel):
    age: int
    symptoms: Union[List[str], str]


# -----------------------------
# Convert symptoms → feature vector
# -----------------------------
def build_features(age, symptoms):

    if isinstance(symptoms, str):
        symptoms = [s.strip() for s in symptoms.split(",")]
        
    symptoms = [s.lower() for s in symptoms]

    return [
        age,
        1 if "fever" in symptoms else 0,
        1 if "cough" in symptoms else 0,
        1 if "fatigue" in symptoms else 0,
        1 if "headache" in symptoms else 0,
        1 if "chest pain" in symptoms else 0,
        1 if "short breath" in symptoms else 0,
        1 if "nausea" in symptoms else 0,
        1 if "vomiting" in symptoms else 0,
        1 if "body pain" in symptoms else 0,
        1 if "sore throat" in symptoms else 0,
        1 if "runny nose" in symptoms else 0,
        1 if "dizziness" in symptoms else 0,
        0,  # DiabetesHistory
        0,  # BPHigh
        0   # Smoking
    ]


# -----------------------------
# Convert probability → risk level
# -----------------------------
def risk_indicator(prob):

    prob = prob * 100

    if prob < 35:
        return "Low"

    elif prob < 70:
        return "Moderate"

    else:
        return "High"


# -----------------------------
# Prediction API
# -----------------------------
@app.post("/predict")

def predict(data: HealthInput):

    features = build_features(data.age, data.symptoms)

    prediction = model.predict([features])[0]

    probabilities = model.predict_proba([features])[0]
    class_names = model.classes_

    confidence = max(probabilities)

    risk = risk_indicator(confidence)

    # Build full disease breakdown sorted by probability (highest first)
    disease_risks = []
    for i, cls in enumerate(class_names):
        pct = round(probabilities[i] * 100, 1)
        if pct >= 1:  # Only include diseases with >= 1% probability
            disease_risks.append({
                "disease": cls,
                "probability": pct
            })
    disease_risks.sort(key=lambda x: x["probability"], reverse=True)

    return {
        "predicted_condition": prediction,
        "risk_level": risk,
        "confidence": round(confidence * 100, 2),
        "disease_risks": disease_risks
    }