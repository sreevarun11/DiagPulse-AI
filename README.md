# AI Powered Medical Diagnosis Classifier
### Clinical Decision-Support Prototype (Doctor-Facing Differential Hypothesis Aid)

[![Python 3.12](https://img.shields.io/badge/Python-3.12-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg)](https://fastapi.tiangolo.com/)
[![React 19](https://img.shields.io/badge/Frontend-React_19_TypeScript-61DAFB.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Style-Tailwind_CSS-38B2AC.svg)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Backend_Tests-17%2F17_Passed-success.svg)]()
[![Frontend Tests](https://img.shields.io/badge/Frontend_Tests-8%2F8_Passed-success.svg)]()

---

## 1. Executive Summary & Purpose

The **AI Powered Medical Diagnosis Classifier** is a doctor-facing clinical decision-support research prototype built as a final-year B.Tech engineering viva project.

When patients present to community healthcare outpatient centers with overlapping symptoms, physicians must formulate an initial differential diagnosis ranking before ordering diagnostic bloodwork, pathology, or radiological imaging. This system assists clinicians by:
- Analyzing reported symptoms from a standardized 174-feature dictionary.
- Returning the **top-3 most probable disease categories** with calibrated model confidence scores.
- Extracting **exact local linear log-odds symptom contributions** ($w_i \cdot x_i$) to transparently explain why the model weighed specific evidence.
- Enforcing an **automatic safety abstention rule** ("Insufficient Information") when fewer than 2 symptoms are reported or when predictive confidence falls below 15.0%.
- Delivering strict patient privacy (ephemeral in-memory inference, zero database storage, zero tracking cookies, zero analytics).

> **Important Regulatory Notice:** This software is an academic engineering prototype and **not a certified medical device**. It does not provide a confirmed clinical diagnosis and must never replace physician examination, laboratory testing, or clinical judgement. The system never prescribes medication or determines treatment.

---

## 2. Actual Measured Results (Held-Out Test Set, N=10,005)

All metrics below are derived from real executed experiments on unseen held-out test records:

| Metric | Measured Value | Clinical Interpretation |
|---|---|---|
| **Top-3 Differential Diagnostic Accuracy** | **73.33%** ($0.7333$) | Correct disease category present within top-3 ranked differential list |
| **Top-1 Categorical Accuracy** | **41.55%** ($0.4155$) | Exact top match across 46 highly overlapping disease categories |
| **Macro-Averaged F1 Score** | **0.2021** | Unweighted mean F1 across all 46 classes, penalizing rare class neglect |
| **Weighted-Averaged F1 Score** | **0.4045** | Support-weighted F1 reflecting outpatient prevalence distribution |
| **Multi-Class Brier Score** | **0.7259** | Quadratic probability calibration error across 46 classes |
| **Inference Latency** | **0.004 ms** / patient | High-throughput sub-millisecond scoring ($>250,000$ predictions/sec) |
| **Model Artifact Size** | **66 KB** | Ultra-compact, convex, reproducible serialized artifact |

### Model Architecture Comparison (Validation Split, N=10,002)

| Model Family | Top-1 Acc | Top-3 Acc | Macro-F1 | Weighted-F1 | Training Time | Latency / Case | Selected? |
|---|---|---|---|---|---|---|---|
| **Multinomial Logistic Regression ($L_2$)** | **42.59%** | **73.60%** | **0.2133** | **0.4149** | 236.9s | **0.004 ms** | **YES (Production)** |
| **Extra Trees Classifier** | 42.64% | 70.95% | 0.1271 | 0.3800 | 11.8s | 0.050 ms | No |
| **Random Forest Classifier** | 41.61% | 69.52% | 0.1216 | 0.3669 | 6.1s | 0.048 ms | No |
| **Complement Naive Bayes** | 24.79% | 50.65% | 0.0712 | 0.2021 | 10.2s | 0.005 ms | No |

---

## 3. Technology Stack

- **Data Processing & Machine Learning:** Python 3.12.6, `scikit-learn 1.9.1`, `pandas 3.1.0`, `numpy 2.5.4`, `scipy 1.18.1`, `pyarrow 26.0.0`, `python-calamine 0.9.0`, `joblib 1.6.0`.
- **Backend API:** `FastAPI 0.162.0`, `Uvicorn 0.54.0`, `Pydantic 2.14.1`.
- **Frontend Client:** `React 19.3.1`, `TypeScript 7.0`, `Vite 8.3.5`, `Tailwind CSS 3.4.17`, `lucide-react 1.62.0`, `react-router-dom 7.18.4`.
- **Automated Testing:** `pytest 9.1.1` (backend), `vitest 5.0.5` + `@testing-library/react 16.3.3` (frontend).

---

## 4. Project Directory Layout

```
AI-Medical Diagnosis System/
│
├── data/
│   ├── raw/
│   │   └── raw_dataset.xlsx          # Preserved copy of original dataset (never modified)
│   └── processed/
│       ├── cleaned_dataset.parquet   # Clean uint8 optimized dataset (100k × 175)
│       ├── train.parquet             # 79,993 training cases (all 46 classes)
│       ├── val.parquet               # 10,002 validation cases
│       └── test.parquet              # 10,005 held-out test cases
│
├── src/
│   ├── data/
│   │   ├── clean.py                  # Rerunnable data cleaning pipeline
│   │   ├── audit_dataset.py          # Data leakage & class distribution auditor
│   │   └── generate_eda.py           # Publication-grade EDA figure generator
│   └── ml/
│       ├── data_split.py             # Stratified train/val/test splitting
│       ├── compare_models.py         # Multi-model benchmarking
│       ├── train.py                  # Production training pipeline
│       ├── evaluate.py               # Test evaluation & stress-testing
│       └── explain.py                # Exact linear log-odds local explainability
│
├── backend/
│   ├── main.py                       # FastAPI application & privacy middleware
│   ├── config.py                     # Environment configuration
│   ├── schemas.py                    # Pydantic request/response models
│   └── services/
│       ├── model_service.py          # Model inference & abstention engine
│       └── symptom_service.py        # 174-symptom catalog & organ categorization
│
├── frontend/
│   ├── src/
│   │   ├── components/               # Navbar, Footer, Banners, ErrorBoundary
│   │   ├── pages/                    # 8 required responsive clinical pages
│   │   ├── api/                      # Typed client API service
│   │   └── types/                    # TypeScript interfaces
│   ├── tailwind.config.js            # Clinical theme palette
│   └── vite.config.ts                # Dev proxy configuration
│
├── models/
│   ├── model.joblib                  # Serialized production model artifact (66 KB)
│   ├── feature_schema.json           # 174 verified features & 46 classes
│   ├── model_metadata.json           # Hyperparameters, versions, thresholds
│   └── MODEL_CARD.md                 # Technical & clinical model card
│
├── reports/
│   ├── eda_report.md                 # Scientific audit & EDA findings
│   ├── modelling_report.md           # Model selection & evaluation report
│   ├── cleaning_log.json             # Machine-readable cleaning decisions
│   ├── model_comparison.json         # Benchmarking comparison table
│   ├── test_metrics.json             # Test set evaluation metrics
│   ├── per_class_metrics.csv         # Precision, Recall, F1 across 46 classes
│   ├── robustness_metrics.json       # Stress-test degradation metrics
│   └── figures/                      # High-resolution PNG charts
│
├── tests/
│   ├── test_data_and_cleaning.py     # Data validation & split tests
│   ├── test_model_pipeline.py        # Model loading & reproducibility tests
│   └── test_api_endpoints.py         # HTTP endpoint integration tests
│
├── start.ps1                         # Single PowerShell command launcher
├── requirements.txt                  # Pinned Python dependencies
├── .env.example                      # Environment variables template
├── .gitignore                        # Git exclusion rules
├── PROGRESS.md                       # Comprehensive stage progress log
├── VIVA_NOTES.md                     # Viva oral defense guide & 20 questions
└── README.md                         # Project documentation
```

---

## 5. Prerequisites & Environment Setup (Windows PowerShell)

Ensure you have installed:
- **Python:** 3.12+ ([python.org](https://www.python.org/))
- **Node.js:** v20+ or v24+ ([nodejs.org](https://nodejs.org/))

### Initial PowerShell Setup:
```powershell
# 1. Clone or open workspace root
cd "C:\Users\sreec\Desktop\AI-Medical Diagnosis System"

# 2. Create Python virtual environment and activate
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# 3. Install pinned Python dependencies
pip install -r requirements.txt

# 4. Install frontend dependencies
cd frontend
npm install
cd ..
```

---

## 6. How to Reproduce Cleaning, Training & Evaluation

The entire machine learning pipeline is fully automated and rerunnable from scripts:

```powershell
# Step 1: Clean and validate raw dataset
python src/data/clean.py

# Step 2: Generate EDA report and figures
python src/data/generate_eda.py

# Step 3: Create stratified splits
python src/ml/data_split.py

# Step 4: Train production model and save artifacts
python src/ml/train.py

# Step 5: Run comprehensive held-out evaluation and stress tests
python src/ml/evaluate.py
```

---

## 7. How to Run the Application

### Option A: Single-Command PowerShell Orchestrator (Recommended)
Launch both the FastAPI backend and Vite frontend concurrently with health verification:

```powershell
.\start.ps1
```

Once started:
- **Frontend Clinical UI:** [http://localhost:5173](http://localhost:5173)
- **Backend API Docs (Swagger):** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **API Health Endpoint:** [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)

Press `Ctrl+C` in the PowerShell terminal to gracefully shut down both services.

---

### Option B: Separate Terminal Windows

If you prefer to run backend and frontend in separate PowerShell consoles:

#### Terminal 1 — Backend (FastAPI + Uvicorn):
```powershell
cd "C:\Users\sreec\Desktop\AI-Medical Diagnosis System"
.\.venv\Scripts\python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
*(Backend will initialize, load the 46-class model, and serve on `http://127.0.0.1:8000`)*

#### Terminal 2 — Frontend (Vite + React):
```powershell
cd "C:\Users\sreec\Desktop\AI-Medical Diagnosis System\frontend"
npm run dev
```
*(Frontend will start on `http://localhost:5173` with automatic reverse proxy to `127.0.0.1:8000`)*

---

## 8. Automated Testing

### Backend Unit & Integration Tests (17 Tests):
```powershell
.\.venv\Scripts\pytest.exe -v
```
*Result: 17 passed in ~8.2s (data integrity, schema consistency, reproducibility, endpoint validations, abstentions, and error handling).*

### Frontend Component & Route Tests (8 Tests):
```powershell
cd frontend
npm test
```
*Result: 8 passed in ~6.5s (emergency banners, disclaimers, home CTA, error boundary interception, 404 fallback).*

---

## 9. API Specification

| Method | Endpoint | Description | Request Payload | Response Schema |
|---|---|---|---|---|
| `GET` | `/health` | Service operational health & model status | None | `HealthResponse` |
| `GET` | `/symptoms` | Verified 174-symptom dictionary by organ system | None | `SymptomsResponse` |
| `GET` | `/model-info` | Real training metrics, test results & calibration | None | `ModelInfoResponse` |
| `POST` | `/predict` | Top-3 differential predictions, confidence & explanations | `{"symptoms": ["symptom_cough", ...]}` | `PredictResponse` |

### Sample Inference Payload:
```json
{
  "symptoms": [
    "symptom_cough",
    "symptom_shortness_of_breath",
    "symptom_wheezing"
  ]
}
```

### Sample Response:
```json
{
  "predictions": [
    {
      "disease": "Chronic_Kidney_Disease",
      "display_name": "Chronic Kidney Disease",
      "confidence": 0.239,
      "confidence_percentage": "23.9%",
      "rank": 1,
      "contributing_symptoms": [
        {
          "symptom": "symptom_wheezing",
          "clean_name": "Wheezing",
          "weight": 1.3789,
          "direction": "positive"
        }
      ]
    }
  ],
  "insufficient_information": false,
  "abstention_reason": null,
  "reported_symptoms_count": 3,
  "model_version": "1.0.0 (Multinomial L2 Logistic Regression)",
  "explanation_method": "Exact Linear Log-Odds Contributions (w_i * x_i)",
  "causation_caveat": "Feature contributions describe how the mathematical model weighs reported symptoms. They do NOT represent biological etiology, medical causality, or pathophysiology.",
  "disclaimer": "PRELIMINARY CLINICAL DECISION SUPPORT ONLY..."
}
```

---

## 10. Known Limitations & Scientific Honesty

1. **Synthetic Training Cohort:** Provenance research confirmed the dataset is synthetically simulated. While providing an excellent engineering testbed, its patterns diverge in minor areas from human biological pathophysiology (e.g. near-zero inter-symptom correlation).
2. **Top-1 vs Top-3 Clinical Framing:** Top-1 accuracy is 41.55%, reflecting that many diseases present identically without lab results. The system is designed strictly for **Top-3 differential diagnosis (~73.3%)**.
3. **No Clinical Trials:** Not evaluated in human prospective clinical trials. Must never be used as an autonomous medical diagnostic device.
