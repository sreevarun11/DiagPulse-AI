import React from 'react';
import { FileText, ShieldAlert, CheckCircle2, AlertOctagon, Scale, ShieldCheck } from 'lucide-react';
import { DisclaimerBanner } from '../components/DisclaimerBanner';

export const Terms: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Header */}
      <div className="border-b border-slate-200/80 pb-6 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
          <Scale className="w-3.5 h-3.5 text-brand-700" />
          <span>Clinical Governance & Terms of Access</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Terms of Clinical Use
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-mono">
          Last revised: October 2026 • Governs all prototype operations and clinical decision interactions.
        </p>
      </div>

      <DisclaimerBanner />

      <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
        {/* Section 1 */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-card space-y-3">
          <div className="flex items-center gap-2.5 text-slate-900 font-bold text-base">
            <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-mono">1</span>
            <h2>Nature of System and Non-Device Status</h2>
          </div>
          <p>
            The <strong>DiagPulse AI Powered Medical Diagnosis Classifier</strong> is an academic machine learning research prototype developed as a final-year B.Tech engineering viva project. It is intended strictly for educational, research, and exploratory decision-support analysis by healthcare practitioners and medical researchers.
          </p>
          <p>
            This prototype is <strong>not a certified medical device</strong> under FDA (21 CFR Part 820), European Union Medical Device Regulation (EU MDR 2017/745), or CDSCO regulations, and has not received formal regulatory clearance or clinical trials certification for autonomous diagnostic use.
          </p>
        </div>

        {/* Section 2 */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-card space-y-3">
          <div className="flex items-center gap-2.5 text-slate-900 font-bold text-base">
            <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-mono">2</span>
            <h2>Clinician Responsibility & Physician-in-the-Loop</h2>
          </div>
          <p>
            By accessing or operating this software, you acknowledge and agree that:
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-600 pl-2">
            <li>Any diagnostic hypotheses returned by the system must be independently evaluated, confirmed, or dismissed by a licensed healthcare professional using physical examination, laboratory assays, and radiological imaging.</li>
            <li>You will never prescribe pharmaceutical medication, suggest medical procedures, or withhold emergency care based on outputs produced by this software.</li>
            <li>The attending clinician retains sole legal, medical, and ethical responsibility for all patient management decisions and health outcomes.</li>
          </ul>
        </div>

        {/* Section 3 */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-card space-y-3">
          <div className="flex items-center gap-2.5 text-slate-900 font-bold text-base">
            <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-mono">3</span>
            <h2>Strictly Prohibited Operational Scenarios</h2>
          </div>
          <div className="bg-rose-50/90 border border-rose-200/90 rounded-xl p-4 text-xs text-rose-950 space-y-2.5">
            <div className="flex items-center gap-2 font-bold text-rose-900">
              <AlertOctagon className="w-4 h-4 text-rose-600" />
              <span>Prohibited Operations:</span>
            </div>
            <ul className="list-disc list-inside space-y-1.5 text-rose-800">
              <li>Emergency medical triage or assessment of acute, unstable, or life-threatening presentations.</li>
              <li>Direct-to-consumer unsupervised self-diagnosis or direct patient home administration.</li>
              <li>Fully automated algorithmic prescribing or treatment selection without physician review.</li>
              <li>Reverse engineering, vulnerability probing, or submission of malformed denial-of-service payloads.</li>
            </ul>
          </div>
        </div>

        {/* Section 4 */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-card space-y-3">
          <div className="flex items-center gap-2.5 text-slate-900 font-bold text-base">
            <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-mono">4</span>
            <h2>Disclaimer of Warranties & Limitation of Liability</h2>
          </div>
          <p>
            The software is provided on an <strong>"as is" and "as available" basis</strong> without warranty of any kind, either express, statutory, or implied, including but not limited to the implied warranties of merchantability, fitness for a particular clinical diagnostic purpose, and non-infringement.
          </p>
          <p>
            To the maximum extent permitted under applicable law, the authors, developers, and affiliated academic institutions disclaim all liability for any direct, indirect, incidental, special, consequential, or punitive damages, including damages for personal injury, clinical error, misdiagnosis, or treatment delay resulting from use of this prototype.
          </p>
        </div>
      </div>
    </div>
  );
};
