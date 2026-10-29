# Exploratory Data Analysis & Scientific Audit Report

**Project:** AI Powered Medical Diagnosis Classifier (Doctor-Facing Decision Support Prototype)  
**Dataset:** `Community Healthcare MultiSymptomsDisease Diagnostic Dataset taken.xlsx`  
**Date of Audit:** October 2026  
**Auditor:** Machine Learning Engineering Pipeline  

---

## 1. Executive Summary & Provenance

A thorough, rigorous data audit was conducted on the candidate raw dataset located in the workspace. The dataset represents simulated community healthcare primary care encounters mapping clinical symptom presentations to final diagnostic outcomes.

* **Raw File Name:** `Community Healthcare MultiSymptomsDisease Diagnostic Dataset taken.xlsx` (54,843,613 bytes / ~54.8 MB)
* **Dataset Provenance:** Community Healthcare Multi-Symptoms Disease Diagnostic benchmark dataset (synthetic cohort modeled after community healthcare multi-symptom presentations).
* **Sample Size (N):** 100,000 patient records.
* **Feature Dimensionality (D):** 174 binary symptom indicator variables {0, 1}.
* **Target Variable:** `disease` (46 distinct diagnostic categories).
* **Missing Value Rate:** Exactly 0.00% across all 17,500,000 data cells.
* **Exact Duplicate Rows:** Exactly 0 (0.00%).
* **Duplicate Symptom Vectors:** Exactly 0 (0.00%) — all 100,000 cases have unique symptom signatures.

---

## 2. Dataset Dimensions and Data Types

| Dimension | Raw Value | Cleaned Value | Description |
|---|---|---|---|
| Total Rows | 100,000 | 100,000 | Individual simulated clinical cases |
| Total Columns | 175 | 175 | 174 symptom features + 1 target (`disease`) |
| Regular Symptoms | 135 | 135 | Common outpatient presentations (e.g., `symptom_cough`, `symptom_fever`) |
| Rare Symptoms | 39 | 39 | Specialized clinical signs (e.g., `rare_symptom_butterfly_rash`, `rare_symptom_digital_clubbing`) |
| Data Types | 174 `int64`, 1 `object` | 174 `uint8`, 1 `category` | In-memory footprint optimized from 145.3 MB to ~24.1 MB (83.4% reduction) |
| Missing Values | 0 | 0 | 0.00% null rate across entire dataset |

![Missing Values Audit](figures/missingness.png)

---

## 3. Target Distribution & Rare-Class Analysis

The target variable `disease` encompasses **46 diagnostic categories**, but exhibits severe class imbalance. The class counts span five orders of magnitude: from 21,295 cases (`Asthma`) down to a single recorded case (`Metabolic_Syndrome`).

![Class Distribution](figures/class_distribution.png)

### Summary Statistics of Class Counts
* **Minimum Class Support:** 1 case (`Metabolic_Syndrome`)
* **Maximum Class Support:** 21,295 cases (`Asthma`, 21.30% of entire dataset)
* **Mean Class Support:** 2,173.9 cases
* **Median Class Support:** 125.5 cases
* **Standard Deviation:** 3,949.2 cases
* **Top 5 Classes (Cumulative %):** 55.45% of total dataset (`Asthma`, `Hyperthyroidism`, `Irritable_Bowel_Syndrome`, `Obesity`, `Pneumonia`)
* **Classes with < 100 Cases:** 23 classes (50.0% of all disease categories)
* **Ultra-Rare Classes (< 10 Cases):** 9 classes (`Metabolic_Syndrome`, `Urinary_Tract_Infection`, `Psoriasis`, `Typhoid_Fever`, `Acute_Gastroenteritis`, `Crohn_Disease`, `Fanconi_Anemia`, `Chronic_Liver_Disease`, `Ulcerative_Colitis`)

### Complete Class Distribution Table (All 46 Classes)

| Rank | Disease Category | Case Count | % of Total | Stratification Feasibility (5-Fold CV) |
|---|---|---|---|---|
| 1 | Asthma | 21,295 | 21.30% | High |
| 2 | Hyperthyroidism | 10,747 | 10.75% | High |
| 3 | Irritable_Bowel_Syndrome | 9,023 | 9.02% | High |
| 4 | Obesity | 7,853 | 7.85% | High |
| 5 | Pneumonia | 6,493 | 6.49% | High |
| 6 | Peptic_Ulcer_Disease | 5,834 | 5.83% | High |
| 7 | Type2_Diabetes | 5,239 | 5.24% | High |
| 8 | Chronic_Kidney_Disease | 4,993 | 4.99% | High |
| 9 | Gastritis | 4,431 | 4.43% | High |
| 10 | Osteoarthritis | 4,264 | 4.26% | High |
| 11 | Flu | 3,444 | 3.44% | High |
| 12 | Depression | 2,321 | 2.32% | High |
| 13 | Common_Cold | 2,236 | 2.24% | High |
| 14 | COPD | 2,060 | 2.06% | High |
| 15 | COVID19 | 2,033 | 2.03% | High |
| 16 | Polycystic_Ovary_Syndrome | 1,820 | 1.82% | High |
| 17 | Hypothyroidism | 1,683 | 1.68% | High |
| 18 | Hypertension | 1,647 | 1.65% | High |
| 19 | Coronary_Artery_Disease | 922 | 0.92% | High |
| 20 | Migraine | 467 | 0.47% | High |
| 21 | Epilepsy | 366 | 0.37% | High |
| 22 | Cystic_Fibrosis | 164 | 0.16% | Moderate |
| 23 | Systemic_Lupus_Erythematosus | 156 | 0.16% | Moderate |
| 24 | Generalized_Anxiety_Disorder | 95 | 0.10% | Moderate |
| 25 | Tuberculosis | 67 | 0.07% | Moderate |
| 26 | Stroke | 64 | 0.06% | Moderate |
| 27 | Amyotrophic_Lateral_Sclerosis | 50 | 0.05% | Moderate |
| 28 | Osteopetrosis | 46 | 0.05% | Low |
| 29 | Marfan_Syndrome | 29 | 0.03% | Low |
| 30 | Ehlers_Danlos_Syndrome | 24 | 0.02% | Low |
| 31 | Cirrhosis | 18 | 0.02% | Low |
| 32 | Spinal_Muscular_Atrophy | 17 | 0.02% | Low |
| 33 | Dengue | 17 | 0.02% | Low |
| 34 | Inflammatory_Bowel_Disease | 14 | 0.01% | Low |
| 35 | Niemann_Pick_Disease | 14 | 0.01% | Low |
| 36 | Gaucher_Disease | 12 | 0.01% | Low |
| 37 | Multiple_Sclerosis | 12 | 0.01% | Low |
| 38 | Ulcerative_Colitis | 7 | 0.01% | Borderline (1 per fold) |
| 39 | Chronic_Liver_Disease | 5 | 0.005% | Exactly 1 per fold |
| 40 | Crohn_Disease | 4 | 0.004% | **Impossible for 5-fold CV** (<5) |
| 41 | Fanconi_Anemia | 4 | 0.004% | **Impossible for 5-fold CV** (<5) |
| 42 | Acute_Gastroenteritis | 3 | 0.003% | **Impossible for 5-fold CV** (<5) |
| 43 | Typhoid_Fever | 2 | 0.002% | **Impossible for 5-fold CV** (<5) |
| 44 | Psoriasis | 2 | 0.002% | **Impossible for 5-fold CV** (<5) |
| 45 | Urinary_Tract_Infection | 2 | 0.002% | **Impossible for 5-fold CV** (<5) |
| 46 | Metabolic_Syndrome | 1 | 0.001% | **Singleton: Train-only / Unsplittable** |

---

## 4. Feature Space & Symptom Analysis

* **Feature Representation:** High-dimensional binary bag-of-symptoms representation ($D=174$).
* **Overall Feature Prevalence:**
  * Mean prevalence across all features: **16.39%**
  * Maximum prevalence: **25.66%** (`symptom_loss_of_smell`)
  * Minimum prevalence: **0.057%** (`rare_symptom_bronchiectasis_rare`)

![Symptom Frequency](figures/symptom_frequency.png)

### Patient Symptom Load (Co-morbidity / Presentation Density)

![Symptom Load Distribution](figures/symptom_load_distribution.png)

* **Minimum symptoms per patient:** 1
* **Maximum symptoms per patient:** 97
* **Mean symptoms per patient:** 28.52 ($\pm 13.50$)
* **Median symptoms per patient:** 27.0
* **Interquartile Range (IQR):** 19 to 37 symptoms
* **Empty presentations (0 symptoms):** 0 cases

---

## 5. Medical Realism, Leakage, and Synthetic Data Audit

As mandated by Absolute Rules 1, 3, and 5 and Stage 1 tasks, we performed an empirical audit to determine whether the dataset exhibits artificial or synthetic patterns:

### 1. Inter-Symptom Independence (Poisson / Bernoulli Noise Sign)
In human clinical medicine, symptoms co-occur in physiological clusters (e.g., `symptom_cough` strongly correlates with `symptom_productive_cough` and `symptom_wheezing`).
In this dataset, empirical Pearson correlation across symptom pairs is virtually zero ($|r| < 0.02$ for almost all pairs). 

![Symptom Co-occurrence](figures/symptom_cooccurrence.png)

This demonstrates that the data generator sampled background symptoms independently across cases rather than simulating biological pathophysiological cascades.

### 2. Clinical Pathognomonic Inconsistencies
* In clinical practice, `rare_symptom_butterfly_rash` (malar rash) is a hallmark of Systemic Lupus Erythematosus (SLE). In this dataset:
  * SLE cases exhibiting butterfly rash: **0 out of 156 (0.0%)**
  * Asthma cases exhibiting butterfly rash: **49 cases**
  * Pneumonia cases exhibiting butterfly rash: **33 cases**
* `symptom_loss_of_smell` appears in **24.30%** of COVID-19 cases, compared to **25.69%** of non-COVID cases (no statistical enrichment).
* `rare_symptom_digital_clubbing` is heavily enriched in Cystic Fibrosis (112 out of 164 cases, 68.3%), but also appears in Peptic Ulcer Disease and Obesity.

### 3. Data Leakage Audit
* **Direct Record Duplication:** 0 duplicate rows.
* **Feature Set Collision:** 0 identical symptom combinations.
* **Separability Probe:** Logistic Regression on top 10 classes achieves ~44.5% 3-fold CV accuracy (against a 27.0% majority-class baseline). This confirms there is **no trivial 100% label leakage** or deterministic lookup table.

### 4. Conclusions on Clinical Validity
The dataset is **synthetic**. While it provides a realistic engineering testbed for multi-class classification, top-$k$ ranking, and confidence estimation, **its patterns must never be interpreted as real clinical epidemiological truth or medical causation**. This limitation must be explicitly highlighted in the frontend UI, Model Card, and Viva defense notes.

---

## 6. Scientific Decisions and Strategy for Stage 2

1. **Class Preservation (Compliance with Rule 5):** All 46 disease categories and all 174 features are retained in the processed data without arbitrary deletion.
2. **Handling Rare Classes in Cross-Validation & Splitting:**
   * Classes with $\ge 5$ samples (39 classes, covering 99.98% of data) can be stratified across 5 folds.
   * Classes with $< 5$ samples (7 classes: Crohn's Disease, Fanconi Anemia, Acute Gastroenteritis, Typhoid Fever, Psoriasis, UTI, Metabolic Syndrome) cannot undergo 5-fold stratification.
   * *Proposed Defensible Strategy:* Fixed random seed stratified train/val/test split (e.g., 80% train, 10% validation, 10% test) with a deterministic fallback that ensures singletons/doubletons are placed into the training split so that the model is exposed to all 46 labels during training, while test evaluations are performed on classes with sufficient support.
3. **Evaluation Metrics:** Top-1 Accuracy, Top-3 Categorical Accuracy (vital for clinical differential diagnosis), Macro-F1 (penalizes ignoring rare diseases), Weighted-F1, and Brier score for probability calibration.

---

*Report generated programmatically from verified real execution outputs.*
