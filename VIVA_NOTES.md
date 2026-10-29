# VIVA DEFENSE GUIDE: AI Powered Medical Diagnosis Classifier
### B.Tech Oral Examination & Technical Defense Notes

> **Examiner Readiness Note:** This document translates complex machine learning concepts into simple, defensible, plain-English answers. Read this guide before your oral exam to confidently explain and defend every engineering and clinical decision in the project.

---

## 1. One-Page Architecture Summary

```
[Raw Excel Dataset: 100k records, 175 cols, 46 classes]
                          │
            src/data/clean.py (0 missing values, uint8 cast)
                          │
           data/processed/cleaned_dataset.parquet (24 MB)
                          │
            src/ml/data_split.py (Stratified 80/10/10)
     ┌────────────────────┼────────────────────┐
     ▼                    ▼                    ▼
Train (79,993)        Val (10,002)         Test (10,005 - Touched ONCE)
     │                    │                    │
     ▼                    │                    │
Benchmarking Models:      │                    │
- Logistic Regression ────┘                    │
- Random Forest                                │
- Extra Trees                                  │
- Naive Bayes                                  │
     │                                         │
     ▼                                         │
Best Model Selected:                           │
Multinomial L2 Logistic Regression             │
(Top-3 Acc: 73.6%, Macro-F1: 0.2133)           │
     │                                         │
     ▼                                         ▼
models/model.joblib ──────────────────► src/ml/evaluate.py
                                        (Top-3: 73.33%, Macro-F1: 0.2021)
                                               │
                                               ▼
                              reports/ & reports/figures/
                                               │
               ┌───────────────────────────────┴───────────────────────────────┐
               ▼                                                               ▼
        backend/ (FastAPI)                                             frontend/ (React 19 + TS)
  - GET /health                                                  - 8 Responsive Pages
  - GET /symptoms (174 features)                                 - Searchable Symptom Picker
  - GET /model-info (Dynamic metrics)                            - Top-3 Confidence Bars
  - POST /predict (Validated + Abstention)                       - Exact Log-Odds Explainability
  - Privacy Middleware (Zero health logging)                     - Emergency Triage Red-Flag Banner
```

---

## 2. Why Major Decisions Were Made (In Plain Language)

### Decision A: Why Multinomial Logistic Regression over Deep Learning or Random Forest?
- **Tree Models Fail on Rare Diseases:** In our dataset, 23 of 46 diseases have fewer than 100 cases (and 9 have fewer than 10). When a decision tree splits, rare classes get starved into zero-sample leaves. Random Forest gave a poor Macro-F1 of **0.1216**. Logistic Regression gave **0.2133**—a **75% improvement** on rare diseases because its linear decision hyper-planes preserve weights even with small support.
- **Top-3 Accuracy is Higher:** Logistic Regression achieved **73.60%** Top-3 accuracy compared to **69.52%** for Random Forest.
- **True, Non-Stochastic Explainability:** In Logistic Regression, the probability is directly computed from log-odds ($z_c = \sum w_{c,i} x_i + b_c$). We can show the doctor the exact positive weights ($w_{c,i}$) of the patient's symptoms without estimating with black-box approximations.
- **Fast & Compact:** Model file is only **66 KB** and executes in **0.004 milliseconds** (vs 40 MB for Random Forest).

### Decision B: Why Top-3 Accuracy Instead of Just Top-1 Accuracy?
- In clinical practice, no doctor makes a single definitive guess from symptoms alone. Symptoms overlap heavily (e.g., cough, fever, and fatigue are shared by pneumonia, COVID-19, and bronchitis).
- Doctors formulate a **differential diagnosis** (a list of top 3 to 5 candidate possibilities) and then order lab tests or X-rays to narrow it down.
- Top-1 accuracy is **41.55%** (a difficult 46-class problem where random guess is only 2.17%). Top-3 accuracy is **73.33%**, which is clinically meaningful and defensible.

### Decision C: How Data Leakage was Prevented
- **Duplicate Audit:** We verified that there are **0 exact duplicate records** and **0 duplicate symptom sets** in the entire 100,000 cases.
- **Strict Split Isolation:** Split data into Train (80%), Val (10%), and Test (10%) with fixed random seed ($42$).
- **Held-Out Test Set Touched ONCE:** Model selection and hyperparameter exploration were performed strictly on Train and Validation. The held-out test set was evaluated once at the very end.

### Decision D: How Safety Abstention Works ("Insufficient Information")
- Chatbots like ChatGPT hallucinate diagnoses even if the user types one word ("cough").
- Our system enforces two hard clinical gates:
  1. **Presentation Sparsity:** If fewer than 2 symptoms are reported, it returns `insufficient_information: true`. One symptom is too ambiguous for differential diagnosis.
  2. **Confidence Threshold:** If the highest model probability is below 15.0%, it returns `insufficient_information: true`. Across 46 diseases, a score below 15% represents high diagnostic entropy.

### Decision E: Why Symptom Contributions are NOT Medical Causation
- If the model identifies `wheezing` as a high-weight symptom for `Chronic Kidney Disease`, this means: *In this training cohort, wheezing statistically increased the model's likelihood estimate.*
- It does **not** mean wheezing causes kidney disease. We include this explicit disclaimer in every prediction response to prevent clinicians from confusing statistical correlation with biological etiology.

---

## 3. "If the Examiner Asks X, Say Y" (Defending Weak Spots)

### 1. If asked: *"Your dataset is synthetic. How can you claim this has clinical value?"*
> **Say:** *"You are entirely correct, Professor. Our exploratory data audit proved the dataset is synthetic—for example, Pearson correlation across symptoms is near zero ($|r| < 0.02$), showing independent Bernoulli generation rather than real biological disease cascades.*  
> *We do not claim clinical validation or medical approval. This is an engineering decision-support prototype built to prove that a multi-class differential ranking pipeline with safety abstention, privacy middleware, and exact mathematical explainability can be engineered reliably. In a hospital deployment, this exact pipeline would be retrained on real, de-identified electronic health records (EHR). We documented this limitation prominently in our Model Card and UI."*

### 2. If asked: *"Why is your Top-1 accuracy only 41.55%? Isn't that too low?"*
> **Say:** *"In a 46-class multi-class classification problem, uniform random guessing is $1/46 \approx 2.17\%$. A score of 41.55% is nearly 20 times better than random chance.*  
> *More importantly, medicine is fundamentally differential: multiple diseases present with identical symptoms (such as cough, shortness of breath, and fatigue). A physician never relies on a single diagnosis from symptoms alone without bloodwork or radiology. Our system's primary metric is **Top-3 Differential Diagnostic Accuracy**, which reaches **73.33%**."*

### 3. If asked: *"Why did you use simple Logistic Regression instead of Deep Learning or XGBoost?"*
> **Say:** *"We followed Occam’s razor and prioritized correctness, explainability, and defensibility over unnecessary complexity. Our features are binary indicators $\{0, 1\}$. In this sparse high-dimensional space, tree ensembles like Random Forest starved ultra-rare classes (giving a low Macro-F1 of 0.1216).*  
> *Logistic Regression achieved the highest Top-3 accuracy (73.60%) and nearly doubled the Macro-F1 to 0.2133. Crucially, Logistic Regression provides mathematically exact log-odds feature contributions ($w_{c,i} \cdot x_i$), allowing doctors to see exactly why the model made a recommendation without black-box approximations."*

### 4. If asked: *"How did you handle classes with only 1 or 2 samples (like Metabolic Syndrome)?"*
> **Say:** *"Under our project brief's absolute rules, we were prohibited from arbitrarily dropping rare classes. Because 7 classes had fewer than 5 instances, a naive 5-fold cross-validation or uniform 3-way split would crash on singletons.*  
> *We implemented a deterministic allocation in `src/ml/data_split.py`: singletons and doubletons were allocated to the training split so that the model's weight matrix learned representations for all 46 labels, while validation and test sets evaluated all classes with sufficient support without runtime failure."*

### 5. If asked: *"What would you improve if you had 6 more months?"*
> **Say:** *"Four things: First, partner with a clinical institution to train on real de-identified EHR data containing continuous vitals (heart rate, blood pressure, lab values). Second, implement Platt scaling or isotonic regression to further improve probability calibration. Third, conduct a human-in-the-loop usability study with medical interns to measure diagnostic turnaround time. Fourth, package the backend into a containerized microservice with Docker and Kubernetes for high-availability hospital integration."*

---

## 4. 20 Likely Viva Questions & Model Answers

#### Q1: What is the main objective of this project?
**Answer:** To develop a doctor-facing clinical decision-support tool that takes reported symptoms, evaluates case sufficiency, and returns the top-3 most likely disease categories with confidence scores and exact model explanations, without replacing physician clinical judgement.

#### Q2: What is the difference between a clinical decision support system (CDSS) and an autonomous diagnostic system?
**Answer:** A CDSS assists licensed clinicians by organizing and ranking differential possibilities to reduce cognitive oversight; the physician remains the sole decision-maker. An autonomous diagnostic system acts without human clinician review, which carries severe patient safety and regulatory risks.

#### Q3: What is the shape of the dataset and what do the features represent?
**Answer:** The dataset contains 100,000 cases and 175 columns: 174 binary symptom indicator variables ($0 = \text{absent}, 1 = \text{present}$) and 1 categorical target column (`disease`) spanning 46 diagnostic categories.

#### Q4: What data cleaning steps did you perform?
**Answer:** We validated that all 17.5 million cells contain 0 missing values, verified all 174 features are strictly binary $\{0, 1\}$, confirmed zero duplicate cases exist, normalized column names to snake_case, and downcasted numeric columns from `int64` to `uint8`, saving 83.4% of RAM.

#### Q5: How was the dataset split, and what seed was used?
**Answer:** Split using fixed random seed `42` into 80% Train (79,993 cases), 10% Validation (10,002 cases), and 10% Test (10,005 cases). All 46 disease categories are represented in the training set.

#### Q6: Why did you not use 5-fold cross-validation across all classes?
**Answer:** Because 7 classes in the dataset have fewer than 5 samples (for example, `Metabolic_Syndrome` has only 1 sample, and `Urinary_Tract_Infection` has 2). Dividing 1 sample across 5 folds is mathematically impossible without synthetic oversampling, which was prohibited.

#### Q7: What models did you compare during Stage 2?
**Answer:** We benchmarked Multinomial Logistic Regression ($L_2$), Random Forest Classifier ($N=100$, depth=22), Extra Trees Classifier ($N=100$, depth=22), and Complement Naive Bayes on the 10,002 validation cases.

#### Q8: What were the benchmark results on the validation set?
**Answer:** Logistic Regression achieved 42.59% Top-1, 73.60% Top-3, and 0.2133 Macro-F1. Random Forest achieved 41.61% Top-1, 69.52% Top-3, and 0.1216 Macro-F1. Extra Trees achieved 42.64% Top-1 and 70.95% Top-3. Naive Bayes achieved 24.79% Top-1.

#### Q9: What were the measured metrics on the held-out test set?
**Answer:** On the 10,005 unseen test cases, our final production model scored: Top-1 Accuracy: 41.55%, Top-3 Accuracy: 73.33%, Macro-F1: 0.2021, Weighted-F1: 0.4045, and Multi-Class Brier Score: 0.7259.

#### Q10: Why is Macro-F1 so much lower than Weighted-F1?
**Answer:** Macro-F1 computes the unweighted arithmetic mean of F1 scores across all 46 classes, giving equal weight to `Asthma` (21,295 cases) and `Metabolic_Syndrome` (1 case). Because ultra-rare classes have virtually zero support, their F1 is near 0, which pulls down the unweighted macro average. Weighted-F1 weights each class by its support (0.4045).

#### Q11: What is Top-k accuracy and why is k=3 appropriate?
**Answer:** Top-$k$ accuracy checks whether the true target label is among the model's top-$k$ highest-probability predictions. $k=3$ is standard for clinical differential diagnosis triage because clinicians routinely explore 3 primary diagnostic hypotheses before ordering tests.

#### Q12: What is the Brier score?
**Answer:** The Brier score measures the accuracy of probabilistic predictions by calculating the mean squared difference between predicted probabilities and the one-hot encoded ground truth. Lower values indicate better calibrated probabilities. Our model achieved a multi-class Brier score of 0.7259.

#### Q13: How does your safety abstention rule work?
**Answer:** The system abstains and returns `insufficient_information: true` if:
1. Fewer than 2 symptoms are reported ($N < 2$).
2. The model's top predicted probability is below 15.0% ($P < 0.15$).

#### Q14: How does your local explainability method work?
**Answer:** Because our model is linear multinomial logistic regression, the log-odds for class $c$ is $z_c = b_c + \sum w_{c,i} x_i$. For symptoms reported by the patient ($x_i = 1$), the exact contribution is $w_{c,i}$. We rank active symptoms by their positive weights to show which signs increased the probability of each disease.

#### Q15: How did you stress-test the model for real-world robustness?
**Answer:** We simulated incomplete patient reporting by applying randomized symptom dropout on the test set:
- 10% dropout: Top-3 accuracy degraded slightly from 73.33% to 68.89%.
- 25% dropout: Top-3 accuracy remained resilient at 61.36%.
- 50% dropout: Top-3 accuracy was 50.37%.

#### Q16: What API endpoints did you build in FastAPI?
**Answer:**
- `GET /health`: Service operational health and model status.
- `GET /symptoms`: The verified 174-symptom feature schema grouped into 8 organ systems.
- `GET /model-info`: Verified model metadata, test metrics, and calibration data.
- `POST /predict`: Pydantic-validated prediction endpoint returning top-3 diseases, confidence, exact symptom contributions, abstention flags, and disclaimers.

#### Q17: How did you ensure patient data privacy?
**Answer:**
1. Zero database or disk persistence for patient data.
2. Ephemeral in-memory inference (payload is processed in RAM and discarded).
3. Privacy audit logging middleware that strips symptom payloads and records only HTTP method, path, status, and latency.
4. Zero third-party analytics or tracking cookies.

#### Q18: What tests did you write, and did they pass?
**Answer:**
- Backend: 17 automated tests in `pytest` covering data validation, cleaning transformations, schema consistency, reproducibility under seed 42, model loading, valid/invalid predictions, abstentions, and error handling (100% pass rate).
- Frontend: 8 automated tests in `vitest` covering all routes, emergency banners, disclaimers, and error boundary interception (100% pass rate).

#### Q19: What pages exist in the frontend UI?
**Answer:** Exactly 8 dedicated pages: Home, Clinical Classifier, Results, Model Performance, About & Methodology, Terms of Use, Disclaimer & Privacy, and Custom 404 page (wrapped with a global Error Boundary).

#### Q20: Why did you not include a cookie consent banner?
**Answer:** Under GDPR and ePrivacy regulations, cookie banners are only required when non-essential or tracking cookies are used. Our application uses zero tracking cookies and zero third-party telemetry, so no consent banner is legally required.
