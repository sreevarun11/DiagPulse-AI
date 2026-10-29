import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, AlertCircle } from 'lucide-react';
import { api } from '../api/client';

export const Footer: React.FC = () => {
  const [backendError, setBackendError] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    api.getHealth()
      .then((data) => {
        if (isMounted) setBackendError(data.status !== 'healthy' || !data.model_loaded);
      })
      .catch(() => {
        if (isMounted) setBackendError(true);
      });
    return () => { isMounted = false; };
  }, []);

  return (
    <footer className="bg-white border-t border-slate-200 mt-auto py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-4">
        {/* Unobtrusive Backend Problem Alert (Only shown when there is an issue) */}
        {backendError && (
          <div className="flex items-center justify-center gap-2 text-xs text-rose-700 bg-rose-50 border border-rose-200/80 rounded-lg py-2 px-3">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>Diagnostic API is currently offline on http://127.0.0.1:8000. Start backend to evaluate symptoms.</span>
          </div>
        )}

        {/* Compact Main Footer Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-600">
          {/* Logo & Name */}
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <div className="w-6 h-6 rounded-md bg-brand-700 flex items-center justify-center text-white">
              <Stethoscope className="w-3.5 h-3.5" aria-hidden="true" />
            </div>
            <span>DiagPulse AI</span>
          </div>

          {/* Working Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm" aria-label="Footer Navigation">
            <Link to="/" className="hover:text-slate-900 transition">Overview</Link>
            <Link to="/check-symptoms" className="hover:text-slate-900 transition">Check Symptoms</Link>
            <Link to="/performance" className="hover:text-slate-900 transition">Benchmarks</Link>
            <Link to="/about" className="hover:text-slate-900 transition">Methodology</Link>
          </nav>

          <span className="text-xs text-slate-400">
            Educational B.Tech Prototype
          </span>
        </div>

        {/* One Concise Disclaimer Line */}
        <div className="pt-3 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500 leading-normal">
            <strong>Medical Disclaimer:</strong> DiagPulse AI is an educational decision-support prototype, not a medical device. It suggests statistical possibilities, not clinical diagnoses, and never replaces a qualified healthcare professional.
          </p>
        </div>
      </div>
    </footer>
  );
};
