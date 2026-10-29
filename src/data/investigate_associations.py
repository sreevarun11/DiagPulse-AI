import pandas as pd
import numpy as np

df = pd.read_parquet("data/processed/raw_backup.parquet")

# Let's inspect the correlation between diseases and classic symptoms
# For example, Asthma vs wheezing, shortness_of_breath, cough
cols = [c for c in df.columns if c != "disease"]
print("SLE and butterfly rash:")
print(df[df["disease"] == "Systemic_Lupus_Erythematosus"]["rare_symptom_butterfly_rash"].value_counts())

print("\nAsthma and wheezing:")
print(df[df["disease"] == "Asthma"]["symptom_wheezing"].value_counts())

print("\nCOVID19 and loss_of_smell / loss_of_taste:")
print("Loss of smell in COVID19:", df[df["disease"] == "COVID19"]["symptom_loss_of_smell"].mean())
print("Loss of smell across all non-COVID19:", df[df["disease"] != "COVID19"]["symptom_loss_of_smell"].mean())

print("\nType2_Diabetes top symptoms:")
t2d = df[df["disease"] == "Type2_Diabetes"][cols].mean().sort_values(ascending=False).head(10)
print(t2d)

print("\nAll data symptom prevalence:")
all_prev = df[cols].mean()
print(f"Overall feature mean min={all_prev.min():.4f}, mean={all_prev.mean():.4f}, max={all_prev.max():.4f}")
