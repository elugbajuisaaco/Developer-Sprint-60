/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Award, Sparkles, X, ChevronRight } from 'lucide-react';
import { ActiveTab } from './types';
import { useDevSprintProgress } from './hooks/useDevSprintProgress';
import { BADGE_DEFINITIONS } from './data/badges';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { CurriculumView } from './components/CurriculumView';
import { CodePlaygroundView } from './components/CodePlaygroundView';
import { MockAssessmentView } from './components/MockAssessmentView';
import { BadgesView } from './components/BadgesView';
import { QuizEngine } from './components/QuizEngine';
import { soundFx } from './services/soundEffects';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [activeQuizWeek, setActiveQuizWeek] = useState<number | null>(null);

  const {
    progress,
    levelInfo,
    completeLesson,
    completeChallenge,
    recordQuizResult,
    recordMockAssessment,
    resetProgress,
    loadDemoProfile,
    recentUnlockedBadge,
    dismissBadgeModal,
  } = useDevSprintProgress();

  const currentBadgeObject = recentUnlockedBadge
    ? BADGE_DEFINITIONS.find((b) => b.id === recentUnlockedBadge)
    : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* 3-Zone Top Navigation Contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        progress={progress}
        levelInfo={levelInfo}
        onReset={resetProgress}
        onLoadDemo={loadDemoProfile}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            progress={progress}
            levelInfo={levelInfo}
            setActiveTab={setActiveTab}
            onSelectWeek={(weekNum) => {
              setSelectedWeek(weekNum);
              setActiveTab('curriculum');
            }}
          />
        )}

        {activeTab === 'curriculum' && (
          <CurriculumView
            progress={progress}
            selectedWeek={selectedWeek}
            setSelectedWeek={setSelectedWeek}
            onCompleteLesson={completeLesson}
            onOpenQuiz={(weekNum) => setActiveQuizWeek(weekNum)}
          />
        )}

        {activeTab === 'playground' && (
          <CodePlaygroundView
            progress={progress}
            onCompleteChallenge={completeChallenge}
          />
        )}

        {activeTab === 'mock-exam' && (
          <MockAssessmentView
            progress={progress}
            onRecordAssessment={recordMockAssessment}
            onNavigateToWeek={(weekNum) => {
              setSelectedWeek(weekNum);
              setActiveTab('curriculum');
            }}
          />
        )}

        {activeTab === 'badges' && (
          <BadgesView
            progress={progress}
            levelInfo={levelInfo}
          />
        )}
      </main>

      {/* Module Screening Quiz Modal */}
      {activeQuizWeek !== null && (
        <QuizEngine
          weekNumber={activeQuizWeek}
          onClose={() => setActiveQuizWeek(null)}
          onRecordScore={recordQuizResult}
        />
      )}

      {/* Unlocked Badge Pop-up Toast */}
      {currentBadgeObject && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 max-w-sm rounded-xl border border-cyan-500/50 bg-slate-900 p-4 shadow-2xl space-y-2 animate-bounce"
        >
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-bold text-cyan-400">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Achievement Unlocked!</span>
            </span>
            <button
              onClick={dismissBadgeModal}
              className="text-slate-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">{currentBadgeObject.name}</div>
              <p className="text-xs text-slate-400 line-clamp-1">{currentBadgeObject.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Subtle, Compliant Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">DevSprint 60</span>
            <span aria-hidden="true">·</span>
            <span>Technical Internship Assessment Mentor</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Weeks 1–2: HTML & CSS</span>
            <span aria-hidden="true">·</span>
            <span>Weeks 3–4: Core JS & Async</span>
            <span aria-hidden="true">·</span>
            <span>Weeks 5–6: Python Backend</span>
            <span aria-hidden="true">·</span>
            <span>Weeks 7–8: Machine Learning</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
