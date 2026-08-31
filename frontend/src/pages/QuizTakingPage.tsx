import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, AlertTriangle, ArrowRight, ArrowLeft, Award, Sparkles, RefreshCw } from 'lucide-react';
import { Question, QuizResult, User } from '../types';
import { assessmentService } from '../services/api';

interface QuizTakingPageProps {
  user: User;
  title: string;
  questions: Question[];
  onComplete: () => void;
}

export const QuizTakingPage: React.FC<QuizTakingPageProps> = ({ user, title, questions, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [submitting, setSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  useEffect(() => {
    if (quizResult) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [quizResult]);

  const handleSelectOption = (option: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentIndex.toString()]: option
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const result = await assessmentService.submitQuiz(title, questions, answers, user.email);
      setQuizResult(result);
    } catch (err) {
      console.error('Error submitting quiz:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const currentQ = questions[currentIndex];

  if (quizResult) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 text-left">
        {/* Quiz Result Header */}
        <div className="bg-slate-900 text-white p-8 rounded-2xl border border-slate-800 shadow-xl space-y-4 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto text-2xl font-bold">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <span className="bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-500/30">
              Assessment Completed
            </span>
            <h1 className="text-3xl font-extrabold text-white mt-2">Quiz Results & Feedback</h1>
            <p className="text-xs text-slate-400 mt-1">{title}</p>
          </div>

          {/* Score Badge */}
          <div className="inline-flex items-center justify-center space-x-6 bg-slate-800 p-4 rounded-xl border border-slate-700">
            <div>
              <div className="text-3xl font-black text-emerald-400">{quizResult.score} / {quizResult.max_score}</div>
              <div className="text-xs text-slate-400">Total Score ({quizResult.percentage}%)</div>
            </div>
            <div className="border-l border-slate-700 h-10"></div>
            <div>
              <div className="text-2xl font-bold text-amber-400">{quizResult.updated_overall_competency}%</div>
              <div className="text-xs text-slate-400">Updated Overall Score</div>
            </div>
          </div>
        </div>

        {/* AI Learning Feedback Box */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center space-x-2 text-amber-700 font-bold text-sm">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>AI Personal Learning Feedback</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
            {quizResult.ai_feedback}
          </p>
        </div>

        {/* Topic Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900">Topic-Wise Performance Breakdown</h2>
          <div className="space-y-3">
            {Object.entries(quizResult.topic_breakdown).map(([topic, pct], idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-800">
                  <span>{topic}</span>
                  <span className={pct >= 70 ? 'text-emerald-700 font-bold' : 'text-rose-600 font-bold'}>{pct}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${pct >= 70 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onComplete}
          className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center justify-center space-x-2 text-sm"
        >
          <span>Return to Official Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-left">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 font-mono">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <h1 className="text-lg font-bold text-slate-900">{title}</h1>
        </div>

        <div className="flex items-center space-x-2 bg-slate-100 px-3.5 py-1.5 rounded-xl border border-slate-200 font-mono text-sm font-bold text-slate-800">
          <Clock className="w-4 h-4 text-amber-600" />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
        <div
          className="bg-amber-500 h-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        ></div>
      </div>

      {/* Current Question Card */}
      {currentQ && (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-2">
            <div className="inline-block bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded text-xs font-semibold">
              Topic: {currentQ.topic}
            </div>
            <h2 className="text-lg font-bold text-slate-900 leading-relaxed">
              {currentQ.text}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((opt, optIdx) => {
              const isSelected = answers[currentIndex.toString()] === opt;
              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(opt)}
                  className={`w-full text-left p-4 rounded-xl border transition flex items-center justify-between text-sm ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500 text-amber-950 font-bold shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <span>{opt}</span>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition flex items-center gap-1.5"
              >
                <span>Next Question</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 shadow-md shadow-amber-500/20 transition flex items-center gap-1.5"
              >
                <span>{submitting ? 'Evaluating Test...' : 'Submit Assessment'}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
