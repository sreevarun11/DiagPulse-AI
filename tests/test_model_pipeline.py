import os
import joblib
import json
import numpy as np
import pytest
from sklearn.linear_model import LogisticRegression
from src.ml.explain import explain_prediction

def test_model_artifact_load():
    model_path = "models/model.joblib"
    assert os.path.exists(model_path), f"Model artifact not found at {model_path}"
    model = joblib.load(model_path)
    
    # Must have 46 classes and 174 features
    assert len(model.classes_) == 46
    assert model.coef_.shape == (46, 174)

def test_training_reproducibility():
    """Verifies that fixed random seed (42) yields identical weights and predictions."""
    np.random.seed(42)
    # Generate small synthetic test matrix
    X_sub = np.random.binomial(1, 0.2, size=(200, 10))
    y_sub = np.random.choice(["Disease_A", "Disease_B", "Disease_C"], size=200)
    
    m1 = LogisticRegression(random_state=42, max_iter=50)
    m1.fit(X_sub, y_sub)
    
    m2 = LogisticRegression(random_state=42, max_iter=50)
    m2.fit(X_sub, y_sub)
    
    np.testing.assert_array_almost_equal(m1.coef_, m2.coef_, decimal=6)
    np.testing.assert_array_almost_equal(m1.intercept_, m2.intercept_, decimal=6)

def test_explainability_service():
    model = joblib.load("models/model.joblib")
    with open("models/feature_schema.json", "r") as f:
        schema = json.load(f)
        
    features = schema["features"]
    
    # Vector with 3 active symptoms
    vec = np.zeros(len(features), dtype=np.uint8)
    active_symps = ["symptom_cough", "symptom_fever", "symptom_fatigue"]
    for s in active_symps:
        if s in features:
            vec[features.index(s)] = 1
            
    top_classes = [("Flu", 0.55), ("Asthma", 0.25), ("Common_Cold", 0.10)]
    explanations = explain_prediction(model, vec, features, top_classes)
    
    assert "Flu" in explanations
    assert "Asthma" in explanations
    assert "Common_Cold" in explanations
    
    # Check caveat presence
    assert "causation_caveat" in explanations["Flu"]
    assert "not medical causation" in explanations["Flu"]["causation_caveat"].lower()
