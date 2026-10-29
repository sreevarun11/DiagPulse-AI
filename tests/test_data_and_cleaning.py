import os
import json
import pandas as pd
import numpy as np
import pytest

def test_raw_dataset_exists_and_unmodified():
    raw_path = "data/raw/raw_dataset.xlsx"
    assert os.path.exists(raw_path), f"Raw dataset not found at {raw_path}"
    # Raw file must be approximately 54.8 MB
    size = os.path.getsize(raw_path)
    assert size > 50_000_000, f"Raw dataset size unexpected: {size} bytes"

def test_cleaned_dataset_integrity():
    cleaned_path = "data/processed/cleaned_dataset.parquet"
    assert os.path.exists(cleaned_path), f"Cleaned dataset not found at {cleaned_path}"
    df = pd.read_parquet(cleaned_path)
    
    # 100k rows, 175 columns
    assert df.shape == (100000, 175), f"Cleaned dataset shape mismatch: {df.shape}"
    assert "disease" in df.columns, "Target column 'disease' missing in cleaned data"
    
    # No missing values
    assert df.isna().sum().sum() == 0, "Missing values detected in cleaned dataset"
    
    # Feature columns must be uint8
    feature_cols = [c for c in df.columns if c != "disease"]
    assert len(feature_cols) == 174, f"Feature column count mismatch: {len(feature_cols)}"
    for c in feature_cols:
        assert df[c].dtype == np.uint8, f"Column {c} dtype is not uint8: {df[c].dtype}"
        unique_vals = set(df[c].unique())
        assert unique_vals.issubset({0, 1}), f"Column {c} contains non-binary values: {unique_vals}"

def test_feature_schema_consistency():
    schema_path = "models/feature_schema.json"
    assert os.path.exists(schema_path), f"Schema file not found at {schema_path}"
    
    with open(schema_path, "r") as f:
        schema = json.load(f)
        
    assert schema["feature_count"] == 174
    assert len(schema["features"]) == 174
    assert len(schema["disease_classes"]) == 46
    
    cleaned_df = pd.read_parquet("data/processed/cleaned_dataset.parquet")
    cleaned_features = [c for c in cleaned_df.columns if c != "disease"]
    
    # Check exact equality and ordering
    assert schema["features"] == cleaned_features, "Feature order or names mismatch between schema and dataset"

def test_train_val_test_splits():
    train_path = "data/processed/train.parquet"
    val_path = "data/processed/val.parquet"
    test_path = "data/processed/test.parquet"
    
    assert os.path.exists(train_path)
    assert os.path.exists(val_path)
    assert os.path.exists(test_path)
    
    train_df = pd.read_parquet(train_path)
    val_df = pd.read_parquet(val_path)
    test_df = pd.read_parquet(test_path)
    
    # Total rows must sum to 100,000
    assert len(train_df) + len(val_df) + len(test_df) == 100000
    # Train must contain all 46 classes
    assert train_df["disease"].nunique() == 46
