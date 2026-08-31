import React, { useEffect, useState } from 'react';
import { Building2, Users, Award, TrendingDown, BookOpen, Clock, ShieldAlert, ArrowRight, Grid, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { AdminAnalytics } from '../types';
import { analyticsService } from '../services/api';

interface AdminDashboardProps {
  onNavigate: (view: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const [data, setData] = useState<AdminAnalytics | null>(null);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await analyticsService.getAdminAnalytics();
        setData(res);
      } catch (err) {
        console.error('Error fetching admin analytics:', err);
      }
    };
    fetchAdmin();
  }, []);

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-amber-500/20 text-amber-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-amber-500/30">
              MoSPI Administrator Portal
            </span>
            <span className="text-xs text-slate-400 font-mono">• National Capacity Building Analytics</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Workforce Skill Intelligence Dashboard</h1>
          <p className="text-xs text-slate-300">
            Monitoring official statistical competencies, department skill gaps, training completion, and emerging skill demands across India's Statistical System.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onNavigate('admin-heatmap')}
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-3.5 py-2 rounded-xl transition text-xs border border-slate-700 flex items-center gap-1.5"
          >
            <Grid className="w-4 h-4 text-amber-400" />
            <span>View Competency Heatmap</span>
          </button>
          <button
            onClick={() => onNavigate('admin-emerging')}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3.5 py-2 rounded-xl transition text-xs shadow-md shadow-amber-500/20 flex items-center gap-1.5"
          >
            <Zap className="w-4 h-4" />
            <span>Emerging Skills Demand</span>
          </button>
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-xs font-medium">Total Officials</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{data?.total_officials.toLocaleString() || '2,486'}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Across 6 divisions</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-xs font-medium">Average Competency</div>
          <div className="text-2xl font-extrabold text-amber-600 mt-1">{data?.average_competency || 68.4}%</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">+4.2% YoY growth</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-xs font-medium">Critical Skill Gaps</div>
          <div className="text-2xl font-extrabold text-rose-600 mt-1">{data?.critical_skill_gaps_count || 14}</div>
          <div className="text-[11px] text-rose-600 font-semibold mt-0.5">Targeted in iGOT</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-xs font-medium">Courses Completed</div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">{data?.courses_completed.toLocaleString() || '8,421'}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">iGOT & NSSTA</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-xs font-medium">Total Training Hours</div>
          <div className="text-2xl font-extrabold text-blue-600 mt-1">{data?.total_training_hours.toLocaleString() || '24,580'}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Cumulated upskilling</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Department-wise Competency Bar Chart */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900">Department-Wise Average Competency (%)</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.department_competencies || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="department" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="competency" fill="#d97706" radius={[4, 4, 0, 0]} name="Avg Competency (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Score Distribution Chart */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900">Workforce Competency Distribution</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.competency_distribution || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="range" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#1e40af" radius={[4, 4, 0, 0]} name="Officials Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Skill Gaps Across Workforce */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Top Competency Gaps Across Ministry Workforce</h2>
            <p className="text-xs text-slate-500">Most prevalent skill deficits requiring targeted iGOT Karmayogi course deployment</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.top_skill_gaps.map((gap, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900">{gap.skill}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                  gap.priority === 'CRITICAL' ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'bg-amber-100 text-amber-800'
                }`}>
                  {gap.priority}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Workforce Gap Severity:</span>
                  <span className="font-bold text-rose-600">{gap.gap_percentage}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full" style={{ width: `${gap.gap_percentage}%` }}></div>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 pt-1">
                Impacts <strong className="text-slate-800">{gap.affected_officials} officials</strong> across departments
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
