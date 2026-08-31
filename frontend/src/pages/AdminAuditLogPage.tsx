import React, { useState, useEffect } from 'react';
import { ShieldCheck, Clock, FileText, CheckCircle2 } from 'lucide-react';
import { adminService } from '../services/api';

export const AdminAuditLogPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const data = await adminService.getAuditLogs();
        setLogs(data);
      } catch (err) {
        console.error('Error fetching audit logs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6 text-left max-w-6xl mx-auto">
      <div className="bg-slate-900 text-white p-6 rounded-xl border border-slate-800 shadow-sm">
        <span className="bg-blue-900/60 text-blue-300 text-xs font-semibold px-2.5 py-0.5 rounded border border-blue-700 font-mono">
          System Governance & Compliance
        </span>
        <h1 className="text-xl font-bold text-white mt-1">Authority Append-Only Audit Trail</h1>
        <p className="text-xs text-slate-400">
          Permanent log of all administrative actions, official capacity interventions, course assignments, and system modifications.
        </p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
          Recorded Audit Actions ({logs.length})
        </h2>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500">Loading audit trail records...</div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">No audit logs recorded yet.</div>
        ) : (
          <div className="space-y-3">
            {logs.map((l) => (
              <div key={l.id} className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-1 text-xs">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-blue-700 font-mono text-[11px]">{l.created_at}</span>
                  <span className="bg-slate-200 text-slate-800 px-2 py-0.5 rounded text-[10px] uppercase font-bold">
                    {l.action}
                  </span>
                </div>
                <div className="text-slate-900 font-bold">
                  {l.admin_name} <span className="font-normal text-slate-600">performed action on official</span> {l.target_user_name}
                </div>
                <p className="text-slate-600 text-[11px] font-mono">{l.details}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
