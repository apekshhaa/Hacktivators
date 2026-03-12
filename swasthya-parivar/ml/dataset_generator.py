import pandas as pd
import random

rows = []

for i in range(1000):

    age = random.randint(18,75)

    fever = random.randint(0,1)
    cough = random.randint(0,1)
    fatigue = random.randint(0,1)
    headache = random.randint(0,1)
    chest = random.randint(0,1)
    breath = random.randint(0,1)
    nausea = random.randint(0,1)
    vomiting = random.randint(0,1)
    bodypain = random.randint(0,1)
    sore = random.randint(0,1)
    runny = random.randint(0,1)
    dizzy = random.randint(0,1)

    diabetes = random.randint(0,1)
    bp = random.randint(0,1)
    smoking = random.randint(0,1)

    if fever and cough and sore:
        disease = "Flu"

    elif fever and bodypain:
        disease = "ViralFever"

    elif nausea and vomiting:
        disease = "FoodPoisoning"

    elif breath and smoking:
        disease = "Asthma"

    elif diabetes:
        disease = "DiabetesRisk"

    elif bp and chest:
        disease = "Hypertension"

    elif headache and dizzy:
        disease = "Migraine"

    else:
        disease = "Healthy"

    rows.append([
        age, fever, cough, fatigue, headache, chest, breath,
        nausea, vomiting, bodypain, sore, runny, dizzy,
        diabetes, bp, smoking, disease
    ])

columns = [
"Age","Fever","Cough","Fatigue","Headache","ChestPain",
"ShortBreath","Nausea","Vomiting","BodyPain","SoreThroat",
"RunnyNose","Dizziness","DiabetesHistory","BPHigh","Smoking","Disease"
]

df = pd.DataFrame(rows, columns=columns)

df.to_csv("health_dataset.csv", index=False)

print("Dataset created successfully")