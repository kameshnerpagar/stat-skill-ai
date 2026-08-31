import React, { useState } from 'react';
import { User, UserProfileUpdate } from '../types';
import { authService } from '../services/api';
import { User as UserIcon, Save, Award, Briefcase, GraduationCap, Target } from 'lucide-react';

interface ProfilePageProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUpdateUser }) => {
  const [careerGoal, setCareerGoal] = useState(user.career_goal || '');
  const [currentAssignment, setCurrentAssignment] = useState(user.current_assignment || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await authService.updateProfile(
        {
          career_goal: careerGoal,
          current_assignment: currentAssignment
        },
        user.email
      );
      onUpdateUser(updated);
      alert('Profile updated successfully! Skill gap priorities & course recommendations re-calculated.');
    } catch (err) {
      console.error('Error updating profile:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-left">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-full bg-amber-500 text-slate-950 font-black text-xl flex items-center justify-center border-2 border-amber-400">
            {user.full_name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{user.full_name}</h1>
            <p className="text-xs text-slate-300">{user.designation} • {user.department?.name || 'MoSPI'}</p>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">EMP-ID: 409282 • Joined: 2022</p>
          </div>
        </div>

        <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30">
          Official Profile Active
        </span>
      </div>

      {/* Profile Form */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Official Metadata & Career Goal Settings</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div>
            <label className="block text-slate-500 font-medium mb-1">Full Name</label>
            <input
              type="text"
              value={user.full_name}
              disabled
              className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-slate-500 font-medium mb-1">Government Email</label>
            <input
              type="text"
              value={user.email}
              disabled
              className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-slate-500 font-medium mb-1">Designation</label>
            <input
              type="text"
              value={user.designation}
              disabled
              className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-slate-500 font-medium mb-1">Department / Division</label>
            <input
              type="text"
              value={user.department?.name || 'Data Analytics Division'}
              disabled
              className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-slate-500 font-medium mb-1">Experience (Years)</label>
            <input
              type="text"
              value={`${user.experience_years} Years`}
              disabled
              className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-slate-500 font-medium mb-1">Highest Qualification</label>
            <input
              type="text"
              value={user.education}
              disabled
              className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold cursor-not-allowed"
            />
          </div>
        </div>

        {/* Editable Fields */}
        <form onSubmit={handleSave} className="space-y-4 pt-4 border-t border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-1">Current Assignment / Operational Scope</label>
            <input
              type="text"
              value={currentAssignment}
              onChange={(e) => setCurrentAssignment(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-900 mb-1">Career Goal / Target Upskilling Path</label>
            <textarea
              value={careerGoal}
              onChange={(e) => setCareerGoal(e.target.value)}
              rows={3}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-amber-500 font-medium leading-relaxed"
              placeholder="E.g., Move into Data Science and Advanced Statistical Analytics."
            />
            <p className="text-[11px] text-slate-500 mt-1 italic">
              * Updating your career goal dynamically re-calculates skill gap priority weighting and iGOT course recommendations.
            </p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl shadow-md shadow-amber-500/20 transition flex items-center gap-2 text-xs"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Profile...' : 'Save & Refresh Recommendations'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
