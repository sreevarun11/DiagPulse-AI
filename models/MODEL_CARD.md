# Model Card: AI Powered Medical Diagnosis Classifier

## 1. Model Details
- **Model Name:** AI Powered Medical Diagnosis Classifier
- **Model Architecture:** Regularized Multinomial Logistic Regression ($L_2$ penalty, L-BFGS solver)
- **Input Dimension:** 174 binary symptom indicator variables $\{0, 1\}$
- **Output Dimension:** 46 categorical disease classes with calibrated probability distribution
- **Training Date:** October 2026
- **Developer/Author:** Solo B.Tech Machine Learning Engineering Project
- **Runtime Environment:** Python 3.12.6, `scikit-learn 1.9.1`, `numpy 2.5.4`

## 2. Intended Use & Clinical Scope
- **Primary Use Case:** Doctor-facing clinical decision-support prototype. Assists qualified healthcare professionals by providing a differential diagnosis suggestion list (top 3 disease categories) based on reported symptom presentations.
- **Intended Users:** Medical students, resident physicians, and outpatient triage clinicians reviewing differential possibilities.
- **Out-of-Scope / Prohibited Uses:**
  - Must **never** be used for patient self-diagnosis without medical oversight.
  - Must **never** autonomously prescribe medication or determine treatment plans.
  - Must **never** replace physician examination, diagnostic imaging, pathology, or laboratory testing.

## 3. Training & Validation Data
- **Dataset:** *Community Healthcare MultiSymptomsDisease Diagnostic Dataset*
- **Sample Distribution:** 100,000 total cases:
  - Training split: **79,993 cases** (80.0%, all 46 disease categories represented)
  - Validation split: **10,002 cases** (10.0%, hyperparameter tuning and model selection)
  - Held-out test split: **10,005 cases** (10.0%, touched strictly once for final evaluation)
- **Synthetic Data Limitations:**
  - The dataset is synthetically generated to model community primary care presentations.
  - Inter-symptom correlations are near-zero ($|r| < 0.02$), indicating independent Bernoulli background noise rather than biological disease cascades.
  - Certain classic textbook clinical signs exhibit synthetic noise (e.g., malar rash appearing across respiratory conditions while absent in SLE).

## 4. Model Selection & Architecture Justification
Among all evaluated candidate architectures:
1. **Multinomial Logistic Regression (Selected):**
   - **Top-3 Categorical Accuracy:** ~73.6%
   - **Macro-F1 Score:** ~0.213 (nearly double the performance of tree ensembles across rare diseases)
   - **Inference Latency:** 0.004 ms / case (12x faster than Random Forest)
   - **Artifact Footprint:** ~70 KB
   - **Explainability:** Direct, mathematically exact log-odds feature contributions ($w_{c,i} \cdot x_i$).
2. **Random Forest & Extra Trees:**
   - Exhibited lower Top-3 accuracy (~69.5% - 70.9%) and poor Macro-F1 (~0.122) due to greedy split starvation on ultra-rare classes.
3. **Complement Naive Bayes:**
   - Underperformed across all metrics (Top-1: 24.8%, Top-3: 50.6%).

## 5. Abstention Rules ("Insufficient Information")
The system abstains and returns an `insufficient_information=true` outcome when:
1. **Symptom presentation is too sparse:** Fewer than 2 symptoms are reported ($N_{\text{active}} < 2$). An isolated general symptom (e.g. fatigue) cannot support a valid differential diagnosis.
2. **Predictive confidence is too low:** Maximum model probability is $< 15.0\%$ ($P(\text{top-1}) < 0.15$). Across 46 classes where random chance is $2.17\%$, confidence $< 15\%$ indicates diagnostic ambiguity.

## 6. Explainability Methodology & Honest Caveat
- **Method:** Exact linear log-odds contribution score: $\Delta z_{c, i} = w_{c, i} \cdot x_i$ for active symptoms $x_i = 1$.
- **Causation Caveat:**
  > *Feature contributions describe how the mathematical model weighs reported symptoms to produce its statistical estimate. They do NOT represent biological etiology, medical causality, or pathophysiology. A high symptom contribution means the model found this symptom statistically associated with the diagnostic category in this dataset, not that the symptom caused the disease.*

## 7. Ethical & Technical Limitations
- Not clinically validated in human clinical trials.
- Not approved or cleared by FDA, CE, or CDSCO as a medical device.
- Top-1 accuracy is ~42.6%, reflecting the inherent ambiguity of differential diagnosis from symptoms alone without lab investigations. The system should always be evaluated primarily on **Top-3 differential accuracy (~73.6%)**.
