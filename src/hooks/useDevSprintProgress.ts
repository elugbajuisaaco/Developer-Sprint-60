import { useState, useEffect, useCallback } from 'react';
import { UserProgress, PillarId } from '../types';
import { checkNewBadges } from '../data/badges';
import { soundFx } from '../services/soundEffects';
import { fireConfetti } from '../services/confetti';

const STORAGE_KEY = 'devsprint60_user_progress_v1';

const INITIAL_PROGRESS: UserProgress = {
  xp: 0,
  level: 1,
  streakDays: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  completedLessonIds: [],
  completedChallengeIds: [],
  completedQuizIds: [],
  unlockedBadgeIds: [],
  quizScores: {},
  mockAssessmentHistory: [],
};

export function calculateLevel(xp: number): { level: number; title: string; nextLevelXp: number; currentLevelFloor: number } {
  if (xp < 300) {
    return { level: 1, title: 'Intern Novice', nextLevelXp: 300, currentLevelFloor: 0 };
  } else if (xp < 700) {
    return { level: 2, title: 'Junior Dev', nextLevelXp: 700, currentLevelFloor: 300 };
  } else if (xp < 1300) {
    return { level: 3, title: 'Full-Stack Apprentice', nextLevelXp: 1300, currentLevelFloor: 700 };
  } else if (xp < 2000) {
    return { level: 4, title: 'Senior Sprint Specialist', nextLevelXp: 2000, currentLevelFloor: 1300 };
  } else {
    return { level: 5, title: 'Assessment Ready / Tech Lead', nextLevelXp: 3000, currentLevelFloor: 2000 };
  }
}

export function useDevSprintProgress() {
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...INITIAL_PROGRESS,
          ...parsed,
        };
      }
    } catch {}
    return INITIAL_PROGRESS;
  });

  const [recentUnlockedBadge, setRecentUnlockedBadge] = useState<string | null>(null);

  // Sync to LocalStorage
  const saveProgress = useCallback((newProgress: UserProgress) => {
    setProgress(newProgress);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
    } catch (err) {
      console.error('Failed to save to localStorage:', err);
    }
  }, []);

  // Check and process badges
  const processBadgeUnlocks = useCallback((updated: UserProgress) => {
    const newBadgeIds = checkNewBadges(updated);
    if (newBadgeIds.length > 0) {
      const withNewBadges: UserProgress = {
        ...updated,
        unlockedBadgeIds: [...updated.unlockedBadgeIds, ...newBadgeIds],
      };
      setRecentUnlockedBadge(newBadgeIds[0]);
      soundFx.playBadgeUnlock();
      fireConfetti();
      saveProgress(withNewBadges);
      setTimeout(() => setRecentUnlockedBadge(null), 4000);
      return withNewBadges;
    }
    return updated;
  }, [saveProgress]);

  // Update streak on mount or activity
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (progress.lastActiveDate !== today) {
      const lastDate = new Date(progress.lastActiveDate);
      const currDate = new Date(today);
      const diffTime = Math.abs(currDate.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let updatedStreak = progress.streakDays;
      if (diffDays === 1) {
        // Consecutive day!
        updatedStreak += 1;
      } else if (diffDays > 1) {
        // Streak broken
        updatedStreak = 1;
      }

      const updated = {
        ...progress,
        streakDays: updatedStreak,
        lastActiveDate: today,
      };
      saveProgress(updated);
    }
  }, [progress, saveProgress]);

  // Action: Complete Lesson
  const completeLesson = useCallback((lessonId: string, customXp: number = 75) => {
    if (progress.completedLessonIds.includes(lessonId)) return;

    soundFx.playSuccess();
    const newXp = progress.xp + customXp;
    const { level } = calculateLevel(newXp);

    const updated: UserProgress = {
      ...progress,
      xp: newXp,
      level,
      completedLessonIds: [...progress.completedLessonIds, lessonId],
      lastActiveDate: new Date().toISOString().split('T')[0],
    };

    saveProgress(updated);
    processBadgeUnlocks(updated);
  }, [progress, saveProgress, processBadgeUnlocks]);

  // Action: Complete Code Challenge
  const completeChallenge = useCallback((challengeId: string, customXp: number = 100) => {
    if (progress.completedChallengeIds.includes(challengeId)) return;

    soundFx.playSuccess();
    fireConfetti();
    const newXp = progress.xp + customXp;
    const { level } = calculateLevel(newXp);

    const updated: UserProgress = {
      ...progress,
      xp: newXp,
      level,
      completedChallengeIds: [...progress.completedChallengeIds, challengeId],
      lastActiveDate: new Date().toISOString().split('T')[0],
    };

    saveProgress(updated);
    processBadgeUnlocks(updated);
  }, [progress, saveProgress, processBadgeUnlocks]);

  // Action: Record Quiz Score
  const recordQuizResult = useCallback((quizId: string, scorePercent: number, totalQuestions: number) => {
    const isFirstTime = !progress.completedQuizIds.includes(quizId);
    const xpBonus = Math.round((scorePercent / 100) * 150);
    const newXp = isFirstTime ? progress.xp + xpBonus : progress.xp;
    const { level } = calculateLevel(newXp);

    if (scorePercent >= 70) {
      soundFx.playSuccess();
      fireConfetti();
    } else {
      soundFx.playError();
    }

    const updated: UserProgress = {
      ...progress,
      xp: newXp,
      level,
      completedQuizIds: isFirstTime ? [...progress.completedQuizIds, quizId] : progress.completedQuizIds,
      quizScores: {
        ...progress.quizScores,
        [quizId]: Math.max(scorePercent, progress.quizScores[quizId] || 0),
      },
      lastActiveDate: new Date().toISOString().split('T')[0],
    };

    saveProgress(updated);
    processBadgeUnlocks(updated);
  }, [progress, saveProgress, processBadgeUnlocks]);

  // Action: Record Mock Assessment Result
  const recordMockAssessment = useCallback((
    score: number,
    totalQuestions: number,
    durationSeconds: number,
    breakdown: Record<PillarId, { correct: number; total: number }>
  ) => {
    const passed = (score / totalQuestions) >= 0.7; // 70% passing threshold
    const xpAward = passed ? 350 : 150;
    const newXp = progress.xp + xpAward;
    const { level } = calculateLevel(newXp);

    if (passed) {
      soundFx.playSuccess();
      fireConfetti();
    } else {
      soundFx.playError();
    }

    const newRecord = {
      id: `mock-${Date.now()}`,
      date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
      score,
      totalQuestions,
      passed,
      durationSeconds,
      breakdown,
    };

    const updated: UserProgress = {
      ...progress,
      xp: newXp,
      level,
      mockAssessmentHistory: [newRecord, ...progress.mockAssessmentHistory],
      lastActiveDate: new Date().toISOString().split('T')[0],
    };

    saveProgress(updated);
    processBadgeUnlocks(updated);
  }, [progress, saveProgress, processBadgeUnlocks]);

  // Reset Progress
  const resetProgress = useCallback(() => {
    soundFx.playClick();
    localStorage.removeItem(STORAGE_KEY);
    setProgress(INITIAL_PROGRESS);
  }, []);

  // Demo Profile loader
  const loadDemoProfile = useCallback(() => {
    soundFx.playSuccess();
    fireConfetti();
    const demo: UserProgress = {
      xp: 1450,
      level: 4,
      streakDays: 5,
      lastActiveDate: new Date().toISOString().split('T')[0],
      completedLessonIds: ['w1-l1', 'w1-l2', 'w2-l1', 'w3-l1', 'w3-l2', 'w4-l1', 'w5-l1', 'w6-l1'],
      completedChallengeIds: ['w1-c1', 'w2-c1', 'w3-c1', 'w5-c1'],
      completedQuizIds: ['quiz-w1', 'quiz-w2', 'quiz-w3'],
      unlockedBadgeIds: ['badge-first-step', 'badge-dom-dominator', 'badge-async-ace', 'badge-bug-hunter', 'badge-fire-streak'],
      quizScores: {
        'quiz-w1': 100,
        'quiz-w2': 100,
        'quiz-w3': 100,
      },
      mockAssessmentHistory: [
        {
          id: 'mock-demo-1',
          date: 'Yesterday',
          score: 10,
          totalQuestions: 12,
          passed: true,
          durationSeconds: 610,
          breakdown: {
            'web-foundations': { correct: 2, total: 2 },
            'js-async': { correct: 3, total: 4 },
            'python-backend': { correct: 3, total: 3 },
            'ml-ai': { correct: 2, total: 3 },
          },
        },
      ],
    };
    saveProgress(demo);
  }, [saveProgress]);

  const levelInfo = calculateLevel(progress.xp);

  return {
    progress,
    levelInfo,
    completeLesson,
    completeChallenge,
    recordQuizResult,
    recordMockAssessment,
    resetProgress,
    loadDemoProfile,
    recentUnlockedBadge,
    dismissBadgeModal: () => setRecentUnlockedBadge(null),
  };
}
