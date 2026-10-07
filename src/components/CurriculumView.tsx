import React, { useState } from 'react';
import { 
  CheckCircle2, 
  HelpCircle, 
  Play, 
  Copy, 
  Check, 
  Code2, 
  Terminal, 
  FileCode, 
  Lightbulb, 
  ArrowLeft, 
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { CURRICULUM_DATA } from '../data/curriculum';
import { Lesson, UserProgress } from '../types';
import { soundFx } from '../services/soundEffects';

interface CurriculumViewProps {
  progress: UserProgress;
  selectedWeek: number;
  setSelectedWeek: (week: number) => void;
  onCompleteLesson: (lessonId: string) => void;
  onOpenQuiz: (weekNum: number) => void;
}

export const CurriculumView: React.FC<CurriculumViewProps> = ({
  progress,
  selectedWeek,
  setSelectedWeek,
  onCompleteLesson,
  onOpenQuiz,
}) => {
  const currentWeekData = CURRICULUM_DATA.find((w) => w.weekNumber === selectedWeek) || CURRICULUM_DATA[0];
  const [selectedLessonId, setSelectedLessonId] = useState<string>(currentWeekData.lessons[0]?.id || '');
  const [copiedCode, setCopiedCode] = useState(false);
  const [liveSandboxCode, setLiveSandboxCode] = useState<string>('');
  const [sandboxOutput, setSandboxOutput] = useState<string | null>(null);

  // Sync selected lesson when week changes
  React.useEffect(() => {
    if (!currentWeekData.lessons.some((l) => l.id === selectedLessonId)) {
      const first = currentWeekData.lessons[0];
      if (first) {
        setSelectedLessonId(first.id);
        setLiveSandboxCode(first.codeSnippet);
        setSandboxOutput(first.outputSimulation || null);
      }
    }
  }, [currentWeekData, selectedLessonId]);

  const currentLesson: Lesson | undefined = currentWeekData.lessons.find((l) => l.id === selectedLessonId) || currentWeekData.lessons[0];

  const handleLessonSelect = (lesson: Lesson) => {
    soundFx.playClick();
    setSelectedLessonId(lesson.id);
    setLiveSandboxCode(lesson.codeSnippet);
    setSandboxOutput(lesson.outputSimulation || null);
  };

  const handleCopy = () => {
    if (!currentLesson) return;
    navigator.clipboard.writeText(currentLesson.codeSnippet);
    setCopiedCode(true);
    soundFx.playClick();
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleRunCode = () => {
    soundFx.playClick();
    if (!currentLesson) return;

    if (currentLesson.language === 'javascript') {
      try {
        // Safe console interception in runner
        const logs: string[] = [];
        const customConsole = {
          log: (...args: unknown[]) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
          warn: (...args: unknown[]) => logs.push(`[WARN] ${args.join(' ')}`),
          error: (...args: unknown[]) => logs.push(`[ERROR] ${args.join(' ')}`),
        };
        const runFn = new Function('console', liveSandboxCode);
        runFn(customConsole);
        setSandboxOutput(logs.length > 0 ? logs.join('\n') : '(Execution finished with no output)');
        soundFx.playSuccess();
      } catch (err: unknown) {
        setSandboxOutput(`Runtime Exception: ${err instanceof Error ? err.message : String(err)}`);
        soundFx.playError();
      }
    } else {
      // Python simulated runner
      setSandboxOutput(`[DevSprint Python/ML Environment Simulated]\n${currentLesson.outputSimulation || 'Code executed successfully with return code 0.'}`);
      soundFx.playSuccess();
    }
  };

  const isLessonCompleted = currentLesson ? progress.completedLessonIds.includes(currentLesson.id) : false;

  return (
    <div className="space-y-8">
      {/* Week Selector Ribbon */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">Select Week (1–8):</span>
          <span className="text-xs text-cyan-400 font-mono">
            Week {selectedWeek} of 8
          </span>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {CURRICULUM_DATA.map((week) => {
            const isSelected = week.weekNumber === selectedWeek;
            const weekLessons = week.lessons.map((l) => l.id);
            const isWeekDone = weekLessons.length > 0 && weekLessons.every((id) => progress.completedLessonIds.includes(id));

            return (
              <button
                key={week.weekNumber}
                onClick={() => {
                  soundFx.playClick();
                  setSelectedWeek(week.weekNumber);
                }}
                className={`flex flex-col items-center justify-center py-2 px-2 rounded-lg border text-xs transition-all ${
                  isSelected
                    ? 'border-cyan-500 bg-cyan-950/40 text-cyan-300 font-bold shadow-md shadow-cyan-950/50 ring-1 ring-cyan-500/50'
                    : isWeekDone
                    ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300 hover:bg-slate-900'
                    : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <span className="font-mono text-sm">W{week.weekNumber}</span>
                <span className="text-[10px] truncate max-w-full text-slate-400 mt-0.5">
                  {isWeekDone ? 'Passed' : `${week.lessons.length} units`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Week Title & Overview Banner */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="text-cyan-400 font-semibold">{currentWeekData.pillarTitle}</span>
            <span aria-hidden="true">·</span>
            <span>Est. {currentWeekData.estimatedHours} Hours</span>
            <span aria-hidden="true">·</span>
            <span className="text-amber-400 font-mono tabular-nums">+{currentWeekData.xpReward} XP Reward</span>
          </div>
          <h2 className="text-2xl font-bold text-white">{currentWeekData.title}</h2>
          <p className="text-xs text-slate-300 max-w-2xl">{currentWeekData.subtitle}</p>
        </div>

        <button
          onClick={() => {
            soundFx.playClick();
            onOpenQuiz(selectedWeek);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-cyan-500/40 bg-cyan-950/40 text-cyan-300 hover:bg-cyan-900/50 text-xs font-bold transition-colors shrink-0"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Launch Week {selectedWeek} Quiz</span>
        </button>
      </div>

      {/* Main Two-Zone Lesson Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Lesson Selector Drawer */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-semibold text-slate-400 px-1">
            Bite-Sized Modules ({currentWeekData.lessons.length})
          </h3>
          <div className="space-y-2">
            {currentWeekData.lessons.map((lesson, idx) => {
              const isSelected = lesson.id === selectedLessonId;
              const isDone = progress.completedLessonIds.includes(lesson.id);

              return (
                <button
                  key={lesson.id}
                  onClick={() => handleLessonSelect(lesson)}
                  className={`w-full text-left p-4 rounded-xl border transition-all space-y-2 ${
                    isSelected
                      ? 'border-cyan-500/60 bg-slate-900 text-white shadow-lg shadow-cyan-950/30'
                      : 'border-slate-800 bg-slate-900/30 text-slate-300 hover:bg-slate-900/70 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-cyan-400">Module 0{idx + 1}</span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-500">
                      {isDone ? (
                        <span className="text-emerald-400 flex items-center gap-1 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Done
                        </span>
                      ) : (
                        <span>{lesson.readTimeMinutes} min</span>
                      )}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-white leading-snug">
                    {lesson.title}
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {lesson.summary}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Lesson Viewer & Live Sandbox */}
        {currentLesson && (
          <div className="lg:col-span-8 rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-semibold text-cyan-400">
                  Week {selectedWeek} Deep Dive
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">
                  {currentLesson.title}
                </h3>
              </div>

              {/* Complete button */}
              <button
                onClick={() => onCompleteLesson(currentLesson.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                  isLessonCompleted
                    ? 'border border-emerald-500/30 bg-emerald-950/30 text-emerald-400 cursor-default'
                    : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-md shadow-cyan-500/20'
                }`}
              >
                {isLessonCompleted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Lesson Completed (+75 XP)</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Mark Complete (+75 XP)</span>
                  </>
                )}
              </button>
            </div>

            {/* Concept Summary */}
            <p className="text-sm text-slate-300 leading-relaxed">
              {currentLesson.summary}
            </p>

            {/* Key Concept Points */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400">Architectural Core Principles:</h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {currentLesson.explanationPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Screening Trap & Interview Tip */}
            <div className="rounded-lg border border-amber-500/30 bg-amber-950/20 p-4 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                <Lightbulb className="w-4 h-4" />
                <span>Internship Screening Tip & Gotcha</span>
              </div>
              <p className="text-xs text-amber-200/90 leading-relaxed">
                {currentLesson.internshipTip}
              </p>
            </div>

            {/* Code Snippet & Live Sandbox */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-mono text-slate-300 uppercase">
                    {currentLesson.language} Code Reference
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-400 hover:text-white rounded border border-slate-800 bg-slate-900 transition-colors"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={handleRunCode}
                    className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded transition-colors shadow-sm"
                  >
                    <Play className="w-3.5 h-3.5 fill-slate-950" />
                    <span>Run Sandbox</span>
                  </button>
                </div>
              </div>

              {/* Editable Code Editor */}
              <div className="rounded-lg border border-slate-800 bg-slate-950 overflow-hidden">
                <textarea
                  value={liveSandboxCode}
                  onChange={(e) => setLiveSandboxCode(e.target.value)}
                  rows={10}
                  className="w-full bg-transparent p-4 font-mono text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500/40 resize-y"
                  spellCheck={false}
                />
              </div>

              {/* Sandbox Live Output or HTML Live Preview */}
              {currentLesson.language === 'html' ? (
                <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                    <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Live Rendered HTML/DOM Canvas:</span>
                  </div>
                  <div 
                    className="rounded border border-slate-800 bg-slate-900/60 p-4"
                    dangerouslySetInnerHTML={{ __html: liveSandboxCode }}
                  />
                </div>
              ) : sandboxOutput ? (
                <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Runtime Execution Trace & Console Output:</span>
                  </div>
                  <pre className="font-mono text-xs text-cyan-300 whitespace-pre-wrap leading-relaxed">
                    {sandboxOutput}
                  </pre>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
