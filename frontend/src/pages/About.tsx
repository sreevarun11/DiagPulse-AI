import React, { useState } from 'react';
import { 
  Info, 
  Database, 
  Cpu, 
  ShieldAlert, 
  Code2, 
  BookOpen, 
  ChevronDown, 
  ChevronUp,
  ArrowRight,
  CheckCircle2,
  Terminal,
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';

export const About: React.FC = () => {
  // Accordion open/close state for each of the 5 sections (default first 2 open)
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    purpose: true,
    dataset: true,
    model: false,
    safety: false,
    tech: false,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const expandAll = () => {
    setOpenSections({
      purpose: true,
      dataset: true,
      model: true,
      safety: true,
      tech: true,
    });
  };

  const collapseAll = () => {
    setOpenSections({
      purpose: false,
      dataset: false,
      model: false,
      safety: false,
      tech: false,
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      {/* 1. Header */}
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
          <BookOpen className="w-8 h-8 text-brand-700" aria-hidden="true" />
          <span>System Methodology & Architecture</span>
        </h1>
        <p className="text-base text-slate-600 max-w-3xl leading-relaxed">
          Technical documentation of the machine learning pipeline, dataset provenance, mathematical explainability, safety abstention framework, and clinical limitations.
        </p>
      </div>

      {/* 2. Pipeline Architecture Diagram (Responsive Flow) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-sm">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            End-to-End Pipeline Architecture
          </span>
          <h2 className="text-lg font-bold text-slate-900">
            From Reported Patient Signs to Explainable Suggestions
          </h2>
        </div>

        {/* Responsive Pipeline Steps */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 pt-2">
          {/* Step 1 */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 block">Step 1</span>
            <span className="font-bold text-slate-900 text-xs block">Dataset</span>
            <span className="text-[11px] text-slate-500 block leading-tight">100k Community cases, 174 features</span>
          </div>

          {/* Step 2 */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 block">Step 2</span>
            <span className="font-bold text-slate-900 text-xs block">Preprocessing</span>
            <span className="text-[11px] text-slate-500 block leading-tight">Stratified 80/10/10 leak-free split</span>
          </div>

          {/* Step 3 */}
          <div className="p-3.5 bg-brand-50/70 rounded-xl border border-brand-200 space-y-1 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 block">Step 3</span>
            <span className="font-bold text-brand-900 text-xs block">Core Model</span>
            <span className="text-[11px] text-brand-800 block leading-tight">Multinomial L2 Logistic Regression</span>
          </div>

          {/* Step 4 */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 block">Step 4</span>
            <span className="font-bold text-slate-900 text-xs block">Calibration</span>
            <span className="text-[11px] text-slate-500 block leading-tight">Brier score 0.7259, reliability curve</span>
          </div>

          {/* Step 5 */}
          <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200 space-y-1 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">Step 5</span>
            <span className="font-bold text-amber-950 text-xs block">Abstention</span>
            <span className="text-[11px] text-amber-800 block leading-tight">Rules: N &lt; 2 or confidence &lt; 15%</span>
          </div>

          {/* Step 6 */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 block">Step 6</span>
            <span className="font-bold text-slate-900 text-xs block">Output</span>
            <span className="text-[11px] text-slate-500 block leading-tight">Top-3 ranked + exact log-odds</span>
          </div>
        </div>
      </div>

      {/* 3. Verified Tech Stack Row */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-sm">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          Verified Core Technologies
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-center">
            <span className="font-bold text-slate-900">Python 3.12</span>
            <span className="text-slate-500 text-[11px]">Core Runtime</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-center">
            <span className="font-bold text-slate-900">FastAPI</span>
            <span className="text-slate-500 text-[11px]">REST API Server</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-center">
            <span className="font-bold text-slate-900">scikit-learn</span>
            <span className="text-slate-500 text-[11px]">Model & Metrics</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-center">
            <span className="font-bold text-slate-900">React 19</span>
            <span className="text-slate-500 text-[11px]">User Interface</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-center">
            <span className="font-bold text-slate-900">TypeScript</span>
            <span className="text-slate-500 text-[11px]">Type-Safe Client</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-center">
            <span className="font-bold text-slate-900">Tailwind CSS</span>
            <span className="text-slate-500 text-[11px]">Clinical Design</span>
          </div>
        </div>
      </div>

      {/* 4. Two-Column Layout: Sticky TOC (Left) & Accordions (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Table of Contents (Desktop Sticky) */}
        <div className="lg:col-span-4 sticky top-20">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Documentation Sections
              </h2>
              <div className="flex gap-2 text-[11px]">
                <button onClick={expandAll} className="text-brand-700 hover:underline">Expand</button>
                <span>•</span>
                <button onClick={collapseAll} className="text-slate-500 hover:underline">Collapse</button>
              </div>
            </div>

            <nav className="space-y-1 text-sm font-medium">
              <a
                href="#purpose"
                onClick={() => setOpenSections((prev) => ({ ...prev, purpose: true }))}
                className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition"
              >
                1. Clinical Role & Scope
              </a>
              <a
                href="#dataset"
                onClick={() => setOpenSections((prev) => ({ ...prev, dataset: true }))}
                className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition"
              >
                2. Dataset & Synthetic Audit
              </a>
              <a
                href="#model"
                onClick={() => setOpenSections((prev) => ({ ...prev, model: true }))}
                className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition"
              >
                3. Model Selection Rationale
              </a>
              <a
                href="#safety"
                onClick={() => setOpenSections((prev) => ({ ...prev, safety: true }))}
                className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition"
              >
                4. Safety & Abstention Rules
              </a>
              <a
                href="#tech"
                onClick={() => setOpenSections((prev) => ({ ...prev, tech: true }))}
                className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition"
              >
                5. Engineering & Validation
              </a>
            </nav>
          </div>
        </div>

        {/* Right Column: 5 Accordion Sections */}
        <div className="lg:col-span-8 space-y-5">
          {/* Section 1: Clinical Role & Scope */}
          <section id="purpose" className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition">
            <button
              type="button"
              onClick={() => toggleSection('purpose')}
              className="w-full p-6 text-left flex items-start justify-between gap-4 focus-visible-ring"
              aria-expanded={openSections.purpose}
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-brand-50 text-brand-800 text-xs font-bold flex items-center justify-center">1</span>
                  <h3 className="text-base font-bold text-slate-900">Clinical Purpose & Decision Support Role</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Doctor-facing cognitive aid assisting differential diagnosis recall in primary care outpatient presentations. Formulates ranked hypotheses prior to confirmatory testing.
                </p>
              </div>
              <div className="p-1 rounded-lg text-slate-400 hover:text-slate-700 flex-shrink-0 mt-1">
                {openSections.purpose ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </button>

            {openSections.purpose && (
              <div className="px-6 pb-6 pt-2 border-t border-slate-100 text-xs sm:text-sm text-slate-700 space-y-3 leading-relaxed">
                <p>
                  In outpatient clinics, physicians evaluate patients reporting multiple non-specific symptoms. Because different disease categories share overlapping presentations, clinicians formulate an initial differential ranking to prioritize physical examinations, diagnostic bloodwork, and imaging.
                </p>
                <p>
                  This system is built as a transparent, explainable machine learning aid. It suggests the top-3 most compatible disease categories, exposes exact statistical evidence weights, and enforces deterministic refusal to guess when symptoms are too sparse.
                </p>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
                  <strong>Academic Scope:</strong> Developed as an honest, fully reproducible B.Tech engineering viva defense project, demonstrating transparent ML decision support over unconstrained black-box guessing.
                </div>
              </div>
            )}
          </section>

          {/* Section 2: Dataset & Synthetic Audit */}
          <section id="dataset" className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition">
            <button
              type="button"
              onClick={() => toggleSection('dataset')}
              className="w-full p-6 text-left flex items-start justify-between gap-4 focus-visible-ring"
              aria-expanded={openSections.dataset}
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-brand-50 text-brand-800 text-xs font-bold flex items-center justify-center">2</span>
                  <h3 className="text-base font-bold text-slate-900">Dataset Provenance & Synthetic Audit</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Community Healthcare benchmark of 100,000 cases across 174 binary symptom indicators and 46 disease categories. Empirical audit confirmed synthetic origin.
                </p>
              </div>
              <div className="p-1 rounded-lg text-slate-400 hover:text-slate-700 flex-shrink-0 mt-1">
                {openSections.dataset ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </button>

            {openSections.dataset && (
              <div className="px-6 pb-6 pt-2 border-t border-slate-100 text-xs sm:text-sm text-slate-700 space-y-3 leading-relaxed">
                <p>
                  The raw benchmark comprises <strong>100,000 cases</strong> mapped across <strong>174 binary indicator variables</strong> (0 or 1) and <strong>46 conditions</strong>.
                </p>
                <ul className="list-disc list-inside space-y-1.5 text-slate-600 pl-1">
                  <li><strong>Zero Missing Values:</strong> 0.00% missing rate across all 17.5 million cells.</li>
                  <li><strong>Zero Duplicate Records:</strong> Every patient case has a distinct symptom pattern.</li>
                  <li><strong>Class Imbalance:</strong> Ranges from 21,295 cases (Asthma) down to 1 case (Metabolic Syndrome).</li>
                  <li><strong>Synthetic Origin Confirmed:</strong> Empirical correlation audits revealed inter-symptom Pearson correlation is near zero (|r| &lt; 0.02), indicating independent Bernoulli symptom generation rather than human biological disease cascades.</li>
                  <li><strong>Pathognomonic Discrepancies:</strong> Synthetic noise exists (e.g. malar/butterfly rash appears in respiratory cases but is absent in SLE records). Disclosed transparently rather than manufacturing artificial results.</li>
                </ul>
              </div>
            )}
          </section>

          {/* Section 3: Model Selection Rationale */}
          <section id="model" className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition">
            <button
              type="button"
              onClick={() => toggleSection('model')}
              className="w-full p-6 text-left flex items-start justify-between gap-4 focus-visible-ring"
              aria-expanded={openSections.model}
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-brand-50 text-brand-800 text-xs font-bold flex items-center justify-center">3</span>
                  <h3 className="text-base font-bold text-slate-900">Model Selection & Mathematical Rationale</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Why Regularized Multinomial Logistic Regression was chosen over Random Forest and Extra Trees. Delivers higher Top-3 accuracy (73.6%) and superior rare-class recall (Macro-F1 0.2133).
                </p>
              </div>
              <div className="p-1 rounded-lg text-slate-400 hover:text-slate-700 flex-shrink-0 mt-1">
                {openSections.model ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </button>

            {openSections.model && (
              <div className="px-6 pb-6 pt-2 border-t border-slate-100 text-xs sm:text-sm text-slate-700 space-y-3 leading-relaxed">
                <p>
                  We benchmarked four model families on 10,002 validation cases using a strictly leak-free stratified protocol (Seed 42). Multinomial L2 Logistic Regression was selected based on five criteria:
                </p>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-600 pl-1">
                  <li><strong>Top-3 Accuracy:</strong> Reached 73.6% validation and 73.3% test accuracy (outperforming Random Forest by +4.1%).</li>
                  <li><strong>Preservation of Rare Classes:</strong> Macro-F1 of 0.2021 vs. 0.1216 for Random Forest (+66% gain). Tree splits starved rare classes at leaf nodes, whereas continuous linear hyperplanes retained stable decision boundaries.</li>
                  <li><strong>Exact Mathematical Explainability:</strong> Directly yields unapproximated log-odds contributions (w_i · x_i), avoiding stochastic sampling noise of external surrogate explainers like SHAP.</li>
                  <li><strong>High-Throughput Latency:</strong> 66 KB model footprint with inference latency under 0.004 ms per case.</li>
                  <li><strong>Viva Defensibility:</strong> Mathematically transparent, convex, reproducible, and explainable in oral examination.</li>
                </ol>
              </div>
            )}
          </section>

          {/* Section 4: Safety & Abstention Framework */}
          <section id="safety" className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition">
            <button
              type="button"
              onClick={() => toggleSection('safety')}
              className="w-full p-6 text-left flex items-start justify-between gap-4 focus-visible-ring"
              aria-expanded={openSections.safety}
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-amber-50 text-amber-800 text-xs font-bold flex items-center justify-center">4</span>
                  <h3 className="text-base font-bold text-slate-900">Safety Abstention & Uncertainty Framework</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Explicit refusal to guess when patient presentation is too sparse or predictive confidence is low. Protects clinical safety by withholding speculative predictions.
                </p>
              </div>
              <div className="p-1 rounded-lg text-slate-400 hover:text-slate-700 flex-shrink-0 mt-1">
                {openSections.safety ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </button>

            {openSections.safety && (
              <div className="px-6 pb-6 pt-2 border-t border-slate-100 text-xs sm:text-sm text-slate-700 space-y-3 leading-relaxed">
                <p>
                  Consumer chatbots often guess on ambiguous prompts. In contrast, DiagPulse AI enforces two deterministic safety rules:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-900 text-xs block">Rule 1: Presentation Sparsity</span>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      If fewer than 2 symptoms are reported (N &lt; 2), the system returns <code>insufficient_information: true</code>. Single isolated symptoms lack clinical specificity to formulate a differential ranking.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-900 text-xs block">Rule 2: Diagnostic Ambiguity</span>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      If top confidence falls below 15.0% across 46 conditions, the system sets <code>insufficient_information: true</code>. Low confidence indicates substantial diagnostic entropy where guessing creates clinical risk.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Section 5: Engineering & Validation */}
          <section id="tech" className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition">
            <button
              type="button"
              onClick={() => toggleSection('tech')}
              className="w-full p-6 text-left flex items-start justify-between gap-4 focus-visible-ring"
              aria-expanded={openSections.tech}
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-brand-50 text-brand-800 text-xs font-bold flex items-center justify-center">5</span>
                  <h3 className="text-base font-bold text-slate-900">Engineering Quality & Test Verification</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Rigorous automated testing across backend API endpoints and frontend components. Strict data privacy with zero persistent patient tracking.
                </p>
              </div>
              <div className="p-1 rounded-lg text-slate-400 hover:text-slate-700 flex-shrink-0 mt-1">
                {openSections.tech ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </button>

            {openSections.tech && (
              <div className="px-6 pb-6 pt-2 border-t border-slate-100 text-xs sm:text-sm text-slate-700 space-y-3 leading-relaxed">
                <p>
                  The implementation is verified through automated test suites:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-900 text-xs block">Backend Pytest (17 Tests)</span>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Validates data schema, zero-leakage training reproducibility, model serialization, endpoint input validation, and safety abstentions.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-900 text-xs block">Frontend Vitest (8 Tests)</span>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Verifies component rendering, route mounting, emergency red-flag banners, error boundary containment, and custom 404 handling.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};
