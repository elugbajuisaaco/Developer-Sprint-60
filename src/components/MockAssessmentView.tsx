import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Flag, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Award, 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft,
  BookOpen,
  Sparkles,
  BarChart2
} from 'lucide-react';
import { MOCK_ASSESSMENT_QUESTIONS } from '../data/mockAssessmentQuestions';
import { QuizQuestion, PillarId, UserProgress } from '../types';
import { soundFx } from '../services/soundEffects';

interface MockAssessmentViewProps {
  progress: UserProgress;
  onRecordAssessment: (
    score: number,
    totalQuestions: number,
    durationSeconds: number,
    breakdown: Record<PillarId, { correct: number; total: number }>
  ) => void;
  onNavigateToWeek: (weekNum: number) => void;
}

export const MockAssessmentView: React.FC<MockAssessmentViewProps> = ({
  progress,
  onRecordAssessment,
  onNavigateToWeek,
}) => {
  // Test states: 'intro' | 'active' | 'review'
  const [examState, setExamState] = useState<'intro' | 'active' | 'results'>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [flaggedIndices, setFlaggedIndices] = useState<Set<number>>(new Set());
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(15 * 60); // 15 mins
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [lastExamResult, setLastExamResult] = useState<{
    score: number;
    total: number;
    passed: boolean;
    duration: number;
    breakdown: Record<PillarId, { correct: number; total: number }>;
  } | null>(null);

  const [reviewMode, setReviewMode] = useState(false);

  // Timer effect
  useEffect(() => {
    if (examState !== 'active') return;

    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishExam();
          return 0;
        }
        if (prev === 180) {
          // 3 min warning
          soundFx.playError();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examState]);

  const questions: QuizQuestion[] = MOCK_ASSESSMENT_QUESTIONS;
  const currentQ = questions[currentIndex] || questions[0];

  const handleStartExam = () => {
    soundFx.playClick();
    setSelectedAnswers({});
    setFlaggedIndices(new Set());
    setTimeLeftSeconds(15 * 60);
    setCurrentIndex(0);
    setExamState('active');
    setReviewMode(false);
  };

  const handleOptionSelect = (optionIdx: number) => {
    if (reviewMode) return;
    soundFx.playClick();
    setSelectedAnswers({
      ...selectedAnswers,
      [currentIndex]: optionIdx,
    });
  };

  const handleToggleFlag = () => {
    soundFx.playClick();
    const updated = new Set(flaggedIndices);
    if (updated.has(currentIndex)) {
      updated.delete(currentIndex);
    } else {
      updated.add(currentIndex);
    }
    setFlaggedIndices(updated);
  };

  const handleFinishExam = () => {
    setShowSubmitConfirm(false);
    let correctCount = 0;
    const breakdown: Record<PillarId, { correct: number; total: number }> = {
      'web-foundations': { correct: 0, total: 0 },
      'js-async': { correct: 0, total: 0 },
      'python-backend': { correct: 0, total: 0 },
      'ml-ai': { correct: 0, total: 0 },
    };

    questions.forEach((q, idx) => {
      breakdown[q.pillarId].total += 1;
      if (selectedAnswers[idx] === q.correctOptionIndex) {
        correctCount++;
        breakdown[q.pillarId].correct += 1;
      }
    });

    const passed = (correctCount / questions.length) >= 0.7;
    const durationUsed = 15 * 60 - timeLeftSeconds;

    const result = {
      score: correctCount,
      total: questions.length,
      passed,
      duration: durationUsed,
      breakdown,
    };

    setLastExamResult(result);
    setExamState('results');
    onRecordAssessment(correctCount, questions.length, durationUsed, breakdown);
  };

  // Format MM:SS
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate percentile
  const getPercentile = (scoreRatio: number) => {
    if (scoreRatio >= 0.9) return '96th percentile';
    if (scoreRatio >= 0.8) return '88th percentile';
    if (scoreRatio >= 0.7) return '76th percentile';
    if (scoreRatio >= 0.6) return '58th percentile';
    return '42nd percentile';
  };

  return (
    <div className="space-y-8">
      {/* INTRO SCREEN */}
      {examState === 'intro' && (
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 md:p-10 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
                <span>Internship Screening Simulation</span>
                <span aria-hidden="true">·</span>
                <span>Timed Assessment Engine</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Technical Internship Assessment Readiness Test
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                This comprehensive evaluation mirrors live online screening assessments (HackerRank, Triplebyte, Karat) used by leading engineering organizations.
              </p>
            </div>

            {/* Test Specifications */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-1">
                <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span>Time Limit</span>
                </div>
                <div className="text-xl font-bold font-mono text-white">15 Minutes</div>
                <div className="text-[11px] text-slate-500">Strict countdown</div>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-1">
                <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>Passing Bar</span>
                </div>
                <div className="text-xl font-bold font-mono text-white">70% Required</div>
                <div className="text-[11px] text-slate-500">9 of 12 questions</div>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-1">
                <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-purple-400" />
                  <span>Syllabus Scope</span>
                </div>
                <div className="text-xl font-bold font-mono text-white">All 4 Pillars</div>
                <div className="text-[11px] text-slate-500">HTML/CSS, JS, Python, ML</div>
              </div>
            </div>

            {/* Assessment Rules */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 space-y-2 text-xs text-slate-300">
              <div className="font-bold text-white">Exam Guidelines & Protocols:</div>
              <ul className="space-y-1.5 list-disc list-inside text-slate-400">
                <li>Questions cover real interview gotchas, algorithmic complexity, event loop order, and ML metrics.</li>
                <li>You can flag difficult questions and freely jump between questions using the question matrix.</li>
                <li>Exiting or refreshing preserves your timer countdown. Detailed diagnostic answers unlocked upon submission.</li>
              </ul>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleStartExam}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-sm transition-colors shadow-lg shadow-cyan-400/20"
              >
                <span>Start Timed Assessment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Past History */}
          {progress.mockAssessmentHistory.length > 0 && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-3">
              <h3 className="text-sm font-bold text-white">Previous Assessment Attempts</h3>
              <div className="space-y-2">
                {progress.mockAssessmentHistory.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-slate-800 bg-slate-950/50 text-xs"
                  >
                    <div>
                      <div className="font-semibold text-white">{m.date}</div>
                      <div className="text-slate-500">{formatTime(m.durationSeconds)} duration used</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold tabular-nums text-white">
                        {Math.round((m.score / m.totalQuestions) * 100)}% ({m.score}/{m.totalQuestions})
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${m.passed ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'}`}>
                        {m.passed ? 'PASSED' : 'FAILED'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ACTIVE TEST OR SOLUTION REVIEW SCREEN */}
      {(examState === 'active' || (examState === 'results' && reviewMode)) && (
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Exam Header HUD */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 flex flex-wrap items-center justify-between gap-4 sticky top-16 z-20 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wide">
                {reviewMode ? 'Solution Review Mode' : 'Internship Screening Exam'}
              </span>
              <span className="text-slate-600" aria-hidden="true">·</span>
              <span className="text-xs text-slate-300 font-mono">
                Q {currentIndex + 1} of {questions.length}
              </span>
            </div>

            {/* Timer or Review Return */}
            <div className="flex items-center gap-4">
              {!reviewMode ? (
                <>
                  <div
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-xs font-bold tabular-nums ${
                      timeLeftSeconds < 180
                        ? 'border-rose-500/60 bg-rose-950/50 text-rose-300 animate-pulse'
                        : 'border-slate-800 bg-slate-950 text-cyan-300'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatTime(timeLeftSeconds)}</span>
                  </div>

                  <button
                    onClick={() => setShowSubmitConfirm(true)}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors"
                  >
                    Submit Exam
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setReviewMode(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 text-xs font-semibold hover:text-white transition-colors"
                >
                  Back to Diagnostic Report
                </button>
              )}
            </div>
          </div>

          {/* Question Palette Matrix */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Question Palette Navigator:</span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-cyan-500/30 border border-cyan-500" /> Answered
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-amber-500/30 border border-amber-500" /> Flagged
                </span>
              </div>
            </div>

            <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentIndex;
                const isAnswered = selectedAnswers[idx] !== undefined;
                const isFlagged = flaggedIndices.has(idx);

                let btnClass = 'border-slate-800 bg-slate-950 text-slate-400';
                if (isCurrent) {
                  btnClass = 'border-cyan-400 bg-cyan-950/80 text-cyan-200 font-bold ring-2 ring-cyan-400/50';
                } else if (isFlagged) {
                  btnClass = 'border-amber-500/60 bg-amber-950/40 text-amber-300';
                } else if (isAnswered) {
                  btnClass = 'border-cyan-600/40 bg-cyan-950/30 text-cyan-300 font-medium';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      soundFx.playClick();
                      setCurrentIndex(idx);
                    }}
                    className={`py-1.5 rounded text-xs font-mono transition-all ${btnClass}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Active Question Card */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                Domain: {currentQ.pillarId.replace('-', ' ')}
              </span>

              {!reviewMode && (
                <button
                  onClick={handleToggleFlag}
                  className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded-lg border transition-colors ${
                    flaggedIndices.has(currentIndex)
                      ? 'border-amber-500/60 bg-amber-950/40 text-amber-300'
                      : 'border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>{flaggedIndices.has(currentIndex) ? 'Flagged for Review' : 'Flag Question'}</span>
                </button>
              )}
            </div>

            {/* Question Text */}
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-white leading-relaxed">
                {currentQ.question}
              </h3>

              {currentQ.codeSnippet && (
                <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-cyan-300 whitespace-pre-wrap leading-relaxed">
                  {currentQ.codeSnippet}
                </div>
              )}
            </div>

            {/* Options */}
            <div className="space-y-2.5">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedAnswers[currentIndex] === idx;
                const isCorrect = idx === currentQ.correctOptionIndex;

                let optClass = 'border-slate-800 bg-slate-950/50 text-slate-300 hover:border-slate-700 hover:bg-slate-850';

                if (reviewMode) {
                  if (isCorrect) {
                    optClass = 'border-emerald-500 bg-emerald-950/40 text-emerald-200 font-medium';
                  } else if (isSelected && !isCorrect) {
                    optClass = 'border-rose-500 bg-rose-950/40 text-rose-200';
                  } else {
                    optClass = 'border-slate-800 bg-slate-950/20 text-slate-600 opacity-60';
                  }
                } else if (isSelected) {
                  optClass = 'border-cyan-500 bg-cyan-950/40 text-cyan-200 ring-1 ring-cyan-500/50';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionSelect(idx)}
                    disabled={reviewMode}
                    className={`w-full text-left p-4 rounded-xl border text-xs leading-relaxed transition-all flex items-start gap-3 ${optClass}`}
                  >
                    <span className="font-mono font-bold text-slate-400 shrink-0">
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    <span className="flex-1">{opt}</span>
                    {reviewMode && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    )}
                    {reviewMode && isSelected && !isCorrect && (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Review Explanation */}
            {reviewMode && (
              <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-2 text-xs">
                <div className="font-bold text-cyan-400">Mentor Diagnostic Breakdown:</div>
                <p className="text-slate-300 leading-relaxed">
                  {currentQ.explanation}
                </p>
                {currentQ.distractorNotes && (
                  <p className="text-slate-400 text-[11px] pt-1">
                    Trap Analysis: {currentQ.distractorNotes}
                  </p>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  soundFx.playClick();
                  setCurrentIndex((prev) => Math.max(0, prev - 1));
                }}
                disabled={currentIndex === 0}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white disabled:opacity-30 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <button
                onClick={() => {
                  soundFx.playClick();
                  if (currentIndex < questions.length - 1) {
                    setCurrentIndex(currentIndex + 1);
                  } else if (!reviewMode) {
                    setShowSubmitConfirm(true);
                  }
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-bold transition-colors"
              >
                <span>{currentIndex < questions.length - 1 ? 'Next' : (reviewMode ? 'Finish Review' : 'Review & Submit')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESULTS & DIAGNOSTIC REPORT SCREEN */}
      {examState === 'results' && !reviewMode && lastExamResult && (
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 md:p-10 space-y-8">
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center border ${
                  lastExamResult.passed ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-400' : 'border-rose-500/40 bg-rose-950/40 text-rose-400'
                }`}>
                  <Award className="w-8 h-8" />
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {lastExamResult.passed ? 'Internship Screening Passed!' : 'Assessment Under Threshold'}
              </h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                {lastExamResult.passed
                  ? 'Congratulations! You met the technical screening benchmark required for tech internship offers.'
                  : 'You are close, but need more targeted review on weak topics before real interviews.'}
              </p>
            </div>

            {/* Score & Percentile Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 text-center space-y-1">
                <div className="text-xs text-slate-400 font-semibold">Total Score</div>
                <div className="text-3xl font-extrabold font-mono text-cyan-400 tabular-nums">
                  {Math.round((lastExamResult.score / lastExamResult.total) * 100)}%
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  {lastExamResult.score} of {lastExamResult.total} questions
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 text-center space-y-1">
                <div className="text-xs text-slate-400 font-semibold">Applicant Ranking</div>
                <div className="text-xl font-bold font-mono text-white">
                  {getPercentile(lastExamResult.score / lastExamResult.total)}
                </div>
                <div className="text-[11px] text-slate-500">Based on candidate norm</div>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 text-center space-y-1">
                <div className="text-xs text-slate-400 font-semibold">Duration Used</div>
                <div className="text-xl font-bold font-mono text-white">
                  {formatTime(lastExamResult.duration)}
                </div>
                <div className="text-[11px] text-slate-500">of 15:00 limit</div>
              </div>
            </div>

            {/* Domain Breakdown */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <BarChart2 className="w-4 h-4 text-cyan-400" />
                <span>Performance Breakdown by Curriculum Pillar:</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(Object.entries(lastExamResult.breakdown) as [PillarId, { correct: number; total: number }][]).map(([pillar, stat]) => {
                  const pct = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
                  const labelMap: Record<PillarId, string> = {
                    'web-foundations': 'Web Foundations (HTML/CSS)',
                    'js-async': 'Core JS & Async Event Loop',
                    'python-backend': 'Python & REST Backend',
                    'ml-ai': 'Machine Learning & AI',
                  };

                  return (
                    <div key={pillar} className="p-3.5 rounded-lg border border-slate-800 bg-slate-950/40 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-white">{labelMap[pillar]}</span>
                        <span className="font-mono tabular-nums text-slate-400">{stat.correct}/{stat.total}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${pct >= 70 ? 'bg-emerald-400' : 'bg-amber-400'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Next Steps & Action CTAs */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  soundFx.playClick();
                  setReviewMode(true);
                  setCurrentIndex(0);
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-cyan-500/40 bg-cyan-950/30 text-cyan-300 text-xs font-bold hover:bg-cyan-900/40 transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                <span>Review Question Explanations</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleStartExam}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-800 bg-slate-850 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retake Exam</span>
                </button>
                <button
                  onClick={() => setExamState('intro')}
                  className="px-5 py-2.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-bold transition-colors shadow-sm"
                >
                  Return to Exam Center
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showSubmitConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs"
        >
          <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-amber-400 text-sm font-bold">
              <AlertTriangle className="w-5 h-5" />
              <span>Confirm Exam Submission</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              You have answered {Object.keys(selectedAnswers).length} of {questions.length} questions.
              {Object.keys(selectedAnswers).length < questions.length && (
                <span className="block text-amber-300 font-semibold mt-1">
                  Warning: You still have {questions.length - Object.keys(selectedAnswers).length} unanswered question(s).
                </span>
              )}
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white rounded-lg border border-slate-800"
              >
                Keep Working
              </button>
              <button
                onClick={handleFinishExam}
                className="px-4 py-2 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg shadow-sm"
              >
                Yes, Submit Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
