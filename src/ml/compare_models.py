"""
Model Comparison and Selection Module
AI Powered Medical Diagnosis Classifier

Trains candidate models strictly on the training split (79,993 cases)
and evaluates on the validation split (10,002 cases) to select the optimal model.
Held-out test set is NOT touched during this stage.
"""

import os
import sys
import time
import json
import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import ComplementNB
from sklearn.ensemble import RandomForestClassifier, ExtraTreesClassifier
from sklearn.metrics import accuracy_score, f1_score, top_k_accuracy_score

def evaluate_predictions(y_true, y_pred, y_proba, classes):
    acc = accuracy_score(y_true, y_pred)
    macro_f1 = f1_score(y_true, y_pred, average='macro', zero_division=0)
    weighted_f1 = f1_score(y_true, y_pred, average='weighted', zero_division=0)
    
    # Calculate top-3 accuracy
    # y_proba shape is (n_samples, n_classes)
    try:
        top3_acc = top_k_accuracy_score(y_true, y_proba, k=3, labels=classes)
    except Exception as e:
        print(f"Top-3 calculation warning: {e}")
        top3_acc = np.nan
        
    return {
        "accuracy": float(round(acc, 4)),
        "top3_accuracy": float(round(top3_acc, 4)),
        "macro_f1": float(round(macro_f1, 4)),
        "weighted_f1": float(round(weighted_f1, 4))
    }

def run_comparison():
    print("Loading Train and Validation splits...", flush=True)
    train_df = pd.read_parquet("data/processed/train.parquet")
    val_df = pd.read_parquet("data/processed/val.parquet")
    
    target_col = "disease"
    feature_cols = [c for c in train_df.columns if c != target_col]
    
    X_train = train_df[feature_cols].values
    y_train = train_df[target_col].values
    
    X_val = val_df[feature_cols].values
    y_val = val_df[target_col].values
    
    # All classes present in training
    classes = np.unique(y_train)
    print(f"Features: {len(feature_cols)}, Training classes: {len(classes)}", flush=True)
    
    models = {
        "Logistic_Regression": LogisticRegression(max_iter=300, random_state=42, n_jobs=-1),
        "Complement_Naive_Bayes": ComplementNB(),
        "Random_Forest": RandomForestClassifier(n_estimators=100, max_depth=22, min_samples_split=5, random_state=42, n_jobs=-1),
        "Extra_Trees": ExtraTreesClassifier(n_estimators=100, max_depth=22, min_samples_split=5, random_state=42, n_jobs=-1)
    }
    
    results = {}
    
    for name, model in models.items():
        print(f"\nTraining {name}...", flush=True)
        t0 = time.time()
        model.fit(X_train, y_train)
        fit_time = round(time.time() - t0, 2)
        print(f"  Trained in {fit_time}s", flush=True)
        
        # Inference timing
        t_inf0 = time.time()
        y_pred = model.predict(X_val)
        y_proba = model.predict_proba(X_val)
        inf_time = round((time.time() - t_inf0) / len(X_val) * 1000, 3) # ms per case
        
        metrics = evaluate_predictions(y_val, y_pred, y_proba, model.classes_)
        metrics["training_time_seconds"] = fit_time
        metrics["inference_latency_ms"] = inf_time
        
        results[name] = metrics
        print(f"  Val Top-1 Acc: {metrics['accuracy']:.4f} | Top-3 Acc: {metrics['top3_accuracy']:.4f} | Macro-F1: {metrics['macro_f1']:.4f} | Weighted-F1: {metrics['weighted_f1']:.4f}", flush=True)
        
    print("\n--- Summary Model Comparison (Validation Split) ---", flush=True)
    results_df = pd.DataFrame(results).T
    print(results_df.to_string(), flush=True)
    
    # Save comparison table
    os.makedirs("reports", exist_ok=True)
    results_df.to_csv("reports/model_comparison.csv")
    with open("reports/model_comparison.json", "w") as f:
        json.dump(results, f, indent=2)
    print("Saved reports/model_comparison.csv and reports/model_comparison.json", flush=True)
    
    return results

if __name__ == "__main__":
    run_comparison()
