import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Clock, CheckCircle2, AlertTriangle, ArrowRight, ArrowLeft, Award, Sparkles, ShieldAlert, KeyRound } from 'lucide-react';
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
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes total
  const [questionTimeLeft, setQuestionTimeLeft] = useState(45); // 45 seconds per question
  const [perQuestionTimes, setPerQuestionTimes] = useState<Record<string, number>>({});
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  const questionStartTimeRef = useRef<number>(Date.now());

  /**
   * PROCTORING EXTENSION POINT:
   * checkIntegrity() function stub for future biometric/webcam proctoring service integration.
   */
  const checkIntegrity = useCallback((event: string, meta?: any) => {
    console.log(`[IntegrityMonitor] Event logged: ${event}`, meta);
    // Future expansion: call external proctoring API (e.g., webcam face detection, gaze tracking)
  }, []);

  // Submit Handler
  const handleSubmit = useCallback(async (forcedByIntegrity: boolean = false) => {
    if (submitting || quizResult) return;
    setSubmitting(true);
    
    // Save current question time
    const elapsed = Math.round((Date.now() - questionStartTimeRef.current) / 1000);
    const updatedTimes = { ...perQuestionTimes, [currentIndex.toString()]: elapsed };

    try {
      checkIntegrity('QUIZ_SUBMIT', { forcedByIntegrity, tabSwitchCount, perQuestionTimes: updatedTimes });
      const result = await assessmentService.submitQuiz(
        title,
        questions,
        answers,
        user.email,
        forcedByIntegrity ? tabSwitchCount + 1 : tabSwitchCount,
        updatedTimes
      );
      setQuizResult(result);
    } catch (err) {
      console.error('Error submitting quiz:', err);
    } finally {
      setSubmitting(false);
    }
  }, [submitting, quizResult, title, questions, answers, user.email, tabSwitchCount, perQuestionTimes, currentIndex, checkIntegrity]);

  // Tab switch & window blur anti-cheating listeners
  useEffect(() => {
    if (quizResult) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount(prev => {
          const next = prev + 1;
          checkIntegrity('TAB_SWITCH_DETECTED', { count: next });
          setShowWarning(true);
          if (next >= 3) {
            handleSubmit(true);
          }
          return next;
        });
      }
    };

    const handleWindowBlur = () => {
      checkIntegrity('WINDOW_BLUR', {});
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [quizResult, handleSubmit, checkIntegrity]);

  // Total Quiz Timer & Per-Question Timer
  useEffect(() => {
    if (quizResult) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(false);
          return 0;
        }
        return prev - 1;
      });

      setQuestionTimeLeft(prev => {
        if (prev <= 1) {
          // Auto advance on question timeout
          if (currentIndex < questions.length - 1) {
            setCurrentIndex(c => c + 1);
            return 45;
          } else {
            handleSubmit(false);
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizResult, currentIndex, questions.length, handleSubmit]);

  // Reset Per-Question Timer when switching questions
  useEffect(() => {
    questionStartTimeRef.current = Date.now();
    setQuestionTimeLeft(45);
  }, [currentIndex]);

  const handleSelectOption = (option: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentIndex.toString()]: option
    }));
  };

  const handleQuestionChange = (newIdx: number) => {
    const elapsed = Math.round((Date.now() - questionStartTimeRef.current) / 1000);
    setPerQuestionTimes(prev => ({ ...prev, [currentIndex.toString()]: elapsed }));
    setCurrentIndex(newIdx);
  };

  // Keyboard navigation accessibility
  useEffect(() => {
    if (quizResult) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const currentQ = questions[currentIndex];
      if (!currentQ) return;

      if (['1', '2', '3', '4'].includes(e.key)) {
        const idx = parseInt(e.key) - 1;
        if (currentQ.options[idx]) {
          handleSelectOption(currentQ.options[idx]);
        }
      } else if (e.key === 'ArrowRight' && currentIndex < questions.length - 1) {
        handleQuestionChange(currentIndex + 1);
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        handleQuestionChange(currentIndex - 1);
      } else if (e.key === 'Enter') {
        if (currentIndex < questions.length - 1) {
          handleQuestionChange(currentIndex + 1);
        } else {
          handleSubmit(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [quizResult, currentIndex, questions, handleSelectOption, handleSubmit]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const currentQ = questions[currentIndex];

  if (quizResult) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 text-left select-none">
        {/* Quiz Result Header */}
        <div className="bg-slate-900 text-white p-6 rounded-xl border border-slate-800 shadow-sm space-y-4 text-center">
          <div className="w-14 h-14 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mx-auto text-2xl font-bold">
            <Award className="w-7 h-7" />
          </div>

          <div>
            <span className="bg-blue-900/60 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full border border-blue-700">
              Assessment Evaluation Complete
            </span>
            <h1 className="text-2xl font-bold text-white mt-2">Quiz Results & Integrity Report</h1>
            <p className="text-xs text-slate-400 mt-1">{title}</p>
          </div>

          {/* Score & Integrity Badges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-800 p-4 rounded-lg border border-slate-700 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-400">{quizResult.score} / {quizResult.max_score}</div>
              <div className="text-xs text-slate-400">Quiz Score ({quizResult.percentage}%)</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-400">{quizResult.updated_overall_competency}%</div>
              <div className="text-xs text-slate-400">Updated Competency</div>
            </div>
            <div>
              <div className={`text-2xl font-bold ${quizResult.integrity_score >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {quizResult.integrity_score}%
              </div>
              <div className="text-xs text-slate-400">Assessment Integrity</div>
            </div>
          </div>
        </div>

        {/* Anti-Cheating Integrity Flag Summary */}
        {quizResult.integrity_flags && quizResult.integrity_flags.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg text-xs space-y-1 text-amber-900">
            <div className="font-bold flex items-center gap-1.5 text-amber-800">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Assessment Integrity Logs ({quizResult.integrity_flags.length} Flagged Item)</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-amber-800">
              {quizResult.integrity_flags.map((flag, idx) => (
                <li key={idx}>{flag}</li>
              ))}
            </ul>
          </div>
        )}

        {/* AI Learning Feedback Box */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>AI Personal Learning Feedback</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded border border-slate-200">
            {quizResult.ai_feedback}
          </p>
        </div>

        {/* Topic Breakdown */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900">Topic-Wise Performance Breakdown</h2>
          <div className="space-y-3">
            {Object.entries(quizResult.topic_breakdown).map(([topic, pct], idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-medium text-slate-800">
                  <span>{topic}</span>
                  <span className={pct >= 70 ? 'text-blue-700 font-bold' : 'text-rose-600 font-bold'}>{pct}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${pct >= 70 ? 'bg-blue-600' : 'bg-rose-500'}`}
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onComplete}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2.5 rounded-lg shadow-sm transition flex items-center justify-center space-x-2 text-sm"
        >
          <span>Return to Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div 
      className="max-w-4xl mx-auto space-y-4 text-left select-none"
      onCopy={(e) => e.preventDefault()}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Integrity Violation Warning Modal/Banner */}
      {showWarning && (
        <div className="bg-amber-500 text-slate-950 px-4 py-3 rounded-lg border border-amber-600 flex items-center justify-between shadow-md text-xs font-semibold">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-slate-950 shrink-0" />
            <span>
              INTEGRITY WARNING: Tab/Window switch detected! (Violation {tabSwitchCount} of 3). Quiz auto-submits after 3 violations.
            </span>
          </div>
          <button 
            onClick={() => setShowWarning(false)}
            className="underline font-bold text-slate-950 ml-4 hover:text-slate-800"
          >
            Acknowledge
          </button>
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 font-mono">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span className="text-xs text-slate-400">| Press 1-4 for options, Enter for next</span>
          </div>
          <h1 className="text-base font-bold text-slate-900">{title}</h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Per Question Timer */}
          <div className="flex items-center space-x-1.5 bg-slate-100 px-3 py-1 rounded border border-slate-200 text-xs font-semibold text-slate-700">
            <span>Q-Timer:</span>
            <span className={questionTimeLeft <= 10 ? 'text-rose-600 font-bold animate-pulse' : 'text-blue-700 font-bold'}>
              {questionTimeLeft}s
            </span>
          </div>

          {/* Total Quiz Timer */}
          <div className="flex items-center space-x-1.5 bg-slate-900 text-white px-3 py-1 rounded border border-slate-800 text-xs font-mono font-bold">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>

      {/* Per Question Timer Bar */}
      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ${questionTimeLeft <= 10 ? 'bg-rose-500' : 'bg-blue-600'}`}
          style={{ width: `${(questionTimeLeft / 45) * 100}%` }}
        ></div>
      </div>

      {/* Current Question Card */}
      {currentQ && (
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-2">
            <div className="inline-block bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded text-xs font-semibold">
              Topic: {currentQ.topic}
            </div>
            <h2 className="text-base font-bold text-slate-900 leading-relaxed">
              {currentQ.text}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {currentQ.options.map((opt, optIdx) => {
              const isSelected = answers[currentIndex.toString()] === opt;
              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(opt)}
                  className={`w-full text-left p-3.5 rounded-lg border transition flex items-center justify-between text-xs font-medium ${
                    isSelected
                      ? 'bg-blue-50 border-blue-600 text-blue-950 font-bold shadow-sm'
                      : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${
                      isSelected ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600 border border-slate-300'
                    }`}>
                      {optIdx + 1}
                    </span>
                    <span>{opt}</span>
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => handleQuestionChange(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <div className="text-xs text-slate-400">
              Tab Switches: <span className={tabSwitchCount > 0 ? 'text-amber-600 font-bold' : 'text-slate-600'}>{tabSwitchCount}/3</span>
            </div>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => handleQuestionChange(Math.min(questions.length - 1, currentIndex + 1))}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition flex items-center gap-1.5"
              >
                <span>Next Question</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => handleSubmit(false)}
                disabled={submitting}
                className="px-5 py-2 rounded-lg text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 transition flex items-center gap-1.5 shadow-sm"
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
