import React from 'react';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

interface Props {
  compact?: boolean;
}

export const DisclaimerBanner: React.FC<Props> = ({ compact = false }) => {
  if (compact) {
    return (
      <div 
        className="bg-amber-50/70 border border-amber-200/70 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2.5 shadow-subtle" 
        role="note"
      >
        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
        <p className="leading-relaxed">
          <strong className="font-semibold text-amber-950">Clinical Decision Support:</strong> This decision-support prototype outputs statistical pattern estimates, not clinical diagnoses. Never prescribe, initiate, or withhold treatment based on this software.
        </p>
      </div>
    );
  }

  return (
    <div 
      className="bg-white border border-amber-200/80 rounded-2xl p-5 text-amber-950 shadow-card relative overflow-hidden" 
      role="note"
    >
      <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-amber-500" />
      <div className="flex items-start gap-3.5 pl-1">
        <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200/80 flex items-center justify-center flex-shrink-0 text-amber-700">
          <ShieldCheck className="w-4 h-4" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-slate-900 text-sm tracking-tight">Clinical Governance & Decision Support Scope</h4>
            <span className="text-[10px] font-medium bg-amber-100/70 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200/60">
              Advisory Tool
            </span>
          </div>
          <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">
            This tool is an educational decision-support prototype. It produces differential likelihood scores derived from statistical pattern recognition across simulated outpatient cases. It is <strong>not a medical device</strong>, does not produce a definitive diagnosis, and must never replace clinical history taking, physical examination, diagnostic imaging, or the clinical judgement of a qualified healthcare professional.
          </p>
        </div>
      </div>
    </div>
  );
};
