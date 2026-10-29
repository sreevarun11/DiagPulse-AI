import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, Home, Stethoscope, ArrowRight } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[65vh] flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 text-center space-y-6 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center mx-auto border border-brand-100">
          <FileQuestion className="w-8 h-8" aria-hidden="true" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider bg-slate-100 text-slate-700 px-3 py-1 rounded-full border border-slate-200">
            Page Not Found • Error 404
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            We couldn't find that page
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-sm mx-auto">
            The link you followed may be broken, or the page may have been moved. You can return home or start a new symptom check.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/check-symptoms"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-700 text-white text-sm font-semibold rounded-xl hover:bg-brand-800 transition shadow-sm focus-visible-ring"
          >
            <Stethoscope className="w-4 h-4" />
            <span>Check Symptoms</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 transition shadow-xs focus-visible-ring"
          >
            <Home className="w-4 h-4 text-slate-500" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
