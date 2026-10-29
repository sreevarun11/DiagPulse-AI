import pandas as pd
import json

df = pd.read_parquet("data/processed/raw_backup.parquet")
cols = [c for c in df.columns if c != "disease"]
rare_cols = [c for c in cols if c.startswith("rare_")]
regular_cols = [c for c in cols if not c.startswith("rare_")]

print(f"Total features: {len(cols)}")
print(f"Regular symptom features: {len(regular_cols)}")
print(f"Rare symptom features: {len(rare_cols)}")
print("\nSample regular symptoms (first 15):", regular_cols[:15])
print("\nRare symptoms (all {len(rare_cols)}):", rare_cols)

# Check correlation or predictability: are some diseases uniquely identified by a single symptom?
# E.g., is rare_symptom_renal_cysts_rare only present in one disease?
rare_symptom_diseases = {}
for c in rare_cols:
    d_with_symptom = df[df[c] == 1]["disease"].value_counts()
    rare_symptom_diseases[c] = d_with_symptom.to_dict()

print("\n--- Rare Symptoms Disease Co-occurrence ---")
for c, d in list(rare_symptom_diseases.items())[:10]:
    print(f"{c}: {d}")

# Check synthetic data generation signals:
# Check top regular symptoms prevalence across classes
# In synthetic healthcare datasets (e.g. Kaggle/HuggingFace generated datasets), symptoms are often generated using conditional probabilities or templates per disease.
print("\n--- Mean symptom count per disease ---")
symptom_load = df[cols].sum(axis=1)
df['symptom_count'] = symptom_load
print(df.groupby('disease')['symptom_count'].agg(['count', 'mean', 'std', 'min', 'max']).head(20))
