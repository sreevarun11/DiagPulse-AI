import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  AlertTriangle, 
  ArrowLeft, 
  CheckCircle2, 
  Info, 
  Stethoscope, 
  TrendingUp, 
  RotateCcw,
  Download,
  AlertOctagon,
  FileText,
  Calendar,
  ExternalLink,
  ShieldCheck,
  HelpCircle
} from 'lucide-react';
import { PredictResponse, SymptomItem } from '../types';
import { generateAssessmentPdf } from '../utils/pdfGenerator';
import { DisclaimerBanner } from '../components/DisclaimerBanner';

// Documented conservative emergency warning symptom identifiers
const RED_FLAG_SYMPTOMS = new Set([
  'symptom_chest_pain',
  'symptom_pleuritic_chest_pain',
  'symptom_shortness_of_breath',
  'symptom_hemoptysis',
  'symptom_syncope',
  'symptom_cyanosis',
  'symptom_seizures_symptom',
  'symptom_confusion_symptom',
  'symptom_facial_droop',
  'symptom_speech_difficulty',
]);

export const Results: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [pdfGenerating, setPdfGenerating] = useState<boolean>(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const state = location.state as {
    predictionData?: PredictResponse;
    selectedSymptoms?: SymptomItem[];
    isSampleCase?: boolean;
  } | undefined;

  const predictionData = state?.predictionData;
  const selectedSymptoms = state?.selectedSymptoms || [];
  const isSampleCase = state?.isSampleCase || false;
  const assessmentDate = new Date().toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Empty state if accessed directly without submission
  if (!predictionData) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto border border-slate-200">
          <Stethoscope className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">No Active Clinical Evaluation Found</h2>
          <p className="text-base text-slate-600 max-w-md mx-auto">
            To view ranked differential suggestions, please select patient symptoms in the symptom checker first.
          </p>
        </div>
        <div className="pt-2">
          <Link
            to="/check-symptoms"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-700 text-white text-sm font-semibold rounded-xl hover:bg-brand-800 transition shadow-sm focus-visible-ring"
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
  } = predictionData;

  // Check if any acute red-flag symptoms are present in the patient's selected list
  const identifiedRedFlags = selectedSymptoms.filter((s) => RED_FLAG_SYMPTOMS.has(s.id));
  const hasRedFlags = identifiedRedFlags.length > 0;

  const handleDownloadPdf = () => {
    setPdfError(null);
    setPdfGenerating(true);
    try {
      generateAssessmentPdf({
        predictionData,
        selectedSymptoms,
        timestamp: assessmentDate,
        isSampleCase,
      });
    } catch (err: any) {
      setPdfError(err.message || 'Unable to generate PDF report.');
    } finally {
      setPdfGenerating(false);
    }
  };

  const handleNewAssessment = () => {
    navigate('/check-symptoms');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* 1. Emergency Red-Flag Banner (Prominent, conservative, separate from disease predictions) */}
      {hasRedFlags && (
        <div 
          className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-5 text-rose-950 space-y-3" 
          role="alert" 
          aria-live="assertive"
        >
          <div className="flex items-start gap-3">
            <AlertOctagon className="w-6 h-6 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h2 className="text-base font-bold text-rose-900 tracking-tight">
                Emergency Warning: Potentially Urgent Symptoms Reported
              </h2>
              <p className="text-sm text-rose-900 leading-relaxed">
                You selected one or more symptoms that can indicate an acute or life-threatening condition (
                <strong>{identifiedRedFlags.map((s) => s.name).join(', ')}</strong>). 
                If these symptoms are severe, acute, or worsening, contact local emergency medical services (911 / 112) or go to the nearest emergency department immediately.
              </p>
              <p className="text-xs text-rose-800 font-medium pt-1">
                Do not wait for an outpatient appointment or rely on this model to rule out emergencies.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. Sample Case Notice (if demo data was used) */}
      {isSampleCase && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs sm:text-sm text-amber-900 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-700 flex-shrink-0" />
            <span>
              <strong>Sample Demo Case:</strong> This evaluation was generated using predefined demonstration data.
            </span>
          </div>
          <button
            type="button"
            onClick={handleNewAssessment}
            className="text-xs font-semibold text-amber-900 underline hover:text-amber-950 flex-shrink-0"
          >
            Start your own
          </button>
        </div>
      )}

      {/* 3. Summary Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Your Assessment Results
          </h1>
          <p className="text-sm text-slate-600">
            Model-generated differential suggestions based on {reported_symptoms_count} reported symptoms.
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{assessmentDate}</span>
            <span>•</span>
            <span>Engine: {model_version}</span>
          </div>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-3 self-start sm:self-center">
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={pdfGenerating}
            className="px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold transition flex items-center gap-2 shadow-sm focus-visible-ring"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>{pdfGenerating ? 'Generating...' : 'Download PDF report'}</span>
          </button>

          <button
            type="button"
            onClick={handleNewAssessment}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition flex items-center gap-2 shadow-sm focus-visible-ring"
          >
            <RotateCcw className="w-4 h-4" />
            <span>New assessment</span>
          </button>
        </div>
      </div>

      {pdfError && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
          {pdfError}
        </div>
      )}

      {/* 4. Selected Symptoms Review Strip */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Selected Symptoms ({selectedSymptoms.length})
        </span>
        <div className="flex flex-wrap gap-2">
          {selectedSymptoms.map((s) => (
            <span
              key={s.id}
              className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
            >
              {s.name}
            </span>
          ))}
        </div>
      </div>

      {/* 5. Low-Confidence / Abstention State (When model uncertainty is high or N < 2) */}
      {insufficient_information ? (
        <div className="bg-amber-50/80 border border-amber-300 rounded-2xl p-6 space-y-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-700 flex-shrink-0 mt-0.5" />
            <div className="space-y-1.5">
              <h2 className="text-lg font-bold text-amber-950">
                We couldn't identify a sufficiently reliable result.
              </h2>
              <p className="text-sm text-amber-900 leading-relaxed">
                Your selected symptoms do not provide enough reliable information for a confident result. You can review your selections or consult a healthcare professional.
              </p>
              {abstention_reason && (
                <div className="bg-white/80 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 mt-2">
                  <strong>Reason:</strong> {abstention_reason}
                </div>
              )}
            </div>
          </div>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate('/check-symptoms')}
              className="px-4 py-2 bg-amber-900 text-white rounded-lg text-xs font-semibold hover:bg-amber-950 transition"
            >
              Review or edit symptoms
            </button>
            <button
              type="button"
              onClick={handleNewAssessment}
              className="px-4 py-2 bg-white border border-amber-300 text-amber-950 rounded-lg text-xs font-semibold hover:bg-amber-100 transition"
            >
              Start new assessment
            </button>
          </div>
        </div>
      ) : (
        /* 6. Top Ranked Possibilities (Up to 3 genuine probabilities) */
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand-700" />
              <span>Top Ranked Possibilities</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Conditions ordered by model statistical compatibility. Scores reflect mathematical pattern match, not the personal probability of having the disease.
            </p>
          </div>

          <div className="space-y-4">
            {predictions.slice(0, 3).map((pred) => {
              const scorePct = Math.round(pred.confidence * 100);
              const isFirst = pred.rank === 1;

              // Plain English confidence tier
              let confidenceLabel = 'Exploratory Match';
              if (pred.confidence >= 0.35) {
                confidenceLabel = 'High Compatibility';
              } else if (pred.confidence >= 0.20) {
                confidenceLabel = 'Moderate Compatibility';
              }

              return (
                <div
                  key={pred.disease}
                  className={`bg-white rounded-2xl border p-5 sm:p-6 transition shadow-sm space-y-4 ${
                    isFirst ? 'border-brand-600 ring-1 ring-brand-100' : 'border-slate-200'
                  }`}
                >
                  {/* Title & Score Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                          isFirst ? 'bg-brand-700 text-white' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        #{pred.rank}
                      </span>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">
                          {pred.display_name}
                        </h3>
                        <span className="text-xs text-slate-500 font-medium">
                          {confidenceLabel}
                        </span>
                      </div>
                    </div>

                    <div className="sm:text-right">
                      <span className="text-2xl font-black text-slate-900 block font-mono">
                        {pred.confidence_percentage}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        Model Likelihood Score
                      </span>
                    </div>
                  </div>

                  {/* Horizontal Probability Bar */}
                  <div className="space-y-1">
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          isFirst ? 'bg-brand-700' : 'bg-slate-400'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(6, scorePct))}%` }}
                        role="progressbar"
                        aria-valuenow={scorePct}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`Model score: ${pred.confidence_percentage}`}
                      />
                    </div>
                  </div>

                  {/* 7. "Why this result?" (Statistical Model Contributions) */}
                  <div className="bg-slate-50 rounded-xl p-4 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-brand-700" />
                        <span>Why this result? (Contributing Symptoms)</span>
                      </span>
                      <span className="text-[11px] text-slate-400">Statistical model weights</span>
                    </div>

                    {pred.contributing_symptoms.length === 0 ? (
                      <p className="text-xs text-slate-500 italic py-1">
                        No single symptom dominated this category; result was driven by broader presentation patterns.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1">
                        {pred.contributing_symptoms.map((contrib) => (
                          <div
                            key={contrib.symptom}
                            className="bg-white px-3 py-2 rounded-lg border border-slate-200 text-xs flex items-center justify-between gap-2 shadow-xs"
                          >
                            <span className="font-medium text-slate-800 truncate">{contrib.clean_name}</span>
                            <span className="text-[11px] font-mono font-bold text-brand-800 bg-brand-50 px-1.5 py-0.5 rounded">
                              +{contrib.weight.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    <p className="text-[11px] text-slate-500 pt-1 leading-normal">
                      <strong>Note:</strong> Feature contributions describe how the mathematical model weighed reported signs. They describe model behavior and do not represent biological causes of disease.
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 8. "What to do next" (Cautious, General Medical Guidance) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-brand-700" />
          <h2 className="text-lg font-bold text-slate-900">What to Do Next</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-700">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h3 className="font-bold text-slate-900 text-sm">1. Consult a Doctor</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Share these reported symptoms with a qualified physician (such as a primary care doctor or general practitioner) for comprehensive examination.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h3 className="font-bold text-slate-900 text-sm">2. Laboratory & Imaging</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Clinical confirmation always requires formal diagnostic investigations, such as blood work, urinalysis, ECG, or radiological scans.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h3 className="font-bold text-slate-900 text-sm">3. Emergency Signs</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              If at any point you experience severe chest pain, breathing difficulty, or sudden weakness, seek emergency medical care immediately.
            </p>
          </div>
        </div>
      </div>

      {/* 9. Medical Disclaimer Banner */}
      <DisclaimerBanner />
    </div>
  );
};
