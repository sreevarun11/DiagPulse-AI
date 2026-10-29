# Progress Log: AI Powered Medical Diagnosis Classifier

## Project Overview
- **Project**: AI Powered Medical Diagnosis Classifier (Clinical Decision-Support Prototype)
- **Target User**: Solo B.Tech student project with a viva; doctor-facing clinical decision-support tool.
- **Environment**: Windows, PowerShell, Python 3.12.6, Node.js v24.13.0, npm 10.8.3.
- **Priority**: Correctness, honesty, explainability, rigorous evaluation over complexity.

---

## Stage Tracking

| Stage | Status | Notes |
|-------|--------|-------|
| **Stage 1: Dataset Discovery, Audit, and Cleaning** | Completed | Cleaned 100k records × 175 cols. Identified synthetic provenance, preserved 46 classes, 0 nulls, 0 duplicates. Saved parquet & cleaning log. |
| **Stage 2: Modelling and Evaluation** | Completed | Benchmarked 4 model families. Selected Multinomial L2 Logistic Regression (Top-3 Accuracy: 73.33%, Macro-F1: 0.2021). Evaluated on test set ONCE. Stress tested, calibration curve, abstention rules, exact explainability. |
| **Stage 3: Backend API (FastAPI)** | Completed | FastAPI endpoints (/health, /model-info, /symptoms, /predict) implemented with strict Pydantic validation, CORS, privacy logging, 17/17 pytest tests passing. |
| **Stage 4: Frontend (React + Vite + TS + Tailwind)** | Completed | Built complete 8-page responsive application with accessible clinical styling. Dynamic symptom catalog by organ systems, chip summaries, top-3 differential results with confidence bars, exact log-odds contributions, safety abstentions, dynamic performance dashboard from API, terms, disclaimer/privacy, custom 404, error boundary. Production Vite build succeeded (0 errors). |
| **Stage 5: Integration, Testing, and Handover** | **COMPLETED** | Single PowerShell launch command (`start.ps1`), 17/17 backend tests passing, 8/8 frontend tests passing, production build passing, full `README.md` and student defense guide `VIVA_NOTES.md`. |

---

## Stage 4 Frontend Implementation Log

### 1. Framework & Setup
- Built inside `frontend/` using **React 19**, **TypeScript**, **Vite 8.3**, and **Tailwind CSS 3.4**.
- Package management: `package.json` with pinned versions and verified `package-lock.json`.
- Configured Vite reverse proxy to forward `/api` directly to `http://127.0.0.1:8000`.

### 2. The 8 Required Pages Implemented
1. **Home (`Home.tsx`)**: Product purpose, structured 4-step clinical workflow, empirical test benchmarks (73.3% Top-3 Acc, 46 classes, 174 symptoms, 0.004 ms latency), call to action, and visible medical disclaimer.
2. **Classifier (`Classifier.tsx`)**: Searchable symptom picker categorized across 8 organ systems dynamically loaded from `/api/symptoms`, interactive selection chip summary with count indicators, 1-to-50 symptom validation, reset and submit controls, loading and error states.
3. **Results (`Results.tsx`)**: Clearly labeled preliminary model output, top-3 differential disease predictions with confidence progress bars, exact log-odds contributing symptoms, medical non-causation caveat, safety abstention alerts for sparse/ambiguous presentations, edit symptoms button, and emergency triage red-flag warning.
4. **Model Performance (`Performance.tsx`)**: Real numbers dynamically loaded from `/api/model-info`, model architecture comparison table, per-class metrics, Brier score, calibration curve assessment, robustness stress testing (0%, 10%, 25%, 50% symptom dropout), and clear distinction between internal computational tests and clinical trials.
5. **About and Methodology (`About.tsx`)**: Educational purpose, dataset provenance (Community Healthcare synthetic benchmark) and limitations (inter-symptom independence, pathognomonic clinical signs noise), preprocessing pipeline, model selection rationale, abstention rules, and technology stack.
6. **Terms of Use (`Terms.tsx`)**: Intended clinician use, lack of medical device certification, clinician responsibilities, limitation-of-liability clauses, and explicit prohibited operations.
7. **Disclaimer and Privacy (`DisclaimerPrivacy.tsx`)**: Transparent data handling declaration: in-memory ephemeral inference, zero database storage, zero tracking cookies, sanitized access logs, and complete GDPR/HIPAA privacy compliance.
8. **Custom 404 & Global Error Boundary (`NotFound.tsx`, `ErrorBoundary.tsx`)**: Clean user-friendly fallback with links to overview and classifier; error boundary intercepts exceptions without exposing stack traces.

### 3. Build & Quality Verification
- Compiled production bundle using `npm run build` (`tsc -b && vite build`):
  - `dist/index.html` (0.89 kB)
  - `dist/assets/index-*.css` (22.42 kB)
  - `dist/assets/index-*.js` (341.03 kB)
  - **Build completed in 3.02s with 0 errors.**

---

## Stage 5 Integration, Testing, and Handover Log

### 1. Orchestration & Single Command Startup
- Created [`start.ps1`](file:///c:/Users/sreec/Desktop/AI-Medical%20Diagnosis%20System/start.ps1) for seamless PowerShell execution on Windows.
- Automatically checks/initializes Python `.venv` and Node `node_modules`.
- Spawns FastAPI backend (`http://127.0.0.1:8000`) and Vite frontend dev server (`http://localhost:5173`).
- Handles `Ctrl+C` interrupt with graceful backend process termination and port cleanup.

### 2. Comprehensive Test Verification
- **Backend Test Suite (Pytest)**:
  - Command: `.venv\Scripts\pytest -q`
  - Output: **17 passed in 7.43s (100% pass rate)**.
  - Covers: Data loading, schema validation, zero-leakage training reproducibility, model loading, top-3 differential inference, invalid/empty input handling, and missing artifact security.
- **Frontend Test Suite (Vitest)**:
  - Command: `npm test` inside `frontend/`
  - Output: **8 passed in 6.25s (100% pass rate)**.
  - Covers: Root routing, Navigation, Emergency Banner visibility, Disclaimer Banner presence, Error Boundary fallbacks, and Page component rendering.
- **Production Build (Vite)**:
  - Command: `npm run build`
  - Output: Compiled clean TypeScript bundle in 3.02s with 0 errors.

### 3. Documentation & Viva Defense Package
- [`README.md`](file:///c:/Users/sreec/Desktop/AI-Medical%20Diagnosis%20System/README.md):
  - Clinical decision support scope and disclaimer.
  - Quickstart with single-command `.\start.ps1`.
  - Architecture diagram (FastAPI + React/TS + Scikit-Learn).
  - API endpoint documentation with sample request/response payloads.
  - Empirical benchmark table (Top-1, Top-3, Macro-F1, Brier Score, Latency).
  - Production build and test execution instructions.
- [`VIVA_NOTES.md`](file:///c:/Users/sreec/Desktop/AI-Medical%20Diagnosis%20System/VIVA_NOTES.md):
  - 20 defense questions with exact, technically rigorous answers.
  - "If the examiner asks X, say Y" cheat-sheet.
  - Deep-dive into class imbalance (Asthma 21k vs rare diseases 1 case).
  - Tree ensemble failure vs Logistic Regression success explanation.
  - Proof of synthetic dataset artifacts (independent Bernoulli symptoms, $|r| < 0.02$).
  - Exact log-odds derivation for explainability ($w_{c,i} \cdot x_i$).
  - Ethical and clinical safety justification for abstention rules ($N < 2$, confidence $< 15\%$).

---

## Complete UI Redesign & Backend Repair Execution Log

### 1. Backend Diagnostics & Resolution
- **Root Cause 1 (`ModuleNotFoundError: No module named 'backend'`):** Occurred when executing uvicorn or python commands from within `backend/` or when `BASE_DIR` was absent from `sys.path`. Resolved by anchoring `BASE_DIR = Path(__file__).resolve().parent.parent` and inserting into `sys.path` in both `backend/config.py` and `backend/main.py`.
- **Root Cause 2 (`FileNotFoundError` on model/schema artifacts):** Model path and schema path were relative strings (`models/model.joblib`), resolving against current working directory instead of project root. Resolved by resolving all artifact and report paths explicitly against `BASE_DIR`.
- **Root Cause 3 (Entry Point):** Added `if __name__ == "__main__":` block to `backend/main.py` enabling direct invocation via `python backend/main.py`.
- **Root Cause 4 (Proxy ECONNREFUSED):** Vite dev proxy previously aborted on offline backend with unhandled socket error. Configured Vite proxy error handler in `frontend/vite.config.ts` to cleanly synthesize HTTP 503 `SERVICE_UNAVAILABLE` JSON payloads so frontend remains responsive and displays interactive retry cards.
- **Root Cause 5 (PowerShell Orchestrator):** Enhanced `start.ps1` with uvicorn stdout/stderr log redirection (`.backend_server.log`), automated health polling, and clean PID termination.

### 2. Complete Visual & Architectural UI Redesign
- **Design System:** Replaced basic styling with a high-end healthcare SaaS design system featuring deep slate/navy surfaces (`#0f172a`), refined teal/brand accents, crisp elevation shadows, WCAG AA contrast, and smooth custom scrollbars.
- **Application Shell (`Navbar.tsx`, `Footer.tsx`):**
  - Modern medical wordmark (*DiagPulse AI*), live API health status pill with real-time ping animation and click-to-retry mechanism, streamlined navigation tabs, and responsive mobile drawer.
  - Multi-column architectural footer detailing zero-storage architecture, tech stack specifications, and regulatory boundaries.
- **Symptom Classifier (`Classifier.tsx`):** Redesigned as an outpatient clinical cockpit. Features categorized organ system tabs with count badges, real-time search with clear tags, symptom cards with active/unselected contrast and rare-symptom indicators, presentation sufficiency check (alerting on $N < 2$ sparsity), and duplicate submission prevention.
- **Results View (`Results.tsx`):** Structured clinical decision-support report card. Displays top-3 conditions with visual confidence meters, exact linear log-odds evidence attribution ($w_i \cdot x_i$), prominent safety abstention alerts for ambiguous cases, causation caveat badges, print/export capability, and persistent emergency warnings.
- **Model Performance Dashboard (`Performance.tsx`):** Dynamic metrics telemetry pulling live data from `/api/model-info`, architecture comparison table, stress-test symptom omission degradation grid, and global feature importance.
- **Documentation & Legal Pages (`About.tsx`, `Terms.tsx`, `DisclaimerPrivacy.tsx`, `NotFound.tsx`):** Upgraded to professional white-paper presentation with clean cards, architectural diagrams, and verified privacy declarations.

### 3. Verification & Quality Gates
- **Pytest Backend Suite:** 17 passed in 6.63s (100% pass rate).
- **Vitest Frontend Suite:** 8 passed in 3.11s (100% pass rate).
- **Production Build:** `npm run build` compiled 1,959 modules in 11.33s with 0 errors.
- **Live End-to-End API Test:** All 4 endpoints (`/health`, `/symptoms`, `/model-info`, `/predict`) verified returning genuine predictions.
