import React, { useState } from 'react';
import { Volume2, VolumeX, Flame, RotateCcw, Sparkles, Lock, Unlock } from 'lucide-react';
import { ActiveTab, UserProgress } from '../types';
import { soundFx } from '../services/soundEffects';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  progress: UserProgress;
  levelInfo: { level: number; title: string; nextLevelXp: number; currentLevelFloor: number };
  onReset: () => void;
  onLoadDemo: () => void;
  auditMode?: boolean;
  onToggleAuditMode?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  progress,
  levelInfo,
  onReset,
  onLoadDemo,
  auditMode = false,
  onToggleAuditMode,
}) => {
  const [soundEnabled, setSoundEnabled] = useState(soundFx.isEnabled());
  const [showResetModal, setShowResetModal] = useState(false);

  const toggleSound = () => {
    const next = soundFx.toggle();
    setSoundEnabled(next);
  };

  const navLinks: { id: ActiveTab; label: string }[] = [
    { id: 'dashboard', label: 'Roadmap' },
    { id: 'syllabus', label: 'Syllabus (2 Mo)' },
    { id: 'curriculum', label: 'Lessons' },
    { id: 'playground', label: 'Code Lab' },
    { id: 'mock-exam', label: 'Mock Exam' },
    { id: 'badges', label: 'Achievements' },
  ];

  return (
    <>
      <header className="sticky top-0 z-30 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Zone 1: Brand Wordmark (Single text element) */}
          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab('dashboard');
            }}
            className="flex items-center gap-2 text-left text-lg font-extrabold tracking-tight text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
          >
            <span className="text-cyan-400">DevSprint</span>
            <span className="text-slate-400">60</span>
          </button>

          {/* Zone 2: Navigation Links (Clean text links with hover styling) */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400"
          >
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    soundFx.playClick();
                    setActiveTab(link.id);
                  }}
                  className={`whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:text-white ${
                    isActive
                      ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400 pb-0.5'
                      : 'hover:text-slate-200'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Actions & Telemetry Metrics */}
          <div className="flex items-center gap-3">
            {/* Streak & XP Metric - Tabular figures, unboxed */}
            <div className="hidden sm:flex items-center gap-3 text-xs text-slate-300">
              <span className="flex items-center gap-1 font-mono tabular-nums text-amber-400" title="Active Daily Streak">
                <Flame className="w-4 h-4 fill-amber-400/20" />
                {progress.streakDays}d streak
              </span>
              <span className="text-slate-600" aria-hidden="true">·</span>
              <span className="font-mono tabular-nums text-cyan-300">
                {progress.xp} XP
              </span>
              <span className="text-slate-600" aria-hidden="true">·</span>
              <span className="text-slate-400 hidden lg:inline">
                Lvl {levelInfo.level} ({levelInfo.title})
              </span>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              aria-label={soundEnabled ? 'Mute audio cues' : 'Enable audio cues'}
              title={soundEnabled ? 'Audio sound cues enabled' : 'Audio sound cues muted'}
              className="p-2 text-slate-400 hover:text-white rounded-lg border border-slate-800 bg-slate-900/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-cyan-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
            </button>

            {/* Reset / Demo Action Button */}
            <button
              onClick={() => {
                soundFx.playClick();
                setShowResetModal(true);
              }}
              title="Progress Settings & Options"
              aria-label="Progress settings and options"
              className="p-2 text-slate-400 hover:text-white rounded-lg border border-slate-800 bg-slate-900/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden border-t border-slate-900 px-2 py-2 overflow-x-auto gap-2 bg-slate-950">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  soundFx.playClick();
                  setActiveTab(link.id);
                }}
                className={`whitespace-nowrap px-3 py-1.5 text-xs rounded-md transition-colors ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-400 font-semibold border border-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Settings / Reset Modal */}
      {showResetModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs"
        >
          <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <h3 id="modal-title" className="text-lg font-bold text-white">
              Data & Profile Controls
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your DevSprint 60 progress (XP, streak, completed lessons, challenges, and mock exam scores) is stored safely in your browser LocalStorage.
            </p>

            <div className="space-y-2 pt-2">
              {onToggleAuditMode && (
                <button
                  onClick={() => {
                    onToggleAuditMode();
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold rounded-lg border transition-colors ${
                    auditMode
                      ? 'text-amber-300 bg-amber-950/60 border-amber-500/40 hover:bg-amber-900/40'
                      : 'text-slate-300 bg-slate-800/80 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {auditMode ? <Unlock className="w-4 h-4 text-amber-400" /> : <Lock className="w-4 h-4 text-slate-400" />}
                    <span>{auditMode ? 'Mentor Audit Mode (All Weeks Unlocked)' : 'Strict Gate Mode (Pass Tests to Advance)'}</span>
                  </span>
                  <span className="font-mono text-[11px] underline">
                    {auditMode ? 'Switch to Strict' : 'Unlock All'}
                  </span>
                </button>
              )}

              <button
                onClick={() => {
                  onLoadDemo();
                  setShowResetModal(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 rounded-lg hover:bg-cyan-900/40 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                Fill Demo Progress (Preview Level 4 Profile)
              </button>

              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to reset all XP, streak, and quiz scores?')) {
                    onReset();
                    setShowResetModal(false);
                  }
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-rose-300 bg-rose-950/40 border border-rose-500/30 rounded-lg hover:bg-rose-900/40 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Reset All Progress to 0 XP
              </button>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowResetModal(false)}
                className="px-4 py-1.5 text-xs text-slate-300 hover:text-white rounded-lg border border-slate-800 bg-slate-800/60 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
