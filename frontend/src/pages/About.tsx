import React from 'react';
import { 
  Info, 
  Database, 
  Cpu, 
  GitBranch, 
  ShieldAlert, 
  Code2, 
  CheckCircle2, 
  FileCode2, 
  BookOpen,
  Layers,
  Terminal,
  Activity,
  Award
} from 'lucide-react';
import { DisclaimerBanner } from '../components/DisclaimerBanner';

export const About: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* 1. Header */}
      <div className="border-b border-slate-200/80 pb-6 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5 text-brand-700" />
          <span>Academic Methodology & System Architecture</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          System Methodology & Scientific Provenance
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
          Comprehensive documentation of the machine learning pipeline, dataset audit, model selection rationale, exact explainability derivation, and honest medical limitations.
        </p>
      </div>

      <DisclaimerBanner />

      {/* 2. Section 1: Project Purpose & Role */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-card space-y-4">
        <div className="flex items-center gap-3.5 pb-2 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
            <Info className="w-5 h-5 text-brand-400" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">1. Clinical Role & Educational Context</h2>
            <span className="text-xs text-slate-500 font-mono">Solo B.Tech Capstone Project • Oral Viva Defense Implementation</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          This system was engineered as a doctor-facing <strong>clinical decision-support prototype (CDSS)</strong>. In primary care outpatient consultations, clinicians evaluate patients presenting with multiple overlapping symptoms and formulate a differential diagnosis ranking prior to ordering confirmatory laboratory or imaging investigations.
        </p>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          The central objective is an honest, mathematically explainable machine learning architecture that suggests the top-3 most compatible disease categories, exposes unapproximated model weights, refuses to guess when data is sparse or ambiguous, and guarantees zero storage of patient records.
        </p>
      </section>

      {/* 3. Section 2: Dataset Provenance & Empirical Audit */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-card space-y-4">
        <div className="flex items-center gap-3.5 pb-2 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
            <Database className="w-5 h-5 text-brand-400" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">2. Dataset Provenance & Scientific Audit</h2>
            <span className="text-xs text-slate-500 font-mono">Community Healthcare Multi-Symptoms Disease Diagnostic Benchmark</span>
          </div>
        </div>

        <div className="text-xs sm:text-sm text-slate-700 space-y-3 leading-relaxed">
          <p>
            The raw dataset comprises <strong>100,000 cases</strong> mapped across <strong>174 binary symptom indicator variables</strong> (values 0 or 1) and <strong>46 diagnostic categories</strong>.
          </p>
          <div className="bg-slate-50/80 p-5 rounded-xl border border-slate-200/80 space-y-2.5">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Empirical Audit Findings:</h3>
            <ul className="list-disc list-inside space-y-1.5 text-slate-600">
              <li><strong>Zero Missing Values:</strong> 0.00% missingness rate across all 17.5 million cells.</li>
              <li><strong>Zero Duplicate Records:</strong> Every single case represents an individual symptom combination.</li>
              <li><strong>Severe Class Imbalance:</strong> Spans 5 orders of magnitude, from 21,295 cases (Asthma) down to 1 case (Metabolic Syndrome).</li>
              <li><strong>Synthetic Origin Confirmed:</strong> Empirical correlation audits confirmed the data is synthetically simulated. Inter-symptom Pearson correlation is near zero (|r| &lt; 0.02), indicating independent Bernoulli symptom assignment rather than real biological disease cascades.</li>
              <li><strong>Pathognomonic Discrepancies:</strong> Synthetic noise exists (e.g., malar/butterfly rash is present in respiratory conditions but absent in SLE records). Documented transparently rather than manufacturing artificial results.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. Section 3: Machine Learning Pipeline & Selection Rationale */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-card space-y-4">
        <div className="flex items-center gap-3.5 pb-2 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
            <Cpu className="w-5 h-5 text-brand-400" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">3. Model Selection & Mathematical Rationale</h2>
            <span className="text-xs text-slate-500 font-mono">Why Multinomial L2 Logistic Regression Outperformed Tree Ensembles</span>
          </div>
        </div>

        <div className="text-xs sm:text-sm text-slate-700 space-y-3 leading-relaxed">
          <p>
            We evaluated four model families on the 10,002 validation cases with a strictly leak-free stratified protocol (Seed 42). Multinomial Logistic Regression was chosen for five key reasons:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-slate-600 pl-2">
            <li><strong>Superior Top-3 Differential Accuracy:</strong> 73.6% validation and 73.3% test accuracy (outperforming Random Forest by +4.1%).</li>
            <li><strong>Preservation of Rare Classes:</strong> Macro-F1 of 0.2021 vs. 0.1216 for Random Forest (+66% relative gain). In sparse binary spaces, tree splits starve rare classes with &lt; 10 samples at terminal leaves, whereas continuous linear hyperplanes retain stable separating boundaries.</li>
            <li><strong>Exact Mathematical Explainability:</strong> Directly yields unapproximated linear log-odds evidence (<span className="font-mono text-[11px]">w_i · x_i</span>), completely avoiding the stochastic sampling variance of external surrogate explainers like SHAP or LIME.</li>
            <li><strong>Sub-Millisecond Inference:</strong> Model artifact is only 66 KB with an inference latency of &lt; 0.004 ms, ideal for real-time edge or serverless deployment.</li>
            <li><strong>Academic Defense Integrity:</strong> Highly defensible in oral examination — transparent, convex, reproducible, and mathematically rigorous.</li>
          </ol>
        </div>
      </section>

      {/* 5. Section 4: Safety Abstention Framework */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-card space-y-4">
        <div className="flex items-center gap-3.5 pb-2 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">4. Clinical Safety & Abstention Framework</h2>
            <span className="text-xs text-slate-500 font-mono">Deterministic Refusal to Guess Under High Uncertainty</span>
          </div>
        </div>

        <div className="text-xs sm:text-sm text-slate-700 space-y-3 leading-relaxed">
          <p>
            Unlike unconstrained consumer AI chatbots that hallucinate predictions for any arbitrary input, this clinical CDSS enforces formal abstention rules:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80 space-y-1.5">
              <h4 className="font-bold text-slate-900 text-xs">Rule 1: Presentation Sparsity</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                If the user submits fewer than 2 symptoms (N &lt; 2), the system returns <code>insufficient_information: true</code>. A single isolated symptom (e.g. general fatigue) lacks clinical discriminative power to support a reliable differential hypothesis.
              </p>
            </div>
            <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80 space-y-1.5">
              <h4 className="font-bold text-slate-900 text-xs">Rule 2: Diagnostic Ambiguity</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                If the model's top confidence score is below 15.0% (P &lt; 0.15), the system returns <code>insufficient_information: true</code>. Across 46 categories, a top probability below 15% indicates substantial entropy where guessing risks misdiagnosis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Section 5: Engineering Stack */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-card space-y-4">
        <div className="flex items-center gap-3.5 pb-2 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
            <Code2 className="w-5 h-5 text-brand-400" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">5. Technology Stack & Verification</h2>
            <span className="text-xs text-slate-500 font-mono">Modern, Typed, Fully Automated Test Coverage</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-1">
            <span className="font-bold text-slate-900 block">FastAPI</span>
            <span className="text-slate-500 block">Asynchronous REST API</span>
            <span className="text-[10px] text-emerald-700 font-medium">17 Pytest Tests</span>
          </div>
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-1">
            <span className="font-bold text-slate-900 block">scikit-learn</span>
            <span className="text-slate-500 block">L2 Logistic Regression</span>
            <span className="text-[10px] text-emerald-700 font-medium">Fixed Seed 42</span>
          </div>
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-1">
            <span className="font-bold text-slate-900 block">React 19 + TypeScript</span>
            <span className="text-slate-500 block">Type-Safe Client UI</span>
            <span className="text-[10px] text-emerald-700 font-medium">8 Vitest Tests</span>
          </div>
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-1">
            <span className="font-bold text-slate-900 block">Tailwind CSS</span>
            <span className="text-slate-500 block">Accessible Clinical System</span>
            <span className="text-[10px] text-emerald-700 font-medium">WCAG AA Compliant</span>
          </div>
        </div>
      </section>
    </div>
  );
};
