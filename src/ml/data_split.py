"""
Data Splitting Module
AI Powered Medical Diagnosis Classifier

Splits cleaned dataset into Train (80%), Validation (10%), and Test (10%) splits
using stratified allocation with fixed seed (42), gracefully handling ultra-rare classes.
"""

import os
import json
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split

def create_splits(data_path="data/processed/cleaned_dataset.parquet",
                  output_dir="data/processed",
                  seed=42):
    print(f"Loading cleaned dataset from {data_path}...")
    df = pd.read_parquet(data_path)
    target_col = "disease"
    
    # Class support analysis
    class_counts = df[target_col].value_counts()
    
    # Classes with >= 10 samples can be fully stratified 80/10/10
    # Classes with < 10 samples need careful manual allocation so train gets at least 1
    common_classes = class_counts[class_counts >= 10].index.tolist()
    rare_classes = class_counts[class_counts < 10].index.tolist()
    
    print(f"Classes with >= 10 samples: {len(common_classes)}")
    print(f"Classes with < 10 samples: {len(rare_classes)} ({rare_classes})")
    
    # Split common classes with standard stratified 80/10/10
    df_common = df[df[target_col].isin(common_classes)].copy()
    
    # First split: 80% train, 20% temp (val + test)
    train_common, temp_common = train_test_split(
        df_common, 
        test_size=0.20, 
        random_state=seed, 
        stratify=df_common[target_col]
    )
    
    # Second split: split temp into 50% val (10% overall) and 50% test (10% overall)
    val_common, test_common = train_test_split(
        temp_common, 
        test_size=0.50, 
        random_state=seed, 
        stratify=temp_common[target_col]
    )
    
    # Rare classes allocation: ensure train gets representation for all labels
    train_rare_list, val_rare_list, test_rare_list = [], [], []
    
    for rc in rare_classes:
        sub = df[df[target_col] == rc].copy()
        n = len(sub)
        # Shuffle deterministically
        sub = sub.sample(frac=1.0, random_state=seed)
        
        if n == 1:
            # Singleton (e.g. Metabolic_Syndrome): allocate to train so model knows class
            train_rare_list.append(sub)
        elif n == 2:
            # 1 to train, 1 to test
            train_rare_list.append(sub.iloc[:1])
            test_rare_list.append(sub.iloc[1:2])
        elif n == 3:
            # 1 to train, 1 to val, 1 to test
            train_rare_list.append(sub.iloc[:1])
            val_rare_list.append(sub.iloc[1:2])
            test_rare_list.append(sub.iloc[2:3])
        else: # 4 to 9 samples
            # ~80% train, ~10% val, ~10% test
            n_train = max(1, int(round(n * 0.8)))
            n_val = max(1, int(round((n - n_train) / 2)))
            n_test = n - n_train - n_val
            if n_test < 1:
                n_train -= 1
                n_test = 1
            train_rare_list.append(sub.iloc[:n_train])
            val_rare_list.append(sub.iloc[n_train:n_train+n_val])
            test_rare_list.append(sub.iloc[n_train+n_val:])
            
    # Combine
    train_df = pd.concat([train_common] + train_rare_list, ignore_index=True)
    val_df = pd.concat([val_common] + val_rare_list, ignore_index=True)
    test_df = pd.concat([test_common] + test_rare_list, ignore_index=True)
    
    # Shuffle splits deterministically
    train_df = train_df.sample(frac=1.0, random_state=seed).reset_index(drop=True)
    val_df = val_df.sample(frac=1.0, random_state=seed).reset_index(drop=True)
    test_df = test_df.sample(frac=1.0, random_state=seed).reset_index(drop=True)
    
    print(f"\nFinal Split Sizes:")
    print(f"Train: {len(train_df):,} cases ({len(train_df)/len(df)*100:.2f}%), Classes: {train_df[target_col].nunique()}")
    print(f"Val:   {len(val_df):,} cases ({len(val_df)/len(df)*100:.2f}%), Classes: {val_df[target_col].nunique()}")
    print(f"Test:  {len(test_df):,} cases ({len(test_df)/len(df)*100:.2f}%), Classes: {test_df[target_col].nunique()}")
    
    # Save splits
    os.makedirs(output_dir, exist_ok=True)
    train_path = os.path.join(output_dir, "train.parquet")
    val_path = os.path.join(output_dir, "val.parquet")
    test_path = os.path.join(output_dir, "test.parquet")
    
    train_df.to_parquet(train_path, index=False)
    val_df.to_parquet(val_path, index=False)
    test_df.to_parquet(test_path, index=False)
    
    print(f"Saved splits to:\n  {train_path}\n  {val_path}\n  {test_path}")
    
    split_info = {
        "random_seed": seed,
        "total_cases": len(df),
        "train_cases": len(train_df),
        "val_cases": len(val_df),
        "test_cases": len(test_df),
        "train_classes": train_df[target_col].nunique(),
        "val_classes": val_df[target_col].nunique(),
        "test_classes": test_df[target_col].nunique(),
    }
    with open("reports/split_summary.json", "w") as f:
        json.dump(split_info, f, indent=2)
        
    return train_df, val_df, test_df

if __name__ == "__main__":
    create_splits()
