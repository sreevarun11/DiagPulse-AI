import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score
from sklearn.feature_selection import mutual_info_classif

df = pd.read_parquet("data/processed/raw_backup.parquet")
target_col = "disease"
cols = [c for c in df.columns if c != target_col]

# Check mutual information on a sample (e.g. 5000 rows)
sample = df.sample(n=5000, random_state=42)
X_sub = sample[cols]
y_sub = sample[target_col]

# Let's check a quick Logistic Regression or Random Forest CV on top classes
top_classes = df[target_col].value_counts().head(10).index.tolist()
sample_top = sample[sample[target_col].isin(top_classes)]
X_top = sample_top[cols]
y_top = sample_top[target_col]

clf = LogisticRegression(max_iter=200, random_state=42)
scores = cross_val_score(clf, X_top, y_top, cv=3, scoring='accuracy')
print(f"Probe 3-fold CV Accuracy (Logistic Regression on top 10 classes, n={len(X_top)}): {scores.mean():.4f} +/- {scores.std():.4f}")
print(f"Dummy baseline (most frequent class among top 10): {y_top.value_counts().max() / len(y_top):.4f}")

# Check feature correlation / differences across top classes
mean_by_disease = df.groupby(target_col)[cols].mean()
print("\nVariance of symptom prevalence across diseases:")
symptom_variance_across_diseases = mean_by_disease.var(axis=0)
print(f"Max cross-disease variance for a symptom: {symptom_variance_across_diseases.max():.6f}")
print(f"Top 5 symptoms by cross-disease variance:\n{symptom_variance_across_diseases.nlargest(5)}")
print(f"Bottom 5 symptoms by cross-disease variance:\n{symptom_variance_across_diseases.nsmallest(5)}")
