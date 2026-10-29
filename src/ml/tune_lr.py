import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, f1_score, top_k_accuracy_score

train_df = pd.read_parquet("data/processed/train.parquet")
val_df = pd.read_parquet("data/processed/val.parquet")

target_col = "disease"
feature_cols = [c for c in train_df.columns if c != target_col]

X_train, y_train = train_df[feature_cols].values, train_df[target_col].values
X_val, y_val = val_df[feature_cols].values, val_df[target_col].values

print("Comparing Logistic Regression variants on Validation set...")

# 1. Standard L2
clf_standard = LogisticRegression(C=1.0, max_iter=300, random_state=42)
clf_standard.fit(X_train, y_train)
y_pred_std = clf_standard.predict(X_val)
y_proba_std = clf_standard.predict_proba(X_val)

acc_std = accuracy_score(y_val, y_pred_std)
top3_std = top_k_accuracy_score(y_val, y_proba_std, k=3, labels=clf_standard.classes_)
macro_std = f1_score(y_val, y_pred_std, average='macro', zero_division=0)
weighted_std = f1_score(y_val, y_pred_std, average='weighted', zero_division=0)

print(f"Standard LR: Top-1 Acc={acc_std:.4f}, Top-3={top3_std:.4f}, Macro-F1={macro_std:.4f}, Weighted-F1={weighted_std:.4f}")

# 2. Balanced class weight
clf_bal = LogisticRegression(C=1.0, class_weight='balanced', max_iter=300, random_state=42)
clf_bal.fit(X_train, y_train)
y_pred_bal = clf_bal.predict(X_val)
y_proba_bal = clf_bal.predict_proba(X_val)

acc_bal = accuracy_score(y_val, y_pred_bal)
top3_bal = top_k_accuracy_score(y_val, y_proba_bal, k=3, labels=clf_bal.classes_)
macro_bal = f1_score(y_val, y_pred_bal, average='macro', zero_division=0)
weighted_bal = f1_score(y_val, y_pred_bal, average='weighted', zero_division=0)

print(f"Balanced LR: Top-1 Acc={acc_bal:.4f}, Top-3={top3_bal:.4f}, Macro-F1={macro_bal:.4f}, Weighted-F1={weighted_bal:.4f}")
