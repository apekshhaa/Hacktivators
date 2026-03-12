import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import joblib

# Load dataset
data = pd.read_csv("health_dataset.csv")

# Features and label
X = data.drop("Disease", axis=1)
y = data["Disease"]

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train model
model = RandomForestClassifier(n_estimators=200)
model.fit(X_train, y_train)

# Check accuracy
accuracy = model.score(X_test, y_test)
print("Model accuracy:", accuracy)

# Save model
joblib.dump(model, "health_risk_model.pkl")

print("Model saved successfully")