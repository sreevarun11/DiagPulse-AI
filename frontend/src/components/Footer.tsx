import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Stethoscope, Lock, Terminal, Activity } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800/80 text-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12 mb-10">
          {/* Brand & Purpose */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5 text-white font-bold text-base">
              <div className="w-8 h-8 rounded-lg bg-brand-950 border border-brand-800 flex items-center justify-center text-brand-400">
                <Stethoscope className="w-4 h-4" aria-hidden="true" />
              </div>
              <span>DiagPulse AI</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              A clinician-facing diagnostic decision-support system. Evaluates multi-symptom presentations to formulate ranked differential hypotheses across 46 conditions with exact linear log-odds transparency.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400/90 font-medium bg-emerald-950/40 border border-emerald-900/40 px-3 py-1.5 rounded-lg w-fit">
              <Lock className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Zero-Storage Architecture: Ephemeral in-memory inference</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">Clinical Suite</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white transition">Clinical Overview</Link>
              </li>
              <li>
                <Link to="/classifier" className="text-slate-400 hover:text-white transition">Symptom Classifier</Link>
              </li>
              <li>
                <Link to="/performance" className="text-slate-400 hover:text-white transition">Empirical Benchmarks</Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-400 hover:text-white transition">Methodology & Dataset</Link>
              </li>
            </ul>
          </div>

          {/* Governance & Ethics */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">Governance</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/disclaimer-privacy" className="text-slate-400 hover:text-white transition">Disclaimer & Privacy</Link>
              </li>
              <li>
                <Link to="/terms" className="text-slate-400 hover:text-white transition">Terms of Clinical Use</Link>
              </li>
              <li>
                <a 
                  href="http://127.0.0.1:8000/docs" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-slate-400 hover:text-white transition inline-flex items-center gap-1"
                >
                  <Terminal className="w-3 h-3 text-brand-400" />
                  <span>FastAPI Swagger Docs</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Tech Stack Specs */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">Engine Specs</h4>
            <div className="space-y-1.5 text-[11px] text-slate-400">
              <p><span className="text-slate-500">Core Model:</span> Multinomial L2 Logistic Regression</p>
              <p><span className="text-slate-500">Feature Space:</span> 174 Symptom Binary Indicators</p>
              <p><span className="text-slate-500">Top-3 Test Acc:</span> 73.33% (N=10,005)</p>
              <p><span className="text-slate-500">Inference:</span> &lt; 0.004 ms</p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} DiagPulse AI. Educational B.Tech Oral Viva Project.</p>
          <p className="text-slate-400 text-center sm:text-right">
            Not a certified medical device. Decision support only — never autonomous medical diagnosis.
          </p>
        </div>
      </div>
    </footer>
  );
};
