import joblib
import json
import numpy as np
from src.ml.explain import explain_prediction

model = joblib.load("models/model.joblib")
with open("models/feature_schema.json") as f:
    schema = json.load(f)

features = schema["features"]
print(f"Loaded model with {len(model.classes_)} classes and {len(features)} features.")

# Create a test case: patient with cough, wheezing, shortness of breath, chest tightness
test_vector = np.zeros(len(features), dtype=np.uint8)
sample_symptoms = ["symptom_cough", "symptom_wheezing", "symptom_shortness_of_breath", "symptom_chest_tightness"]
for s in sample_symptoms:
    test_vector[features.index(s)] = 1

# Predict probabilities
probs = model.predict_proba([test_vector])[0]
top3_idx = np.argsort(probs)[::-1][:3]
top3_tuples = [(model.classes_[i], float(round(probs[i], 4))) for i in top3_idx]

print("\nTop 3 Predictions for [cough, wheezing, shortness of breath, chest tightness]:")
for disease, prob in top3_tuples:
    print(f"  {disease}: {prob * 100:.2f}%")

# Generate explanation
explanations = explain_prediction(model, test_vector, features, top3_tuples)
print("\nGenerated Explanations:")
print(json.dumps(explanations, indent=2))
