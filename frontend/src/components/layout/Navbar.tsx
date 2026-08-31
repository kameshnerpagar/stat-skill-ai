import React from 'react';
import { ShieldCheck, LogOut, Globe } from 'lucide-react';
import { User } from '../../types';
import { Language, translations } from '../../utils/i18n';

interface NavbarProps {
  user: User;
  onSwitchUser: (role: 'official' | 'admin') => void;
  onNavigate: (view: string) => void;
  lang?: Language;
  onToggleLang?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onSwitchUser, onNavigate, lang = 'en', onToggleLang }) => {
  const t = translations[lang];

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-sm">
      {/* Top Government Strip */}
      <div className="bg-slate-950 px-4 py-1.5 text-xs border-b border-slate-800/80 flex items-center justify-between text-slate-400">
        <div className="flex items-center space-x-3">
          <span className="font-bold text-amber-500 tracking-wide flex items-center gap-1.5 text-[11px]">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-500"></span>
            {t.gov_heading}
          </span>
          <span className="text-slate-700">|</span>
          <span className="text-[11px] font-medium text-slate-300">{t.mospi_title}</span>
        </div>
        <div className="flex items-center space-x-4">
          {/* Language Toggle */}
          {onToggleLang && (
            <button
              onClick={onToggleLang}
              className="flex items-center gap-1 text-slate-300 hover:text-amber-400 font-medium text-[11px] transition bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700"
              title="Toggle Language / भाषा बदलें"
            >
              <Globe className="w-3 h-3 text-amber-400" />
              <span>{lang === 'en' ? 'English' : 'हिंदी'}</span>
            </button>
          )}
          <span className="bg-slate-800 text-blue-400 px-2 py-0.5 rounded text-[11px] font-mono border border-blue-500/30">
            SIH 2026 SIH26101
          </span>
        </div>
      </div>

      {/* Main Branding Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate(user.role === 'admin' ? 'admin-dashboard' : 'dashboard')}>
          <div className="w-9 h-9 rounded-lg bg-blue-700 flex items-center justify-center font-bold text-white shadow-sm border border-blue-600">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold tracking-tight text-white font-mono">{t.platform_name}</span>
            </div>
            <p className="text-xs text-slate-400">{t.sub_title}</p>
          </div>
        </div>

        {/* User Role Switcher & Profile Info */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs">
            <button
              onClick={() => onSwitchUser('official')}
              className={`px-3 py-1 rounded font-medium transition ${
                user.role === 'official'
                  ? 'bg-blue-700 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.official_view}
            </button>
            <button
              onClick={() => onSwitchUser('admin')}
              className={`px-3 py-1 rounded font-medium transition ${
                user.role === 'admin'
                  ? 'bg-blue-700 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.admin_view}
            </button>
          </div>

          <div className="flex items-center space-x-3 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
            <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-blue-400 font-bold text-xs border border-slate-600">
              {user.full_name.charAt(0)}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-semibold text-white leading-tight flex items-center gap-1.5">
                {user.full_name}
                <span className="bg-blue-900/60 text-blue-300 text-[10px] uppercase font-bold px-1.5 py-0.2 rounded border border-blue-700">
                  {user.role}
                </span>
              </div>
              <div className="text-[11px] text-slate-400">{user.designation}</div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('login')}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition"
            title={t.logout}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
