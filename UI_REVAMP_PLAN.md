# UI/UX Revamp & Upgrade Plan: DiagPulse AI

## 1. Executive Summary & Objective
This plan outlines the staged upgrade of **DiagPulse AI** (AI-Powered Medical Diagnosis Classifier) from an internal research prototype into a polished, accessible, responsive, honest, and demo-ready clinical decision-support application.

The core machine learning pipeline, trained model artifacts (`models/model.joblib`), preprocessing, evaluation datasets, and FastAPI endpoints are preserved. The upgrade focuses on typography, layout hierarchy, plain-English communication, clinical safety, feature enhancements (sample cases, PDF reports, interactive charts), and rigorous verification.

---

## 2. Repository & Technical Audit Findings

### 2.1 Backend Architecture & API Contracts
- **Framework:** FastAPI with Uvicorn, Python 3.12, scikit-learn 1.9.1.
- **Entry point:** `backend.main:app` (also runnable via `python backend/main.py`).
- **Core Endpoints & Verified Schemas:**
  1. `GET /health` -> `HealthResponse`:
     - `status`: "healthy" | "degraded"
     - `model_loaded`: boolean
     - `features_count`: 174
     - `classes_count`: 46
     - `environment`: "development" | "production"
  2. `GET /symptoms` -> `SymptomsResponse`:
     - `total_count`: 174
     - `categories`: 8 organ systems ("Respiratory", "Cardiovascular", "Neurological", "Gastrointestinal & Hepatic", "Musculoskeletal", "Dermatological & Endocrine", "Systemic & General", "Rare Clinical Signs")
     - `symptoms`: List of 174 objects with `{ id, name, category, is_rare }`
  3. `GET /model-info` -> `ModelInfoResponse`:
     - Returns verified metadata, test set metrics, validation benchmarks, and top 25 global features.
  4. `POST /predict` -> `PredictResponse`:
     - Input: `{"symptoms": ["symptom_cough", "symptom_wheezing", ...]}`
     - Validated by Pydantic: $1 \le \text{len} \le 50$, unique, non-blank strings matching verified symptom dictionary.
     - Output:
       - `predictions`: Top-3 items `[{ disease, display_name, confidence, confidence_percentage, rank, contributing_symptoms }]`
       - `insufficient_information`: boolean
       - `abstention_reason`: string or null
       - `reported_symptoms_count`: integer
       - `model_version`, `explanation_method`, `causation_caveat`, `disclaimer`

### 2.2 Backend Safety & Abstention Rules (Confirmed from Code)
- **Minimum Symptoms Rule:**
  - In `backend/services/model_service.py`:
    - If `symptom_count < 2`: Enforces `insufficient_information = True` with: *"Presentation sparsity: Only {symptom_count} symptom was reported. A minimum of 2 symptoms is required to formulate a reliable clinical differential hypothesis."*
  - In `backend/schemas.py`: Pydantic allows $\ge 1$ symptom for valid HTTP ingestion.
  - **Decision:** Frontend shows the usability guidance: *"Select at least 3 symptoms for a more informative assessment."* The button remains active at $\ge 1$ symptom. If $N=1$, the backend reliably processes it and returns the abstention result.
- **Confidence Threshold Rule:**
  - If top predicted confidence $< 0.15$ ($15.0\%$ across 46 classes), the backend sets `insufficient_information = True` with: *"Low diagnostic confidence: Top predicted category confidence ({top1_conf*100:.1f}%) falls below the 15.0% threshold across 46 possible diseases, indicating substantial diagnostic uncertainty."*
- **Explainability Mechanism:**
  - Exact linear log-odds: $w_{c,i} \cdot x_i$ computed directly from `model.coef_` for the displayed classes. Feature contributions represent model weights, not biological causality.

### 2.3 Verified Empirical Metrics (Held-Out Test Set $N=10,005$, Fixed Seed 42)
| Metric | Real Value | Definition / Source |
|---|---|---|
| **Top-3 Differential Accuracy** | **73.33%** | Dataset label within top-3 predictions (`reports/test_metrics.json`) |
| **Top-1 Accuracy** | **41.55%** | First-ranked prediction matches label (`reports/test_metrics.json`) |
| **Macro-Averaged F1** | **0.2021** | Unweighted mean F1 across all 46 classes (`reports/test_metrics.json`) |
| **Weighted-Averaged F1** | **0.4045** | Prevalence-weighted F1 (`reports/test_metrics.json`) |
| **Multi-Class Brier Score** | **0.7259** | Quadratic probability calibration error (`reports/test_metrics.json`) |
| **Model Comparison (Val $N=10,002$)** | LR: Top-3 73.6%, Top-1 42.6% | Outperformed Random Forest (69.5%), Extra Trees (70.9%), Naive Bayes (50.6%) |
| **Dropout Robustness** | 0% (73.3%), 10% (68.9%), 25% (61.4%), 50% (50.4%) | Symptom omission degradation curve (`reports/robustness_metrics.json`) |

---

## 3. Staged Implementation Checklist

### Phase 1 — Repository Audit & Planning [COMPLETED]
- [x] Inspect full codebase, backend routes, schemas, models, and reports.
- [x] Initialize Git repository, create base commit, and switch to `ui-revamp` branch.
- [x] Verify API request/response shapes, valid feature list, abstention thresholds.
- [x] Author comprehensive plan in `UI_REVAMP_PLAN.md`.

### Phase 2 — Design System, Navbar & Footer [COMPLETED]
- [x] Upgrade global typography in `frontend/src/index.css` (body 15-16px, labels 12-13px, comfortable line-height).
- [x] Restrain color palette to single primary medical teal/blue, neutral text/surfaces, amber for warnings, red only for emergencies.
- [x] Refactor `Navbar.tsx`:
  - [x] Rename "Classifier" to **"Check Symptoms"**.
  - [x] Remove duplicate links, redundant "New Assessment" button, and always-visible "API Online" badge.
  - [x] Accessible responsive mobile hamburger menu with full keyboard navigation and ARIA attributes.
- [x] Refactor `Footer.tsx`:
  - [x] Compact single-row footer with working links (Overview, Check Symptoms, Benchmarks, Methodology).
  - [x] Single concise medical disclaimer line.
  - [x] Discreet backend status indicator.
  - [x] Checkpoint commit `25f8b5d`.

### Phase 3 — Check Symptoms Page (`Classifier.tsx`) [COMPLETED]
- [x] Responsive two-column desktop layout: Symptom picker (left) + sticky "Your symptoms" panel (right).
- [x] Large clickable tiles/chips for symptoms with distinct selected/unselected visual and keyboard states.
- [x] "Common symptoms" quick-pick shortcut row at the top (Fever, Cough, Headache, Fatigue, Shortness of Breath, Chest Pain, Sore Throat, Wheezing).
- [x] Instant search filtering with clear button and friendly empty state ("No symptoms match your search").
- [x] "Try a sample case" button loading a documented clinical scenario with a prominent demo badge.
- [x] Usability validation guidance: *"Select at least 3 symptoms for a more informative assessment."*
- [x] Prevention of duplicate submissions in flight, clear progress loading state, and error handling.
- [x] Checkpoint commit `5d98f49`.

### Phase 4 — Results Page (`Results.tsx`) [COMPLETED]
- [x] Summary header: selected symptoms, timestamp, and clear indication of model-generated suggestions.
- [x] Top ranked possibilities (up to 3): Rank, condition display name, horizontal probability bar, and plain-English confidence indicator.
- [x] "Why this result?" section: visual horizontal bars of statistical model evidence ($w_i \cdot x_i$) with non-causal disclaimer.
- [x] "What to do next" guidance: General, supportive clinical advice on professional consultations and emergency warning signs without prescribing treatments.
- [x] Redesigned Low-Confidence / Abstention State:
  - Heading: *"We couldn't identify a sufficiently reliable result."*
  - Body: *"Your selected symptoms do not provide enough reliable information for a confident result. You can review your selections or consult a healthcare professional."*
- [x] Emergency Red-Flag Banner: Independent conservative rule set triggered by acute symptoms (crushing chest pain, severe dyspnea, acute neurological loss) directing to emergency care.
- [x] "Download PDF report" action using `jspdf` generating clean summary with timestamps, symptoms, differential results, disclaimer, and model metadata.
- [x] "New assessment" action resetting state and returning to symptom selection.
- [x] Checkpoint commit `96882e1`.

### Phase 5 — Benchmarks Page (`Performance.tsx`) [COMPLETED]
- [x] Verify all numbers before building visualizations (ensure Top-1 and Top-3 are never conflated).
- [x] Model Comparison Bar Chart (Logistic Regression, Random Forest, Extra Trees, Naive Bayes).
- [x] Symptom-Dropout Robustness Line Chart (0%, 10%, 25%, 50% dropout).
- [x] Top 10 global feature importance horizontal bars (expandable to 25) with method disclosure.
- [x] Comprehensive tooltips for Top-1, Top-3, Brier score, Macro-F1.
- [x] Checkpoint commit `2d715ae`.

### Phase 6 — Home / Overview Page (`Home.tsx`) [COMPLETED]
- [x] Two-column hero on desktop (stacked on mobile): Left: headline, subtitle, primary CTA "Check Symptoms"; Right: polished classifier UI preview.
- [x] Verified Statistics Bar: Exactly 3 verified numbers with plain labels (e.g. 73.3% Top-3 Accuracy, 41.6% Top-1 Accuracy, 46 Evaluated Conditions).
- [x] Remove 0.004 ms latency and 174 feature dictionary stats.
- [x] Three-step flow with concise text: 1. Select symptoms, 2. Get ranked possibilities, 3. Understand your results.
- [x] Compact, light two-column "What it can do" vs "What it cannot do" strip.
- [x] Checkpoint commit `6c6ecd5`.

### Phase 7 — Methodology Page (`About.tsx`) [COMPLETED]
- [x] Left sticky table of contents on desktop (collapsible on mobile).
- [x] 5 accordion sections with 2-3 line collapsed summaries expanding to technical details.
- [x] Clear responsive pipeline diagram: Dataset -> Preprocessing -> Model -> Calibration -> Abstention -> Output.
- [x] Compact verified tech stack icon row (FastAPI, scikit-learn, React 19, TypeScript, Tailwind CSS, Vite).
- [x] Checkpoint commit `6ee64bd`.

### Phase 8 — Shared States, Error Handling & 404 [COMPLETED]
- [x] Skeleton loaders for symptoms, metrics, and results.
- [x] Cold start detection with friendly progress message and bounded retries.
- [x] Polished Custom 404 page (`NotFound.tsx`) with working navigation links.
- [x] Resilient, honest `ErrorBoundary.tsx` catching runtime exceptions with friendly reload action.
- [x] Checkpoint commit `7167fbc`.

### Phase 9 — End-to-End Verification [COMPLETED]
- [x] Run backend tests (`pytest` 17 tests: 17 passed).
- [x] Run frontend unit tests (`vitest` 8 tests: 8 passed).
- [x] Run production build (`npm run build`: 0 errors).
- [x] Perform smoke test on backend prediction with valid sample (live inference verified).
- [x] Verify PDF generation (`jspdf` vector generation).
- [x] Verify responsive breakpoints (~1440px, ~768px, ~375px).

### Phase 10 — GitHub Readiness & Final Report [COMPLETED]
- [x] Verify git status and `.gitignore`.
- [x] Formulate final report covering all 9 required sections.

---

## 4. Conservative Architectural Decisions
1. **Routing:** Rename the primary symptom route to `/check-symptoms`, with `/classifier` maintained as a backward-compatible redirect so existing links and tests never break.
2. **Chart Library:** Build clean, zero-dependency, fully responsive SVG/CSS charts matching the medical teal design system. This eliminates React 19 peer-dependency conflicts with older chart libraries while ensuring zero bundle bloat and 100% test compatibility.
3. **PDF Generation:** Use `jspdf` installed directly in `frontend/` to produce client-side vector clinical decision-support summaries with embedded metadata, timestamps, and disclaimers.
4. **Validation:** Align frontend and backend validation: client suggests $\ge 3$ symptoms for informative results, allows submission at $\ge 1$, and lets backend abstention logic return safe "insufficient information" responses when $N < 2$.
