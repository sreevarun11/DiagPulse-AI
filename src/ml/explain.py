"""
Model Explainability Service
AI Powered Medical Diagnosis Classifier

Extracts mathematically exact local symptom contributions for each predicted disease
using the model's true linear log-odds coefficients (w_{c, i} * x_i).
Ensures zero fabricated explanations.
"""

import numpy as np

def explain_prediction(model, input_vector, feature_names, top_classes, max_symptoms_per_class=5):
    """
    Computes exact model contribution scores for the predicted disease classes.
    
    Parameters:
    - model: Trained LogisticRegression model instance.
    - input_vector: 1D array of length 174 (binary 0/1 indicator for each feature).
    - feature_names: list of feature column names in identical schema order.
    - top_classes: list of tuples (class_name, probability).
    - max_symptoms_per_class: maximum top contributing symptoms to return per class.
    
    Returns:
    - dict: mapping class_name -> list of contributing symptoms with contribution scores and clinical caveat.
    """
    class_to_row = {c: i for i, c in enumerate(model.classes_)}
    input_vector = np.asarray(input_vector, dtype=np.float32)
    
    # Active symptoms reported by the patient
    active_indices = np.where(input_vector > 0)[0]
    
    explanations = {}
    
    for class_name, prob in top_classes:
        if class_name not in class_to_row:
            continue
            
        row_idx = class_to_row[class_name]
        weights = model.coef_[row_idx] # weights for class c across all 174 features
        
        # Calculate contribution for each reported symptom: w_{c, i} * x_i
        contributions = []
        for idx in active_indices:
            w = float(weights[idx])
            contributions.append({
                "symptom": feature_names[idx],
                "clean_name": feature_names[idx].replace("symptom_", "").replace("rare_", "Rare: ").replace("_", " ").title(),
                "weight": round(w, 4),
                "direction": "positive" if w > 0 else "negative"
            })
            
        # Sort by positive contribution (symptoms that most strongly raised the model's probability for this disease)
        contributions.sort(key=lambda item: item["weight"], reverse=True)
        
        # Take top positive contributing symptoms
        top_positive = [item for item in contributions if item["weight"] > 0][:max_symptoms_per_class]
        
        explanations[class_name] = {
            "disease": class_name,
            "probability": prob,
            "top_contributing_symptoms": top_positive,
            "total_active_symptoms_evaluated": len(active_indices),
            "explanation_method": "Exact linear log-odds contribution (w_i * x_i)",
            "causation_caveat": "Feature contributions describe how the MODEL behaves, not medical causation. A high contribution score indicates the symptom increased the model's statistical likelihood estimate for this disease category, not that it caused the disease."
        }
        
    return explanations
