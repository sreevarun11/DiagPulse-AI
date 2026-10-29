import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Stethoscope, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Layers, 
  SlidersHorizontal, 
  TrendingUp,
  FileText,
  Activity,
  Check
} from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <div className="space-y-16 py-8 sm:py-16">
      {/* 1. Hero Section (Two columns on desktop, stacked on mobile) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Headline, Subtitle, Primary CTA */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-900 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-brand-600" />
              <span>Evidence-Based Clinical Decision Support</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Symptom-based differential guidance for clinicians.
              </h1>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                Analyze reported patient signs across 46 conditions. DiagPulse AI presents ranked possibilities and transparent model evidence to assist clinical history-taking, not replace it.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <Link
                to="/check-symptoms"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-700 hover:bg-brand-800 text-white font-semibold rounded-xl shadow-sm transition focus-visible-ring text-base group"
              >
                <Stethoscope className="w-5 h-5" aria-hidden="true" />
                <span>Check Symptoms</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
              </Link>

              <Link
                to="/performance"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 font-semibold rounded-xl shadow-xs transition focus-visible-ring text-base"
              >
                <span>View Benchmarks</span>
              </Link>
            </div>

            <p className="text-xs text-slate-500 leading-normal">
              *Educational prototype: Suggests ranked possibilities, not confirmed clinical diagnoses.
            </p>
          </div>

          {/* Right Column: Polished Classifier Dashboard Mockup */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-5 sm:p-6 space-y-4 relative overflow-hidden">
              {/* Window Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                  <span className="ml-2 text-xs font-mono font-medium text-slate-400">DiagPulse Engine Preview</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-50 text-brand-800">
                  Demo
                </span>
              </div>

              {/* Sample Presentation Chips */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Patient Signs Selected
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-1 bg-slate-100 rounded-md text-xs font-medium text-slate-800 flex items-center gap-1">
                    <Check className="w-3 h-3 text-brand-700" /> Cough
                  </span>
                  <span className="px-2.5 py-1 bg-slate-100 rounded-md text-xs font-medium text-slate-800 flex items-center gap-1">
                    <Check className="w-3 h-3 text-brand-700" /> Shortness of Breath
                  </span>
                  <span className="px-2.5 py-1 bg-slate-100 rounded-md text-xs font-medium text-slate-800 flex items-center gap-1">
                    <Check className="w-3 h-3 text-brand-700" /> Wheezing
                  </span>
                </div>
              </div>

              {/* Sample Ranked Results Output */}
              <div className="space-y-2.5 pt-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Model Ranked Output
                </span>

                {/* Ranked Item 1 */}
                <div className="p-3 rounded-xl border border-brand-200 bg-brand-50/40 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                    <span className="flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-brand-700 text-white flex items-center justify-center text-[10px]">1</span>
                      <span>Asthma</span>
                    </span>
                    <span className="font-mono text-brand-800">Top-Ranked</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-700 rounded-full" style={{ width: '74%' }} />
                  </div>
                  <span className="text-[10px] text-slate-500 block">
                    Evidence: Wheezing (+1.38), Shortness of Breath (+0.42)
                  </span>
                </div>

                {/* Ranked Item 2 */}
                <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px]">2</span>
                      <span>Chronic Bronchitis</span>
                    </span>
                    <span className="font-mono text-slate-500 text-[11px]">Differential</span>
                  </div>
                  <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-400 rounded-full" style={{ width: '45%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Statistics Section (Exactly three verified stats with plain labels) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
            {/* Stat 1: Top-3 Accuracy */}
            <div className="pt-4 md:pt-0 space-y-1">
              <span className="text-4xl font-black text-brand-700 font-mono tracking-tight">73.3%</span>
              <h3 className="text-sm font-bold text-slate-900">Top-3 Diagnostic Accuracy</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                The true condition appears among the top 3 suggestions in 73.3% of tested presentations.
              </p>
            </div>

            {/* Stat 2: Top-1 Accuracy */}
            <div className="pt-4 md:pt-0 md:px-4 space-y-1">
              <span className="text-4xl font-black text-slate-900 font-mono tracking-tight">41.6%</span>
              <h3 className="text-sm font-bold text-slate-900">Top-1 Accuracy</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                First-choice prediction matches exactly across 46 conditions from symptoms alone.
              </p>
            </div>

            {/* Stat 3: Evaluated Conditions */}
            <div className="pt-4 md:pt-0 md:pl-4 space-y-1">
              <span className="text-4xl font-black text-slate-900 font-mono tracking-tight">46</span>
              <h3 className="text-sm font-bold text-slate-900">Diagnostic Conditions</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Covers respiratory, cardiovascular, neurological, gastrointestinal, and systemic disorders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Three-Step Workflow Flow */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            How DiagPulse AI Works
          </h2>
          <p className="text-sm text-slate-600">
            A simple, transparent process to explore potential conditions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h3 className="text-base font-bold text-slate-900">Select symptoms</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Choose the symptoms that apply from the verified clinical catalog using search or bodily system filters.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h3 className="text-base font-bold text-slate-900">Get ranked possibilities</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Review the conditions suggested by the model, ordered by statistical compatibility scores.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h3 className="text-base font-bold text-slate-900">Understand your results</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Explore which symptoms contributed most to each suggestion and review appropriate professional follow-up steps.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Can / Cannot Strip (Light, compact, two-column strip) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">
              System Capabilities & Appropriate Use
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Clear clinical boundaries for healthcare providers and students.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* What it CAN do */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>What it can do</span>
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                  <span>Analyze selected symptoms using the implemented regularized model.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                  <span>Present ranked possibilities when supported by the feature dictionary.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                  <span>Explain available prediction information through statistical weights.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                  <span>Encourage appropriate professional follow-up and clinical investigation.</span>
                </li>
              </ul>
            </div>

            {/* What it CANNOT do */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-rose-800 flex items-center gap-2">
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>What it cannot do</span>
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 flex-shrink-0" />
                  <span>Confirm a clinical diagnosis or replace physical medical examination.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 flex-shrink-0" />
                  <span>Replace the clinical judgement of a qualified healthcare professional.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 flex-shrink-0" />
                  <span>Guarantee that a specific condition is definitively present or absent.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 flex-shrink-0" />
                  <span>Reliably rule out medical emergencies or prescribe medical treatments.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
