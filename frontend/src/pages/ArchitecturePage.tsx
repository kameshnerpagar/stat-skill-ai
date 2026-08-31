import React from 'react';
import { Layers, ShieldCheck, Cpu, Database, Route, BookOpen, FileQuestion, LineChart, Server } from 'lucide-react';

export const ArchitecturePage: React.FC = () => {
  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl space-y-2">
        <div className="flex items-center space-x-2">
          <span className="bg-amber-500/20 text-amber-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-amber-500/30">
            System Architecture Overview
          </span>
          <span className="text-xs text-slate-400 font-mono">• SIH 2026 Problem SIH26101</span>
        </div>
        <h1 className="text-2xl font-bold text-white">How STAT-SKILL AI Works</h1>
        <p className="text-xs text-slate-300">
          End-to-end conceptual and technical pipeline connecting official metadata, competency framework, explainable AI gap analysis, iGOT Karmayogi adapter, document MCQ generator, and workforce analytics.
        </p>
      </div>

      {/* Visual Pipeline Flowchart */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
          1. End-to-End Intelligence Pipeline
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Step 1 */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs">
              01
            </div>
            <h3 className="font-bold text-sm text-slate-900">User Profile & Framework</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Stores official designation, department, years of experience, education, and career goal aligned with MoSPI's 4 competency domains.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs">
              02
            </div>
            <h3 className="font-bold text-sm text-slate-900">AI Competency Assessment</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Evaluates baseline scores across Statistical, Technical, Digital Governance, and Behavioural competencies.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs">
              03
            </div>
            <h3 className="font-bold text-sm text-slate-900">Multi-Factor Gap Engine</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Calculates priority score: <em className="text-slate-800">Priority = f(Gap, RoleWeight, DeptWeight, FutureDemand, CareerGoal)</em>.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs">
              04
            </div>
            <h3 className="font-bold text-sm text-slate-900">iGOT Karmayogi Connector</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ranks 15+ curated iGOT courses and NSSTA programmes, generating transparent AI explanations for each recommendation.
            </p>
          </div>

          {/* Step 5 */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs">
              05
            </div>
            <h3 className="font-bold text-sm text-slate-900">AI Document MCQ Generator</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Extracts text from uploaded PDF/DOCX/PPTX/TXT learning material and auto-generates MCQs with topic explanations.
            </p>
          </div>

          {/* Step 6 */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs">
              06
            </div>
            <h3 className="font-bold text-sm text-slate-900">Dynamic Competency Re-evaluation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Quiz attempts dynamically update official competency scores, trigger new recommendations, and feed workforce heatmaps.
            </p>
          </div>
        </div>
      </div>

      {/* Tech Stack & Modules */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
          2. Modular Code & Stack Separation
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-2">
              <Server className="w-4 h-4 text-amber-500" />
              <span>FastAPI Backend Services</span>
            </div>
            <ul className="space-y-1 text-slate-600 list-disc list-inside">
              <li><code>competency_service</code>: Multi-factor priority algorithm</li>
              <li><code>recommendation_service</code>: Hybrid course ranker</li>
              <li><code>igot_service</code>: Abstract interface & mock adapter</li>
              <li><code>ai_service</code>: OpenAI client + deterministic fallback</li>
              <li><code>document_service</code>: PyPDF / docx / pptx extractors</li>
              <li><code>analytics_service</code>: Workforce heatmaps & forecasting</li>
            </ul>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-amber-500" />
              <span>React TypeScript Frontend</span>
            </div>
            <ul className="space-y-1 text-slate-600 list-disc list-inside">
              <li>Vite + React 18 + TypeScript</li>
              <li>Tailwind CSS enterprise government design</li>
              <li>Recharts (Radar, Bar, Line charts)</li>
              <li>Lucide Icons</li>
              <li>Dual Learner & Admin role interfaces</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
