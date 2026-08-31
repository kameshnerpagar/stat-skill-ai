import React, { useState, useEffect } from 'react';
import { Search, Download, AlertTriangle, ShieldCheck, UserCheck, ArrowRight, Filter, ChevronRight, User } from 'lucide-react';
import { adminService } from '../services/api';

interface OfficerSummary {
  id: number;
  email: string;
  full_name: string;
  designation: string;
  department: string;
  experience_years: number;
  overall_competency_score: number;
  critical_gaps_count: number;
  last_active: string;
  integrity_status: string;
  intervention_flagged: boolean;
  intervention_notes?: string;
  intervention_date?: string;
}

interface AdminOfficersPageProps {
  onSelectOfficer: (officerId: number) => void;
}

export const AdminOfficersPage: React.FC<AdminOfficersPageProps> = ({ onSelectOfficer }) => {
  const [officers, setOfficers] = useState<OfficerSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'competency' | 'gaps' | 'name'>('gaps');

  useEffect(() => {
    const fetchOfficers = async () => {
      try {
        setLoading(true);
        const data = await adminService.getAllOfficers();
        setOfficers(data);
      } catch (err) {
        console.error('Error loading officers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOfficers();
  }, []);

  const departments = ['All', ...Array.from(new Set(officers.map(o => o.department)))];

  const filteredOfficers = officers
    .filter(o => {
      const matchesSearch = o.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            o.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            o.designation.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDept = departmentFilter === 'All' || o.department === departmentFilter;
      return matchesSearch && matchesDept;
    })
    .sort((a, b) => {
      if (sortBy === 'competency') return b.overall_competency_score - a.overall_competency_score;
      if (sortBy === 'gaps') return b.critical_gaps_count - a.critical_gaps_count;
      return a.full_name.localeCompare(b.full_name);
    });

  // CSV Export Handler
  const handleExportCSV = () => {
    const headers = ['ID', 'Full Name', 'Email', 'Designation', 'Department', 'Competency Score', 'Critical Skill Gaps', 'Integrity Status', 'Intervention Status'];
    const rows = filteredOfficers.map(o => [
      o.id,
      `"${o.full_name}"`,
      `"${o.email}"`,
      `"${o.designation}"`,
      `"${o.department}"`,
      o.overall_competency_score,
      o.critical_gaps_count,
      `"${o.integrity_status}"`,
      `"${o.intervention_flagged ? 'Intervention Flagged' : 'Normal'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MoSPI_Officials_Performance_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 rounded-xl border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="bg-blue-900/60 text-blue-300 text-xs font-semibold px-2.5 py-0.5 rounded border border-blue-700 font-mono">
            Authority Oversight Module
          </span>
          <h1 className="text-xl font-bold text-white mt-1">Individual Official Performance & Intervention Directory</h1>
          <p className="text-xs text-slate-400">
            Monitor official competencies, critical skill gap counts, quiz integrity scores, and assign targeted interventions across MoSPI divisions.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition shadow-sm shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export Directory (CSV)</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, or designation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto text-xs">
          <div className="flex items-center space-x-1.5 text-slate-600 font-medium">
            <Filter className="w-3.5 h-3.5" />
            <span>Division:</span>
          </div>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            {departments.map((d, idx) => (
              <option key={idx} value={d}>{d}</option>
            ))}
          </select>

          <div className="flex items-center space-x-1.5 text-slate-600 font-medium ml-2">
            <span>Sort By:</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="gaps">Priority: Skill Gaps (High to Low)</option>
            <option value="competency">Overall Competency Score</option>
            <option value="name">Official Name (Alphabetical)</option>
          </select>
        </div>
      </div>

      {/* Officers Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-xs">Loading officer workforce records...</div>
        ) : filteredOfficers.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">No officials found matching the specified filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-4 py-3">Official / Designation</th>
                  <th className="px-4 py-3">Division</th>
                  <th className="px-4 py-3 text-center">Competency Score</th>
                  <th className="px-4 py-3 text-center">Critical Gaps</th>
                  <th className="px-4 py-3 text-center">Quiz Integrity</th>
                  <th className="px-4 py-3 text-center">Status / Flag</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOfficers.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/80 transition cursor-pointer" onClick={() => onSelectOfficer(o.id)}>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs border border-slate-300">
                          {o.full_name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                            <span>{o.full_name}</span>
                            {o.intervention_flagged && (
                              <span className="bg-rose-100 text-rose-800 text-[10px] px-1.5 py-0.2 rounded font-bold border border-rose-300">
                                Flagged
                              </span>
                            )}
                          </div>
                          <div className="text-slate-500 text-[11px]">{o.designation} • {o.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-700">{o.department}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded font-bold text-xs ${
                        o.overall_competency_score >= 75
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : o.overall_competency_score >= 65
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}>
                        {o.overall_competency_score}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center font-bold">
                      <span className={`px-2 py-0.5 rounded ${o.critical_gaps_count > 0 ? 'bg-rose-100 text-rose-800 font-bold' : 'bg-slate-100 text-slate-600'}`}>
                        {o.critical_gaps_count} Gaps
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        o.integrity_status === 'Good'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200 font-bold'
                      }`}>
                        {o.integrity_status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-[11px]">
                      {o.intervention_flagged ? (
                        <span className="text-rose-700 font-bold">Intervention Pending</span>
                      ) : (
                        <span className="text-slate-500">Normal Track</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={(e) => { e.stopPropagation(); onSelectOfficer(o.id); }}
                        className="text-blue-700 hover:text-blue-900 font-bold flex items-center gap-1 justify-end ml-auto"
                      >
                        <span>View Analytics</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
