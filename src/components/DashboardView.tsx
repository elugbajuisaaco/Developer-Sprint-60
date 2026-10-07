import React from 'react';
import { 
  Play, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Award, 
  Flame, 
  Code2, 
  Brain, 
  Terminal, 
  Layout, 
  Zap,
  Target,
  BookOpen,
  Calendar,
  Lock,
  Unlock,
  ShieldAlert,
  Check
} from 'lucide-react';
import { CURRICULUM_DATA } from '../data/curriculum';
import { UserProgress, ActiveTab, PillarId } from '../types';
import { soundFx } from '../services/soundEffects';

interface DashboardViewProps {
  progress: UserProgress;
  levelInfo: { level: number; title: string; nextLevelXp: number; currentLevelFloor: number };
  setActiveTab: (tab: ActiveTab) => void;
  onSelectWeek: (weekNum: number) => void;
  isWeekUnlocked?: (weekNum: number) => boolean;
  auditMode?: boolean;
  onToggleAuditMode?: () => void;
  onOpenQuiz?: (weekNum: number) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  progress,
  levelInfo,
  setActiveTab,
  onSelectWeek,
  isWeekUnlocked = () => true,
  auditMode = false,
  onToggleAuditMode,
  onOpenQuiz,
}) => {
  // Calculate completion percentages for each of the 4 pillars
  const pillarStats: Record<PillarId, { completed: number; total: number; title: string; icon: React.ReactNode }> = {
    'web-foundations': {
      completed: 0,
      total: 0,
      title: 'Web Foundations (Weeks 1–2)',
      icon: <Layout className="w-4 h-4 text-cyan-400" />,
    },
    'js-async': {
      completed: 0,
      total: 0,
      title: 'Core JS & Async (Weeks 3–4)',
      icon: <Zap className="w-4 h-4 text-emerald-400" />,
    },
    'python-backend': {
      completed: 0,
      total: 0,
      title: 'Python & REST Backend (Weeks 5–6)',
      icon: <Terminal className="w-4 h-4 text-indigo-400" />,
    },
    'ml-ai': {
      completed: 0,
      total: 0,
      title: 'Machine Learning & AI (Weeks 7–8)',
      icon: <Brain className="w-4 h-4 text-purple-400" />,
    },
  };

  CURRICULUM_DATA.forEach((week) => {
    week.lessons.forEach((lesson) => {
      pillarStats[week.pillarId].total += 1;
      if (progress.completedLessonIds.includes(lesson.id)) {
        pillarStats[week.pillarId].completed += 1;
      }
    });
  });

  const totalLessons = CURRICULUM_DATA.reduce((acc, w) => acc + w.lessons.length, 0);
  const totalCompletedLessons = progress.completedLessonIds.length;
  const overallCurriculumPercent = totalLessons > 0 ? Math.round((totalCompletedLessons / totalLessons) * 100) : 0;

  // Level XP calculation for progress bar
  const xpInCurrentLevel = progress.xp - levelInfo.currentLevelFloor;
  const xpNeededForLevel = levelInfo.nextLevelXp - levelInfo.currentLevelFloor;
  const levelProgressPercent = Math.min(100, Math.max(0, Math.round((xpInCurrentLevel / xpNeededForLevel) * 100)));

  // Latest mock exam
  const latestMock = progress.mockAssessmentHistory[0];

  return (
    <div className="space-y-10">
      {/* Mentor Hero Section */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950 p-6 md:p-10">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
            <span>60-Day Technical Career Roadmap</span>
            <span aria-hidden="true">·</span>
            <span>Internship Assessment Training</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            DevSprint 60: Full-Stack & Machine Learning Mentor
          </h1>

          <p className="text-base text-slate-300 leading-relaxed">
            An 8-week accelerated engineering syllabus covering HTML/CSS semantics, JavaScript event loop mechanics, Python OOP & REST APIs, and client-connected Scikit-Learn models.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                soundFx.playClick();
                setActiveTab('syllabus');
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-500 text-slate-950 font-bold text-sm hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20"
            >
              <BookOpen className="w-4 h-4 fill-slate-950" />
              <span>Full 2-Month Syllabus (202 Items)</span>
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                setActiveTab('curriculum');
                onSelectWeek(1);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-700 bg-slate-800 text-white font-semibold text-sm hover:bg-slate-700 transition-colors"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Continue Lesson Plan</span>
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                setActiveTab('mock-exam');
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-700 bg-slate-800/80 text-white font-semibold text-sm hover:bg-slate-700 hover:border-slate-600 transition-colors"
            >
              <Target className="w-4 h-4 text-emerald-400" />
              <span>Launch Timed Mock Exam</span>
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                setActiveTab('playground');
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-800 text-slate-300 font-medium text-sm hover:text-white hover:border-slate-700 transition-colors"
            >
              <Code2 className="w-4 h-4 text-indigo-400" />
              <span>Code Lab</span>
            </button>
          </div>
        </div>
      </section>

      {/* Gamified Metric & Pillar Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Level & XP Progression Card */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Current Level</span>
            <span className="text-xs font-mono text-cyan-400">Lvl {levelInfo.level}</span>
          </div>
          <div>
            <div className="text-xl font-bold text-white">{levelInfo.title}</div>
            <div className="text-xs text-slate-400 mt-1">
              <span className="font-mono tabular-nums text-cyan-300">{progress.xp}</span> / {levelInfo.nextLevelXp} XP to next milestone
            </div>
          </div>
          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-cyan-400 transition-all duration-500 rounded-full"
                style={{ width: `${levelProgressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-mono text-slate-500">
              <span>{levelProgressPercent}% progress</span>
              <span>+{levelInfo.nextLevelXp - progress.xp} XP needed</span>
            </div>
          </div>
        </div>

        {/* Streak Counter Card */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Consistency Tracker</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
              {progress.streakDays} <span className="text-sm font-sans font-medium text-amber-400">Days Active</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Coding daily reinforces muscle memory for technical live-coding rounds.
            </p>
          </div>
          <div className="pt-1 flex items-center gap-2 text-xs text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Today&apos;s sprint registered</span>
          </div>
        </div>

        {/* Mock Readiness / Exam Status */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Internship Readiness</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            {latestMock ? (
              <>
                <div className="text-2xl font-bold font-mono tabular-nums text-white">
                  {Math.round((latestMock.score / latestMock.totalQuestions) * 100)}%
                  <span className={`ml-2 text-xs font-sans px-2 py-0.5 rounded ${latestMock.passed ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'}`}>
                    {latestMock.passed ? 'Screening Passed' : 'Needs Review'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Last tested {latestMock.date} ({latestMock.score}/{latestMock.totalQuestions} questions correct)
                </p>
              </>
            ) : (
              <>
                <div className="text-xl font-bold text-white">Assessment Unattempted</div>
                <p className="text-xs text-slate-400 mt-1">
                  Take the timed 15-minute diagnostic exam to test your readiness across all pillars.
                </p>
              </>
            )}
          </div>
          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab('mock-exam');
            }}
            className="w-full text-center text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            {latestMock ? 'Retake Readiness Exam ->' : 'Start Diagnostic Exam ->'}
          </button>
        </div>
      </section>

      {/* 4 Pillars Readiness Breakdown */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Curriculum Competency Pillars</h2>
          <span className="text-xs text-slate-400 font-mono tabular-nums">
            {totalCompletedLessons}/{totalLessons} Lessons Finished ({overallCurriculumPercent}%)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(Object.entries(pillarStats) as [PillarId, typeof pillarStats[PillarId]][]).map(([key, stat]) => {
            const pct = stat.total > 0 ? Math.round((stat.completed / stat.total) * 100) : 0;
            return (
              <div key={key} className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {stat.icon}
                    <span className="text-xs font-semibold text-white truncate">{stat.title}</span>
                  </div>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold font-mono text-white tabular-nums">{pct}%</span>
                  <span className="text-xs text-slate-400 font-mono tabular-nums">{stat.completed}/{stat.total} units</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-cyan-400 transition-all duration-500 rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 8-Week Roadmap Visual Timeline */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-xl font-bold text-white">8-Week Accelerated Plan (2 Months / 60 Days)</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Structured into Month 1 (Weeks 1–4: Python & Foundations) and Month 2 (Weeks 5–8: Frontend, React & Full-Stack AI).
            </p>
          </div>
          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab('syllabus');
            }}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View Full 15-Module Syllabus Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 2 Months Breakdown Cards & Unified Curriculum Architecture Banner */}
        <div className="space-y-4">
          <div className="rounded-xl border border-cyan-500/20 bg-slate-900/60 p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Unified 8-Week Engineering Pipeline (Full-Stack + Machine Learning)
                </h3>
              </div>
              <span className="text-xs font-mono text-cyan-300 bg-cyan-950/80 px-2.5 py-0.5 rounded border border-cyan-500/30">
                End-of-Week Gate Tests Enforced
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Languages and frameworks are taught not as detached silos, but as a continuous engineering pipeline designed to pass technical internship screening assessments:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-lg border border-slate-800 bg-slate-950/60 space-y-1">
                <div className="text-cyan-400 font-bold">1. Systems & Runtime</div>
                <div className="text-slate-400 text-[11px]">Bash CLI · CPython VM · Memory pointers · Types</div>
              </div>
              <div className="p-2.5 rounded-lg border border-slate-800 bg-slate-950/60 space-y-1">
                <div className="text-emerald-400 font-bold">2. OOP & Algorithms</div>
                <div className="text-slate-400 text-[11px]">Hash maps · Dunder methods · GIL · Concurrency</div>
              </div>
              <div className="p-2.5 rounded-lg border border-slate-800 bg-slate-950/60 space-y-1">
                <div className="text-purple-400 font-bold">3. Modern Frontend</div>
                <div className="text-slate-400 text-[11px]">DOM bubbling · Event Loop · React hooks · Routing</div>
              </div>
              <div className="p-2.5 rounded-lg border border-slate-800 bg-slate-950/60 space-y-1">
                <div className="text-amber-400 font-bold">4. Backend & ML AI</div>
                <div className="text-slate-400 text-[11px]">FastAPI REST · Scikit-Learn · Model inference</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/20 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-cyan-300 font-mono">MONTH 1: WEEKS 1–4</span>
                <span className="text-cyan-400 font-mono">103 Total Items</span>
              </div>
              <div className="text-sm font-bold text-white">Part 1: Python & Foundations (Modules 1–7)</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Computational thinking, CPython runtime, Shell/Bash, memory & types, OOP classes, data structures, algorithms, and concurrency.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-300 font-mono">MONTH 2: WEEKS 5–8</span>
                <span className="text-emerald-400 font-mono">99 Total Items</span>
              </div>
              <div className="text-sm font-bold text-white">Part 2: Frontend & React + Part 3: Backend & AI (Modules 8–15)</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                HTML/CSS layouts, DOM manipulation, Async JS, React ecosystem, routing, enterprise state, REST APIs & Scikit-Learn integration.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CURRICULUM_DATA.map((week) => {
            const completedCount = week.lessons.filter((l) => progress.completedLessonIds.includes(l.id)).length;
            const isCompleted = completedCount === week.lessons.length && week.lessons.length > 0;
            const monthNum = week.weekNumber <= 4 ? 1 : 2;
            const isUnlocked = isWeekUnlocked(week.weekNumber);
            const weekScore = progress.quizScores[`quiz-w${week.weekNumber}`];
            const isGateCleared = weekScore !== undefined && weekScore >= 70;

            return (
              <div
                key={week.weekNumber}
                onClick={() => {
                  soundFx.playClick();
                  onSelectWeek(week.weekNumber);
                  setActiveTab('curriculum');
                }}
                className={`group relative cursor-pointer rounded-xl border p-5 transition-all duration-200 space-y-3 ${
                  !isUnlocked
                    ? 'border-slate-800/60 bg-slate-950/60 opacity-80 hover:border-slate-700 hover:opacity-100'
                    : isGateCleared
                    ? 'border-emerald-500/30 bg-slate-900/40 hover:bg-slate-900 hover:border-emerald-500/60'
                    : 'border-slate-800 bg-slate-900/40 hover:bg-slate-900 hover:border-cyan-500/40'
                }`}
              >
                {/* Week Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="font-bold text-cyan-400">Month {monthNum} · Week {week.weekNumber}</span>
                      <span aria-hidden="true">·</span>
                      <span>{week.pillarTitle}</span>
                    </div>
                    <h3 className="text-base font-bold text-white mt-1 group-hover:text-cyan-300 transition-colors flex items-center gap-2">
                      <span>{week.title}</span>
                      {!isUnlocked && (
                        <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      )}
                    </h3>
                  </div>

                  <div className="shrink-0 text-right">
                    {!isUnlocked ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        <Lock className="w-3 h-3 text-slate-500" />
                        <span>Locked</span>
                      </span>
                    ) : isGateCleared ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Gate Cleared ({weekScore}%)</span>
                      </span>
                    ) : weekScore !== undefined ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-rose-400 bg-rose-950/50 px-2 py-0.5 rounded border border-rose-500/30">
                        <span>Retake Due ({weekScore}%)</span>
                      </span>
                    ) : isCompleted ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-500/30">
                        <span>Test Due (≥ 70%)</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono text-cyan-400">
                        {completedCount}/{week.lessons.length} lessons
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                  {week.subtitle}
                </p>

                {/* Topics list */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {week.topics.slice(0, 3).map((topic, i) => (
                    <span
                      key={i}
                      className="text-[11px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/60"
                    >
                      {topic}
                    </span>
                  ))}
                  {week.topics.length > 3 && (
                    <span className="text-[11px] text-slate-500 py-0.5">
                      +{week.topics.length - 3} more
                    </span>
                  )}
                </div>

                {/* End-of-week test notice bar */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-400 text-[11px] font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {week.estimatedHours}h
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="text-amber-400 tabular-nums">
                      +{week.xpReward} XP
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="text-cyan-400">
                      {week.quiz.length} MCQs Test
                    </span>
                  </div>

                  <span className={`flex items-center gap-1 font-semibold text-xs group-hover:translate-x-1 transition-transform ${
                    !isUnlocked ? 'text-slate-500' : 'text-cyan-400'
                  }`}>
                    <span>{!isUnlocked ? `Requires W${week.weekNumber - 1} Test` : 'Enter Week'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
