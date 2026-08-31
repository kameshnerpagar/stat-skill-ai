import React, { useEffect, useState } from 'react';
import { TrendingDown, BrainCircuit, ArrowRight, CheckCircle2, ShieldAlert, Sparkles, Filter } from 'lucide-react';
import { User, SkillGap } from '../types';
import { competencyService } from '../services/api';

interface SkillGapPageProps {
  user: User;
  onNavigate: (view: string) => void;
}

export const SkillGapPage: React.FC<SkillGapPageProps> = ({ user, onNavigate }) => {
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>([]);
  const [filterPriority, setFilterPriority] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGaps = async () => {
      try {
        setLoading(true);
        const data = await competencyService.getSkillGaps(user.email);
        setSkillGaps(data);
      } catch (err) {
        console.error('Error fetching skill gaps:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGaps();
  }, [user.email]);

  const filteredGaps = skillGaps.filter(g => {
    if (filterPriority === 'All') return true;
    return g.priority === filterPriority;
  });

  return (
    <div className="space-y-6 text-left">
      {/* Visual Pipeline Header */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl space-y-6">
        <div>
          <span className="bg-amber-500/20 text-amber-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-amber-500/30">
            Explainable AI Gap Engine
          </span>
          <h1 className="text-2xl font-bold text-white mt-2">AI Skill-Gap Prioritization Analysis</h1>
          <p className="text-xs text-slate-400">
            Prioritizing official development areas based on numerical gap, job assignment, department requirements, future skill demand, and career goals.
          </p>
        </div>

        {/* State Pipeline Flow */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 pt-2 text-center text-xs">
          <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
            <div className="text-[10px] uppercase text-slate-400 font-mono">Step 1</div>
            <div className="font-bold text-white mt-1">CURRENT STATE</div>
            <div className="text-[10px] text-amber-400 mt-0.5">Assessed Scores</div>
          </div>
          <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
            <div className="text-[10px] uppercase text-slate-400 font-mono">Step 2</div>
            <div className="font-bold text-white mt-1">FRAMEWORK</div>
            <div className="text-[10px] text-slate-300 mt-0.5">MoSPI Benchmark</div>
          </div>
          <div className="bg-amber-500 text-slate-950 p-3 rounded-xl font-bold shadow-lg shadow-amber-500/20">
            <div className="text-[10px] uppercase text-slate-900 font-mono font-bold">Step 3</div>
            <div className="font-extrabold text-slate-950 mt-1">AI GAP ANALYSIS</div>
            <div className="text-[10px] text-slate-900 mt-0.5 font-semibold">Multi-Factor Score</div>
          </div>
          <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
            <div className="text-[10px] uppercase text-slate-400 font-mono">Step 4</div>
            <div className="font-bold text-white mt-1">PRIORITIZED GAPS</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">Critical & High</div>
          </div>
          <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 col-span-2 md:col-span-1">
            <div className="text-[10px] uppercase text-slate-400 font-mono">Step 5</div>
            <div className="font-bold text-white mt-1">LEARNING PATH</div>
            <div className="text-[10px] text-blue-400 mt-0.5">iGOT & NSSTA</div>
          </div>
        </div>
      </div>

      {/* AI Explanation Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center space-x-2 text-amber-700 font-bold text-sm">
          <BrainCircuit className="w-5 h-5 text-amber-500" />
          <span>AI Prioritization Rationale</span>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          "Your largest competency gap is <strong className="text-slate-900">Cloud Computing (34% gap)</strong>, followed by <strong className="text-slate-900">Data Privacy (32% gap)</strong> and <strong className="text-slate-900">Python for Data Analysis (28% gap)</strong>. Since your assignment in <strong className="text-slate-900">{user.department?.name || 'Data Analytics'}</strong> involves automated survey pipelines and your career goal is <strong className="text-slate-900">'{user.career_goal}'</strong>, these skills have been elevated to HIGH & CRITICAL priority."
        </p>
      </div>

      {/* Priority Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Skill-Gap Priority Matrix</h2>
            <p className="text-xs text-slate-500">Ranked by intelligent priority algorithm (Gap size + Role relevance + Future demand + Career goal)</p>
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="bg-slate-100 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-semibold focus:outline-none"
            >
              <option value="All">All Priorities</option>
              <option value="CRITICAL">Critical Only</option>
              <option value="HIGH">High Only</option>
              <option value="MEDIUM">Medium Only</option>
              <option value="LOW">Low Only</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 font-mono text-[11px] uppercase border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 font-bold">Skill Name</th>
                <th className="py-3.5 px-4 font-bold">Category</th>
                <th className="py-3.5 px-4 font-bold text-center">Current</th>
                <th className="py-3.5 px-4 font-bold text-center">Required</th>
                <th className="py-3.5 px-4 font-bold text-center">Gap</th>
                <th className="py-3.5 px-4 font-bold">Priority</th>
                <th className="py-3.5 px-4 font-bold">AI Priority Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredGaps.map((gap) => (
                <tr key={gap.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{gap.skill_name}</td>
                  <td className="py-3.5 px-4 text-slate-600">{gap.category}</td>
                  <td className="py-3.5 px-4 text-center font-mono text-slate-700">{gap.current_score}%</td>
                  <td className="py-3.5 px-4 text-center font-mono text-slate-500">{gap.required_score}%</td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-rose-600">{gap.gap_score}%</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded text-[10px] font-extrabold uppercase ${
                      gap.priority.toUpperCase() === 'CRITICAL' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                      gap.priority.toUpperCase() === 'HIGH' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                      gap.priority.toUpperCase() === 'MEDIUM' ? 'bg-blue-100 text-blue-800' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {gap.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 leading-relaxed text-[11px] max-w-md">
                    {gap.priority_reason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">Ready to proceed to your personalized pathway?</span>
          <button
            onClick={() => onNavigate('learning-path')}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl transition flex items-center gap-2 text-xs shadow-md shadow-amber-500/20"
          >
            <span>View Personalized Learning Path</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
