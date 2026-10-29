import React from 'react';
import { AlertCircle, PhoneCall } from 'lucide-react';

export const EmergencyBanner: React.FC = () => {
  return (
    <div 
      className="bg-rose-50/90 border-b border-rose-200/80 px-4 py-2 sm:px-6 backdrop-blur-sm transition-all" 
      role="alert" 
      aria-live="assertive"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 text-rose-950 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex-shrink-0">
            <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
          </span>
          <p className="leading-snug">
            <strong className="font-semibold text-rose-900">Emergency Warning:</strong> If you or a patient have severe, acute, or unstable symptoms (e.g., crushing chest pressure, acute hemoptysis, sudden neurological deficits, severe respiratory distress), contact local emergency medical services immediately. This software is not an emergency triage tool.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-1.5 flex-shrink-0 text-rose-800 font-medium bg-rose-100/60 px-2.5 py-1 rounded-md border border-rose-200/50">
          <PhoneCall className="w-3 h-3 text-rose-600" aria-hidden="true" />
          <span>Call Emergency (911 / 112)</span>
        </div>
      </div>
    </div>
  );
};
