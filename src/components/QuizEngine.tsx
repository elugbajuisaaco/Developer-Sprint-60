import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  HelpCircle, 
  RotateCcw, 
  Award,
  Sparkles
} from 'lucide-react';
import { CURRICULUM_DATA } from '../data/curriculum';
import { QuizQuestion } from '../types';
import { soundFx } from '../services/soundEffects';

interface QuizEngineProps {
  weekNumber: number;
  onClose: () => void;
  onRecordScore: (quizId: string, scorePercent: number, totalQuestions: number) => void;
  onAdvanceWeek?: (nextWeek: number) => void;
}

export const QuizEngine: React.FC<QuizEngineProps> = ({
  weekNumber,
  onClose,
  onRecordScore,
  onAdvanceWeek,
}) => {
  const weekData = CURRICULUM_DATA.find((w) => w.weekNumber === weekNumber) || CURRICULUM_DATA[0];
  const questions: QuizQuestion[] = weekData.quiz;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isFinished, setIsFinished] = useState(false);

  const currentQ: QuizQuestion = questions[currentIndex] || questions[0];
  const quizId = `quiz-w${weekNumber}`;

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    soundFx.playClick();
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswerSubmitted) return;

    setIsAnswerSubmitted(true);
    const updatedAnswers = { ...answers, [currentIndex]: selectedOption };
    setAnswers(updatedAnswers);

    const isCorrect = selectedOption === currentQ.correctOptionIndex;
    if (isCorrect) {
      soundFx.playSuccess();
    } else {
      soundFx.playError();
    }
  };

  const handleNext = () => {
    soundFx.playClick();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(answers[currentIndex + 1] ?? null);
      setIsAnswerSubmitted(false);
    } else {
      // Calculate final score
      let correctCount = 0;
      questions.forEach((q, idx) => {
        if (answers[idx] === q.correctOptionIndex) {
          correctCount++;
        }
      });
      const scorePct = Math.round((correctCount / questions.length) * 100);
      setIsFinished(true);
      onRecordScore(quizId, scorePct, questions.length);
    }
  };

  const handleRetake = () => {
    soundFx.playClick();
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setAnswers({});
    setIsFinished(false);
  };

  // Score summary
  const totalCorrect = questions.filter((q, idx) => answers[idx] === q.correctOptionIndex).length;
  const finalPercentage = questions.length > 0 ? Math.round((totalCorrect / questions.length) * 100) : 0;

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="quiz-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8 shadow-2xl space-y-6">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
              <span>Week {weekNumber} Gate Assessment</span>
              <span aria-hidden="true">·</span>
              <span>Passing Bar: 70% to Unlock Week {weekNumber + 1}</span>
            </div>
            <h3 id="quiz-modal-title" className="text-xl font-bold text-white mt-0.5">
              Technical Screening Gate Test
            </h3>
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg border border-slate-800 bg-slate-800/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Finished State */}
        {isFinished ? (
          <div className="text-center py-6 space-y-5">
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center border ${
              finalPercentage >= 70 ? 'border-emerald-500/40 bg-emerald-950/60 text-emerald-400' : 'border-rose-500/40 bg-rose-950/60 text-rose-400'
            }`}>
              <Award className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-2xl font-bold text-white">
                {finalPercentage >= 70 ? `Gate Cleared! Week ${weekNumber + 1} Unlocked` : 'Under 70% Passing Threshold'}
              </h4>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
                {finalPercentage >= 70
                  ? `Congratulations! You scored ${finalPercentage}%, clearing the internship screening gate required to advance.`
                  : `You scored ${finalPercentage}%. You need at least 70% to unlock Week ${weekNumber + 1}. Review the explanations and retake to advance.`}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5 max-w-sm mx-auto space-y-2">
              <div className={`text-4xl font-extrabold font-mono tabular-nums ${
                finalPercentage >= 70 ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {finalPercentage}%
              </div>
              <div className="text-xs text-slate-400">
                {totalCorrect} of {questions.length} questions answered correctly
              </div>
              <div className="pt-2 text-xs font-semibold text-amber-400">
                +{Math.round((finalPercentage / 100) * 150)} XP Earned
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button
                onClick={handleRetake}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-lg border border-slate-800 bg-slate-800/60 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Retake Gate Test
              </button>

              {finalPercentage >= 70 && weekNumber < 8 && onAdvanceWeek && (
                <button
                  onClick={() => {
                    onAdvanceWeek(weekNumber + 1);
                    onClose();
                  }}
                  className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors shadow-md"
                >
                  <span>Advance to Week {weekNumber + 1}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={onClose}
                className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors shadow-md"
              >
                <span>Return to Lessons</span>
              </button>
            </div>
          </div>
        ) : (
          /* Active Question State */
          <div className="space-y-6">
            {/* Progress indicator */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-400 font-mono">
                <span>Question {currentIndex + 1} of {questions.length}</span>
                <span>Difficulty: {currentQ.difficulty}</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-cyan-400 transition-all duration-300 rounded-full"
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Text */}
            <div className="space-y-3">
              <div className="text-base font-semibold text-white leading-relaxed">
                {currentQ.question}
              </div>

              {currentQ.codeSnippet && (
                <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-cyan-300 whitespace-pre-wrap">
                  {currentQ.codeSnippet}
                </div>
              )}
            </div>

            {/* Options List */}
            <div className="space-y-2.5">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQ.correctOptionIndex;

                let optionStyle = 'border-slate-800 bg-slate-950/40 text-slate-300 hover:bg-slate-800/60 hover:border-slate-700';

                if (isAnswerSubmitted) {
                  if (isCorrect) {
                    optionStyle = 'border-emerald-500/60 bg-emerald-950/40 text-emerald-200';
                  } else if (isSelected && !isCorrect) {
                    optionStyle = 'border-rose-500/60 bg-rose-950/40 text-rose-200';
                  } else {
                    optionStyle = 'border-slate-800/40 bg-slate-950/20 text-slate-600 opacity-60';
                  }
                } else if (isSelected) {
                  optionStyle = 'border-cyan-500 bg-cyan-950/40 text-cyan-200 ring-1 ring-cyan-500/50';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswerSubmitted}
                    className={`w-full text-left p-4 rounded-xl border text-xs leading-relaxed transition-all flex items-start gap-3 ${optionStyle}`}
                  >
                    <span className="font-mono font-bold text-slate-400 shrink-0">
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    <span className="flex-1">{option}</span>
                    {isAnswerSubmitted && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    )}
                    {isAnswerSubmitted && isSelected && !isCorrect && (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Detailed Explanation Reveal */}
            {isAnswerSubmitted && (
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-cyan-400">
                  <HelpCircle className="w-4 h-4" />
                  <span>Mentor Explanation:</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {currentQ.explanation}
                </p>
                {currentQ.screeningContext && (
                  <div className="pt-1 text-[11px] text-amber-400/90 font-medium">
                    Screening Context: {currentQ.screeningContext}
                  </div>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex justify-end gap-3 pt-2">
              {!isAnswerSubmitted ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={selectedOption === null}
                  className="px-5 py-2.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-bold transition-colors disabled:opacity-40"
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-bold transition-colors shadow-sm"
                >
                  <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'View Results'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
