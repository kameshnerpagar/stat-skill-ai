import React, { useState } from 'react';
import { ShieldCheck, UserCheck, Lock, ArrowRight, Sparkles, Building2, CheckCircle2 } from 'lucide-react';
import { UserRole } from '../types';

interface LoginPageProps {
  onLogin: (email: string, role: UserRole) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('official@statskill.gov.in');
  const [role, setRole] = useState<UserRole>('official');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, role);
  };

  const handleSelectOfficial = () => {
    setEmail('official@statskill.gov.in');
    setRole('official');
    onLogin('official@statskill.gov.in', 'official');
  };

  const handleSelectAdmin = () => {
    setEmail('admin@statskill.gov.in');
    setRole('admin');
    onLogin('admin@statskill.gov.in', 'admin');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between text-slate-100 font-sans relative overflow-hidden">
      {/* Background Decorative Grids */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]"></div>
      
      {/* Top Bar */}
      <div className="bg-slate-900/80 border-b border-slate-800 px-6 py-3 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center space-x-3">
          <span className="text-amber-500 font-bold tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            GOVERNMENT OF INDIA
          </span>
          <span>|</span>
          <span>Ministry of Statistics and Programme Implementation (MoSPI)</span>
        </div>
        <span className="bg-amber-500/10 text-amber-400 px-2.5 py-0.5 rounded border border-amber-500/20 font-mono">
          SIH 2026 Problem ID: SIH26101
        </span>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 py-12 flex-1 flex items-center justify-center grid grid-cols-1 lg:grid-cols-12 gap-12 z-10">
        
        {/* Left Side: Presentation */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center space-x-2 bg-amber-500/10 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Skill Intelligence Ecosystem</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            STAT-SKILL <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">AI</span>
          </h1>

          <p className="text-xl font-medium text-slate-300">
            Strengthening Capacity Building in India's Official Statistical System
          </p>

          <p className="text-sm text-slate-400 leading-relaxed max-w-xl">
            An intelligent competency assessment and personalized learning pathway platform integrated with the 
            <strong className="text-slate-200"> iGOT Karmayogi</strong> ecosystem and <strong className="text-slate-200">NSSTA</strong> training programmes. Auto-generate MCQs from statistical learning materials and empower officials with role-based skill analytics.
          </p>

          <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl text-xs text-slate-300">
            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Competency Gap Identification across 4 Key Domains</span>
            </div>
            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>iGOT Karmayogi & NSSTA Personalized Course Mapping</span>
            </div>
            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>AI Document MCQ Generator (PDF, DOCX, PPTX, TXT)</span>
            </div>
            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Workforce Analytics & Competency Heatmaps for Admins</span>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="lg:col-span-5 w-full">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-8 shadow-2xl shadow-slate-950/80 backdrop-blur-xl">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Portal Sign In</h2>
                <p className="text-xs text-slate-400">Select Demo Account or enter government ID</p>
              </div>
            </div>

            {/* Quick One-Click Demo Triggers */}
            <div className="mb-6 space-y-2.5">
              <label className="text-xs font-semibold text-slate-400 block uppercase tracking-wider font-mono">
                One-Click Hackathon Demo Profiles
              </label>
              
              <button
                type="button"
                onClick={handleSelectOfficial}
                className="w-full bg-slate-800 hover:bg-slate-700/80 border border-slate-700 hover:border-amber-500/50 p-3 rounded-xl flex items-center justify-between text-left transition group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                    AS
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-amber-400 transition">
                      Ananya Sharma (Official)
                    </div>
                    <div className="text-[11px] text-slate-400">Statistical Officer • Data Analytics</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition" />
              </button>

              <button
                type="button"
                onClick={handleSelectAdmin}
                className="w-full bg-slate-800 hover:bg-slate-700/80 border border-slate-700 hover:border-amber-500/50 p-3 rounded-xl flex items-center justify-between text-left transition group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                    RV
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-amber-400 transition">
                      Dr. Rajesh Verma (Administrator)
                    </div>
                    <div className="text-[11px] text-slate-400">Director General • Workforce Intelligence</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition" />
              </button>
            </div>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-800"></div>
              <span className="flex-shrink mx-3 text-[11px] text-slate-500 uppercase font-mono">Or Login Manually</span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Government Email Address</label>
                <div className="relative">
                  <UserCheck className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                    placeholder="official@statskill.gov.in"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Target Portal Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="official">Official / Learner</option>
                  <option value="admin">Administrator / Manager</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-lg shadow-lg shadow-amber-500/20 transition flex items-center justify-center space-x-2 text-sm"
              >
                <span>Access STAT-SKILL AI Platform</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-950 border-t border-slate-800 px-6 py-4 text-center text-xs text-slate-500">
        MoSPI — Official Statistical System Capacity Building Platform • Developed for Smart India Hackathon 2026
      </div>
    </div>
  );
};
