import React, { useEffect, useState } from 'react';
import { BookOpen, Search, Filter, Star, Clock, CheckCircle2, Award, ExternalLink, Sparkles } from 'lucide-react';
import { Course, User } from '../types';
import { courseService } from '../services/api';

interface CourseRepositoryPageProps {
  user: User;
  onNavigate: (view: string) => void;
  onSelectCourse: (course: Course) => void;
}

export const CourseRepositoryPage: React.FC<CourseRepositoryPageProps> = ({ user, onNavigate, onSelectCourse }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProvider, setSelectedProvider] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<number[]>([1, 4]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await courseService.getCourses({
          category: selectedCategory,
          difficulty: selectedDifficulty,
          provider: selectedProvider,
          search
        });
        setCourses(data);
      } catch (err) {
        console.error('Error fetching courses:', err);
      }
    };
    fetchCourses();
  }, [selectedCategory, selectedDifficulty, selectedProvider, search]);

  const categories = ['All', 'Statistical', 'Technical', 'Digital Governance', 'Behavioural & Managerial'];

  const handleEnroll = async (course: Course, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await courseService.enrollCourse(course.id, user.email);
      setEnrolledCourseIds(prev => [...prev, course.id]);
      alert(`Successfully enrolled in "${course.title}" via iGOT Karmayogi Adapter!`);
    } catch (err) {
      console.error('Error enrolling course:', err);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Connector Header */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              iGOT Integration — Prototype Connector
            </span>
            <span className="text-xs text-slate-400 font-mono">• 15+ Statistical Modules</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">iGOT Karmayogi & NSSTA Course Repository</h1>
          <p className="text-xs text-slate-300">
            Catalog of statistical, technical, and digital governance courses available for upskilling in India's Official Statistical System.
          </p>
        </div>

        <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 text-xs text-slate-300 max-w-xs shrink-0">
          <div className="font-bold text-amber-400 mb-0.5">Production Integration Note:</div>
          <p className="text-[11px] text-slate-400">
            This prototype adapter provides realistic course metadata. In production, this service directly calls live iGOT Karmayogi OAuth2 & REST APIs.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses by skill, topic, or keyword..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Provider & Difficulty Selectors */}
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none"
            >
              <option value="All">All Providers</option>
              <option value="igot">iGOT Karmayogi</option>
              <option value="nssta">NSSTA Programmes</option>
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none"
            >
              <option value="All">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex space-x-2 border-t border-slate-100 pt-3 overflow-x-auto custom-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => {
          const isEnrolled = enrolledCourseIds.includes(course.id);
          const isNSSTA = course.provider_type === 'nssta';

          return (
            <div
              key={course.id}
              onClick={() => onSelectCourse(course)}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between hover:border-amber-400 hover:shadow-md transition cursor-pointer group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className={`px-2.5 py-0.5 rounded font-semibold text-[11px] ${
                    isNSSTA ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {course.provider}
                  </span>
                  <div className="flex items-center space-x-1 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <span>{course.rating}</span>
                  </div>
                </div>

                <h3 className="font-bold text-base text-slate-900 group-hover:text-amber-600 transition">
                  {course.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {course.description}
                </p>

                <div className="flex flex-wrap gap-1 pt-1">
                  {course.skills_covered.map((skill, sIdx) => (
                    <span key={sIdx} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{course.duration}</span>
                  <span>•</span>
                  <span>{course.difficulty}</span>
                </div>

                <button
                  onClick={(e) => handleEnroll(course, e)}
                  disabled={isEnrolled}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    isEnrolled
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm'
                  }`}
                >
                  {isEnrolled ? '✓ Enrolled' : 'Enroll Now'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
