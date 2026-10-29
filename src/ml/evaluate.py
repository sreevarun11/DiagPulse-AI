"""
Comprehensive Model Evaluation & Stress Testing Pipeline
AI Powered Medical Diagnosis Classifier

Touches the held-out test set (10,005 cases) ONCE for the final production model.
Generates:
1. Overall test performance (Top-1 Acc, Top-3 Acc, Macro-F1, Weighted-F1, Brier score)
2. Per-class classification report (Precision, Recall, F1, Support)
3. Confusion matrix heatmap
4. Probability calibration analysis & reliability curve
5. Stress-testing / robustness evaluation (simulated symptom dropouts & sparse reporting)
6. Global feature importance chart
All metrics written to reports/ as JSON, CSV, and high-resolution PNG charts.
"""

import os
import sys
import json
import joblib
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import (
    accuracy_score, 
    f1_score, 
    precision_recall_fscore_support, 
    confusion_matrix, 
    top_k_accuracy_score,
    classification_report
)
from sklearn.calibration import calibration_curve

def evaluate_production_model(test_path="data/processed/test.parquet",
                              model_path="models/model.joblib",
                              reports_dir="reports",
                              figures_dir="reports/figures"):
    print("=" * 70)
    print("Starting Comprehensive Final Test Evaluation (Touching Test Set ONCE)")
    print("=" * 70)
    
    os.makedirs(reports_dir, exist_ok=True)
    os.makedirs(figures_dir, exist_ok=True)
    
    # Set plot style
    plt.style.use('seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'default')
    
    # 1. Load model and test data
    print(f"Loading production model from: {model_path}")
    model = joblib.load(model_path)
    
    print(f"Loading held-out test data from: {test_path}")
    test_df = pd.read_parquet(test_path)
    target_col = "disease"
    feature_cols = [c for c in test_df.columns if c != target_col]
    
    X_test = test_df[feature_cols].values
    y_test = test_df[target_col].values
    classes = list(model.classes_)
    
    print(f"Test cases: {len(X_test):,}, Feature count: {len(feature_cols)}, Classes: {len(classes)}")
    
    # 2. Baseline Test Predictions & Probabilities
    print("\nRunning inference on held-out test set...", flush=True)
    y_probs = model.predict_proba(X_test)
    y_preds = model.predict(X_test)
    
    top1_acc = float(round(accuracy_score(y_test, y_preds), 4))
    top3_acc = float(round(top_k_accuracy_score(y_test, y_probs, k=3, labels=model.classes_), 4))
    macro_f1 = float(round(f1_score(y_test, y_preds, average='macro', zero_division=0), 4))
    weighted_f1 = float(round(f1_score(y_test, y_preds, average='weighted', zero_division=0), 4))
    
    # Multi-class Brier score
    class_to_idx = {c: i for i, c in enumerate(classes)}
    y_test_indices = np.array([class_to_idx.get(y, -1) for y in y_test])
    valid_mask = y_test_indices >= 0
    
    y_test_onehot = np.zeros_like(y_probs[valid_mask])
    for row_idx, col_idx in enumerate(y_test_indices[valid_mask]):
        y_test_onehot[row_idx, col_idx] = 1.0
        
    brier_score = float(round(np.mean(np.sum((y_probs[valid_mask] - y_test_onehot) ** 2, axis=1)), 4))
    
    test_summary = {
        "evaluation_dataset": "Held-Out Test Set (10,005 cases)",
        "total_test_cases": int(len(X_test)),
        "top1_accuracy": top1_acc,
        "top3_accuracy": top3_acc,
        "macro_f1": macro_f1,
        "weighted_f1": weighted_f1,
        "brier_score": brier_score
    }
    
    print("\n" + "-" * 40)
    print("FINAL TEST SET PERFORMANCE (MEASURED)")
    print("-" * 40)
    print(f"Top-1 Accuracy:     {top1_acc:.4f} ({top1_acc * 100:.2f}%)")
    print(f"Top-3 Accuracy:     {top3_acc:.4f} ({top3_acc * 100:.2f}%)")
    print(f"Macro-F1 Score:     {macro_f1:.4f}")
    print(f"Weighted-F1 Score:  {weighted_f1:.4f}")
    print(f"Multi-Class Brier:  {brier_score:.4f}")
    print("-" * 40)
    
    with open(os.path.join(reports_dir, "test_metrics.json"), "w") as f:
        json.dump(test_summary, f, indent=2)
        
    # 3. Per-Class Precision, Recall, F1, Support
    print("\nGenerating per-class metrics report...", flush=True)
    report_dict = classification_report(y_test, y_preds, labels=classes, target_names=classes, output_dict=True, zero_division=0)
    
    per_class_rows = []
    for c in classes:
        if c in report_dict:
            per_class_rows.append({
                "disease": c,
                "precision": round(report_dict[c]["precision"], 4),
                "recall": round(report_dict[c]["recall"], 4),
                "f1_score": round(report_dict[c]["f1-score"], 4),
                "support": int(report_dict[c]["support"])
            })
            
    per_class_df = pd.DataFrame(per_class_rows).sort_values(by="support", ascending=False)
    per_class_df.to_csv(os.path.join(reports_dir, "per_class_metrics.csv"), index=False)
    with open(os.path.join(reports_dir, "per_class_metrics.json"), "w") as f:
        json.dump(per_class_rows, f, indent=2)
    print("Saved per-class metrics to CSV and JSON.")
    
    # 4. Confusion Matrix Heatmap
    print("\nComputing confusion matrix heatmap...", flush=True)
    cm = confusion_matrix(y_test, y_preds, labels=classes)
    
    # Save raw confusion matrix to JSON
    cm_dict = {
        "classes": classes,
        "matrix": cm.tolist()
    }
    with open(os.path.join(reports_dir, "confusion_matrix.json"), "w") as f:
        json.dump(cm_dict, f, indent=2)
        
    # Plot top 20 most frequent classes confusion matrix for readability
    top_20_classes = per_class_df.head(20)["disease"].tolist()
    top_20_idx = [classes.index(c) for c in top_20_classes]
    cm_top20 = cm[np.ix_(top_20_idx, top_20_idx)]
    
    # Normalize rows by support for percentage view
    cm_norm = cm_top20.astype('float') / np.maximum(cm_top20.sum(axis=1)[:, np.newaxis], 1)
    
    plt.figure(figsize=(14, 12))
    sns.heatmap(cm_norm, xticklabels=top_20_classes, yticklabels=top_20_classes, 
                cmap='Blues', annot=True, fmt='.2f', cbar=True, annot_kws={"size": 7.5})
    plt.title("Normalized Confusion Matrix (Top 20 Disease Categories, Test Set)", fontsize=13, fontweight='bold', pad=15)
    plt.xlabel("Predicted Disease", fontsize=11)
    plt.ylabel("True Disease", fontsize=11)
    plt.xticks(rotation=45, ha='right', fontsize=8.5)
    plt.yticks(rotation=0, fontsize=8.5)
    plt.tight_layout()
    plt.savefig(os.path.join(figures_dir, "confusion_matrix.png"), dpi=200)
    plt.close()
    print("Saved confusion_matrix.png")
    
    # 5. Probability Calibration Assessment & Reliability Curve
    print("\nEvaluating probability calibration...", flush=True)
    # Binary one-vs-rest pooling for multi-class calibration
    confidences = np.max(y_probs, axis=1)
    correct_preds = (y_preds == y_test).astype(int)
    
    # Calibration bins
    prob_true, prob_pred = calibration_curve(correct_preds, confidences, n_bins=10, strategy='uniform')
    
    plt.figure(figsize=(8, 6))
    plt.plot([0, 1], [0, 1], linestyle='--', color='#94a3b8', label='Perfect Calibration')
    plt.plot(prob_pred, prob_true, marker='o', linewidth=2, color='#2563eb', label=f'Model Calibration (Brier: {brier_score:.3f})')
    plt.title("Probability Reliability Curve (Confidence vs Empirical Accuracy)", fontsize=12, fontweight='bold', pad=12)
    plt.xlabel("Mean Predicted Model Confidence", fontsize=10.5)
    plt.ylabel("Observed Fraction of Correct Diagnoses", fontsize=10.5)
    plt.legend(frameon=True)
    plt.tight_layout()
    plt.savefig(os.path.join(figures_dir, "calibration_curve.png"), dpi=200)
    plt.close()
    print("Saved calibration_curve.png")
    
    # 6. Robustness Evaluation (Simulated Symptom Dropout & Incomplete Patient Reports)
    print("\nRunning Robustness Stress Tests (Simulated Real-World Incomplete Reports)...", flush=True)
    np.random.seed(42)
    
    robustness_scenarios = {
        "baseline_test": {
            "description": "Standard held-out test presentations (Full reported symptoms)",
            "dropout_rate": 0.0
        },
        "minor_symptom_dropout_10pct": {
            "description": "10% random symptom omissions (patient forgot minor signs)",
            "dropout_rate": 0.10
        },
        "moderate_symptom_dropout_25pct": {
            "description": "25% random symptom omissions (patient presents early in disease progression)",
            "dropout_rate": 0.25
        },
        "severe_symptom_dropout_50pct": {
            "description": "50% random symptom omissions (severely truncated or hurried triage report)",
            "dropout_rate": 0.50
        }
    }
    
    robustness_results = []
    
    for key, spec in robustness_scenarios.items():
        rate = spec["dropout_rate"]
        if rate == 0.0:
            X_stress = X_test.copy()
        else:
            # Mask active symptoms (where value is 1) with probability dropout_rate
            X_stress = X_test.copy()
            active_mask = (X_stress == 1)
            drop_mask = np.random.binomial(1, rate, size=X_stress.shape).astype(bool)
            X_stress[active_mask & drop_mask] = 0
            
        probs_stress = model.predict_proba(X_stress)
        preds_stress = model.predict(X_stress)
        
        t1 = float(round(accuracy_score(y_test, preds_stress), 4))
        t3 = float(round(top_k_accuracy_score(y_test, probs_stress, k=3, labels=classes), 4))
        mf1 = float(round(f1_score(y_test, preds_stress, average='macro', zero_division=0), 4))
        
        res = {
            "scenario": key,
            "description": spec["description"],
            "dropout_rate": rate,
            "top1_accuracy": t1,
            "top3_accuracy": t3,
            "macro_f1": mf1
        }
        robustness_results.append(res)
        print(f"  {key}: Top-1={t1:.4f} | Top-3={t3:.4f} | Macro-F1={mf1:.4f}")
        
    with open(os.path.join(reports_dir, "robustness_metrics.json"), "w") as f:
        json.dump(robustness_results, f, indent=2)
        
    # Plot Robustness Degradation Chart
    scenarios_labels = ["Baseline (0%)", "10% Omissions", "25% Omissions", "50% Omissions"]
    t1_scores = [r["top1_accuracy"] * 100 for r in robustness_results]
    t3_scores = [r["top3_accuracy"] * 100 for r in robustness_results]
    
    x = np.arange(len(scenarios_labels))
    width = 0.35
    
    plt.figure(figsize=(9, 5.5))
    plt.bar(x - width/2, t1_scores, width, label='Top-1 Accuracy (%)', color='#3b82f6')
    plt.bar(x + width/2, t3_scores, width, label='Top-3 Accuracy (%)', color='#10b981')
    
    plt.xlabel('Simulated Incomplete Clinical Report Scenario', fontsize=10.5)
    plt.ylabel('Diagnostic Accuracy (%)', fontsize=10.5)
    plt.title('Robustness Stress Test: Model Performance Under Symptom Dropout', fontsize=12, fontweight='bold', pad=12)
    plt.xticks(x, scenarios_labels)
    plt.ylim(0, 100)
    plt.legend(frameon=True)
    
    for i in range(len(x)):
        plt.text(x[i] - width/2, t1_scores[i] + 1.5, f"{t1_scores[i]:.1f}%", ha='center', fontsize=9, fontweight='bold')
        plt.text(x[i] + width/2, t3_scores[i] + 1.5, f"{t3_scores[i]:.1f}%", ha='center', fontsize=9, fontweight='bold')
        
    plt.tight_layout()
    plt.savefig(os.path.join(figures_dir, "robustness_evaluation.png"), dpi=200)
    plt.close()
    print("Saved robustness_evaluation.png")
    
    # 7. Global Feature Importance Chart
    print("\nGenerating global feature importance chart...", flush=True)
    global_weights = np.mean(np.abs(model.coef_), axis=0)
    sorted_idx = np.argsort(global_weights)[::-1]
    
    top_20_imp = global_weights[sorted_idx[:20]]
    top_20_names = [feature_cols[i].replace('symptom_', '').replace('rare_', 'rare_') for i in sorted_idx[:20]]
    
    plt.figure(figsize=(10, 7.5))
    plt.barh(top_20_names[::-1], top_20_imp[::-1], color='#6366f1', height=0.65)
    plt.title("Global Feature Importance (Mean Absolute Log-Odds Coefficients Across 46 Classes)\nNote: Describes Model Decision Weight, Not Biological Causation", 
              fontsize=11, fontweight='bold', pad=15)
    plt.xlabel("Mean Absolute Coefficient Magnitude (|w|)", fontsize=10)
    plt.tight_layout()
    plt.savefig(os.path.join(figures_dir, "global_feature_importance.png"), dpi=200)
    plt.close()
    print("Saved global_feature_importance.png")
    
    print("\nAll evaluation artifacts and figures generated successfully!")
    return test_summary

if __name__ == "__main__":
    evaluate_production_model()
