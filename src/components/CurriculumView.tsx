import React, { useState, useMemo } from 'react';
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
  BookOpen,
  ListChecks,
  Sparkles,
  Layers,
  Lock,
  Unlock,
  ShieldAlert,
  Award
} from 'lucide-react';
import { CURRICULUM_DATA } from '../data/curriculum';
import { LEARNING_PATH_SYLLABUS } from '../data/learningPathSyllabus';
import { Lesson, UserProgress, SyllabusItem } from '../types';
import { soundFx } from '../services/soundEffects';

interface CurriculumViewProps {
  progress: UserProgress;
  selectedWeek: number;
  setSelectedWeek: (week: number) => void;
  onCompleteLesson: (lessonId: string) => void;
  onToggleSyllabusItem?: (itemId: string) => void;
  onOpenQuiz: (weekNum: number) => void;
  isWeekUnlocked: (weekNum: number) => boolean;
  auditMode: boolean;
  onToggleAuditMode: () => void;
}

export const CurriculumView: React.FC<CurriculumViewProps> = ({
  progress,
  selectedWeek,
  setSelectedWeek,
  onCompleteLesson,
  onToggleSyllabusItem,
  onOpenQuiz,
  isWeekUnlocked,
  auditMode,
  onToggleAuditMode,
}) => {
  const currentWeekData = CURRICULUM_DATA.find((w) => w.weekNumber === selectedWeek) || CURRICULUM_DATA[0];
  const [selectedLessonId, setSelectedLessonId] = useState<string>(currentWeekData.lessons[0]?.id || '');
  const [copiedCode, setCopiedCode] = useState(false);
  const [liveSandboxCode, setLiveSandboxCode] = useState<string>('');
  const [sandboxOutput, setSandboxOutput] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'interactive' | 'syllabus-items'>('interactive');

  // Collect all learning path items mapped to this week
  const weekSyllabusItems = useMemo(() => {
    const list: { moduleTitle: string; moduleNumber: number; item: SyllabusItem }[] = [];
    LEARNING_PATH_SYLLABUS.forEach((part) => {
      part.modules.forEach((mod) => {
        if (mod.weeksMapped.includes(selectedWeek)) {
          mod.items.forEach((item) => {
            if (item.weekNumber === selectedWeek) {
              list.push({
                moduleTitle: mod.title,
                moduleNumber: mod.moduleNumber,
                item,
              });
            }
          });
        }
      });
    });
    return list;
  }, [selectedWeek]);

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
    setActiveSubTab('interactive');
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
      setSandboxOutput(`[DevSprint Python/ML Environment Trace]\n${currentLesson.outputSimulation || 'Program compiled and executed successfully with exit code 0.'}`);
      soundFx.playSuccess();
    }
  };

  const isLessonCompleted = currentLesson ? progress.completedLessonIds.includes(currentLesson.id) : false;

  const completedSyllabusCount = weekSyllabusItems.filter(
    (entry) => progress.completedSyllabusItemIds?.includes(entry.item.id)
  ).length;

  const isSelectedWeekUnlocked = isWeekUnlocked(selectedWeek);
  const prevWeekNum = selectedWeek - 1;
  const prevWeekScore = progress.quizScores[`quiz-w${prevWeekNum}`];
  const currentWeekQuizScore = progress.quizScores[`quiz-w${selectedWeek}`];
  const isCurrentWeekQuizPassed = currentWeekQuizScore !== undefined && currentWeekQuizScore >= 70;

  return (
    <div className="space-y-8">
      {/* Month & Week Selector Ribbon */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-white">2-Month Synchronized Plan:</span>
            <span className={`font-mono font-bold ${selectedWeek <= 4 ? 'text-cyan-400' : 'text-emerald-400'}`}>
              Month {currentWeekData.monthNumber} · {currentWeekData.partTitle}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Mentor Audit Mode Toggle */}
            <button
              onClick={onToggleAuditMode}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono transition-colors border ${
                auditMode
                  ? 'border-amber-500/50 bg-amber-950/40 text-amber-300'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-300'
              }`}
              title={auditMode ? 'Audit Mode is ON: All weeks unlocked for preview' : 'Strict Mode: Complete each week test (≥ 70%) to unlock next week'}
            >
              {auditMode ? (
                <>
                  <Unlock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Audit Mode: Unlocked</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Strict Gate Mode</span>
                </>
              )}
            </button>

            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              Week {selectedWeek} of 8 (60 Days Roadmap)
            </span>
          </div>
        </div>

        {/* Month 1 vs Month 2 divider pill labels */}
        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono font-semibold text-center">
          <div className={`py-1 rounded border ${selectedWeek <= 4 ? 'border-cyan-500/40 bg-cyan-950/30 text-cyan-300' : 'border-slate-800 bg-slate-900/40 text-slate-500'}`}>
            Month 1: Part 1 — Python & Foundations (Weeks 1–4 · 103 items)
          </div>
          <div className={`py-1 rounded border ${selectedWeek > 4 ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300' : 'border-slate-800 bg-slate-900/40 text-slate-500'}`}>
            Month 2: Part 2 & 3 — React & Backend AI (Weeks 5–8 · 99 items)
          </div>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {CURRICULUM_DATA.map((week) => {
            const isSelected = week.weekNumber === selectedWeek;
            const weekLessons = week.lessons.map((l) => l.id);
            const isWeekDone = weekLessons.length > 0 && weekLessons.every((id) => progress.completedLessonIds.includes(id));
            const isMonth1 = week.weekNumber <= 4;
            const isUnlocked = isWeekUnlocked(week.weekNumber);
            const weekScore = progress.quizScores[`quiz-w${week.weekNumber}`];
            const isGateCleared = weekScore !== undefined && weekScore >= 70;

            return (
              <button
                key={week.weekNumber}
                onClick={() => {
                  soundFx.playClick();
                  setSelectedWeek(week.weekNumber);
                }}
                className={`relative flex flex-col items-center justify-center py-2 px-2 rounded-lg border text-xs transition-all ${
                  isSelected
                    ? isMonth1
                      ? 'border-cyan-500 bg-cyan-950/50 text-cyan-200 font-bold shadow-md shadow-cyan-950/50 ring-1 ring-cyan-500/50'
                      : 'border-emerald-500 bg-emerald-950/50 text-emerald-200 font-bold shadow-md shadow-emerald-950/50 ring-1 ring-emerald-500/50'
                    : !isUnlocked
                    ? 'border-slate-800/60 bg-slate-950/60 text-slate-600 hover:text-slate-400 hover:border-slate-700'
                    : isGateCleared
                    ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300 hover:bg-slate-900'
                    : isWeekDone
                    ? 'border-amber-500/40 bg-amber-950/20 text-amber-300 hover:bg-slate-900'
                    : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {!isUnlocked && (
                  <span className="absolute top-1 right-1">
                    <Lock className="w-2.5 h-2.5 text-slate-500" />
                  </span>
                )}
                <span className="font-mono text-sm">W{week.weekNumber}</span>
                <span className="text-[10px] truncate max-w-full text-slate-400 mt-0.5">
                  {!isUnlocked ? 'Locked' : isGateCleared ? 'Cleared' : isWeekDone ? 'Test Due' : `${week.lessons.length} units`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* LOCKED WEEK SCREEN IF NOT UNLOCKED */}
      {!isSelectedWeekUnlocked ? (
        <div className="rounded-2xl border border-rose-900/50 bg-gradient-to-b from-slate-900 via-rose-950/20 to-slate-950 p-8 sm:p-12 text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-rose-950/80 border border-rose-500/40 flex items-center justify-center text-rose-400 shadow-xl shadow-rose-950/50">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="max-w-xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs font-mono font-semibold">
              <Lock className="w-3.5 h-3.5" />
              <span>Assessment Gate Active</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Week {selectedWeek} is Currently Locked
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              To pass real technical internship assessments, DevSprint 60 requires candidates to prove mastery. You must complete and pass the <strong className="text-white">Week {prevWeekNum} End-of-Week Gate Assessment Test</strong> with a score of <strong className="text-cyan-400">≥ 70%</strong> before unlocking Week {selectedWeek}.
            </p>
          </div>

          <div className="max-w-md mx-auto p-4 rounded-xl border border-slate-800 bg-slate-900/80 flex items-center justify-between text-xs">
            <div className="text-left">
              <div className="text-slate-400">Week {prevWeekNum} Prerequisite Status:</div>
              <div className="font-bold font-mono text-white mt-0.5">
                {prevWeekScore !== undefined ? `Current Score: ${prevWeekScore}% (Needs ≥ 70%)` : 'Gate Test Unattempted'}
              </div>
            </div>
            <button
              onClick={() => onOpenQuiz(prevWeekNum)}
              className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition-colors shadow-md"
            >
              Take Week {prevWeekNum} Test
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs">
            <button
              onClick={() => setSelectedWeek(prevWeekNum)}
              className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Review Week {prevWeekNum} Lessons</span>
            </button>

            <span className="text-slate-600" aria-hidden="true">·</span>

            <button
              onClick={onToggleAuditMode}
              className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 transition-colors font-mono"
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>Enable Mentor Audit Mode (Unlock All Weeks for Review)</span>
            </button>
          </div>
        </div>
      ) : (
        /* UNLOCKED WEEK CONTENT */
        <>
          {/* Week Title & Overview Banner */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <span className="text-cyan-400 font-semibold">{currentWeekData.partTitle}</span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-400 font-mono">Module {currentWeekData.moduleNumbers.join(', ')}</span>
                <span aria-hidden="true">·</span>
                <span>Est. {currentWeekData.estimatedHours} Hours</span>
                <span aria-hidden="true">·</span>
                <span className="text-amber-400 font-mono tabular-nums">+{currentWeekData.xpReward} XP Reward</span>
                <span aria-hidden="true">·</span>
                <span className={`font-mono px-2 py-0.5 rounded text-[11px] ${
                  isCurrentWeekQuizPassed
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                    : currentWeekQuizScore !== undefined
                    ? 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
                    : 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                }`}>
                  {isCurrentWeekQuizPassed
                    ? `Gate Cleared (${currentWeekQuizScore}%)`
                    : currentWeekQuizScore !== undefined
                    ? `Gate Score: ${currentWeekQuizScore}% (Retake needed)`
                    : 'End-of-Week Test Required'}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white">{currentWeekData.title}</h2>
              <p className="text-xs text-slate-300 max-w-2xl">{currentWeekData.subtitle}</p>

              <div className="flex flex-wrap gap-1.5 pt-2">
                {currentWeekData.moduleTitles.map((modTitle, idx) => (
                  <span key={idx} className="text-[11px] font-mono text-cyan-300 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/20">
                    Module {currentWeekData.moduleNumbers[idx]}: {modTitle}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                soundFx.playClick();
                onOpenQuiz(selectedWeek);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-cyan-500/40 bg-cyan-950/40 text-cyan-300 hover:bg-cyan-900/50 text-xs font-bold transition-colors shrink-0 shadow-lg shadow-cyan-950/20"
            >
              <HelpCircle className="w-4 h-4" />
              <span>{isCurrentWeekQuizPassed ? 'Retake Week Test' : `Start Week ${selectedWeek} Gate Test`}</span>
            </button>
          </div>

      {/* Synchronized Mode Switcher: Sprint Lessons vs Learning Path Items */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundFx.playClick();
              setActiveSubTab('interactive');
            }}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeSubTab === 'interactive'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Interactive Sprint Modules ({currentWeekData.lessons.length})</span>
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              setActiveSubTab('syllabus-items');
            }}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeSubTab === 'syllabus-items'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ListChecks className="w-4 h-4" />
            <span>Syllabus Checklist ({weekSyllabusItems.length} items)</span>
          </button>
        </div>

        <div className="text-xs font-mono text-slate-400 hidden sm:block">
          {completedSyllabusCount}/{weekSyllabusItems.length} checklist items verified
        </div>
      </div>

      {/* VIEW A: INTERACTIVE DEEP DIVE & CODE SANDBOX */}
      {activeSubTab === 'interactive' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Lesson Selector Drawer */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-semibold text-slate-400 px-1">
              Sprint Deep Dive Lessons ({currentWeekData.lessons.length})
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
                      <span className="font-mono text-cyan-400">Lesson 0{idx + 1}</span>
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
                    Week {selectedWeek} · Module {currentWeekData.moduleNumbers.join(', ')}
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
                <h4 className="text-xs font-bold text-slate-400">Core Engineering Principles:</h4>
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
                  <span>Technical Screening Gotcha & Interview Trap</span>
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
      )}

      {/* VIEW B: SYNCHRONIZED SYLLABUS CHECKLIST FOR THIS WEEK */}
      {activeSubTab === 'syllabus-items' && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white">
                Week {selectedWeek} Learning Path Items Checklist
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                All canonical items from the master curriculum mapped to Week {selectedWeek}. Click to check off as mastered (+25 XP each).
              </p>
            </div>
            <div className="text-xs font-mono text-cyan-400 font-semibold">
              {completedSyllabusCount} / {weekSyllabusItems.length} Completed
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {weekSyllabusItems.map(({ moduleTitle, moduleNumber, item }) => {
              const isChecked = progress.completedSyllabusItemIds?.includes(item.id) ?? false;
              const isAiInterval = item.type === 'ai-interval';

              return (
                <div
                  key={item.id}
                  onClick={() => onToggleSyllabusItem && onToggleSyllabusItem(item.id)}
                  className={`p-3.5 rounded-lg border text-xs cursor-pointer transition-all flex items-start gap-3 ${
                    isChecked
                      ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-200'
                      : isAiInterval
                      ? 'border-purple-500/30 bg-purple-950/20 text-purple-200 hover:border-purple-500/50'
                      : 'border-slate-800 bg-slate-950/50 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <button
                    type="button"
                    className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center border shrink-0 transition-colors ${
                      isChecked
                        ? 'border-emerald-500 bg-emerald-500 text-slate-950'
                        : 'border-slate-700 bg-slate-900 text-transparent'
                    }`}
                  >
                    <Check className="w-3 h-3 stroke-[3]" />
                  </button>

                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-mono font-bold ${isChecked ? 'text-emerald-400' : isAiInterval ? 'text-purple-400' : 'text-cyan-400'}`}>
                        {item.code}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        Mod {moduleNumber}
                      </span>
                      {isAiInterval && (
                        <span className="text-[10px] text-purple-300 bg-purple-950 px-1.5 py-0.2 rounded border border-purple-500/40">
                          AI Interval
                        </span>
                      )}
                    </div>
                    <div className="text-white font-medium leading-snug">
                      {item.title}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* End-of-Week Gate Assessment Milestone Section */}
      <section className="rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-slate-900 via-cyan-950/20 to-slate-900 p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400">
              <Award className="w-4 h-4 text-cyan-400" />
              <span>WEEK {selectedWeek} GATE MILESTONE</span>
              <span aria-hidden="true">·</span>
              <span>PASSING SCORE: ≥ 70%</span>
            </div>
            <h3 className="text-xl font-bold text-white">
              End-of-Week {selectedWeek} Technical Screening Gate Test
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Every single week concludes with an internship screening gate test. Passing this test with at least 70% is mandatory to unlock Week {selectedWeek + 1}. You are evaluated on real internship technical screening questions covering {currentWeekData.title}.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => {
                soundFx.playClick();
                onOpenQuiz(selectedWeek);
              }}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs transition-colors shadow-lg shadow-cyan-400/20"
            >
              <HelpCircle className="w-4 h-4 fill-slate-950" />
              <span>{isCurrentWeekQuizPassed ? 'Retake Week Test' : `Take Week ${selectedWeek} Gate Test`}</span>
            </button>

            {isCurrentWeekQuizPassed && selectedWeek < 8 && (
              <button
                onClick={() => {
                  soundFx.playClick();
                  setSelectedWeek(selectedWeek + 1);
                }}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs transition-colors shadow-lg shadow-emerald-400/20"
              >
                <span>Advance to Week {selectedWeek + 1}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 text-slate-400 font-mono">
            <span>{currentWeekData.quiz.length} Screening MCQs</span>
            <span aria-hidden="true">·</span>
            <span>+150 XP Reward</span>
            <span aria-hidden="true">·</span>
            <span>70% Passing Threshold</span>
          </div>

          <div className="font-mono text-xs">
            {isCurrentWeekQuizPassed ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Cleared ({currentWeekQuizScore}%) · Week {selectedWeek + 1} Unlocked
              </span>
            ) : currentWeekQuizScore !== undefined ? (
              <span className="text-rose-400 font-bold">
                Current Best: {currentWeekQuizScore}% (Retake needed to reach 70%)
              </span>
            ) : (
              <span className="text-amber-400 font-semibold">
                Test Not Yet Attempted — Required to unlock Week {selectedWeek + 1}
              </span>
            )}
          </div>
        </div>
      </section>
    </>
    )}
  </div>
  );
};
