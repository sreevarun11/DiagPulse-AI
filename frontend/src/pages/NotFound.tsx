import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, Home, Stethoscope, ArrowRight } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[65vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-10 text-center space-y-6 shadow-card">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center mx-auto border border-slate-200 shadow-subtle">
          <FileQuestion className="w-8 h-8 text-slate-700" aria-hidden="true" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full border border-slate-200">
            HTTP 404 • Resource Not Found
          </span>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Clinical Route Not Found</h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            The requested clinical assessment page or endpoint does not exist or may have been relocated.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-slate-800 transition shadow-card focus-visible-ring"
          >
            <Home className="w-4 h-4 text-brand-400" />
            <span>Return to Overview</span>
          </Link>
          <Link
            to="/classifier"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl hover:bg-slate-50 transition shadow-subtle focus-visible-ring"
          >
            <Stethoscope className="w-4 h-4 text-slate-500" />
            <span>Open Classifier</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
