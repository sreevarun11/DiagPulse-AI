import pandas as pd
import sys
import time

print("Starting inspection with calamine engine...", flush=True)
t0 = time.time()
raw_path = "data/raw/raw_dataset.xlsx"

# Using calamine engine for fast parsing
df = pd.read_excel(raw_path, engine="calamine")
t1 = time.time()
print(f"Loaded DataFrame in {t1 - t0:.2f} seconds!", flush=True)
print(f"DataFrame shape: {df.shape}", flush=True)
print(f"Total columns: {len(df.columns)}", flush=True)
print(f"Columns: {list(df.columns[:25])} ...", flush=True)

print("\n--- Summary Info ---", flush=True)
print(f"Memory usage: {df.memory_usage(deep=True).sum() / 1e6:.2f} MB", flush=True)
print(f"Data types:\n{df.dtypes.value_counts()}", flush=True)

# Look for target column
print("\n--- Object / Category Columns (potential targets) ---", flush=True)
obj_cols = [c for c in df.columns if df[c].dtype == 'object']
for col in obj_cols:
    val_counts = df[col].value_counts()
    print(f"\nColumn: '{col}' (dtype={df[col].dtype}, nunique={df[col].nunique()}, nulls={df[col].isna().sum()}):", flush=True)
    print(f"Top 10 values:\n{val_counts.head(10)}", flush=True)
    if len(val_counts) > 10:
        print(f"Bottom 5 values:\n{val_counts.tail(5)}", flush=True)

# Also check numeric columns min/max/uniques
print("\n--- Numeric Columns Summary ---", flush=True)
num_cols = [c for c in df.columns if c not in obj_cols]
print(f"Numeric column count: {len(num_cols)}", flush=True)
unique_val_counts = {c: df[c].nunique() for c in num_cols}
from collections import Counter
print(f"Unique value count distribution across numeric columns: {Counter(unique_val_counts.values())}", flush=True)

# Check missing values overall
total_nulls = df.isna().sum().sum()
print(f"\nTotal missing values across entire dataset: {total_nulls}", flush=True)
