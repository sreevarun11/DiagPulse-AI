import pandas as pd
import json

df = pd.read_parquet("data/processed/raw_backup.parquet")
raw_cols = df.columns.tolist()

cleaned_cols = [c.strip().lower() for c in raw_cols]
diff_cols = [(raw, clean) for raw, clean in zip(raw_cols, cleaned_cols) if raw != clean]
print(f"Columns requiring name normalization (case/spaces): {len(diff_cols)}")

# Check target column unique values
diseases = df['disease'].unique()
print(f"\nUnique disease names: {sorted(diseases)}")
# Check for any leading/trailing spaces or variations in disease names
stripped_diseases = [d.strip() for d in diseases if isinstance(d, str)]
print(f"Total diseases: {len(diseases)}, Stripped: {len(set(stripped_diseases))}")
