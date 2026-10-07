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
  Target
} from 'lucide-react';
import { CURRICULUM_DATA } from '../data/curriculum';
import { UserProgress, ActiveTab, PillarId } from '../types';
import { soundFx } from '../services/soundEffects';

interface DashboardViewProps {
  progress: UserProgress;
  levelInfo: { level: number; title: string; nextLevelXp: number; currentLevelFloor: number };
  setActiveTab: (tab: ActiveTab) => void;
  onSelectWeek: (weekNum: number) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  progress,
  levelInfo,
  setActiveTab,
  onSelectWeek,
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

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={() => {
                soundFx.playClick();
                setActiveTab('curriculum');
                onSelectWeek(1);
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-500 text-slate-950 font-bold text-sm hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Continue Lesson Plan</span>
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                setActiveTab('mock-exam');
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-700 bg-slate-800/80 text-white font-semibold text-sm hover:bg-slate-700 hover:border-slate-600 transition-colors"
            >
              <Target className="w-4 h-4 text-emerald-400" />
              <span>Launch Timed Mock Exam</span>
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                setActiveTab('playground');
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-800 text-slate-300 font-medium text-sm hover:text-white hover:border-slate-700 transition-colors"
            >
              <Code2 className="w-4 h-4 text-indigo-400" />
              <span>Interactive Code Lab</span>
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
        <div>
          <h2 className="text-xl font-bold text-white">8-Week Interactive Syllabus</h2>
          <p className="text-xs text-slate-400 mt-1">
            Click into any week to view bite-sized lessons, interactive live code previews, and interview quiz tests.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CURRICULUM_DATA.map((week) => {
            const completedCount = week.lessons.filter((l) => progress.completedLessonIds.includes(l.id)).length;
            const isCompleted = completedCount === week.lessons.length && week.lessons.length > 0;
            const isInProgress = completedCount > 0 && !isCompleted;

            return (
              <div
                key={week.weekNumber}
                onClick={() => {
                  soundFx.playClick();
                  onSelectWeek(week.weekNumber);
                  setActiveTab('curriculum');
                }}
                className="group relative cursor-pointer rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900 hover:border-cyan-500/40 p-5 transition-all duration-200 space-y-3"
              >
                {/* Week Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="font-bold text-cyan-400">Week {week.weekNumber}</span>
                      <span aria-hidden="true">·</span>
                      <span>{week.pillarTitle}</span>
                    </div>
                    <h3 className="text-base font-bold text-white mt-1 group-hover:text-cyan-300 transition-colors">
                      {week.title}
                    </h3>
                  </div>

                  {isCompleted ? (
                    <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      Completed
                    </span>
                  ) : isInProgress ? (
                    <span className="text-xs text-cyan-400 font-mono">
                      {completedCount}/{week.lessons.length} done
                    </span>
                  ) : (
                    <span className="text-xs text-slate-500">
                      Not started
                    </span>
                  )}
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

                {/* Footer metadata */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs text-slate-400">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {week.estimatedHours}h
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="text-amber-400 font-mono tabular-nums">
                      +{week.xpReward} XP
                    </span>
                  </div>

                  <span className="flex items-center gap-1 text-cyan-400 group-hover:translate-x-1 transition-transform">
                    <span>Enter Week</span>
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
