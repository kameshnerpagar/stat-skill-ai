import React from 'react';
import {
  LayoutDashboard,
  Award,
  TrendingDown,
  Route,
  BookOpen,
  FileQuestion,
  Bot,
  LineChart,
  User,
  Building2,
  Zap,
  Grid,
  Layers
} from 'lucide-react';
import { UserRole } from '../../types';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  role: UserRole;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, role }) => {
  const officialNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'competencies', label: 'My Competencies', icon: Award },
    { id: 'skill-gap', label: 'Skill Gap Analysis', icon: TrendingDown },
    { id: 'learning-path', label: 'Learning Path', icon: Route },
    { id: 'igot-courses', label: 'iGOT Courses', icon: BookOpen },
    { id: 'mcq-generator', label: 'AI MCQ Generator', icon: FileQuestion },
    { id: 'statbot', label: 'AI Assistant (StatBot)', icon: Bot },
    { id: 'progress', label: 'Progress & Analytics', icon: LineChart },
    { id: 'profile', label: 'Official Profile', icon: User },
  ];

  const adminNav = [
    { id: 'admin-dashboard', label: 'Workforce Intelligence', icon: Building2 },
    { id: 'admin-officers', label: 'Officers Directory', icon: User },
    { id: 'admin-heatmap', label: 'Competency Heatmap', icon: Grid },
    { id: 'admin-emerging', label: 'Emerging Skills Demand', icon: Zap },
    { id: 'admin-audit-log', label: 'Admin Audit Log', icon: LineChart },
  ];

  const items = role === 'admin' ? adminNav : officialNav;

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-[calc(100vh-80px)] border-r border-slate-800 p-4 flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        {/* Navigation Category Label */}
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-3 mb-2 font-mono">
            {role === 'admin' ? 'Administration Portal' : 'Official Learner Portal'}
          </div>
          <nav className="space-y-1">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-semibold shadow-md shadow-amber-500/10'
                      : 'hover:bg-slate-800 hover:text-white text-slate-400'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Highlight Card */}
        <div className="bg-slate-800/80 rounded-xl p-3.5 border border-slate-700/60">
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>iGOT Karmayogi Sync</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Connected via prototype connector adapter. Ready for live API integration.
          </p>
        </div>
      </div>

      {/* MoSPI System Footer */}
      <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 text-center">
        <span>MoSPI Statistical System v2.6</span>
        <br />
        <span>Competency Engine Active</span>
      </div>
    </aside>
  );
};
