import React, { useEffect, useState } from 'react';
import { Course, User } from '../types';
import { courseService } from '../services/api';
import { ArrowLeft, Sparkles, BookOpen, Clock, Star, Award, CheckCircle2, ExternalLink } from 'lucide-react';

interface CourseDetailPageProps {
  course: Course;
  user: User;
  onBack: () => void;
}

export const CourseDetailPage: React.FC<CourseDetailPageProps> = ({ course, user, onBack }) => {
  const [detail, setDetail] = useState<any>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const data = await courseService.getCourseDetail(course.id);
        setDetail(data);
      } catch (err) {
        console.error('Error fetching course detail:', err);
      }
    };
    fetchDetail();
  }, [course.id]);

  const handleEnroll = async () => {
    try {
      await courseService.enrollCourse(course.id, user.email);
      setIsEnrolled(true);
      alert(`Enrolled in "${course.title}" via iGOT Karmayogi Adapter!`);
    } catch (err) {
      console.error('Error enrolling course:', err);
    }
  };

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-amber-600 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Course Repository</span>
      </button>

      {/* Course Main Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                course.provider_type === 'nssta' ? 'bg-purple-100 text-purple-900 border border-purple-300' : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
              }`}>
                {course.provider}
              </span>
              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-600" />
                AI Recommended
              </span>
            </div>

            <h1 className="text-2xl font-extrabold text-slate-900">{course.title}</h1>
            <p className="text-xs text-slate-500">Category: {course.category} • Difficulty: {course.difficulty}</p>
          </div>

          <div className="flex flex-col items-end shrink-0 space-y-2">
            <div className="flex items-center space-x-1 text-amber-500 font-bold text-lg">
              <Star className="w-5 h-5 fill-amber-500" />
              <span>{course.rating} / 5.0</span>
            </div>

            <button
              onClick={handleEnroll}
              disabled={isEnrolled}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold shadow-md transition ${
                isEnrolled
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
              }`}
            >
              {isEnrolled ? '✓ Enrolled in iGOT' : 'Enroll in iGOT Course'}
            </button>
          </div>
        </div>

        {/* AI Recommendation Rationale */}
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl space-y-1">
          <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Why this course is recommended for {user.full_name}?</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            This course addresses key competency requirements for the <strong className="text-slate-900">{user.designation}</strong> role in <strong className="text-slate-900">{user.department?.name || 'MoSPI'}</strong>. Completing this module will bridge identified skill gaps and improve overall assessment scores.
          </p>
        </div>

        {/* Overview */}
        <div className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">Course Overview</h2>
          <p className="text-sm text-slate-600 leading-relaxed">{course.description}</p>
        </div>

        {/* Skills Developed */}
        <div className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">Skills Developed</h2>
          <div className="flex flex-wrap gap-2">
            {course.skills_covered.map((skill, sIdx) => (
              <span key={sIdx} className="bg-slate-100 text-slate-800 px-3 py-1 rounded-lg text-xs font-semibold border border-slate-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{skill}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Syllabus Modules */}
        <div className="space-y-3 pt-2">
          <h2 className="text-base font-bold text-slate-900">Syllabus & Learning Modules</h2>
          <div className="space-y-2.5">
            {detail?.modules ? (
              detail.modules.map((mod: any, mIdx: number) => (
                <div key={mIdx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="font-bold text-sm text-slate-900">{mod.title}</div>
                    <div className="flex gap-2 text-xs text-slate-500">
                      {mod.topics.map((t: string, tIdx: number) => (
                        <span key={tIdx} className="bg-white px-2 py-0.5 rounded border border-slate-200">{t}</span>
                      ))}
                    </div>
                  </div>
                  <span className="text-xs font-mono font-semibold text-slate-600 shrink-0">{mod.duration}</span>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-500">Loading module syllabus...</div>
            )}
          </div>
        </div>

        {/* Expected Improvement Footer */}
        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
          <span className="text-emerald-900 font-semibold">Expected Competency Outcome:</span>
          <span className="font-extrabold text-emerald-800 text-sm">{detail?.expected_score_improvement || '+20% Score Boost'}</span>
        </div>
      </div>
    </div>
  );
};
