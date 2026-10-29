import pandas as pd
import numpy as np
import json
import time

print("Starting deep dataset audit...", flush=True)
raw_path = "data/raw/raw_dataset.xlsx"
t0 = time.time()
df = pd.read_excel(raw_path, engine="calamine")
print(f"Loaded {df.shape[0]} rows, {df.shape[1]} cols in {time.time() - t0:.2f}s", flush=True)

# 1. Target column inspection
target_col = "disease"
print(f"\n--- Target Column: '{target_col}' ---", flush=True)
val_counts = df[target_col].value_counts()
num_classes = len(val_counts)
print(f"Number of distinct disease classes: {num_classes}", flush=True)
print(f"Min class count: {val_counts.min()} ('{val_counts.idxmin()}')", flush=True)
print(f"Max class count: {val_counts.max()} ('{val_counts.idxmax()}')", flush=True)
print(f"Mean class count: {val_counts.mean():.2f}", flush=True)
print(f"Median class count: {val_counts.median()}", flush=True)
print(f"Std class count: {val_counts.std():.2f}", flush=True)
print("\nAll 46 classes and their counts:\n", flush=True)
for disease, cnt in val_counts.items():
    print(f"  {disease}: {cnt}", flush=True)

# 2. Features inspection
feature_cols = [c for c in df.columns if c != target_col]
print(f"\n--- Features ({len(feature_cols)}) ---", flush=True)

constant_cols = [c for c in feature_cols if df[c].nunique() <= 1]
print(f"Constant columns (zero variance): {len(constant_cols)}: {constant_cols}", flush=True)

non_binary = {}
for c in feature_cols:
    u = set(df[c].unique())
    if not u.issubset({0, 1}):
        non_binary[c] = u
print(f"Non-binary feature columns: {len(non_binary)}: {non_binary}", flush=True)

# 3. Missing values
null_counts = df.isna().sum()
total_nulls = null_counts.sum()
print(f"\nTotal missing values: {total_nulls}", flush=True)

# 4. Exact duplicates
exact_dup_count = df.duplicated().sum()
print(f"\nExact duplicate rows (features + disease): {exact_dup_count} ({exact_dup_count / len(df) * 100:.2f}%)", flush=True)

# 5. Symptom pattern duplicates and contradictions
feature_dup_count = df.duplicated(subset=feature_cols).sum()
print(f"Duplicate symptom patterns: {feature_dup_count} ({feature_dup_count / len(df) * 100:.2f}%)", flush=True)

# Conflicting patterns: identical symptoms but different disease
unique_symptom_disease = df.drop_duplicates(subset=feature_cols + [target_col])
conflicting_patterns_count = unique_symptom_disease.duplicated(subset=feature_cols).sum()
print(f"Conflicting symptom patterns (same symptoms -> different disease): {conflicting_patterns_count}", flush=True)

# 6. Symptom load per patient
symptom_load = df[feature_cols].sum(axis=1)
print(f"\n--- Symptom Load per Patient ---", flush=True)
print(f"Min symptoms: {symptom_load.min()}", flush=True)
print(f"Max symptoms: {symptom_load.max()}", flush=True)
print(f"Mean symptoms: {symptom_load.mean():.2f}", flush=True)
print(f"Median symptoms: {symptom_load.median()}", flush=True)
zero_symp = (symptom_load == 0).sum()
print(f"Patients with 0 symptoms: {zero_symp}", flush=True)
print(f"Symptom count distribution (quantiles):\n{symptom_load.describe()}", flush=True)

# 7. Symptom prevalence
symptom_prev = df[feature_cols].mean().sort_values(ascending=False)
print(f"\nTop 10 most common symptoms:\n{symptom_prev.head(10)}", flush=True)
print(f"\nTop 10 rarest symptoms:\n{symptom_prev.tail(10)}", flush=True)

# Save fast parquet copy
df.to_parquet("data/processed/raw_backup.parquet", index=False)
print("\nSuccessfully saved data/processed/raw_backup.parquet!", flush=True)
