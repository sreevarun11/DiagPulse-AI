"""
Model Training Pipeline
AI Powered Medical Diagnosis Classifier

Trains the production clinical decision-support model (regularized Logistic Regression)
on the training split (79,993 cases). Evaluates validation metrics, derives abstention
thresholds, extracts global feature importances, and persists production artifacts.
"""

import os
import sys
import time
import json
import joblib
import platform
import numpy as np
import pandas as pd
import sklearn
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, f1_score, top_k_accuracy_score, brier_score_loss
from sklearn.calibration import calibration_curve

def train_production_model(train_path="data/processed/train.parquet",
                           val_path="data/processed/val.parquet",
                           model_output_path="models/model.joblib",
                           metadata_output_path="models/model_metadata.json"):
    t0 = time.time()
    print("=" * 60)
    print("Starting Model Training Pipeline")
    print("=" * 60)
    
    # 1. Load data
    print(f"Loading training data from {train_path}...")
    train_df = pd.read_parquet(train_path)
    val_df = pd.read_parquet(val_path)
    
    target_col = "disease"
    feature_cols = [c for c in train_df.columns if c != target_col]
    
    X_train = train_df[feature_cols].values
    y_train = train_df[target_col].values
    
    X_val = val_df[feature_cols].values
    y_val = val_df[target_col].values
    
    print(f"Train samples: {len(X_train):,}, Validation samples: {len(X_val):,}")
    print(f"Features: {len(feature_cols)}, Classes: {len(np.unique(y_train))}")
    
    # 2. Fit final Logistic Regression model
    # C=1.0, max_iter=300 with l2 regularization
    print("\nFitting Logistic Regression (multinomial L2)...", flush=True)
    fit_start = time.time()
    model = LogisticRegression(
        C=1.0,
        max_iter=300,
        random_state=42
    )
    model.fit(X_train, y_train)
    fit_duration = round(time.time() - fit_start, 2)
    print(f"Model fit completed in {fit_duration}s")
    
    classes = list(model.classes_)
    
    # 3. Validation evaluation
    val_probs = model.predict_proba(X_val)
    val_preds = model.predict(X_val)
    
    val_acc = float(round(accuracy_score(y_val, val_preds), 4))
    val_top3 = float(round(top_k_accuracy_score(y_val, val_probs, k=3, labels=model.classes_), 4))
    val_macro_f1 = float(round(f1_score(y_val, val_preds, average='macro', zero_division=0), 4))
    val_weighted_f1 = float(round(f1_score(y_val, val_preds, average='weighted', zero_division=0), 4))
    
    # Multi-class Brier score (mean squared difference between one-hot truth and predicted probability)
    # y_val one-hot encoding across model.classes_
    class_to_idx = {c: i for i, c in enumerate(classes)}
    y_val_indices = np.array([class_to_idx.get(y, -1) for y in y_val])
    valid_mask = y_val_indices >= 0
    
    y_val_onehot = np.zeros_like(val_probs[valid_mask])
    for row_idx, col_idx in enumerate(y_val_indices[valid_mask]):
        y_val_onehot[row_idx, col_idx] = 1.0
        
    brier_score = float(round(np.mean(np.sum((val_probs[valid_mask] - y_val_onehot) ** 2, axis=1)), 4))
    
    print(f"\n--- Validation Metrics ---")
    print(f"Top-1 Accuracy:     {val_acc:.4f} ({val_acc*100:.2f}%)")
    print(f"Top-3 Accuracy:     {val_top3:.4f} ({val_top3*100:.2f}%)")
    print(f"Macro-F1 Score:     {val_macro_f1:.4f}")
    print(f"Weighted-F1 Score:  {val_weighted_f1:.4f}")
    print(f"Multi-Class Brier:  {brier_score:.4f}")
    
    # 4. Abstention Thresholds Justification
    # Clinical decision support abstention rule:
    # 1. Minimum symptoms reported: < 2 symptoms -> Insufficient Information
    #    (Clinical justification: a single isolated symptom is too ambiguous for differential diagnosis).
    # 2. Confidence threshold: Top-1 predicted probability < 0.15 (15%) -> Insufficient Information / Low Confidence
    #    (With 46 classes, random chance is 1/46 = 2.17%; 0.15 is nearly 7x random chance).
    abstention_rules = {
        "min_symptoms_required": 2,
        "min_confidence_threshold": 0.15,
        "justification": "Clinical abstention protects patient safety: presentations with fewer than 2 symptoms contain insufficient discriminatory signal; predictions with confidence < 15% (near uniform distribution across 46 classes) represent unacceptable diagnostic entropy."
    }
    
    # 5. Extract Feature Coefficients & Global Importances
    # model.coef_ shape is (n_classes, n_features)
    # Global feature importance = mean absolute log-odds weight across all 46 classes
    global_importance = np.mean(np.abs(model.coef_), axis=0)
    top_features_idx = np.argsort(global_importance)[::-1]
    
    top_global_features = [
        {
            "rank": int(i + 1),
            "feature": feature_cols[idx],
            "importance": float(round(global_importance[idx], 4))
        }
        for i, idx in enumerate(top_features_idx[:25])
    ]
    
    # 6. Save model artifact
    os.makedirs(os.path.dirname(model_output_path), exist_ok=True)
    joblib.dump(model, model_output_path)
    print(f"\nPersisted production model to {model_output_path}")
    
    # 7. Model Metadata & Schema
    metadata = {
        "model_name": "AI Powered Medical Diagnosis Classifier",
        "model_type": "LogisticRegression (L2 Multinomial)",
        "training_date": time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime()),
        "random_seed": 42,
        "hyperparameters": {
            "C": 1.0,
            "penalty": "l2",
            "solver": "lbfgs",
            "max_iter": 300,
            "class_weight": None
        },
        "environment": {
            "python_version": platform.python_version(),
            "scikit_learn_version": sklearn.__version__,
            "numpy_version": np.__version__,
            "platform": platform.platform()
        },
        "dataset": {
            "name": "Community Healthcare MultiSymptomsDisease Diagnostic Dataset",
            "training_samples": int(len(X_train)),
            "validation_samples": int(len(X_val)),
            "feature_count": len(feature_cols),
            "class_count": len(classes)
        },
        "validation_metrics": {
            "top1_accuracy": val_acc,
            "top3_accuracy": val_top3,
            "macro_f1": val_macro_f1,
            "weighted_f1": val_weighted_f1,
            "brier_score": brier_score,
            "fit_duration_seconds": fit_duration
        },
        "abstention_rules": abstention_rules,
        "classes": classes,
        "features": feature_cols,
        "top_global_features": top_global_features
    }
    
    with open(metadata_output_path, "w") as f:
        json.dump(metadata, f, indent=2)
    print(f"Persisted model metadata to {metadata_output_path}")
    
    return model, metadata

if __name__ == "__main__":
    train_production_model()
