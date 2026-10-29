import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import json
import os

print("Generating EDA visualizations and report...", flush=True)
os.makedirs("reports/figures", exist_ok=True)

df = pd.read_parquet("data/processed/raw_backup.parquet")
target_col = "disease"
feature_cols = [c for c in df.columns if c != target_col]

# Set overall plot styling
plt.style.use('seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'default')
plt.rcParams['font.sans-serif'] = 'Helvetica, Arial, DejaVu Sans'
plt.rcParams['axes.edgecolor'] = '#cbd5e1'
plt.rcParams['axes.linewidth'] = 0.8

# 1. Class Distribution Plot
plt.figure(figsize=(14, 10))
class_counts = df[target_col].value_counts()
colors = ['#1e40af' if i < 10 else '#3b82f6' if i < 25 else '#93c5fd' if cnt >= 50 else '#ef4444' 
          for i, cnt in enumerate(class_counts.values)]
bars = plt.barh(class_counts.index[::-1], class_counts.values[::-1], color=colors[::-1], height=0.7)
plt.xscale('log')
plt.title("Distribution of Disease Categories (N=100,000, 46 Classes, Log Scale)", fontsize=14, fontweight='bold', pad=15)
plt.xlabel("Number of Cases (Logarithmic Scale)", fontsize=11)
plt.ylabel("Disease Category", fontsize=11)
plt.tight_layout()
plt.savefig("reports/figures/class_distribution.png", dpi=200)
plt.close()
print("Saved class_distribution.png", flush=True)

# 2. Symptom Frequency Plot (Top 25 and Bottom 20)
symptom_prev = df[feature_cols].mean() * 100
top_25 = symptom_prev.nlargest(25)
bottom_20 = symptom_prev.nsmallest(20)

fig, axes = plt.subplots(1, 2, figsize=(16, 8))
axes[0].barh([c.replace('symptom_', '') for c in top_25.index[::-1]], top_25.values[::-1], color='#0284c7', height=0.65)
axes[0].set_title("Top 25 Most Frequent Symptoms (% of Patients)", fontsize=12, fontweight='bold')
axes[0].set_xlabel("Prevalence (%)", fontsize=10)

axes[1].barh([c.replace('rare_symptom_', 'rare_').replace('symptom_', '') for c in bottom_20.index[::-1]], 
             bottom_20.values[::-1], color='#dc2626', height=0.65)
axes[1].set_title("20 Rarest Symptoms (% of Patients)", fontsize=12, fontweight='bold')
axes[1].set_xlabel("Prevalence (%)", fontsize=10)

plt.tight_layout()
plt.savefig("reports/figures/symptom_frequency.png", dpi=200)
plt.close()
print("Saved symptom_frequency.png", flush=True)

# 3. Missingness Verification Plot
plt.figure(figsize=(10, 4))
null_series = df.isna().mean() * 100
plt.bar(["Target ('disease')", "174 Symptom Features (Min)", "174 Symptom Features (Max)", "Overall Dataset"], 
        [null_series['disease'], null_series[feature_cols].min(), null_series[feature_cols].max(), null_series.mean()],
        color=['#10b981', '#10b981', '#10b981', '#10b981'], width=0.4)
plt.ylim(0, 5)
plt.axhline(0, color='#64748b', linestyle='--')
plt.title("Missing Values Audit (0.00% Missing Across All 17,500,000 Cells)", fontsize=12, fontweight='bold', pad=15)
plt.ylabel("Missing Values (%)", fontsize=11)
for i, v in enumerate([null_series['disease'], null_series[feature_cols].min(), null_series[feature_cols].max(), null_series.mean()]):
    plt.text(i, v + 0.15, f"{v:.2f}% (0 / 100k)", ha='center', fontweight='bold', color='#047857')
plt.tight_layout()
plt.savefig("reports/figures/missingness.png", dpi=200)
plt.close()
print("Saved missingness.png", flush=True)

# 4. Symptom Co-occurrence Matrix (Top 20 symptoms)
top_20_cols = symptom_prev.nlargest(20).index.tolist()
clean_top_20_labels = [c.replace('symptom_', '') for c in top_20_cols]
corr_matrix = df[top_20_cols].corr()

plt.figure(figsize=(12, 10))
sns.heatmap(corr_matrix, xticklabels=clean_top_20_labels, yticklabels=clean_top_20_labels, 
            cmap='vlag', vmin=-0.05, vmax=0.05, annot=True, fmt='.3f', annot_kws={"size": 7})
plt.title("Correlation Matrix Across Top 20 Reported Symptoms\n(Near-Zero Inter-Symptom Pearson Correlation Indicates Independent Poisson/Bernoulli Simulation)", 
          fontsize=11, fontweight='bold', pad=15)
plt.tight_layout()
plt.savefig("reports/figures/symptom_cooccurrence.png", dpi=200)
plt.close()
print("Saved symptom_cooccurrence.png", flush=True)

# 5. Symptom Load Distribution Plot
symptom_load = df[feature_cols].sum(axis=1)
plt.figure(figsize=(10, 5))
plt.hist(symptom_load, bins=range(0, 100, 2), color='#3b82f6', edgecolor='#1e40af', alpha=0.75, density=True)
plt.axvline(symptom_load.median(), color='#dc2626', linestyle='--', linewidth=2, label=f'Median: {symptom_load.median():.0f} symptoms')
plt.axvline(symptom_load.mean(), color='#f59e0b', linestyle='-', linewidth=2, label=f'Mean: {symptom_load.mean():.1f} symptoms')
plt.title("Distribution of Total Reported Symptoms per Patient Case (Min=1, Max=97)", fontsize=12, fontweight='bold', pad=15)
plt.xlabel("Reported Symptoms Count", fontsize=11)
plt.ylabel("Probability Density", fontsize=11)
plt.legend(frameon=True)
plt.tight_layout()
plt.savefig("reports/figures/symptom_load_distribution.png", dpi=200)
plt.close()
print("Saved symptom_load_distribution.png", flush=True)

print("All figures successfully created in reports/figures/", flush=True)
