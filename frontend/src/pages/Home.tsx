import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Stethoscope, 
  ShieldCheck, 
  BrainCircuit, 
  SlidersHorizontal, 
  CheckCircle, 
  ArrowRight,
  TrendingUp,
  Activity,
  Layers,
  Sparkles,
  Lock,
  AlertTriangle,
  FileCheck
} from 'lucide-react';
import { DisclaimerBanner } from '../components/DisclaimerBanner';

export const Home: React.FC = () => {
  return (
    <div className="space-y-16 py-8 sm:py-14">
      {/* 1. Hero Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
        {/* Micro-badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200/90 text-slate-700 text-xs font-semibold shadow-subtle">
          <BrainCircuit className="w-3.5 h-3.5 text-brand-700" aria-hidden="true" />
          <span>Multinomial L2 Regularized Engine</span>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
          <span className="text-brand-800 font-bold">Top-3 Test Accuracy: 73.33%</span>
        </div>

        {/* Hero Title */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
            Evidence-Based Differential Clinical Decision Support
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            An explainable diagnostic aid for outpatient primary presentations. Evaluates reported patient signs across 46 conditions with calibrated likelihood scoring, safety abstention, and exact log-odds feature attribution.
          </p>
        </div>

        {/* Primary Call to Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Link
            to="/classifier"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl shadow-card transition-all focus-visible-ring text-sm sm:text-base group"
          >
            <Stethoscope className="w-4 h-4 text-brand-400 group-hover:scale-110 transition-transform" aria-hidden="true" />
            <span>Launch Symptom Classifier</span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
          </Link>

          <Link
            to="/performance"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-slate-200/90 text-slate-700 hover:text-slate-900 hover:bg-slate-50 font-semibold rounded-xl shadow-subtle transition-all focus-visible-ring text-sm sm:text-base"
          >
            <TrendingUp className="w-4 h-4 text-slate-500" aria-hidden="true" />
            <span>View Verified Benchmarks</span>
          </Link>
        </div>

        {/* Prominent Medical Disclaimer Banner */}
        <div className="pt-4 max-w-3xl mx-auto text-left">
          <DisclaimerBanner />
        </div>
      </section>

      {/* 2. Measured Benchmark KPI Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-100 gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-700">Verified Test Performance</span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">Empirical Evaluation on N=10,005 Held-out Cases</h2>
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Tested once on final split (Seed 42)</span>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Stat 1 */}
            <div className="bg-slate-50/70 p-5 rounded-xl border border-slate-200/70 hover:border-slate-300 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-500">Differential Accuracy</span>
                <span className="text-[10px] font-bold text-brand-700 bg-brand-50 border border-brand-200/60 px-2 py-0.5 rounded-full">Top-3</span>
              </div>
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">73.33%</span>
              <p className="text-xs text-slate-500 mt-1 leading-snug">
                True condition captured within top-3 differential hypotheses.
              </p>
            </div>

            {/* Stat 2 */}
            <div className="bg-slate-50/70 p-5 rounded-xl border border-slate-200/70 hover:border-slate-300 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-500">Diagnostic Coverage</span>
                <span className="text-[10px] font-bold text-slate-700 bg-slate-200/60 px-2 py-0.5 rounded-full">Multi-Class</span>
              </div>
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">46</span>
              <p className="text-xs text-slate-500 mt-1 leading-snug">
                Disease categories spanning acute, chronic, and systemic conditions.
              </p>
            </div>

            {/* Stat 3 */}
            <div className="bg-slate-50/70 p-5 rounded-xl border border-slate-200/70 hover:border-slate-300 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-500">Feature Dictionary</span>
                <span className="text-[10px] font-bold text-slate-700 bg-slate-200/60 px-2 py-0.5 rounded-full">Binary</span>
              </div>
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">174</span>
              <p className="text-xs text-slate-500 mt-1 leading-snug">
                Standardized clinical symptoms grouped into 8 organ systems.
              </p>
            </div>

            {/* Stat 4 */}
            <div className="bg-slate-50/70 p-5 rounded-xl border border-slate-200/70 hover:border-slate-300 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-500">Inference Latency</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">&lt; 1 ms</span>
              </div>
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">0.004 ms</span>
              <p className="text-xs text-slate-500 mt-1 leading-snug">
                Sub-millisecond response for real-time outpatient consultations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Clinical Decision Pathway (Structured Stepper) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-700">Clinical Workflow</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">How DiagPulse AI Assists Consultation</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            A deterministic, four-step pipeline prioritizing medical transparency, safety abstention, and clinical explainability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {/* Step 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-subtle space-y-4 relative group hover:border-brand-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-900 font-bold text-sm">
              01
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold text-slate-900 text-base">Symptom Ingestion</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The clinician selects confirmed signs and symptoms from the 174-feature schema categorized across 8 bodily systems. Interactive summary chips allow instant verification.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-subtle space-y-4 relative group hover:border-brand-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-900 font-bold text-sm">
              02
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold text-slate-900 text-base">Abstention Audit</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Before generating differential scores, safety filters enforce abstention if presentation has fewer than 2 symptoms or top likelihood fails to clear the 15% threshold.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-subtle space-y-4 relative group hover:border-brand-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-900 font-bold text-sm">
              03
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold text-slate-900 text-base">Calibrated Inference</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The regularized model estimates calibrated multi-class probability scores across all 46 disease categories and extracts the top-3 ranked differential hypotheses.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-subtle space-y-4 relative group hover:border-brand-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-900 font-bold text-sm">
              04
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold text-slate-900 text-base">Exact Log-Odds Attribution</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Decomposes log-odds evidence (<span className="font-mono text-[11px]">w_i · x_i</span>) to show exactly which reported symptoms influenced each prediction, with non-causal labeling.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Clinical Governance & Ethical Boundaries */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-900 text-white rounded-3xl p-7 sm:p-10 space-y-8 shadow-elevation border border-slate-800">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-brand-400 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Ethical Governance & Clinical Boundaries</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Scope of Clinical Advisory Support</h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-2xl">
              Strictly engineered with physician-in-the-loop safeguards. Below is an explicit delineation of capabilities and design limits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* System Does */}
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                <CheckCircle className="w-4 h-4" />
                <span>What this system DOES:</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                  <span>Computes ranked top-3 differential disease possibilities for clinical review.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                  <span>Provides transparent model attribution based on exact linear log-odds weights.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                  <span>Safely abstains when presentation has fewer than 2 symptoms or extreme uncertainty.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                  <span>Preserves absolute patient privacy via ephemeral, in-memory zero-retention inference.</span>
                </li>
              </ul>
            </div>

            {/* System Never Does */}
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>What this system NEVER does:</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0" />
                  <span>Never prescribes medication, pharmaceutical dosages, or treatment regimens.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0" />
                  <span>Never replaces physical examination, blood chemistry, imaging, or pathology.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0" />
                  <span>Never claims biological causation between statistical correlations and disease.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0" />
                  <span>Never acts as an autonomous diagnostic authority or emergency triage device.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-brand-400" />
              <span>Full methodology, calibration, and viva notes available in documentation.</span>
            </div>
            <Link
              to="/about"
              className="text-white hover:text-brand-300 font-semibold inline-flex items-center gap-1 transition"
            >
              <span>Read Full Methodology</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
