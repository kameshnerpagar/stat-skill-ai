import React, { useState, useEffect } from 'react';
import { ArrowLeft, Award, ShieldAlert, BookOpen, AlertTriangle, CheckCircle2, Flag, UserCheck, Sparkles } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { adminService } from '../services/api';

interface AdminOfficerDetailPageProps {
  officerId: number;
  onBack: () => void;
}

export const AdminOfficerDetailPage: React.FC<AdminOfficerDetailPageProps> = ({ officerId, onBack }) => {
  const [officer, setOfficer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [interventionModalOpen, setInterventionModalOpen] = useState(false);
  const [notesInput, setNotesInput] = useState('');
  const [submittingAction, setSubmittingAction] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const data = await adminService.getOfficerDetail(officerId);
        setOfficer(data);
        setNotesInput(data.intervention_notes || '');
      } catch (err) {
        console.error('Error fetching officer details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [officerId]);

  const handleToggleIntervention = async (flagged: boolean) => {
    try {
      setSubmittingAction(true);
      const res = await adminService.updateOfficerIntervention(officerId, flagged, notesInput);
      setOfficer((prev: any) => ({
        ...prev,
        intervention_flagged: res.intervention_flagged,
        intervention_notes: res.intervention_notes
      }));
      setInterventionModalOpen(false);
    } catch (err) {
      console.error('Error updating intervention:', err);
    } finally {
      setSubmittingAction(false);
    }
  };

  if (loading || !officer) {
    return (
      <div className="max-w-6xl mx-auto p-12 text-center text-slate-500 text-xs">
        Loading individual officer analytics profile...
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left max-w-6xl mx-auto">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition flex items-center gap-1.5 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Officers Directory</span>
        </button>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setInterventionModalOpen(true)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition shadow-sm flex items-center gap-2 ${
              officer.intervention_flagged
                ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                : 'bg-rose-700 hover:bg-rose-800 text-white'
            }`}
          >
            <Flag className="w-4 h-4" />
            <span>{officer.intervention_flagged ? 'Resolve Intervention' : 'Flag for Intervention'}</span>
          </button>
        </div>
      </div>

      {/* Header Profile Card */}
      <div className="bg-slate-900 text-white p-6 rounded-xl border border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-full bg-blue-700 text-white font-bold text-xl flex items-center justify-center border border-blue-600 shadow-sm">
            {officer.full_name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-white">{officer.full_name}</h1>
              {officer.intervention_flagged && (
                <span className="bg-rose-900/80 text-rose-300 text-[10px] font-bold px-2 py-0.5 rounded border border-rose-700 uppercase">
                  Intervention Flagged
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 mt-0.5">{officer.designation} • {officer.department}</p>
            <p className="text-xs text-slate-400 mt-0.5">{officer.email} • {officer.experience_years} Yrs Exp • {officer.education}</p>
          </div>
        </div>

        {/* Comparative Badges */}
        <div className="grid grid-cols-3 gap-3 text-center bg-slate-800/80 p-3 rounded-lg border border-slate-700 w-full md:w-auto">
          <div>
            <div className="text-xl font-bold text-blue-400">{officer.overall_competency_score}%</div>
            <div className="text-[10px] text-slate-400">Officer Score</div>
          </div>
          <div className="border-l border-slate-700 pl-3">
            <div className="text-xl font-bold text-slate-200">{officer.dept_average}%</div>
            <div className="text-[10px] text-slate-400">Dept Avg ({officer.delta_vs_dept >= 0 ? `+${officer.delta_vs_dept}%` : `${officer.delta_vs_dept}%`})</div>
          </div>
          <div className="border-l border-slate-700 pl-3">
            <div className="text-xl font-bold text-slate-200">{officer.org_average}%</div>
            <div className="text-[10px] text-slate-400">Org Avg</div>
          </div>
        </div>
      </div>

      {/* Grid: Radar Breakdown & Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Competency Radar Chart */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            4-Domain Competency Profile Breakdown
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={officer.domain_radar}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#334155', fontSize: 11, fontWeight: 600 }} />
                <Radar name="Officer Score" dataKey="score" stroke="#1d4ed8" fill="#2563eb" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Prioritized Skill Gaps */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            Prioritized Skill Gaps
          </h2>
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {officer.skill_gaps.map((g: any, idx: number) => (
              <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1 text-xs">
                <div className="flex justify-between items-center font-bold text-slate-900">
                  <span>{g.skill_name} ({g.category})</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    g.priority === 'Critical' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {g.priority} Gap ({g.gap_score}%)
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">{g.priority_reason}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid: Quiz Attempt History & Integrity Flags */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
          Assessment History & Quiz Anti-Cheating Integrity Logs
        </h2>
        {officer.quiz_history.length === 0 ? (
          <p className="text-xs text-slate-500">No quiz attempts logged for this officer yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-semibold">
                <tr>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Assessment Title</th>
                  <th className="px-3 py-2 text-center">Score</th>
                  <th className="px-3 py-2 text-center">Tab Switches</th>
                  <th className="px-3 py-2 text-center">Integrity Score</th>
                  <th className="px-3 py-2">Integrity Flags</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {officer.quiz_history.map((q: any) => (
                  <tr key={q.id}>
                    <td className="px-3 py-2 text-slate-500 font-mono text-[11px]">{q.date}</td>
                    <td className="px-3 py-2 font-bold text-slate-900">{q.title}</td>
                    <td className="px-3 py-2 text-center font-bold text-blue-700">{q.percentage}%</td>
                    <td className="px-3 py-2 text-center font-semibold text-slate-700">{q.tab_switches}</td>
                    <td className="px-3 py-2 text-center">
                      <span className={`px-2 py-0.5 rounded font-bold ${q.integrity_score >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {q.integrity_score}%
                      </span>
                    </td>
                    <td className="px-3 py-2 text-slate-600 text-[11px]">
                      {q.integrity_flags && q.integrity_flags.length > 0 ? (
                        <span className="text-rose-700 font-medium">{q.integrity_flags.join(', ')}</span>
                      ) : (
                        <span className="text-emerald-700 font-medium">Clean Execution</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Intervention Modal */}
      {interventionModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-xl text-left">
            <h3 className="text-base font-bold text-slate-900">
              {officer.intervention_flagged ? 'Resolve Officer Intervention' : 'Flag Officer for Capacity Intervention'}
            </h3>
            <p className="text-xs text-slate-600">
              Enter official administrative notes or intervention instructions for {officer.full_name}:
            </p>
            <textarea
              rows={3}
              value={notesInput}
              onChange={(e) => setNotesInput(e.target.value)}
              placeholder="e.g. Assigned mandatory iGOT Python Data Analysis course due to critical skill gap..."
              className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50"
            />
            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setInterventionModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleToggleIntervention(!officer.intervention_flagged)}
                disabled={submittingAction}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition shadow-sm"
              >
                {submittingAction ? 'Updating Record...' : 'Confirm Action'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
