import React from 'react';
import { 
  Award, 
  Sparkles, 
  Layout, 
  Zap, 
  Terminal, 
  Brain, 
  Flame, 
  Code2, 
  ShieldCheck, 
  Lock, 
  CheckCircle2
} from 'lucide-react';
import { BADGE_DEFINITIONS } from '../data/badges';
import { Badge, UserProgress } from '../types';

interface BadgesViewProps {
  progress: UserProgress;
  levelInfo: { level: number; title: string; nextLevelXp: number; currentLevelFloor: number };
}

export const BadgesView: React.FC<BadgesViewProps> = ({
  progress,
  levelInfo,
}) => {
  const getBadgeIcon = (iconName: string, isUnlocked: boolean) => {
    const iconClass = isUnlocked ? 'w-6 h-6 text-cyan-400' : 'w-6 h-6 text-slate-600';
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className={iconClass} />;
      case 'Layout':
        return <Layout className={iconClass} />;
      case 'Zap':
        return <Zap className={iconClass} />;
      case 'Terminal':
        return <Terminal className={iconClass} />;
      case 'Brain':
        return <Brain className={iconClass} />;
      case 'Flame':
        return <Flame className={iconClass} />;
      case 'Code2':
        return <Code2 className={iconClass} />;
      case 'Award':
        return <Award className={iconClass} />;
      case 'ShieldCheck':
        return <ShieldCheck className={iconClass} />;
      default:
        return <Award className={iconClass} />;
    }
  };

  const unlockedCount = progress.unlockedBadgeIds.length;
  const totalBadges = BADGE_DEFINITIONS.length;

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
          <span>Gamified Competency Badges</span>
          <span aria-hidden="true">·</span>
          <span>Interview Assessment Milestones</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
          Achievements & Career Rank
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          Earn verified skill badges by mastering weekly code modules, conquering LeetCode-style debugging challenges, and clearing technical mock assessments.
        </p>
      </div>

      {/* Rank Ladder Card */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs text-slate-400 font-semibold">Active Assessment Rank:</span>
            <div className="text-xl font-bold text-white flex items-center gap-2 mt-0.5">
              <span>Level {levelInfo.level}:</span>
              <span className="text-cyan-400">{levelInfo.title}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono tabular-nums text-slate-300">
              {progress.xp} Total XP Accumulated
            </span>
            <div className="text-[11px] text-slate-500">
              {unlockedCount} of {totalBadges} Badges Unlocked
            </div>
          </div>
        </div>

        {/* 5-Tier Ladder Progression */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-2">
          {[
            { lvl: 1, name: 'Intern Novice', minXp: '0 XP' },
            { lvl: 2, name: 'Junior Dev', minXp: '300 XP' },
            { lvl: 3, name: 'Apprentice', minXp: '700 XP' },
            { lvl: 4, name: 'Sprint Lead', minXp: '1,300 XP' },
            { lvl: 5, name: 'Ready for Hire', minXp: '2,000 XP' },
          ].map((tier) => {
            const isReached = levelInfo.level >= tier.lvl;
            const isCurrent = levelInfo.level === tier.lvl;

            return (
              <div
                key={tier.lvl}
                className={`p-3 rounded-lg border text-xs text-center space-y-1 transition-all ${
                  isCurrent
                    ? 'border-cyan-500 bg-cyan-950/40 text-cyan-200 ring-1 ring-cyan-500/50 font-bold'
                    : isReached
                    ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300'
                    : 'border-slate-800 bg-slate-950/40 text-slate-500'
                }`}
              >
                <div className="font-mono text-[11px]">Level {tier.lvl}</div>
                <div className="truncate font-semibold">{tier.name}</div>
                <div className="text-[10px] text-slate-500 font-mono">{tier.minXp}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold text-white">Syllabus Milestone Badges</span>
          <span className="font-mono tabular-nums text-cyan-400">
            {unlockedCount}/{totalBadges} Claimed
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BADGE_DEFINITIONS.map((badge: Badge) => {
            const isUnlocked = progress.unlockedBadgeIds.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`p-5 rounded-xl border transition-all space-y-3 relative overflow-hidden ${
                  isUnlocked
                    ? 'border-cyan-500/40 bg-slate-900/80 shadow-lg shadow-cyan-950/20'
                    : 'border-slate-800/80 bg-slate-950/40 opacity-70'
                }`}
              >
                {/* Top icon and status */}
                <div className="flex items-start justify-between">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                      isUnlocked
                        ? 'border-cyan-500/40 bg-cyan-950/60 shadow-md shadow-cyan-500/20'
                        : 'border-slate-800 bg-slate-900'
                    }`}
                  >
                    {getBadgeIcon(badge.iconName, isUnlocked)}
                  </div>

                  {isUnlocked ? (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Unlocked</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Locked</span>
                    </span>
                  )}
                </div>

                {/* Badge title & description */}
                <div>
                  <h3 className={`text-base font-bold ${isUnlocked ? 'text-white' : 'text-slate-400'}`}>
                    {badge.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {badge.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
