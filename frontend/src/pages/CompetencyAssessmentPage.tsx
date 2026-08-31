import React, { useState } from 'react';
import { Award, CheckCircle2, ArrowRight, BrainCircuit, Sparkles } from 'lucide-react';
import { User, Question } from '../types';
import { assessmentService } from '../services/api';

interface CompetencyAssessmentPageProps {
  user: User;
  onNavigate: (view: string) => void;
}

export const CompetencyAssessmentPage: React.FC<CompetencyAssessmentPageProps> = ({ user, onNavigate }) => {
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [resultScore, setResultScore] = useState<any>(null);

  const sampleQuestions: Question[] = [
    {
      text: "Which sampling methodology is most effective to ensure representative estimates across heterogeneous state and district sub-groups?",
      options: ["A. Cluster Sampling", "B. Stratified Multi-Stage Sampling", "C. Convenience Sampling", "D. Systematic Sampling"],
      correct_answer: "B. Stratified Multi-Stage Sampling",
      explanation: "Stratified multi-stage sampling is standard in NSS surveys to guarantee representation across diverse strata.",
      topic: "Statistical Methods",
      difficulty: "Medium"
    },
    {
      text: "In Python data analysis, which method is used to remove missing values from a pandas DataFrame?",
      options: ["A. df.dropna()", "B. df.clean()", "C. bg.remove_null()", "D. df.strip()"],
      correct_answer: "A. df.dropna()",
      explanation: "df.dropna() drops null or missing values from a pandas DataFrame.",
      topic: "Python Data Science",
      difficulty: "Medium"
    },
    {
      text: "Under India's Digital Personal Data Protection (DPDP) Act 2023, what technique must be applied before releasing statistical microdata to the public?",
      options: ["A. Data Compression", "B. Microdata Anonymization & Masking", "C. Data Duplication", "D. Format Conversion"],
      correct_answer: "B. Microdata Anonymization & Masking",
      explanation: "Microdata anonymization prevents re-identification of individual respondents.",
      topic: "Data Privacy",
      difficulty: "Medium"
    },
    {
      text: "What is the primary benefit of MeghRaj Government Cloud hosting for MoSPI survey databases?",
      options: ["A. Sovereign data protection and scalable automated ETL pipelines", "B. Removing all database passwords", "C. Eliminating the need for data validation", "D. Automatic generation of survey questionnaires"],
      correct_answer: "A. Sovereign data protection and scalable automated ETL pipelines",
      explanation: "Government cloud provides secure scalable compute for high-volume survey pipelines.",
      topic: "Cloud Computing",
      difficulty: "Medium"
    }
  ];

  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});

  const handleSelectOption = (qIdx: number, opt: string) => {
    setUserAnswers(prev => ({ ...prev, [qIdx.toString()]: opt }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await assessmentService.submitQuiz(
        "Diagnostic Competency Assessment",
        sampleQuestions,
        userAnswers,
        user.email
      );
      setResultScore(res);
      setCompleted(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (completed && resultScore) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 text-left">
        <div className="bg-slate-900 text-white p-8 rounded-2xl border border-slate-800 shadow-xl text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto text-2xl font-bold">
            <Award className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-white">Competency Assessment Completed!</h1>
          <p className="text-xs text-slate-400">Your answers have been evaluated and your competency profile has been updated.</p>

          <div className="inline-flex items-center space-x-6 bg-slate-800 p-4 rounded-xl border border-slate-700">
            <div>
              <div className="text-3xl font-black text-emerald-400">{resultScore.score} / {resultScore.max_score}</div>
              <div className="text-xs text-slate-400">Score ({resultScore.percentage}%)</div>
            </div>
            <div className="border-l border-slate-700 h-10"></div>
            <div>
              <div className="text-2xl font-bold text-amber-400">{resultScore.updated_overall_competency}%</div>
              <div className="text-xs text-slate-400">Updated Overall Competency</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center space-x-2 text-amber-700 font-bold text-sm">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>AI Feedback & Updated Roadmap</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
            {resultScore.ai_feedback}
          </p>
        </div>

        <button
          onClick={() => onNavigate('dashboard')}
          className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center justify-center space-x-2 text-sm"
        >
          <span>Return to Dashboard & View Updated Profile</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-left">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
        <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded uppercase tracking-wide">
          Diagnostic Skill Assessment
        </span>
        <h1 className="text-xl font-bold text-slate-900">Official Statistical System Competency Questionnaire</h1>
        <p className="text-xs text-slate-600">Answer these domain diagnostic questions to evaluate and update your competency profile.</p>
      </div>

      <div className="space-y-6">
        {sampleQuestions.map((q, qIdx) => (
          <div key={qIdx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <span className="font-bold text-sm text-slate-900">Q{qIdx + 1}. {q.text}</span>
              <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-mono shrink-0 ml-2">{q.topic}</span>
            </div>

            <div className="space-y-2">
              {q.options.map((opt, optIdx) => {
                const isSelected = userAnswers[qIdx.toString()] === opt;
                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(qIdx, opt)}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-amber-50 border-amber-500 text-amber-950 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <span>{opt}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-xl shadow-lg shadow-amber-500/20 transition text-sm flex items-center justify-center space-x-2"
      >
        <span>{submitting ? 'Evaluating Assessment...' : 'Submit Diagnostic Assessment'}</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
