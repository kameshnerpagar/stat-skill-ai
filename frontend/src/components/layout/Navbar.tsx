import React from 'react';
import { ShieldCheck, User as UserIcon, LogOut, Award, Layers } from 'lucide-react';
import { User } from '../../types';

interface NavbarProps {
  user: User;
  onSwitchUser: (role: 'official' | 'admin') => void;
  onNavigate: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onSwitchUser, onNavigate }) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
      {/* Top Government Strip */}
      <div className="bg-slate-950 px-4 py-1 text-xs border-b border-slate-800/60 flex items-center justify-between text-slate-400">
        <div className="flex items-center space-x-3">
          <span className="font-semibold text-amber-500 tracking-wide flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            GOVERNMENT OF INDIA
          </span>
          <span className="text-slate-600">|</span>
          <span>Ministry of Statistics and Programme Implementation (MoSPI)</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="bg-slate-800 text-emerald-400 px-2 py-0.5 rounded text-[11px] font-medium border border-emerald-500/20">
            SIH 2026 Prototype
          </span>
          <button 
            onClick={() => onNavigate('architecture')} 
            className="hover:text-amber-400 transition flex items-center gap-1"
          >
            <Layers className="w-3 h-3 text-amber-400" />
            System Architecture
          </button>
        </div>
      </div>

      {/* Main Branding Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-3.5 cursor-pointer" onClick={() => onNavigate(user.role === 'admin' ? 'admin-dashboard' : 'dashboard')}>
          {/* Emblem Icon / Logo */}
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center font-bold text-slate-950 text-xl shadow-lg shadow-amber-500/20 border border-amber-400/40">
            <ShieldCheck className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight text-white font-mono">STAT-SKILL</span>
              <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent text-xl font-extrabold">AI</span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Competency Intelligence & Personalized Learning Platform</p>
          </div>
        </div>

        {/* User Role Switcher & Profile Info */}
        <div className="flex items-center space-x-4">
          {/* Quick Demo Switcher */}
          <div className="hidden md:flex bg-slate-800/80 p-1 rounded-lg border border-slate-700 text-xs">
            <button
              onClick={() => onSwitchUser('official')}
              className={`px-3 py-1 rounded-md font-medium transition ${
                user.role === 'official'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Official View
            </button>
            <button
              onClick={() => onSwitchUser('admin')}
              className={`px-3 py-1 rounded-md font-medium transition ${
                user.role === 'admin'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Admin View
            </button>
          </div>

          {/* Profile Badge */}
          <div className="flex items-center space-x-3 bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-700">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-amber-400 font-bold border border-slate-600">
              {user.full_name.charAt(0)}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-sm font-semibold text-white leading-tight flex items-center gap-1.5">
                {user.full_name}
                <span className="bg-amber-500/20 text-amber-300 text-[10px] uppercase font-bold px-1.5 py-0.2 rounded border border-amber-500/30">
                  {user.role}
                </span>
              </div>
              <div className="text-xs text-slate-400">{user.designation}</div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={() => onNavigate('login')}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition"
            title="Switch User / Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
