import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  AlertTriangle, 
  ArrowLeft, 
  CheckCircle2, 
  Info, 
  ShieldAlert, 
  Stethoscope, 
  TrendingUp, 
  BrainCircuit, 
  RotateCcw,
  Printer,
  Sparkles,
  Layers,
  Activity,
  FileText
} from 'lucide-react';
import { PredictResponse, SymptomItem } from '../types';
import { EmergencyBanner } from '../components/EmergencyBanner';
import { DisclaimerBanner } from '../components/DisclaimerBanner';

export const Results: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as {
    predictionData?: PredictResponse;
    selectedSymptoms?: SymptomItem[];
  } | undefined;

  const predictionData = state?.predictionData;
  const selectedSymptoms = state?.selectedSymptoms || [];

  if (!predictionData) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto border border-slate-200 shadow-subtle">
          <Stethoscope className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">No Active Clinical Evaluation Found</h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            To view differential diagnostic predictions, please select patient-reported signs and symptoms in the classifier.
          </p>
        </div>
        <div className="pt-2">
          <Link
            to="/classifier"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-slate-800 transition shadow-card"
          >
            <ArrowLeft className="w-4 h-4" /> 
            <span>Open Symptom Classifier</span>
          </Link>
        </div>
      </div>
    );
  }

  const {
    predictions,
    insufficient_information,
    abstention_reason,
    reported_symptoms_count,
    model_version,
    explanation_method,
    causation_caveat,
  } = predictionData;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Mandatory Emergency Banner */}
      <EmergencyBanner />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-2">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/80">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
              <BrainCircuit className="w-3.5 h-3.5 text-brand-700" />
              <span>Preliminary Decision-Support Output</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Differential Diagnosis Likelihood Analysis
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-mono">
              Evaluated on {reported_symptoms_count} reported signs • Model: {model_version}
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-center">
            <button
              type="button"
              onClick={() => navigate('/classifier')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200/90 text-slate-700 hover:text-slate-900 hover:bg-slate-50 text-xs font-semibold rounded-xl transition shadow-subtle focus-visible-ring"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Modify Symptoms</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition focus-visible-ring"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Summary</span>
            </button>
          </div>
        </div>

        {/* 2. Insufficient Information / Safety Abstention Alert */}
        {insufficient_information && (
          <div 
            className="bg-amber-50/90 border border-amber-200/90 p-5 rounded-2xl shadow-card space-y-3 relative overflow-hidden" 
            role="alert"
          >
            <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-amber-500" />
            <div className="flex items-start gap-3 pl-1">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-700" />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-amber-950">Safety Abstention: Insufficient Information</h3>
                  <span className="text-[10px] font-semibold bg-amber-200/60 text-amber-900 px-2 py-0.5 rounded-full">
                    Refusal to Guess
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
                  {abstention_reason}
                </p>
                <p className="text-[11px] text-amber-800/90">
                  To protect clinical integrity, the engine withholds high-confidence categorization when diagnostic entropy is elevated. Predictions below illustrate statistical associations only.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 3. Patient Presentation Summary Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-card space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Reported Patient Presentation ({selectedSymptoms.length} Signs)</span>
            </h2>
            <span className="text-[11px] text-slate-400 font-mono">Case Features</span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {selectedSymptoms.map((symp) => (
              <span
                key={symp.id}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200/80"
              >
                <span>{symp.name}</span>
                <span className="text-[10px] text-slate-400">({symp.category.split(' ')[0]})</span>
              </span>
            ))}
          </div>
        </div>

        {/* 4. Top 3 Differential Categories */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-slate-900" />
                <span>Top 3 Differential Disease Categories</span>
              </h2>
              <p className="text-xs text-slate-500">Ranked by calibrated multinomial model likelihood</p>
            </div>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
              Softmax Distribution
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {predictions.map((pred) => {
              const confidencePct = Math.round(pred.confidence * 100);
              const isFirst = pred.rank === 1;

              return (
                <div
                  key={pred.disease}
                  className={`bg-white rounded-2xl border p-5 sm:p-6 transition-all shadow-card space-y-4 relative overflow-hidden ${
                    isFirst 
                      ? 'border-slate-900 ring-1 ring-slate-900/10' 
                      : 'border-slate-200/80'
                  }`}
                >
                  {isFirst && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-slate-900" />
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3.5">
                      <span
                        className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                          isFirst 
                            ? 'bg-slate-900 text-white shadow-subtle' 
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        #{pred.rank}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                            {pred.display_name}
                          </h3>
                          {isFirst && (
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-800 px-2 py-0.5 rounded-full border border-slate-200">
                              Primary Hypothesis
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">
                          Target Identifier: {pred.disease}
                        </span>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-2xl font-black text-slate-900 block leading-tight font-mono">
                        {pred.confidence_percentage}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">Model Likelihood Score</span>
                    </div>
                  </div>

                  {/* Visual Confidence Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          isFirst ? 'bg-slate-900' : 'bg-slate-400'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(6, confidencePct))}%` }}
                        role="progressbar"
                        aria-valuenow={confidencePct}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      />
                    </div>
                  </div>

                  {/* Contributing Symptoms Breakdown */}
                  <div className="bg-slate-50/80 rounded-xl p-4 space-y-2.5 border border-slate-200/70">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-700" />
                        <span>Key Contributing Signs (Model Evidence)</span>
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono">Exact w_i · x_i</span>
                    </div>

                    {pred.contributing_symptoms.length === 0 ? (
                      <p className="text-xs text-slate-400 italic py-1">
                        No reported signs exhibited strong positive log-odds weight for this condition.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
                        {pred.contributing_symptoms.map((contrib) => (
                          <div
                            key={contrib.symptom}
                            className="bg-white px-3 py-2 rounded-xl border border-slate-200/80 text-xs flex items-center justify-between gap-2 shadow-subtle"
                          >
                            <span className="font-medium text-slate-800 truncate">{contrib.clean_name}</span>
                            <span className="text-[11px] font-mono font-bold text-slate-900 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded-md flex-shrink-0">
                              +{contrib.weight.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. Scientific Explainability & Causation Notice */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-card space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Info className="w-4 h-4 text-brand-700" />
            <span>Mathematical Explainability & Medical Non-Causation Notice</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            <strong>Methodology:</strong> {explanation_method}. Feature contribution scores represent exact log-odds coefficients derived from regularized hyperplanes.
          </p>
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-700 leading-relaxed">
            <strong className="text-slate-900 font-semibold">Scientific Caveat:</strong> {causation_caveat}
          </div>
        </div>

        {/* 6. Medical Governance Disclaimer */}
        <DisclaimerBanner />
      </div>
    </div>
  );
};
