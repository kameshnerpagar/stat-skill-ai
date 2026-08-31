import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid, Legend } from 'recharts';
import { LineChart as ChartIcon, Clock, Award, CheckCircle2, TrendingUp, Calendar } from 'lucide-react';
import { User, ProgressData } from '../types';
import { analyticsService } from '../services/api';

interface ProgressPageProps {
  user: User;
}

export const ProgressPage: React.FC<ProgressPageProps> = ({ user }) => {
  const [progress, setProgress] = useState<ProgressData | null>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const data = await analyticsService.getProgress(user.email);
        setProgress(data);
      } catch (err) {
        console.error('Error fetching progress:', err);
      }
    };
    fetchProgress();
  }, [user.email]);

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded uppercase tracking-wide">
              Capacity Building Analytics
            </span>
            <span className="text-xs text-slate-500">• MoSPI Learner Progress</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Learner Competency & Upskilling History</h1>
          <p className="text-xs text-slate-600">
            Tracking score improvements, completed iGOT modules, and skill-gap reductions for <strong className="text-slate-900">{user.full_name}</strong>.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-xs font-medium">Total Learning Hours</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{progress?.learning_hours || 38} hrs</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">+6 hrs this month</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-xs font-medium">Courses Completed</div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">{progress?.courses_completed || 2}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">iGOT & NSSTA</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-xs font-medium">Assessments Taken</div>
          <div className="text-2xl font-extrabold text-blue-600 mt-1">{progress?.assessments_taken || 3}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Avg Score: 84%</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-xs font-medium">Overall Improvement</div>
          <div className="text-2xl font-extrabold text-amber-600 mt-1">+{progress?.competency_improvement_pct || 8.0}%</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Since baseline</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Line Chart: Score Over Time */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900">Competency Score Improvement Trend</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progress?.competency_trend || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis domain={[40, 100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#d97706" strokeWidth={3} dot={{ fill: '#d97706', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: Before vs After */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900">Before vs Current Domain Competency</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={progress?.before_after || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="domain" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="before" fill="#cbd5e1" name="Baseline Score" radius={[4, 4, 0, 0]} />
                <Bar dataKey="after" fill="#059669" name="Current Score" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900">Upskilling Activity Timeline</h2>
        <div className="space-y-3">
          {progress?.timeline.map((item, idx) => (
            <div key={idx} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                ✓
              </div>
              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">{item.title}</span>
                  <span className="text-slate-400 font-mono text-[11px]">{item.date}</span>
                </div>
                <p className="text-xs text-slate-600">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
