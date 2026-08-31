import React, { useState } from 'react';
import { FileQuestion, Upload, FileText, Sparkles, Settings2, Play, CheckCircle2, AlertCircle } from 'lucide-react';
import { User, Question, MCQGenResponse } from '../types';
import { assessmentService } from '../services/api';

interface McqGeneratorPageProps {
  user: User;
  onStartQuiz: (title: string, questions: Question[]) => void;
}

export const McqGeneratorPage: React.FC<McqGeneratorPageProps> = ({ user, onStartQuiz }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileUploadInfo, setFileUploadInfo] = useState<any>(null);
  const [textContent, setTextContent] = useState<string>(
    "Stratified sampling divides a population into homogeneous subgroups called strata. Independent random samples are then drawn from each stratum to ensure proportional representation and minimize sampling variance across MoSPI survey operations."
  );
  const [numQuestions, setNumQuestions] = useState<number>(10);
  const [difficulty, setDifficulty] = useState<string>('Medium');
  const [generating, setGenerating] = useState<boolean>(false);
  const [mcqResult, setMcqResult] = useState<MCQGenResponse | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      try {
        const res = await assessmentService.uploadMaterial(file, user.email);
        setFileUploadInfo(res);
        if (res.text_preview) {
          setTextContent(res.text_preview);
        }
      } catch (err) {
        console.error('Error uploading file:', err);
      }
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const result = await assessmentService.generateMCQs(textContent, numQuestions, difficulty);
      setMcqResult(result);
    } catch (err) {
      console.error('Error generating MCQs:', err);
    } finally {
      setGenerating(false);
    }
  };

  const sampleMaterials = [
    { title: "National Sample Survey Sampling Methodology", text: "Stratified multi-stage sampling is used in National Sample Surveys. First stage units are rural villages and urban frame survey blocks. Second stage units are households selected from listing schedules." },
    { title: "Digital Personal Data Protection Act 2023 Guidelines", text: "Data Fiduciaries must implement organizational security measures, notice requirements, and microdata masking before processing or releasing statistical datasets." },
    { title: "Python & Cloud Computing for Statistical Automation", text: "Automating ETL data pipelines using Python Pandas and hosted on MeghRaj Government Cloud enables real-time statistical reporting and API dissemination." }
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-amber-500/20 text-amber-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-amber-500/30">
              AI Assessment Generator
            </span>
            <span className="text-xs text-slate-400 font-mono">• Document Processing Pipeline</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Automatic Quiz & MCQ Generator</h1>
          <p className="text-xs text-slate-300">
            Upload PDF, DOCX, PPTX, or TXT learning materials to generate structured multiple-choice questions with instant AI explanations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Upload & Configuration */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Upload Area */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Upload className="w-5 h-5 text-amber-500" />
              <span>1. Upload Learning Material</span>
            </h2>

            <div className="border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-2xl p-6 text-center bg-slate-50 transition cursor-pointer relative">
              <input
                type="file"
                accept=".pdf,.docx,.pptx,.txt"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <FileText className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <div className="text-xs font-bold text-slate-800">
                {selectedFile ? selectedFile.name : 'Click or Drag PDF, DOCX, PPTX, TXT file here'}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Maximum file size: 25 MB</p>
            </div>

            {fileUploadInfo && (
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
                <span>Extracted {fileUploadInfo.char_count} chars ({fileUploadInfo.file_type})</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
            )}

            {/* Quick Sample Selector */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">
                Or Select Sample Statistical Material:
              </label>
              <div className="space-y-1.5">
                {sampleMaterials.map((sm, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setFileUploadInfo(null);
                      setTextContent(sm.text);
                    }}
                    className="w-full text-left bg-slate-100 hover:bg-amber-50 p-2.5 rounded-lg border border-slate-200 hover:border-amber-300 text-xs font-medium text-slate-800 transition line-clamp-1"
                  >
                    📄 {sm.title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-amber-500" />
              <span>2. Assessment Parameters</span>
            </h2>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Number of Questions</label>
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 15, 20].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setNumQuestions(num)}
                    className={`py-2 rounded-lg text-xs font-bold transition ${
                      numQuestions === num
                        ? 'bg-amber-500 text-slate-950 shadow'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {num} Qs
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Difficulty Level</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
                <option value="Mixed">Mixed</option>
              </select>
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating || !textContent}
              className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold py-3 rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center justify-center space-x-2 text-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>{generating ? 'Generating MCQs via AI...' : 'Generate AI Assessment'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Generated MCQs Preview & Quiz Launch */}
        <div className="lg:col-span-7 space-y-6">
          {mcqResult ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Generated Assessment Preview</h2>
                  <p className="text-xs text-slate-500">{mcqResult.questions.length} Questions Generated • {difficulty} Difficulty</p>
                </div>

                <button
                  onClick={() => onStartQuiz("Generated Material Quiz", mcqResult.questions)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 text-sm shrink-0"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Start Interactive Test</span>
                </button>
              </div>

              {/* Summary & Topics */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="font-bold text-slate-900">Detected Material Summary:</div>
                <p className="text-slate-600 leading-relaxed">{mcqResult.topic_summary}</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {mcqResult.detected_topics.map((t, idx) => (
                    <span key={idx} className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded text-[10px] font-bold">
                      # {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {mcqResult.questions.map((q, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-start justify-between">
                      <span className="font-bold text-xs text-slate-900">Q{idx + 1}. {q.text}</span>
                      <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-[10px] font-mono shrink-0 ml-2">{q.topic}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs pt-1">
                      {q.options.map((opt, optIdx) => (
                        <div
                          key={optIdx}
                          className={`p-2 rounded border text-[11px] ${
                            opt === q.correct_answer || opt[0] === q.correct_answer[0]
                              ? 'bg-emerald-50 border-emerald-300 font-semibold text-emerald-900'
                              : 'bg-white border-slate-200 text-slate-700'
                          }`}
                        >
                          {opt}
                        </div>
                      ))}
                    </div>

                    <div className="text-[11px] text-slate-500 pt-1 italic bg-white p-2 rounded border border-slate-100">
                      💡 <strong>Explanation:</strong> {q.explanation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm text-center space-y-4 flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto border border-amber-200">
                <FileQuestion className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No Assessment Generated Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm">
                Upload a statistical document or select sample material on the left, then click "Generate AI Assessment" to preview MCQs and launch interactive tests.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
